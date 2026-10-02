'use client'

import { functions, storage } from '@/firebase/config'
import { ensureFirebaseUser } from '@/firebase/sign-in'
import { ImageMeta, ModerationResult } from '@/types'
import { useAuth } from '@clerk/nextjs'
import { ref, type UploadResult } from 'firebase/storage'
import { useCallback, useRef, useState } from 'react'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { toast } from 'sonner'

/**
 * Print creation pipeline status:
 * idle → uploading → moderating → ready (approved for printing),
 * or flagged (adult content) / error (retryable) along the way
 */
export type PrintStatus =
    'idle' | 'uploading' | 'moderating' | 'ready' | 'flagged' | 'error'

/**
 * Upload a screenshot and moderate it.
 *
 * - Each run gets an id; calling `reset()` (cancel) bumps the id so any late
 *   results from the cancelled run are ignored.
 * - A successful upload is remembered, so retrying the same file after a
 *   failed step skips straight to moderation instead of uploading again.
 */
export const useCreatePrint = () => {
    /**
     * Get Clerk auth userId
     */
    const { userId } = useAuth()

    /**
     * Firebase Storage upload and moderation callable
     */
    const [uploadFile, , snapshot] = useUploadFile()
    const [moderateImageUrl] = useHttpsCallable<
        {
            fileRef: UploadResult['ref']
            fileMetadata: UploadResult['metadata']
        },
        ModerationResult
    >(functions, 'moderateImageUrl')

    const [status, setStatus] = useState<PrintStatus>('idle')

    const runIdRef = useRef(0)
    const toastIdRef = useRef<string | number | null>(null)
    const uploadedRef = useRef<{ file: File; result: UploadResult } | null>(
        null
    )

    /**
     * Upload progress (0-100) while uploading
     */
    const progress =
        status === 'uploading' && snapshot
            ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            : 0

    /**
     * Upload the screenshot to Firebase Storage
     */
    const uploadToStorage = async (file: File, meta: ImageMeta) => {
        const storageRef = ref(
            storage,
            `${crypto.randomUUID()}--${userId}--${file.name}`
        )

        const result = await uploadFile(storageRef, file, {
            customMetadata: {
                width: meta.width.toString(),
                height: meta.height.toString(),
                aspectRatio: meta.aspectRatio,
                userId: userId!
            }
        })

        /**
         * uploadFile resolves to undefined when the upload fails
         */
        if (!result) {
            throw new Error('Error uploading image to Firebase Storage')
        }

        return result
    }

    /**
     * Moderate the uploaded screenshot with Cloud Vision SafeSearch.
     * Only adult content rated VERY_LIKELY is flagged. The function also
     * tags the file with its verdict, which server routes can check.
     */
    const moderate = async (upload: UploadResult) => {
        const response = await moderateImageUrl({
            fileRef: upload.ref,
            fileMetadata: upload.metadata
        })

        const moderation = response?.data

        /**
         * The check failed or returned no result - not a flag, so the user
         * can try again
         */
        if (moderation?.status !== 'ok' || !moderation.detections) {
            throw new Error(
                "We couldn't check your image right now. Please try again."
            )
        }

        const rejected = moderation.verdict
            ? moderation.verdict === 'rejected'
            : moderation.detections.adult === 'VERY_LIKELY'

        return rejected ? 'flagged' : 'passed'
    }

    /**
     * Run the print pipeline for a screenshot
     */
    const start = async (file: File, meta: ImageMeta) => {
        if (!userId) return

        const runId = ++runIdRef.current
        const isCancelled = () => runId !== runIdRef.current

        const toastId = toast.loading('Uploading Media', {
            description: 'Preparing print assets'
        })
        toastIdRef.current = toastId

        try {
            /**
             * Make sure Firebase Auth is signed in as this Clerk user - Storage
             * rules and the moderation callable require it
             */
            await ensureFirebaseUser(userId).catch(() => {
                throw new Error(
                    "We couldn't connect your account. Please try again."
                )
            })
            if (isCancelled()) return

            /**
             * Upload, unless this file was already uploaded by an earlier attempt
             */
            let upload =
                uploadedRef.current?.file === file
                    ? uploadedRef.current.result
                    : null

            if (!upload) {
                setStatus('uploading')
                upload = await uploadToStorage(file, meta)
                if (isCancelled()) return
                uploadedRef.current = { file, result: upload }
            }

            /**
             * Moderate
             */
            setStatus('moderating')
            toast.loading('Moderating Image', {
                id: toastId,
                description: 'Scanning for spicy pixels'
            })

            const verdict = await moderate(upload)
            if (isCancelled()) return

            if (verdict === 'flagged') {
                setStatus('flagged')
                toast.error('Error', {
                    id: toastId,
                    description:
                        'Sorry, we can not print images with adult content.'
                })
                return
            }

            /**
             * Approved for printing
             */
            setStatus('ready')
            toast.success('Ready to Print', {
                id: toastId,
                description: 'Your screenshot is approved for printing.'
            })
        } catch (error) {
            if (isCancelled()) return

            let message = 'Something went wrong.'
            if (error instanceof Error) message = error.message

            setStatus('error')
            toast.error('Error', {
                id: toastId,
                description: message
            })
        }
    }

    /**
     * Cancel any run in progress and return to idle
     */
    const reset = useCallback(() => {
        runIdRef.current++

        if (toastIdRef.current !== null) {
            toast.dismiss(toastIdRef.current)
            toastIdRef.current = null
        }

        setStatus('idle')
    }, [])

    const isBusy = status === 'uploading' || status === 'moderating'

    return { status, isBusy, progress, start, reset }
}
