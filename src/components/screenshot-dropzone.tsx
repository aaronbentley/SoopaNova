'use client'

import { ctaButtonVariants } from '@/components/cta-button'
import { cn, formatBytes } from '@/lib/utils'
import { UploadCloud } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

/**
 * Define dropzone config
 */
const accept = {
    'image/jpeg': [],
    'image/png': []
}
const maxSize =
    1024 * 1024 * parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE! || '')

interface ScreenshotDropzoneProps {
    onSelect: (file: File) => void
    /**
     * dropzone: drag 'n' drop area. button: a single button that opens
     * the file picker.
     */
    variant?: 'dropzone' | 'button'
    className?: string
}

const ScreenshotDropzone = ({
    onSelect,
    variant = 'dropzone',
    className
}: ScreenshotDropzoneProps) => {
    /**
     * Handle dropzone file selection
     */
    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (acceptedFiles[0]) {
                /**
                 * Release focus from the trigger so the preview sheet can
                 * take it (Radix hides everything behind the sheet)
                 */
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                }
                onSelect(acceptedFiles[0])
            }

            rejectedFiles.forEach(({ errors }) => {
                if (errors[0]?.message) {
                    toast.error('Error', {
                        description: errors[0].message
                    })
                }
            })
        },
        [onSelect]
    )

    /**
     * Initialize dropzone
     */
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles: 1,
        multiple: false,
        noClick: variant === 'button',
        noKeyboard: variant === 'button',
        noDrag: variant === 'button'
    })

    if (variant === 'button') {
        return (
            <>
                <input {...getInputProps()} />
                <button
                    type='button'
                    onClick={open}
                    className={cn(ctaButtonVariants(), className)}>
                    <UploadCloud aria-hidden='true' />
                    Upload a screenshot
                </button>
            </>
        )
    }

    return (
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
                        'px-5',
                        'py-2.5',
                        'text-center',
                        'transition',
                        'ring-offset-background',
                        'focus-visible:outline-hidden',
                        'focus-visible:ring-2',
                        'focus-visible:ring-ring',
                        'focus-visible:ring-offset-2',
                        'hover:border-primary',
                        'transition-all',
                        'duration-200'
                    ],
                    isDragActive && ['border-primary', 'dark:border-primary'],
                    className
                )}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <div className='grid place-items-center gap-2 sm:px-5'>
                        <UploadCloud
                            className={cn([
                                'size-8',
                                'origin-bottom',
                                'animate-bounce',
                                'text-primary'
                            ])}
                            aria-hidden='true'
                        />
                        <p className='text-base font-medium text-primary'>
                            Drop it like it&apos;s hot
                        </p>
                    </div>
                ) : (
                    <div className='grid place-items-center gap-1 sm:px-5'>
                        <UploadCloud
                            className={cn([
                                'size-8',
                                'text-muted-foreground',
                                'duration-200',
                                'origin-bottom',
                                'group-hover:text-primary',
                                'group-hover:animate-bounce'
                            ])}
                            aria-hidden='true'
                        />
                        <p className='mt-2 text-base font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary'>
                            Drag {`'n'`} drop here, or click to select file
                        </p>
                        <small className='text-sm text-muted-foreground/75'>
                            Max. file size {formatBytes(maxSize)}
                        </small>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ScreenshotDropzone
