'use client'

import { cn, formatBytes } from '@/lib/utils'
import { FileWithPreview } from '@/types'
import { Loader2, UploadCloud, X } from 'lucide-react'
import { default as NextImage } from 'next/image'
import React from 'react'
import {
    useDropzone,
    type FileRejection,
    type FileWithPath
} from 'react-dropzone'
import { Button } from './ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from './ui/tooltip'
import { useToast } from './ui/use-toast'

const UploadFile = ({ className }: { className?: string }) => {
    /**
     * Define dropzone config
     */
    const accept = {
        'image/jpeg': [],
        'image/png': []
    }
    const maxSize = 1024 * 1024 * 100
    const maxFiles = 1
    const disabled = false

    /**
     * Initialize toast
     */
    const { toast } = useToast()

    /**
     * Manage uploading state
     */
    const [isUploading, setIsUploading] = React.useState(false)

    /**
     *  Manage file in state so we can preview it
     */
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
    // console.log('🦄 ~ file: upload-file.tsx ~ UploadFile ~ files:', files)

    /**
     * Handle image metadata
     */
    const [imageMeta = null, setImageMeta] = React.useState<{
        width: number
        height: number
    } | null>(null)

    /**
     * Handle dropzone file upload
     */
    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            // setIsUploading(true)

            if (acceptedFiles.length) {
                setFiles(
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                )
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

            // setIsUploading(false)
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

    const orderPrints = async () => {
        /**
         * Bail if no files
         */
        if (!files) return

        /**
         * Get the image file
         */
        const file = (files[0] as File) || null

        if (file) {
            try {
                setIsUploading(true)
                /**
                 * Compose formData and append 'file' to it
                 */

                const formData = new FormData()
                formData.append('image', file)

                /**
                 * Send the file to api route handler
                 */
                const response = await fetch('/api/canvaspop/image', {
                    method: 'POST',
                    body: formData
                })
                console.log(
                    '🦄 ~ file: upload-file.tsx:142 ~ orderPrints ~ response:',
                    response
                )

                if (!response.ok) {
                    throw new Error('Error uploading payload to API route')
                }

                /**
                 * Get api response data as JSON
                 */
                const json = await response.json()
                console.log(
                    '🦄 ~ file: upload-file.tsx:152 ~ orderPrints ~ json:',
                    json
                )
            } catch (error) {
                console.error(
                    '🦄 ~ file: upload-file.tsx:144 ~ orderPrints ~ error:',
                    error
                )
            } finally {
                setIsUploading(false)
            }
        }
    }

    return (
        <>
            <div className='container mx-auto flex justify-center'>
                {files && (
                    <div className='flex flex-col gap-y-12'>
                        <div
                            // data-image-loading={isUploading}
                            className={cn(
                                'relative aspect-video h-[540px] bg-indigo-700 animate-none'
                                // '[&[data-image-loading=true]]:animate-pulse'
                            )}>
                            <NextImage
                                src={files[0].preview}
                                alt={files[0].name}
                                className={cn(
                                    'object-contain object-center shadow-xl shadow-indigo-500/25'
                                )}
                                fill={true}
                                onLoadingComplete={({
                                    naturalWidth,
                                    naturalHeight
                                }) =>
                                    setImageMeta({
                                        width: naturalWidth,
                                        height: naturalHeight
                                    })
                                }
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='destructive'
                                            size='icon'
                                            className='absolute top-2 right-2'
                                            onClick={() => setFiles(null)}>
                                            <X />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Clear image</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className='flex justify-between items-center gap-x-8'>
                            <div>
                                <p className='text-xl font-extrabold text-slate-400'>
                                    {files[0].name}
                                </p>
                                <div className='flex gap-x-2 items-center'>
                                    <small className='text-sm text-slate-600 font-bold'>
                                        {formatBytes(files[0].size)}
                                    </small>
                                    {imageMeta?.width && imageMeta?.height && (
                                        <small className='text-sm text-slate-600'>
                                            {imageMeta.width}x{imageMeta.height}
                                        </small>
                                    )}
                                </div>
                            </div>
                            <Button
                                disabled={isUploading}
                                onClick={() => {
                                    orderPrints()
                                }}>
                                {isUploading && (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                )}
                                Order Prints
                            </Button>
                        </div>
                    </div>
                )}
                {!files && (
                    <div className='w-96'>
                        <div
                            {...getRootProps()}
                            className={cn(
                                'group min-w-full relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-400/25 px-5 py-2.5 text-center transition hover:bg-slate-700/25',
                                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                isDragActive && 'border-indigo-400',
                                disabled && 'pointer-events-none opacity-60',
                                className
                            )}>
                            <input {...getInputProps()} />
                            {isUploading ? (
                                <div className='group grid w-full place-items-center gap-1 sm:px-10'>
                                    <UploadCloud
                                        className='h-9 w-9 animate-pulse text-muted-foreground'
                                        aria-hidden='true'
                                    />
                                </div>
                            ) : isDragActive ? (
                                <div className='grid place-items-center gap-2 text-muted-foreground sm:px-5'>
                                    <UploadCloud
                                        className={cn(
                                            'h-8 w-8',
                                            isDragActive &&
                                                'animate-bounce text-indigo-400'
                                        )}
                                        aria-hidden='true'
                                    />
                                    <p className='text-base font-medium text-indigo-400'>
                                        Drop the file here
                                    </p>
                                </div>
                            ) : (
                                <div className='grid place-items-center gap-1 sm:px-5'>
                                    <UploadCloud
                                        className='h-8 w-8 text-slate-400'
                                        aria-hidden='true'
                                    />
                                    <p className='mt-2 text-base font-medium text-slate-400'>
                                        Drag {`'n'`} drop here, or click to
                                        select file
                                    </p>
                                    <small className='text-sm text-slate-600'>
                                        Please upload file with size less than{' '}
                                        {formatBytes(maxSize)}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default UploadFile
