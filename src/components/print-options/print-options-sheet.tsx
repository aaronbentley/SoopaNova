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
import { Form } from '@/components/ui/form'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import type { PrintStatus } from '@/hooks/use-create-print'
import { usePrintOptionsForm } from '@/hooks/use-print-options'
import type { PrintOptionsValues } from '@/lib/print-options-schema'
import { formatSize } from '@/lib/print-quality'
import type { ImageMeta } from '@/types'

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
    /** Called with the validated options when the form is submitted */
    onCheckout: (values: PrintOptionsValues) => void
    checkoutPending: boolean
    checkoutError: string | null
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
    onCheckout,
    checkoutPending,
    checkoutError
}: PrintOptionsSheetProps) => {
    const print = usePrintOptionsForm(meta)
    const { values, form } = print

    const countryName =
        countries.find((country) => country.code === values.country)?.name ??
        values.country

    const title = print.size
        ? `${productTypes[values.productType].name}, ${formatSize(print.size.size, meta).inches}`
        : productTypes[values.productType].name

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
                                productType={values.productType}
                                size={print.size?.size ?? null}
                                options={values.options}>
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

                        <Form {...form}>
                            <form
                                noValidate
                                onSubmit={form.handleSubmit(onCheckout)}
                                className='min-w-0'>
                                {/* Locked if the screenshot can't be printed */}
                                <fieldset
                                    disabled={status === 'flagged'}
                                    className='flex min-w-0 flex-col gap-8 disabled:opacity-50'>
                                    {/* First, as it sets the currency of every price below */}
                                    <CountryField
                                        control={form.control}
                                        onChange={print.setCountry}
                                    />
                                    <ProductTypeField
                                        control={form.control}
                                        choices={print.productChoices}
                                        onChange={print.setProductType}
                                    />
                                    <SizeField
                                        control={form.control}
                                        choices={print.sizeChoices}
                                        meta={meta}
                                        onChange={print.setSize}
                                    />
                                    {Object.entries(print.optionValues).map(
                                        ([name, optionValues]) => (
                                            <OptionField
                                                key={name}
                                                control={form.control}
                                                name={name}
                                                values={optionValues}
                                                onChange={(value) =>
                                                    print.setOption(name, value)
                                                }
                                            />
                                        )
                                    )}
                                    <OrderSummary
                                        control={form.control}
                                        title={title}
                                        price={print.price}
                                        shippingFrom={print.shippingFrom}
                                        countryName={countryName}
                                        approved={status === 'ready'}
                                        pending={checkoutPending}
                                        error={checkoutError}
                                    />
                                </fieldset>
                            </form>
                        </Form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default PrintOptionsSheet
