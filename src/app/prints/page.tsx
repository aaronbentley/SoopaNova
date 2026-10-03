import { printsJsonLd } from '@/assets/data/json-ld'
import { optionCountNames } from '@/assets/data/print-options'
import {
    productTypes,
    regions,
    type ProductTypeId
} from '@/assets/data/pricing'
import { compareRows, productPages } from '@/assets/data/product-pages'
import { productPath } from '@/assets/data/products'
import { sizeRange } from '@/assets/data/size-range'
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
import ProductCard from '@/components/product-card'
import ProductPrice from '@/components/product-price'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { getFromPrices, getProductOptions } from '@/lib/pricing'
import { formatInches } from '@/lib/print-quality'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Prints',
    description: `Art prints, canvases, framed prints and framed canvases of your gaming screenshots, side by side, in sizes from ${sizeRange}.`,
    alternates: {
        canonical: '/prints/'
    }
}

const productTypeIds = Object.keys(productTypes) as ProductTypeId[]

/**
 * A product's sizes, noting any only sold in some regions
 * ('14 × 24″, 28 × 48″ (United Kingdom only)')
 */
const describeSizes = (productType: ProductTypeId) =>
    productTypes[productType].sizes
        .map(({ size, ...rest }) => {
            const only = 'regions' in rest ? rest.regions : undefined

            return only
                ? `${formatInches(size)} (${only.map((region) => regions[region].name).join(', ')} only)`
                : formatInches(size)
        })
        .join(', ')

/**
 * A product's options, counted ('8 frame colours · 4 edge finishes')
 */
const describeOptions = (productType: ProductTypeId) =>
    Object.entries(getProductOptions(productType))
        .map(
            ([name, values]) =>
                `${values.length} ${optionCountNames[name] ?? name}`
        )
        .join(' · ') || 'None'

const Prints = () => (
    <>
        <JsonLd data={printsJsonLd} />
        <div>
            <PageHeader eyebrow='Compare all prints'>
                <PageHeaderHeading>Paper, canvas or frame?</PageHeaderHeading>
                <PageHeaderDescription>
                    Four ways to put your favourite screenshot on the wall, in
                    sizes from {sizeRange}. Each one is made to order.
                </PageHeaderDescription>
            </PageHeader>
        </div>

        <div>
            <PageSection className='md:py-10 w-full'>
                <div className='grid w-full gap-4 md:grid-cols-2'>
                    {productTypeIds.map((productType) => (
                        <ProductCard
                            key={productType}
                            productType={productType}
                        />
                    ))}
                </div>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Choose your fighter</PageSectionHeading>
                <dl className='grid w-full gap-4 sm:grid-cols-2'>
                    {productTypeIds.map((productType) => (
                        <div
                            key={productType}
                            className='flex flex-col gap-1 rounded-lg border p-5'>
                            <dt>
                                <Link
                                    href={productPath(productType)}
                                    className='font-medium transition-colors duration-200 hover:text-primary'>
                                    {productTypes[productType].name}
                                </Link>
                            </dt>
                            <dd className='text-sm text-pretty text-muted-foreground'>
                                {productPages[productType].bestFor}
                            </dd>
                        </div>
                    ))}
                </dl>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Side by side</PageSectionHeading>
                <PageSectionDescription>
                    Prices are for the print; delivery is added at checkout.
                </PageSectionDescription>
                <Table className='min-w-3xl'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-40' />
                            {productTypeIds.map((productType) => (
                                <TableHead key={productType}>
                                    <Link
                                        href={productPath(productType)}
                                        className='transition-colors duration-200 hover:text-primary'>
                                        {productTypes[productType].name}
                                    </Link>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className='[&_td]:whitespace-normal [&_td]:align-top'>
                        <TableRow>
                            <TableHead>From</TableHead>
                            {productTypeIds.map((productType) => (
                                <TableCell
                                    key={productType}
                                    className='font-mono tabular-nums'>
                                    <ProductPrice
                                        prices={getFromPrices(productType)}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableHead>Sizes</TableHead>
                            {productTypeIds.map((productType) => (
                                <TableCell key={productType}>
                                    {describeSizes(productType)}
                                </TableCell>
                            ))}
                        </TableRow>
                        {(
                            Object.entries(compareRows) as [
                                keyof typeof compareRows,
                                string
                            ][]
                        ).map(([row, label]) => (
                            <TableRow key={row}>
                                <TableHead>{label}</TableHead>
                                {productTypeIds.map((productType) => (
                                    <TableCell key={productType}>
                                        {productPages[productType].compare[row]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableHead>Options</TableHead>
                            {productTypeIds.map((productType) => (
                                <TableCell key={productType}>
                                    {describeOptions(productType)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
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

export default Prints
