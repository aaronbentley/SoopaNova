'use client'

import { countries } from '@/assets/data/countries'
import { productTypes } from '@/assets/data/pricing'
import {
    CountryField,
    OptionField,
    ProductTypeField,
    SizeField
} from '@/components/print-options/fields'
import OrderSummary from '@/components/print-options/order-summary'
import PreviewStatus from '@/components/print-options/preview-status'
import PrintPreview from '@/components/print-options/print-preview'
import ScreenshotDetails from '@/components/print-options/screenshot-details'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import type { PrintStatus } from '@/hooks/use-create-print'
import { usePrintOptions } from '@/hooks/use-print-options'
import { formatSize } from '@/lib/print-quality'
import type { ImageMeta, PrintSelection } from '@/types'

interface PrintOptionsSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    file: File
    previewUrl: string
    meta: ImageMeta
    /** Upload and moderation, which run while the customer chooses */
    status: PrintStatus
    progress: number
    error: string | null
    onRetry: () => void
    onCheckout: (selection: PrintSelection) => void
}

/**
 * Choose a product, size and options for a screenshot. Opens as soon as a
 * screenshot is chosen, while it uploads and is moderated; checkout waits
 * for approval. Prices come from the catalogue and pricing config.
 */
const PrintOptionsSheet = ({
    open,
    onOpenChange,
    file,
    previewUrl,
    meta,
    status,
    progress,
    error,
    onRetry,
    onCheckout
}: PrintOptionsSheetProps) => {
    const print = usePrintOptions(meta)

    const countryName =
        countries.find((country) => country.code === print.country)?.name ??
        print.country

    const title = print.size
        ? `${productTypes[print.productType].name}, ${formatSize(print.size.size, meta).inches}`
        : productTypes[print.productType].name

    return (
        <Sheet
            open={open}
            onOpenChange={onOpenChange}>
            <SheetContent
                side='bottom'
                className='h-dvh gap-0 overflow-y-auto border-none'
                onOpenAutoFocus={(event) => {
                    event.preventDefault()
                }}>
                <div className='wrapper flex flex-col gap-8 py-8'>
                    <SheetHeader className='p-0'>
                        <SheetTitle className='font-extrabold'>
                            Print Options
                        </SheetTitle>
                        <SheetDescription>
                            Make something awesome. Make it your own.
                        </SheetDescription>
                    </SheetHeader>

                    <div className='grid gap-10 md:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16'>
                        <div className='md:sticky md:top-8 md:self-start'>
                            <PrintPreview
                                previewUrl={previewUrl}
                                alt={file.name}
                                meta={meta}
                                productType={print.productType}
                                size={print.size?.size ?? null}
                                options={print.options}>
                                <PreviewStatus
                                    status={status}
                                    progress={progress}
                                    error={error}
                                    onRetry={onRetry}
                                />
                                <ScreenshotDetails
                                    file={file}
                                    meta={meta}
                                />
                            </PrintPreview>
                        </div>

                        {/* Locked if the screenshot can't be printed */}
                        <fieldset
                            disabled={status === 'flagged'}
                            className='flex min-w-0 flex-col gap-8 disabled:opacity-50'>
                            {/* First, as it sets the currency of every price below */}
                            <CountryField
                                value={print.country}
                                onChange={print.setCountry}
                            />
                            <ProductTypeField
                                choices={print.productChoices}
                                value={print.productType}
                                onChange={print.setProductType}
                            />
                            <SizeField
                                choices={print.sizeChoices}
                                value={print.size?.size ?? null}
                                meta={meta}
                                onChange={print.setSize}
                            />
                            {Object.entries(print.optionValues).map(
                                ([name, values]) => (
                                    <OptionField
                                        key={name}
                                        name={name}
                                        values={values}
                                        value={print.options[name]}
                                        onChange={(value) =>
                                            print.setOption(name, value)
                                        }
                                    />
                                )
                            )}
                            <OrderSummary
                                title={title}
                                price={print.price}
                                shippingFrom={print.shippingFrom}
                                countryName={countryName}
                                confirmed={print.confirmed}
                                approved={status === 'ready'}
                                onConfirmedChange={print.setConfirmed}
                                onCheckout={() => {
                                    if (print.selection) {
                                        onCheckout(print.selection)
                                    }
                                }}
                            />
                        </fieldset>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default PrintOptionsSheet
