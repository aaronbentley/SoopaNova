'use client'

import { functions, storage } from '@/firebase/config'
import { ensureFirebaseUser } from '@/firebase/sign-in'
import { ImageMeta, ModerationResult } from '@/types'
import { useAuth } from '@clerk/nextjs'
import { track } from '@vercel/analytics'
import { getDownloadURL, ref, type UploadResult } from 'firebase/storage'
import { useCallback, useRef, useState } from 'react'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { toast } from 'sonner'

/**
 * Print creation pipeline status:
 * idle → uploading → moderating → pushing → ready,
 * or flagged (adult content) / error (retryable) along the way
 */
export type PrintStatus =
    | 'idle'
    | 'uploading'
    | 'moderating'
    | 'pushing'
    | 'ready'
    | 'flagged'
    | 'error'

/**
 * Upload a screenshot, moderate it, push it to CanvasPop and build the
 * CanvasPop cart url.
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
    const [cartUrl, setCartUrl] = useState<string | null>(null)

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
     * Only adult content rated VERY_LIKELY is flagged.
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

        return moderation.detections.adult === 'VERY_LIKELY'
            ? 'flagged'
            : 'passed'
    }

    /**
     * Push the screenshot to CanvasPop (via our API route) and return the
     * CanvasPop image token
     */
    const pushToCanvaspop = async (upload: UploadResult) => {
        const imageUrl = await getDownloadURL(upload.ref)

        const response = await fetch('/api/canvaspop/push-image/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        })

        const json = response.ok ? await response.json() : null
        const imageToken: string | undefined = json?.data?.image_token

        if (!imageToken) {
            throw new Error('No image token found in response')
        }

        return imageToken
    }

    /**
     * Build the CanvasPop cart url for the pushed image
     */
    const buildCartUrl = (imageToken: string, meta: ImageMeta) => {
        const url = new URL(
            `${process.env.NEXT_PUBLIC_CANVASPOP_IMAGE_LOADER_ENDPOINT}/${imageToken}/${meta.width}/${meta.height}/`
        )

        url.searchParams.append(
            'reference_id',
            process.env.NEXT_PUBLIC_APP_TITLE!
        )

        return url.href
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
             * Push to CanvasPop and build the cart url
             */
            setStatus('pushing')
            toast.loading('Creating Print Order', {
                id: toastId,
                description: 'Hold tight Sparky - this may take a moment'
            })

            const imageToken = await pushToCanvaspop(upload)
            if (isCancelled()) return

            track('print-order-initiated', {
                userId,
                fileName: file.name
            })

            setCartUrl(buildCartUrl(imageToken, meta))
            setStatus('ready')
            toast.dismiss(toastId)
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
        setCartUrl(null)
    }, [])

    const isBusy =
        status === 'uploading' ||
        status === 'moderating' ||
        status === 'pushing'

    return { status, isBusy, progress, cartUrl, start, reset }
}
