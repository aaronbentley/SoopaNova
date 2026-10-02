'use client'

import PrintOptionsSheet from '@/components/print-options/print-options-sheet'
import ScreenshotDropzone from '@/components/screenshot-dropzone'
import { useCreatePrint } from '@/hooks/use-create-print'
import { useScreenshot } from '@/hooks/use-screenshot'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

/**
 * Screenshot upload → print options flow.
 *
 * Choosing a screenshot checks its dimensions (useScreenshot), then starts
 * the upload/moderation pipeline (useCreatePrint) and opens the print
 * options sheet straight away, which shows the pipeline's progress.
 */
const UploadFile = ({
    variant = 'dropzone',
    className
}: {
    variant?: 'dropzone' | 'button'
    className?: string
}) => {
    const screenshot = useScreenshot()
    const print = useCreatePrint()

    /**
     * Check the screenshot, then upload and moderate it
     */
    const select = async (file: File) => {
        print.reset()

        const selected = await screenshot.select(file)
        if (selected) print.start(selected.file, selected.meta)
    }

    /**
     * Cancel any run in progress and clear the screenshot
     */
    const close = () => {
        print.reset()
        screenshot.clear()
    }

    return (
        <div
            className={cn(
                variant === 'dropzone' && ['flex', 'w-full', 'justify-center'],
                className
            )}>
            {(variant === 'button' || !screenshot.file) && (
                <ScreenshotDropzone
                    onSelect={select}
                    variant={variant}
                />
            )}
            {screenshot.file && screenshot.previewUrl && screenshot.meta && (
                <PrintOptionsSheet
                    key={screenshot.previewUrl}
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) close()
                    }}
                    file={screenshot.file}
                    previewUrl={screenshot.previewUrl}
                    meta={screenshot.meta}
                    status={print.status}
                    progress={print.progress}
                    error={print.error}
                    onRetry={() => {
                        if (screenshot.file && screenshot.meta) {
                            print.start(screenshot.file, screenshot.meta)
                        }
                    }}
                    onCheckout={() => {
                        /**
                         * Placeholder until /api/checkout (Stripe) exists
                         */
                        toast.info('Checkout is coming soon', {
                            description:
                                "Your choices look great - we're still building this bit."
                        })
                    }}
                />
            )}
        </div>
    )
}

export default UploadFile
