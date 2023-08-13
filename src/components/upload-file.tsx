'use client'

import { storage } from '@/firebase/config'
import { cn, formatBytes, getAspectRatio } from '@/lib/utils'
import { FileWithPreview } from '@/types'
import { getDownloadURL, ref } from 'firebase/storage'
import { Loader2, ShoppingBag, UploadCloud } from 'lucide-react'
import { default as NextImage } from 'next/image'
import React from 'react'
import {
    useDropzone,
    type FileRejection,
    type FileWithPath
} from 'react-dropzone'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { v4 as uuidv4 } from 'uuid'
import CanvasPopCart from './canvaspop-cart'
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
import { useToast } from './ui/use-toast'

const UploadFile = ({ className }: { className?: string }) => {
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
     * Initialize toast
     */
    const { toast } = useToast()

    /**
     *  Manage file in state so we can preview it
     */
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
    // console.log('🦄 ~ file: upload-file.tsx:55 ~ UploadFile ~ files:', files)

    /**
     * Handle Firebase uploads
     */
    const [uploadFile, uploading, snapshot, uploadError] = useUploadFile()

    /**
     * Handle Upload progress
     */
    const [uploadProgress, setUploadProgress] = React.useState(0)

    /**
     * Handle print options progress
     */
    const [createPrintOptions, setCreatePrintOptions] = React.useState(false)

    /**
     * Handle Media Sheet state
     */
    const [mediaSheetOpen, setMediaSheetOpen] = React.useState(false)

    /**
     * Handle Print Sheet state
     */
    const [printSheetOpen, setPrintSheetOpen] = React.useState(false)

    /**
     * Handle Print Order Url
     */
    const [printOrderUrl, setPrintOrderUrl] = React.useState<string | null>(
        null
    )

    /**
     * Handle image metadata
     */
    const [imageMeta = null, setImageMeta] = React.useState<{
        width: number
        height: number
        aspectRatio: string
    } | null>(null)

    /**
     * Handle upload progress
     */
    React.useEffect(() => {
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
    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            if (acceptedFiles.length) {
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                )

                setMediaSheetOpen(true)
            }

            if (rejectedFiles.length) {
                rejectedFiles.forEach(({ errors }) => {
                    errors[0]?.message &&
                        toast({
                            variant: 'destructive',
                            title: 'Error',
                            description: errors[0].message
                        })
                })
            }
        },
        [toast]
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
    React.useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => URL.revokeObjectURL(file.preview))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        const file = (files[0] as FileWithPreview) || undefined

        if (file) {
            try {
                toast({
                    title: 'Uploading Media',
                    description: 'Preparing print assets'
                })

                /**
                 * Get Firebase Storage reference
                 */
                const storageRef = ref(storage, `${uuidv4()}--${file.name}`)

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
                            aspectRatio: imageMeta?.aspectRatio || ''
                        }
                    }
                )

                /**
                 * Handle Firebase Storage upload error
                 */
                if (!firebaseStorageUploadResponse) {
                    throw new Error('Error uploading image to Firebase Storage')
                }

                setCreatePrintOptions(true)

                /**
                 * Get file download url using existing Firebase Storage reference returned from upload
                 */
                const fileDownloadUrl = await getDownloadURL(
                    firebaseStorageUploadResponse.ref
                )

                toast({
                    title: 'Creating Print Order',
                    description: 'Hold tight Sparky - this may take a moment'
                })

                /**
                 * Initiate upload to CanvasPop Push API (API route handler)
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
                    data: { image_token = undefined, message }
                } = pushImageResponseJson

                /**
                 * Check we have an image upload token
                 */
                if (!image_token) {
                    throw new Error('No image token found in response')
                }

                const canvasPopCartUrl = new URL(
                    `${process.env.NEXT_PUBLIC_CANVASPOP_IMAGE_LOADER_ENDPOINT}/${image_token}/${imageMeta?.width}/${imageMeta?.height}/`
                )

                // console.info('CART URL:', canvasPopCartUrl.href)

                setPrintOrderUrl(canvasPopCartUrl.href)

                setPrintSheetOpen(true)

                // window?.open(canvasPopCartUrl.href, '_blank')
            } catch (error) {
                console.error('createPrintOrder ~ error:', error)

                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Something went wrong. Please try again.'
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
                                        'h-8',
                                        'w-8',
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
                                        'h-8',
                                        'w-8',
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
                    <div className='grid md:grid-cols-4 gap-12'>
                        <div className='md:col-span-1'>
                            {files && (
                                <ImageMetadata
                                    file={files[0]}
                                    imageMeta={imageMeta}
                                />
                            )}
                        </div>

                        <div className='md:col-span-3'>
                            <div className={cn(['relative', 'aspect-video'])}>
                                {snapshot && (
                                    <div className='absolute inset-0 z-30 flex flex-col justify-end px-4 pb-4'>
                                        <Progress
                                            value={uploadProgress}
                                            className='[&>div]:data-[state=indeterminate]:bg-pink-500'
                                        />
                                    </div>
                                )}
                                {createPrintOptions && (
                                    <div className='absolute inset-0 z-30 bg-neutral-50/75 dark:bg-neutral-950/75 flex flex-col justify-center items-center gap-y-4'>
                                        <Loader2 className='h-12 w-12 animate-spin text-pink-500' />
                                        <p className='font-extrabold'>
                                            Creating Print Order
                                        </p>
                                    </div>
                                )}
                                {files && (
                                    <NextImage
                                        src={files[0].preview}
                                        alt={files[0].name}
                                        className={cn(
                                            [
                                                'z-10',
                                                'object-contain',
                                                'object-center'
                                            ],
                                            uploading && ['opacity-75'],
                                            createPrintOptions && ['opacity-75']
                                        )}
                                        fill={true}
                                        priority={true}
                                        onLoadingComplete={({
                                            naturalWidth,
                                            naturalHeight
                                        }) =>
                                            setImageMeta({
                                                width: naturalWidth,
                                                height: naturalHeight,
                                                aspectRatio: getAspectRatio(
                                                    naturalWidth,
                                                    naturalHeight
                                                )
                                            })
                                        }
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
                                setMediaSheetOpen(false)
                            }}>
                            Cancel
                        </Button>
                        <Button
                            disabled={uploading || createPrintOptions}
                            className='bg-pink-500 dark:bg-pink-500 hover:bg-pink-500/90 dark:hover:bg-pink-500/90'
                            onClick={() => {
                                createPrintOrder()
                            }}>
                            {uploading || createPrintOptions ? (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            ) : (
                                <ShoppingBag className='mr-2 h-4 w-4' />
                            )}
                            Order Prints
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <Sheet
                open={printSheetOpen}
                onOpenChange={(open) => setPrintSheetOpen(open)}>
                <SheetContent
                    side='bottom'
                    className='h-screen flex flex-col gap-y-6 border-none container mx-auto'>
                    <SheetHeader>
                        <SheetTitle className='font-extrabold'>
                            Print Order
                        </SheetTitle>
                        <SheetDescription>
                            Choose from a Poster, Canvas, or Framed Print, then
                            choose your size and quantity.
                        </SheetDescription>
                    </SheetHeader>
                    {printOrderUrl && <CanvasPopCart src={printOrderUrl} />}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default UploadFile
