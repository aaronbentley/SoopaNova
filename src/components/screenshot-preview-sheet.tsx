'use client'

import ImageMetadata from '@/components/image-metadata'
import { Typography } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { PrintStatus } from '@/hooks/use-create-print'
import { cn } from '@/lib/utils'
import { ImageMeta } from '@/types'
import { Loader2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'

/**
 * Overlay label shown over the preview while a step is running
 */
const busyLabels: Partial<Record<PrintStatus, string>> = {
    moderating: 'Moderating Image'
}

interface ScreenshotPreviewSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file: File | null
    previewUrl: string | null
    meta: ImageMeta | null
    onImageLoad: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
    status: PrintStatus
    progress: number
    isBusy: boolean
    canCreate: boolean
    onCreate: () => void
    onCancel: () => void
}

const ScreenshotPreviewSheet = ({
    open,
    onOpenChange,
    file,
    previewUrl,
    meta,
    onImageLoad,
    status,
    progress,
    isBusy,
    canCreate,
    onCreate,
    onCancel
}: ScreenshotPreviewSheetProps) => {
    const busyLabel = busyLabels[status]

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}>
            <SheetContent
                side='top'
                className='h-fit flex flex-col gap-y-6 border-none container mx-auto'
                onOpenAutoFocus={(event) => {
                    event.preventDefault()
                }}>
                <SheetHeader>
                    <SheetTitle className='font-extrabold'>
                        Screenshot Preview
                    </SheetTitle>
                    <SheetDescription>How we lookin&apos;?</SheetDescription>
                </SheetHeader>
                <div className='grid md:grid-cols-4 gap-12 max-w-full'>
                    <div className='md:col-span-1'>
                        <ImageMetadata
                            file={file}
                            imageMeta={meta}
                        />
                    </div>

                    <div className='md:col-span-3'>
                        <div
                            className={cn([
                                'relative',
                                'aspect-video',
                                'max-w-full'
                            ])}>
                            {status === 'uploading' && (
                                <div className='absolute inset-0 z-30 bg-background/50 flex flex-col justify-end px-4 pb-4'>
                                    <Progress
                                        value={progress}
                                        className='data-[state=indeterminate]:[&>div]:bg-primary'
                                    />
                                </div>
                            )}
                            {busyLabel && (
                                <div className='absolute inset-0 z-30 bg-background/50 flex flex-col justify-center items-center gap-y-4'>
                                    <Loader2 className='size-12 animate-spin text-primary' />
                                    <Typography
                                        variant='p'
                                        className='font-extrabold text-center'>
                                        {busyLabel}
                                    </Typography>
                                </div>
                            )}
                            {file && previewUrl && (
                                <Image
                                    src={previewUrl}
                                    alt={file.name}
                                    className={cn(
                                        [
                                            'z-10',
                                            'object-contain',
                                            'object-center'
                                        ],
                                        status === 'flagged' && [
                                            'blur-sm',
                                            'opacity-75'
                                        ]
                                    )}
                                    onLoad={onImageLoad}
                                    fill={true}
                                    priority={true}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <SheetFooter className='md:flex-row md:justify-end md:px-0'>
                    <Button
                        variant='ghost'
                        onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!canCreate}
                        className='focus-visible:ring-primary dark:focus-visible:ring-primary'
                        onClick={onCreate}>
                        {isBusy ? (
                            <Loader2 className='mr-2 size-4 animate-spin' />
                        ) : (
                            <ShoppingBag className='mr-2 size-4' />
                        )}
                        Create Print
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default ScreenshotPreviewSheet
