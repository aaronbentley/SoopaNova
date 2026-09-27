'use client'

import PrintOrderSheet from '@/components/print-order-sheet'
import ScreenshotDropzone from '@/components/screenshot-dropzone'
import ScreenshotPreviewSheet from '@/components/screenshot-preview-sheet'
import { useCreatePrint } from '@/hooks/use-create-print'
import { useScreenshot } from '@/hooks/use-screenshot'
import { cn } from '@/lib/utils'

/**
 * Screenshot upload → preview → print order flow.
 *
 * The screenshot (file, preview, dimensions) lives in useScreenshot and the
 * upload/moderation/CanvasPop pipeline in useCreatePrint; this component
 * wires them to the dropzone and the two sheets.
 */
const UploadFile = ({ className }: { className?: string }) => {
    const screenshot = useScreenshot()
    const print = useCreatePrint()

    /**
     * Cancel any run in progress and clear the screenshot
     */
    const close = () => {
        print.reset()
        screenshot.clear()
    }

    /**
     * Create Print is available once the screenshot's dimensions are known
     * and valid, and nothing is running (or it was flagged)
     */
    const canCreate =
        screenshot.meta !== null &&
        !screenshot.isTooSmall &&
        !print.isBusy &&
        print.status !== 'flagged'

    return (
        <div
            className={cn(
                ['container', 'mx-auto', 'flex', 'justify-center'],
                className
            )}>
            {!screenshot.file && (
                <ScreenshotDropzone
                    onSelect={screenshot.select}
                    className={className}
                />
            )}
            <ScreenshotPreviewSheet
                open={screenshot.file !== null}
                onOpenChange={(open) => {
                    if (!open) close()
                }}
                file={screenshot.file}
                previewUrl={screenshot.previewUrl}
                meta={screenshot.meta}
                onImageLoad={screenshot.onImageLoad}
                status={print.status}
                progress={print.progress}
                isBusy={print.isBusy}
                canCreate={canCreate}
                onCreate={() => {
                    if (screenshot.file && screenshot.meta) {
                        print.start(screenshot.file, screenshot.meta)
                    }
                }}
                onCancel={close}
            />
            <PrintOrderSheet
                open={print.status === 'ready'}
                onOpenChange={(open) => {
                    if (!open) close()
                }}
                cartUrl={print.cartUrl}
            />
        </div>
    )
}

export default UploadFile
