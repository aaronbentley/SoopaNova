'use client'

import { storage } from '@/firebase/config'
import {
    cn,
    formatBytes,
    getAspectRatio,
    getDateFromUnixTimestamp
} from '@/lib/utils'
import { FileWithPreview } from '@/types'
import { getDownloadURL, ref } from 'firebase/storage'
import { Loader2, ShoppingCart, UploadCloud } from 'lucide-react'
import { default as NextImage } from 'next/image'
import React from 'react'
import {
    useDropzone,
    type FileRejection,
    type FileWithPath
} from 'react-dropzone'
import { useUploadFile } from 'react-firebase-hooks/storage'
import { v4 as uuidv4 } from 'uuid'
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
import { Table, TableBody, TableCell, TableHead, TableRow } from './ui/table'
import { useToast } from './ui/use-toast'

const UploadFile = ({ className }: { className?: string }) => {
    /**
     * Define dropzone config
     */
    const accept = {
        'image/jpeg': [],
        'image/png': []
    }
    const maxSize = 1024 * 1024 * 50
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
     * Handle Sheet state
     */
    const [sheetOpen, setSheetOpen] = React.useState(false)

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

                setSheetOpen(true)
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

    const orderPrints = async () => {
        /**
         * Bail if no files
         */
        if (!files) return

        /**
         * Pluck the image file from the array
         */
        const file = (files[0] as File) || null

        if (file) {
            try {
                /**
                 * Get Firebase Storage reference
                 */
                const storageRef = ref(storage, `${uuidv4()}--${file.name}`)

                /**
                 * Upload file to Firebase Storage
                 */
                const firebaseStorageResponse = await uploadFile(
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

                if (!firebaseStorageResponse) {
                    throw new Error('Error uploading image to Firebase Storage')
                }

                console.log(
                    '🦄 ~ file: upload-file.tsx:151 ~ orderPrints ~ firebaseStorageResponse:',
                    firebaseStorageResponse
                )

                /**
                 * Get file download url
                 */
                const fileDownloadUrl = await getDownloadURL(
                    firebaseStorageResponse.ref
                )
                // console.log(
                //     '🦄 ~ file: upload-file.tsx:192 ~ orderPrints ~ fileDownloadUrl:',
                //     fileDownloadUrl
                // )

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
                    data: { image_token, message }
                } = pushImageResponseJson
                console.log(
                    '🦄 ~ file: upload-file.tsx:210 ~ orderPrints ~ image_token:',
                    image_token
                )
                console.info(
                    'CART URL:',
                    `https://store.canvaspop.com/loader/${image_token}/${imageMeta?.width}/${imageMeta?.height}/`
                )

                window?.open(
                    `https://store.canvaspop.com/loader/${image_token}/${imageMeta?.width}/${imageMeta?.height}/`,
                    '_blank'
                )
            } catch (error) {
                console.error(
                    '🦄 ~ file: upload-file.tsx:144 ~ orderPrints ~ error:',
                    error
                )

                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Something went wrong. Please try again.'
                })
            } finally {
                // setIsUploading(uploading)
            }
        }
    }

    return (
        <>
            <div className='container mx-auto flex justify-center'>
                {!files && (
                    <div className='w-96'>
                        <div
                            {...getRootProps()}
                            className={cn(
                                'group min-w-full relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-neutral-400/25 px-5 py-2.5 text-center transition',
                                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-fuchsia-400 transition-all duration-200',
                                isDragActive && 'border-fuchsia-400',
                                disabled && 'pointer-events-none opacity-60',
                                className
                            )}>
                            <input {...getInputProps()} />
                            {uploading ? (
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
                                            'animate-bounce text-fuchsia-400'
                                        )}
                                        aria-hidden='true'
                                    />
                                    <p className='text-base font-medium text-fuchsia-400'>
                                        Drop file here
                                    </p>
                                </div>
                            ) : (
                                <div className='grid place-items-center gap-1 sm:px-5'>
                                    <UploadCloud
                                        className='h-8 w-8 text-neutral-400 duration-200 group-hover:text-fuchsia-400'
                                        aria-hidden='true'
                                    />
                                    <p className='mt-2 text-base font-medium text-neutral-400 transition-colors duration-200 group-hover:text-fuchsia-400'>
                                        Drag {`'n'`} drop here, or click to
                                        select file
                                    </p>
                                    <small className='text-sm text-neutral-500'>
                                        Please upload file with size less than{' '}
                                        {formatBytes(maxSize)}
                                    </small>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Sheet
                    open={sheetOpen}
                    onOpenChange={async (open) => {
                        if (!open) {
                            setFiles(null)
                        }
                        setSheetOpen(open)
                    }}>
                    {files && (
                        <SheetContent
                            side='bottom'
                            // forceMount
                            className='h-screen flex flex-col gap-y-12 border-none container mx-auto'>
                            <SheetHeader>
                                <SheetTitle className='font-extrabold'>
                                    Media
                                </SheetTitle>
                                <SheetDescription>
                                    How we lookin&apos;?
                                </SheetDescription>
                            </SheetHeader>
                            <div className='grid md:grid-cols-4 gap-12'>
                                <div className='md:col-span-1'>
                                    <Table>
                                        <TableBody>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>Filename</TableHead>
                                                <TableCell>
                                                    {files[0].name}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>Width</TableHead>
                                                <TableCell>
                                                    {`${imageMeta?.width} px`}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>Height</TableHead>
                                                <TableCell>
                                                    {`${imageMeta?.height} px`}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>
                                                    Aspect ratio
                                                </TableHead>
                                                <TableCell>
                                                    {imageMeta?.aspectRatio}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>Size</TableHead>
                                                <TableCell>
                                                    {formatBytes(files[0].size)}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>Format</TableHead>
                                                <TableCell>
                                                    {files[0].type}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className='border-neutral-400/25'>
                                                <TableHead>
                                                    Created at
                                                </TableHead>
                                                <TableCell>
                                                    {getDateFromUnixTimestamp(
                                                        files[0].lastModified
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className='md:col-span-3'>
                                    <div
                                        className={cn(
                                            ['relative', 'aspect-video']
                                            // uploading && ['animate-pulse']
                                        )}>
                                        {snapshot && (
                                            <div className='absolute inset-0 z-20 flex flex-col justify-end px-4 pb-4'>
                                                <Progress
                                                    value={uploadProgress}
                                                />
                                            </div>
                                        )}
                                        <NextImage
                                            src={files[0].preview}
                                            alt={files[0].name}
                                            className={cn(
                                                [
                                                    'z-10',
                                                    'object-contain',
                                                    'object-center'
                                                ],
                                                uploading && ['opacity-75']
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
                                    </div>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    variant='ghost'
                                    onClick={() => {
                                        setFiles(null)
                                        setSheetOpen(false)
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    disabled={uploading}
                                    onClick={() => {
                                        orderPrints()
                                    }}>
                                    {uploading ? (
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    ) : (
                                        <ShoppingCart className='mr-2 h-4 w-4' />
                                    )}
                                    Order Prints
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    )}
                </Sheet>
            </div>
        </>
    )
}

export default UploadFile
