import { productJsonLd } from '@/assets/data/json-ld'
import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { careNote, productPages } from '@/assets/data/product-pages'
import { productCopy, productPath } from '@/assets/data/products'
import {
    frameSwatches,
    optionNames,
    wrapDescriptions
} from '@/assets/data/print-options'
import { ctaButtonVariants } from '@/components/cta-button'
import JsonLd from '@/components/json-ld'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import ProductImage from '@/components/product-image'
import ProductPrice from '@/components/product-price'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    getFromPrices,
    getProductOptions,
    getRegionPrices
} from '@/lib/pricing'
import { optionLabel, sortOptionValues } from '@/lib/print-labels'
import {
    formatCentimetres,
    formatInches,
    qualityThresholds
} from '@/lib/print-quality'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ product: string }> }

const productTypeIds = Object.keys(productTypes) as ProductTypeId[]

const isProductType = (product: string): product is ProductTypeId =>
    productTypeIds.includes(product as ProductTypeId)

/**
 * One static page per product; anything else is a 404
 */
export const dynamicParams = false

export const generateStaticParams = () =>
    productTypeIds.map((product) => ({ product }))

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const { product } = await params

    if (!isProductType(product)) return {}

    return {
        title: productTypes[product].name,
        description: productCopy[product].description,
        alternates: {
            canonical: productPath(product)
        }
    }
}

/**
 * Small pink square bullet, like the wordmark's
 */
const Bullet = () => (
    <span
        aria-hidden='true'
        className='mt-2 size-1.5 shrink-0 bg-primary'
    />
)

const ProductPage = async ({ params }: Props) => {
    const { product } = await params

    if (!isProductType(product)) notFound()

    const { name, sizes } = productTypes[product]
    const { intro, features, specs } = productPages[product]
    const options = Object.entries(getProductOptions(product)).map(
        ([optionName, values]) =>
            [optionName, sortOptionValues(optionName, values)] as const
    )

    return (
        <>
            <JsonLd data={productJsonLd(product)} />
            <div>
                <PageHeader eyebrow='Prints'>
                    <PageHeaderHeading>{name}</PageHeaderHeading>
                    <PageHeaderDescription>
                        {productCopy[product].description}
                    </PageHeaderDescription>
                    <div className='flex flex-wrap items-center gap-5'>
                        <Link
                            href='/create/'
                            className={ctaButtonVariants()}>
                            Start creating
                            <ArrowRight aria-hidden='true' />
                        </Link>
                        <span className='font-mono text-sm text-muted-foreground'>
                            <ProductPrice
                                prices={getFromPrices(product)}
                                from
                            />
                        </span>
                    </div>
                </PageHeader>
            </div>

            <div>
                <PageSection className='md:py-10 w-full'>
                    <div className='grid w-full gap-10 md:grid-cols-2 lg:gap-16'>
                        <ProductImage
                            productType={product}
                            sizes='(max-width: 767px) 100vw, 600px'
                            eager
                            className='rounded-xl border'
                        />
                        <div className='flex flex-col gap-6'>
                            {intro.map((paragraph) => (
                                <PageSectionDescription key={paragraph}>
                                    {paragraph}
                                </PageSectionDescription>
                            ))}
                            <ul className='flex flex-col gap-3'>
                                {features.map((feature) => (
                                    <li
                                        key={feature}
                                        className='flex gap-3'>
                                        <Bullet />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className='flex flex-wrap gap-1.5'>
                                {productCopy[product].tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className='rounded-sm border px-2 py-1 font-mono text-[11px] text-muted-foreground'>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Sizes</PageSectionHeading>
                    <PageSectionDescription>
                        Prices are for the print; delivery is added at checkout.
                        Your screenshot is cropped from the centre to fill the
                        print, and sizes it&apos;s too small for (under{' '}
                        {qualityThresholds.ok} pixels per inch) can&apos;t be
                        ordered.
                    </PageSectionDescription>
                    <Table className='max-w-xl'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Inches</TableHead>
                                <TableHead>Centimetres</TableHead>
                                <TableHead className='text-right'>
                                    Price
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sizes.map(({ size }) => (
                                <TableRow key={size}>
                                    <TableCell className='font-medium'>
                                        {formatInches(size)}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground'>
                                        {formatCentimetres(size)}
                                    </TableCell>
                                    <TableCell className='text-right font-mono tabular-nums'>
                                        <ProductPrice
                                            prices={getRegionPrices(
                                                product,
                                                size
                                            )}
                                            unavailable={
                                                <span className='text-muted-foreground'>
                                                    Not available in your
                                                    country
                                                </span>
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </PageSection>

                {options.map(([optionName, values]) => (
                    <PageSection
                        key={optionName}
                        className='md:py-10 w-full'>
                        <PageSectionHeading>
                            {optionNames[optionName] ?? optionName}
                        </PageSectionHeading>
                        {optionName === 'color' ? (
                            <ul className='flex flex-wrap gap-x-6 gap-y-4'>
                                {values.map((value) => (
                                    <li
                                        key={value}
                                        className='flex items-center gap-3 text-sm'>
                                        <span
                                            aria-hidden='true'
                                            style={{
                                                backgroundColor:
                                                    frameSwatches[value] ??
                                                    'transparent'
                                            }}
                                            className='size-7 rounded-full border'
                                        />
                                        {optionLabel(optionName, value)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul className='grid w-full gap-3 sm:grid-cols-2'>
                                {values.map((value) => (
                                    <li
                                        key={value}
                                        className='flex flex-col gap-1 rounded-lg border p-4'>
                                        <span className='font-medium'>
                                            {optionLabel(optionName, value)}
                                        </span>
                                        {wrapDescriptions[value] && (
                                            <span className='text-sm text-pretty text-muted-foreground'>
                                                {wrapDescriptions[value]}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </PageSection>
                ))}

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Specifications</PageSectionHeading>
                    <dl className='w-full max-w-3xl divide-y border-y'>
                        {specs.map(({ label, value }) => (
                            <div
                                key={label}
                                className='grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6'>
                                <dt className='eyebrow text-muted-foreground'>
                                    {label}
                                </dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Looking after it</PageSectionHeading>
                    <PageSectionDescription>{careNote}</PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Ready, player one?</PageSectionHeading>
                    <PageSectionDescription>
                        Upload your screenshot, then choose your size and
                        options. You&apos;ll see a preview of your{' '}
                        {name.toLowerCase()} before you order.
                    </PageSectionDescription>
                    <Link
                        href='/create/'
                        className={cn(ctaButtonVariants(), 'mt-4')}>
                        Start creating
                        <ArrowRight aria-hidden='true' />
                    </Link>
                </PageSection>
            </div>
        </>
    )
}

export default ProductPage
