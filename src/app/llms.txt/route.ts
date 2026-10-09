import { countries } from '@/assets/data/countries'
import { platforms } from '@/assets/data/platforms'
import { optionNames } from '@/assets/data/print-options'
import {
    productTypes,
    regions,
    type ProductTypeId
} from '@/assets/data/pricing'
import { productCopy, productPath } from '@/assets/data/products'
import { sizeRange } from '@/assets/data/size-range'
import { formatMoney, getProductOptions, getRegionPrices } from '@/lib/pricing'
import { optionLabel, sortOptionValues } from '@/lib/print-labels'
import { formatInches, qualityThresholds } from '@/lib/print-quality'
import type { Region } from '@/types'

export const dynamic = 'force-static'

/**
 * A summary of the site for AI assistants (https://llmstxt.org/), built at
 * build time from the same data as the pages, so prices and sizes stay true
 */

const url = (path: string) => new URL(path, process.env.APP_URL!).href

const productTypeIds = Object.keys(productTypes) as ProductTypeId[]
const regionIds = Object.keys(regions) as Region[]

/**
 * A product's sizes with their price in each region, and its options
 */
const describeProduct = (productType: ProductTypeId) => {
    const { name, sizes } = productTypes[productType]

    const sizeLines = sizes.map(({ size }) => {
        const prices = getRegionPrices(productType, size)
        const regionPrices = regionIds
            .map((region) => prices[region] && formatMoney(prices[region]))
            .filter(Boolean)
            .join(' / ')

        return `- ${formatInches(size)}: ${regionPrices}`
    })

    const optionLines = Object.entries(getProductOptions(productType)).map(
        ([option, values]) =>
            `- ${optionNames[option] ?? option}: ${sortOptionValues(
                option,
                values
            )
                .map((value) => optionLabel(option, value))
                .join(', ')}`
    )

    return [
        `### ${name}`,
        '',
        productCopy[productType].description,
        '',
        ...sizeLines,
        ...optionLines
    ].join('\n')
}

const content = () => {
    const title = process.env.APP_TITLE!
    const currencies = regionIds
        .map(
            (region) => `${regions[region].currency} (${regions[region].name})`
        )
        .join(', ')
    const euCount = countries.filter(({ region }) => region === 'eu').length

    return `# ${title}

> ${title} turns gaming screenshots into physical prints: art prints, canvases, framed prints and framed canvases, in sizes from ${sizeRange}. Prints are made to order by our print partner, Prodigi, and delivered to the United Kingdom, the ${euCount} countries of the European Union and the United States.

## How it works

1. Sign in and upload a JPG or PNG screenshot at ${url('/create/')}.
2. Choose a product, size and options (frame colour or canvas edges). Each size is graded by how sharp the screenshot will print, in pixels per inch: Great (${qualityThresholds.great}+), Good (${qualityThresholds.good}+) or OK (${qualityThresholds.ok}+). Sizes below ${qualityThresholds.ok} can't be ordered.
3. Pay with Stripe Checkout. Prints are usually sent out within one to five working days, depending on the product, then delivered by Standard or Express shipping.

Orders can be cancelled for a full refund within 90 minutes of ordering. Prints are for personal use only.

## Products and prices

Prices are per print, in ${currencies}, with shipping added at checkout. Sizes are in inches.

${productTypeIds.map(describeProduct).join('\n\n')}

## Prints

- [All prints](${url('/prints/')}): every product side by side
${productTypeIds
    .map(
        (productType) =>
            `- [${productTypes[productType].name}](${url(productPath(productType))}): features, specs and prices`
    )
    .join('\n')}
- [Sustainability](${url('/prints/sustainability/')}): how prints are made, packed and shipped

## Screenshot guides

- [Screenshots](${url('/screenshots/')}): how to get a screenshot that prints well, and common resolutions
${platforms
    .map(
        (platform) =>
            `- [${platform.name}](${url(platform.href)}): ${platform.description}`
    )
    .join('\n')}

## Help

- [FAQ](${url('/faq/')}): products, sizes, delivery times, cancelling, shipping countries and print problems
- [About](${url('/about/')}): who makes ${title} and why

## Optional

- [Terms of Service](${url('/terms/')})
- [Privacy Policy](${url('/privacy/')})
`
}

export const GET = () =>
    new Response(content(), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
