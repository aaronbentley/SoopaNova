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
const minSize = `${process.env.NEXT_PUBLIC_MIN_IMAGE_WIDTH}×${process.env.NEXT_PUBLIC_MIN_IMAGE_HEIGHT}`

/**
 * What to tell the customer when a file is turned away, by react-dropzone's
 * error code (its own messages are written for developers)
 */
const rejections: Record<string, { title: string; description: string }> = {
    'file-invalid-type': {
        title: 'That file type won’t work',
        description: 'Please choose a JPG or PNG screenshot.'
    },
    'file-too-large': {
        title: 'That file is too big',
        description: `Screenshots can be up to ${formatBytes(maxSize)}.`
    },
    'too-many-files': {
        title: 'One screenshot at a time',
        description: 'Please choose a single screenshot.'
    }
}

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
                 * Release focus from the trigger so the print options sheet can
                 * take it (the sheet hides everything behind it)
                 */
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                }
                onSelect(acceptedFiles[0])
            }

            const code = rejectedFiles[0]?.errors[0]?.code

            if (code) {
                const { title, description } = rejections[code] ?? {
                    title: 'That file won’t work',
                    description: 'Please choose a JPG or PNG screenshot.'
                }

                toast.error(title, { id: 'screenshot-rejected', description })
            }
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

    /**
     * react-dropzone hides the file input with a zero size but leaves it in
     * the layout, and Safari gives file inputs a minimum width, which pushed
     * the hero buttons apart. sr-only takes it out of the flow.
     */
    const inputProps = getInputProps({ className: 'sr-only' })

    if (variant === 'button') {
        return (
            <>
                <input {...inputProps} />
                <button
                    type='button'
                    onClick={open}
                    className={cn(ctaButtonVariants(), className)}>
                    <UploadCloud aria-hidden='true' />
                    Start creating
                </button>
            </>
        )
    }

    return (
        <div className='w-full max-w-115'>
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
                        'rounded-xl',
                        'border-[1.5px]',
                        'border-dashed',
                        'bg-background',
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
                <input {...inputProps} />
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
                        <small className='font-mono text-xs text-muted-foreground'>
                            JPG / PNG · min {minSize} · max{' '}
                            {formatBytes(maxSize)}
                        </small>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ScreenshotDropzone
