import type { FileWithPreview } from '@/types'
import * as React from 'react'
import {
    useDropzone,
    type Accept,
    type FileRejection,
    type FileWithPath
} from 'react-dropzone'
import type {
    FieldValues,
    Path,
    PathValue,
    UseFormSetValue
} from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { cn, formatBytes } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'
import { useToast } from './ui/use-toast'

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface FileDialogProps<TFieldValues extends FieldValues>
    extends React.HTMLAttributes<HTMLDivElement> {
    name: Path<TFieldValues>
    setValue: UseFormSetValue<TFieldValues>
    accept?: Accept
    maxSize?: number
    maxFiles?: number
    files: FileWithPreview[] | null
    setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[] | null>>
    isUploading?: boolean
    disabled?: boolean
}

export function FileDialog<TFieldValues extends FieldValues>({
    name,
    setValue,
    accept = {
        'image/*': []
    },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    files,
    setFiles,
    isUploading = false,
    disabled = false,
    className,
    ...props
}: FileDialogProps<TFieldValues>) {
    const { toast } = useToast()

    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
            setValue(
                name,
                acceptedFiles as PathValue<TFieldValues, Path<TFieldValues>>,
                {
                    shouldValidate: true
                }
            )

            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            )

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ errors }) => {
                    if (errors[0]?.code === 'file-too-large') {
                        toast({
                            title: "It's too big!",
                            description: `File is too large. Max size is ${formatBytes(
                                maxSize
                            )}`
                        })
                        return
                    }
                    errors[0]?.message &&
                        toast({
                            title: 'Error',
                            description: errors[0].message
                        })
                })
            }
        },

        [maxSize, name, setFiles, setValue, toast]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
        multiple: maxFiles > 1,
        disabled
    })

    // Revoke preview url when component unmounts
    React.useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => URL.revokeObjectURL(file.preview))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant='outline'
                    disabled={disabled}>
                    Upload Images
                    <span className='sr-only'>Upload Images</span>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[480px]'>
                <p className='absolute left-5 top-4 text-base font-medium text-muted-foreground'>
                    Upload your images
                </p>
                <div
                    {...getRootProps()}
                    className={cn(
                        'group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
                        'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        isDragActive && 'border-muted-foreground/50',
                        disabled && 'pointer-events-none opacity-60',
                        className
                    )}
                    {...props}>
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
                                    isDragActive && 'animate-bounce'
                                )}
                                aria-hidden='true'
                            />
                            <p className='text-base font-medium'>
                                Drop the file here
                            </p>
                        </div>
                    ) : (
                        <div className='grid place-items-center gap-1 sm:px-5'>
                            <UploadCloud
                                className='h-8 w-8 text-muted-foreground'
                                aria-hidden='true'
                            />
                            <p className='mt-2 text-base font-medium text-muted-foreground'>
                                Drag {`'n'`} drop file here, or click to select
                                file
                            </p>
                            <p className='text-sm text-slate-500'>
                                Please upload file with size less than{' '}
                                {formatBytes(maxSize)}
                            </p>
                        </div>
                    )}
                </div>
                <p className='text-center text-sm font-medium text-muted-foreground'>
                    You can upload up to {maxFiles}{' '}
                    {maxFiles === 1 ? 'file' : 'files'}
                </p>
            </DialogContent>
        </Dialog>
    )
}
