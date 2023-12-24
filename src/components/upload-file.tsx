'use client'

import { functions, storage } from '@/firebase/config'
import { cn, formatBytes, getAspectRatio } from '@/lib/utils'
import { FileWithPreview } from '@/types'
import { useAuth } from '@clerk/nextjs'
import { HttpsCallableResult } from 'firebase/functions'
import { getDownloadURL, ref } from 'firebase/storage'
import { Loader2, ShoppingBag, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import {
    useDropzone,
    type FileRejection,
    type FileWithPath
} from 'react-dropzone'
import { useHttpsCallable } from 'react-firebase-hooks/functions'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import CanvaspopCart from './canvaspop-cart'
import ImageMetadata from './image-metadata'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from './ui/sheet'

const UploadFile = ({ className }: { className?: string }) => {
    /**
     * Get Clerk auth userId
     */
    const { userId = '' } = useAuth()

    /**
     * Get Firebase callable cloud function
     */
    const [callableModerateImageUrl, callableExecuting, callableError] =
        useHttpsCallable(functions, 'moderateImageUrl')

    /**
     * Define dropzone config
     */
    const accept = {
        'image/jpeg': [],
        'image/png': []
    }
    const maxSize =
        1024 *
        1024 *
        parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE! || '')
    const maxFiles = 1
    const disabled = false

    /**
     * Define minimum image dimensions
     */
    const imageMinWidth = parseInt(process.env.NEXT_PUBLIC_MIN_IMAGE_WIDTH!)
    const imageMinHeight = parseInt(process.env.NEXT_PUBLIC_MIN_IMAGE_HEIGHT!)

    /**
     *  Manage file in state so we can preview it
     */
    const [files, setFiles] = useState<FileWithPreview[] | null>(null)

    /**
     * Handle Firebase uploads
     */
    const [uploadFile, uploading, snapshot, uploadError] = useUploadFile()

    /**
     * Handle upload progress
     */
    const [uploadProgress, setUploadProgress] = useState(0)

    /**
     * Handle content moderation
     */
    const [contentModeration, setContentModeration] = useState(false)

    /**
     * Handle print options progress
     */
    const [createPrintOptions, setCreatePrintOptions] = useState(false)

    /**
     * Handle Media Sheet state
     */
    const [mediaSheetOpen, setMediaSheetOpen] = useState(false)

    /**
     * Handle Print Sheet state
     */
    const [printSheetOpen, setPrintSheetOpen] = useState(false)

    /**
     * Handle Print Order Url
     */
    const [printOrderUrl, setPrintOrderUrl] = useState<string | null>(null)

    /**
     * Handle image metadata
     */
    const [imageMeta = null, setImageMeta] = useState<{
        width: number
        height: number
        aspectRatio: string
    } | null>(null)

    /**
     * Handle image dimension error
     */
    const [imageDimensionsError, setImageDimensionsError] = useState(false)

    /**
     * Handle upload progress
     */
    useEffect(() => {
        if (!snapshot) return
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadProgress(progress)

        return () => {
            setUploadProgress(0)
        }
    }, [snapshot])

    /**
     * Handle dropzone file upload
     */
    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            if (acceptedFiles && acceptedFiles.length) {
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                )

                setMediaSheetOpen(true)
            }

            if (rejectedFiles && rejectedFiles.length) {
                rejectedFiles.forEach(({ errors }) => {
                    errors[0]?.message &&
                        toast.error('Error', {
                            description: errors[0].message
                        })
                })
            }
        },
        []
    )

    /**
     * Initialize dropzone
     */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
        multiple: maxFiles > 1,
        disabled
    })

    /**
     * Revoke preview url when component unmounts
     */
    useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => URL.revokeObjectURL(file.preview))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Handle image onLoad
     */
    const onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement
        const { naturalWidth, naturalHeight } = target

        // Check image dimensions
        if (naturalWidth < imageMinWidth || naturalHeight < imageMinHeight) {
            // Set image dimensions error
            setImageDimensionsError(true)

            toast.error('Screenshot too small!', {
                description: `Minimum dimensions are ${imageMinWidth}px width and minimum ${imageMinHeight}px height.`
            })
        }

        setImageMeta({
            width: naturalWidth,
            height: naturalHeight,
            aspectRatio: getAspectRatio(naturalWidth, naturalHeight)
        })
    }

    /**
     * Create print order
     */
    const createPrintOrder = async () => {
        /**
         * Bail if no files
         */
        if (!files) return

        /**
         * Pluck the image file from the array
         */
        const file = (files[0] as FileWithPreview) || null

        // Ensure we have a file and userId
        if (file && userId) {
            try {
                const processToast = toast.loading('Uploading Media', {
                    description: 'Preparing print assets'
                })

                /**
                 * Get Firebase Storage reference
                 */
                const storageRef = ref(
                    storage,
                    `${uuidv4()}--${userId}--${file.name}`
                )

                /**
                 * Upload file to Firebase Storage
                 */
                const firebaseStorageUploadResponse = await uploadFile(
                    storageRef,
                    file,
                    {
                        customMetadata: {
                            width: imageMeta?.width.toString() || '',
                            height: imageMeta?.height.toString() || '',
                            aspectRatio: imageMeta?.aspectRatio || '',
                            userId: userId
                        }
                    }
                )

                /**
                 * Handle Firebase Storage upload error
                 */
                if (
                    !firebaseStorageUploadResponse ||
                    uploadError !== undefined
                ) {
                    throw new Error('Error uploading image to Firebase Storage')
                }

                toast.loading('Moderating Image', {
                    id: processToast,
                    description: 'Scanning for spicy pixels'
                })

                /**
                 * Moderate image using Google Vision API for adult content
                 */
                const moderateImageUrlResponse = await callableModerateImageUrl(
                    {
                        fileRef: firebaseStorageUploadResponse.ref,
                        fileMetadata: firebaseStorageUploadResponse.metadata
                    }
                )

                /**
                 * Handle moderation error
                 */
                if (!moderateImageUrlResponse) {
                    throw new Error('Error moderating image')
                }

                const { data: moderationData } =
                    moderateImageUrlResponse as HttpsCallableResult<{
                        status: string
                        message: string
                        detections: {
                            adult: string
                            racy: string
                            violence: string
                        }
                    }>

                /**
                 * Check for adult content
                 */

                if (moderationData?.detections?.adult === 'VERY_LIKELY') {
                    setContentModeration(true)
                    throw new Error(
                        'Sorry, we can not print images with adult content.'
                    )
                }

                toast.info('Creating Print Order', {
                    description: 'Hold tight Sparky - this may take a moment'
                })

                /**
                 * Set print options state
                 */
                setCreatePrintOptions(true)

                /**
                 * Get file download url using existing Firebase Storage reference returned from upload
                 */
                const fileDownloadUrl = await getDownloadURL(
                    firebaseStorageUploadResponse.ref
                )

                /**
                 * Initiate upload to Canvaspop Push API (API route handler)
                 */
                const pushImageResponse = await fetch(
                    '/api/canvaspop/push-image',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            imageUrl: fileDownloadUrl
                        })
                    }
                )

                /**
                 * Get Push Image response data as json
                 */
                const pushImageResponseJson = await pushImageResponse.json()

                const {
                    data: { image_token = null, message }
                } = pushImageResponseJson

                /**
                 * Check we have an image upload token
                 */
                if (!image_token) {
                    throw new Error('No image token found in response')
                }

                // Build Canvaspop Cart URL
                const canvasPopCartUrl = new URL(
                    `${process.env.NEXT_PUBLIC_CANVASPOP_IMAGE_LOADER_ENDPOINT}/${image_token}/${imageMeta?.width}/${imageMeta?.height}/`
                )

                // Add reference_id query param
                canvasPopCartUrl.searchParams.append(
                    'reference_id',
                    process.env.NEXT_PUBLIC_APP_TITLE!
                )

                setPrintOrderUrl(canvasPopCartUrl.href)

                setPrintSheetOpen(true)

                // FIXME: reset upload state on successful order and redirect to a thank you page
            } catch (error) {
                let message = 'Something went wrong.'
                if (error instanceof Error) message = error.message

                toast.error('Error', {
                    description: message
                })
            } finally {
                setCreatePrintOptions(false)
            }
        }
    }

    return (
        <div
            className={cn(
                ['container', 'mx-auto', 'flex', 'justify-center'],
                className
            )}>
            {!files && (
                <div className='w-96'>
                    <div
                        {...getRootProps()}
                        className={cn(
                            [
                                'group',
                                'min-w-full',
                                'relative',
                                'grid',
                                'h-48',
                                'w-full',
                                'cursor-pointer',
                                'place-items-center',
                                'rounded-lg',
                                'border-2',
                                'border-dashed',
                                'border-neutral-300',
                                'dark:border-neutral-700',
                                'px-5',
                                'py-2.5',
                                'text-center',
                                'transition',
                                'ring-offset-background',
                                'focus-visible:outline-none',
                                'focus-visible:ring-2',
                                'focus-visible:ring-ring',
                                'focus-visible:ring-offset-2',
                                'hover:border-pink-500',
                                'hover:dark:border-pink-500',
                                'transition-all',
                                'duration-200'
                            ],
                            isDragActive && [
                                'border-pink-500',
                                'dark:border-pink-500'
                            ],
                            disabled && ['pointer-events-none', 'opacity-60'],
                            className
                        )}>
                        <input {...getInputProps()} />
                        {uploading ? (
                            <div className='group grid w-full place-items-center gap-1 sm:px-10'>
                                <UploadCloud
                                    className='h-9 w-9 animate-pulse'
                                    aria-hidden='true'
                                />
                            </div>
                        ) : isDragActive ? (
                            <div className='grid place-items-center gap-2 sm:px-5'>
                                <UploadCloud
                                    className={cn([
                                        'size-8',
                                        'origin-bottom',
                                        'animate-bounce',
                                        'text-pink-500'
                                    ])}
                                    aria-hidden='true'
                                />
                                <p className='text-base font-medium text-pink-500'>
                                    Drop it like it&apos;s hot
                                </p>
                            </div>
                        ) : (
                            <div className='grid place-items-center gap-1 sm:px-5'>
                                <UploadCloud
                                    className={cn([
                                        'size-8',
                                        'text-neutral-400',
                                        'duration-200',
                                        'origin-bottom',
                                        'group-hover:text-pink-500',
                                        'group-hover:animate-bounce'
                                    ])}
                                    aria-hidden='true'
                                />
                                <p className='mt-2 text-base font-medium text-neutral-500 dark:text-neutral-400 transition-colors duration-200 group-hover:text-pink-500'>
                                    Drag {`'n'`} drop here, or click to select
                                    file
                                </p>
                                <small className='text-sm text-neutral-400 dark:text-neutral-600'>
                                    Maximum file size {formatBytes(maxSize)}
                                </small>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Sheet
                open={mediaSheetOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setFiles(null)
                        setImageDimensionsError(false)
                    }
                    setMediaSheetOpen(open)
                }}>
                <SheetContent
                    side='top'
                    className='h-fit flex flex-col gap-y-6 border-none container mx-auto'>
                    <SheetHeader>
                        <SheetTitle className='font-extrabold'>
                            Screenshot Preview
                        </SheetTitle>
                        <SheetDescription>
                            How we lookin&apos;?
                        </SheetDescription>
                    </SheetHeader>
                    <div className='grid md:grid-cols-4 gap-12 max-w-full'>
                        <div className='md:col-span-1'>
                            {files && files.length && (
                                <ImageMetadata
                                    file={files[0]}
                                    imageMeta={imageMeta}
                                />
                            )}
                        </div>

                        <div className='md:col-span-3'>
                            <div
                                className={cn([
                                    'relative',
                                    'aspect-video',
                                    'max-w-full'
                                ])}>
                                {snapshot && (
                                    <div className='absolute inset-0 z-30 flex flex-col justify-end px-4 pb-4'>
                                        <Progress
                                            value={uploadProgress}
                                            className='[&>div]:data-[state=indeterminate]:bg-pink-500'
                                        />
                                    </div>
                                )}
                                {callableExecuting && (
                                    <div className='absolute inset-0 z-30 bg-neutral-50/75 dark:bg-neutral-950/75 flex flex-col justify-center items-center gap-y-4'>
                                        <Loader2 className='size-12 animate-spin text-pink-500' />
                                        <p className='font-extrabold'>
                                            Moderating Image
                                        </p>
                                    </div>
                                )}
                                {createPrintOptions && (
                                    <div className='absolute inset-0 z-30 bg-neutral-50/75 dark:bg-neutral-950/75 flex flex-col justify-center items-center gap-y-4'>
                                        <Loader2 className='size-12 animate-spin text-pink-500' />
                                        <p className='font-extrabold'>
                                            Creating Print Order
                                        </p>
                                    </div>
                                )}
                                {files && files.length && (
                                    <Image
                                        src={files[0].preview}
                                        alt={files[0].name}
                                        className={cn(
                                            [
                                                'z-10',
                                                'object-contain',
                                                'object-center'
                                            ],
                                            uploading && ['opacity-75'],
                                            contentModeration && [
                                                'blur',
                                                'opacity-75'
                                            ],
                                            createPrintOptions && ['opacity-75']
                                        )}
                                        onLoad={onLoad}
                                        fill={true}
                                        priority={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button
                            variant='ghost'
                            onClick={() => {
                                setFiles(null)
                                setContentModeration(false)
                                setMediaSheetOpen(false)
                                setImageDimensionsError(false)
                            }}>
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                uploading ||
                                createPrintOptions ||
                                callableExecuting ||
                                contentModeration ||
                                imageDimensionsError
                            }
                            className='bg-pink-500 dark:bg-pink-500 hover:bg-pink-500/90 dark:hover:bg-pink-500/90'
                            onClick={() => {
                                createPrintOrder()
                            }}>
                            {uploading ||
                            createPrintOptions ||
                            callableExecuting ? (
                                <Loader2 className='mr-2 size-4 animate-spin' />
                            ) : (
                                <ShoppingBag className='mr-2 size-4' />
                            )}
                            Create Print
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <Sheet
                open={printSheetOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setFiles(null)
                        setImageDimensionsError(false)
                    }
                    setMediaSheetOpen(open)
                    setPrintSheetOpen(open)
                }}>
                <SheetContent
                    side='bottom'
                    className='h-screen flex flex-col gap-y-6 border-none container mx-auto'>
                    <SheetHeader>
                        <SheetTitle className='font-extrabold'>
                            Print Order
                        </SheetTitle>
                        <SheetDescription>
                            Make something awesome. Make it your own.
                        </SheetDescription>
                    </SheetHeader>
                    {printOrderUrl && <CanvaspopCart src={printOrderUrl} />}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default UploadFile
