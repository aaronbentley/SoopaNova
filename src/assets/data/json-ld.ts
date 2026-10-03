import {
    productTypes,
    regions,
    type ProductTypeId
} from '@/assets/data/pricing'
import { productImages } from '@/assets/data/product-images'
import { productCopy } from '@/assets/data/products'
import { getPrice, type Price } from '@/lib/pricing'
import type { Region } from '@/types'
import type { AggregateOffer, Graph, Product } from 'schema-dts'

/**
 * Structured data for the homepage: the business, the website, and the
 * printing service with its products. Products, prices and images come from
 * the same data as the page, worked out at build time.
 *
 * Validate with https://validator.schema.org/ after changing it.
 */

const url = (path: string) => new URL(path, process.env.APP_URL!).href

const ids = {
    organization: url('/#organization'),
    website: url('/#website'),
    service: url('/#service')
}

const regionIds = Object.keys(regions) as Region[]

/**
 * A product's price range in one region, across the sizes sold there. Null
 * when it isn't sold there.
 */
const regionOffer = (
    productType: ProductTypeId,
    region: Region
): AggregateOffer | null => {
    const prices = productTypes[productType].sizes
        .map(({ size }) => getPrice(productType, size, region))
        .filter((price): price is Price => price !== null)
        .map((price) => price.amount)

    if (!prices.length) return null

    return {
        '@type': 'AggregateOffer',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        priceCurrency: regions[region].currency,
        eligibleRegion: regions[region].name,
        availability: 'https://schema.org/InStock'
    }
}

const product = (productType: ProductTypeId): Product => {
    const image = productImages[productType]

    return {
        '@type': 'Product',
        name: productTypes[productType].name,
        description: productCopy[productType].description,
        category: 'Wall art',
        brand: { '@type': 'Brand', name: process.env.APP_TITLE! },
        ...(image && { image: url(image.src) }),
        offers: regionIds
            .map((region) => regionOffer(productType, region))
            .filter((offer): offer is AggregateOffer => offer !== null)
    }
}

export const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': ids.organization,
            name: process.env.APP_TITLE!,
            url: url('/'),
            logo: url('/apple-icon'),
            sameAs: [
                process.env.APP_SOCIAL_TWITTER,
                process.env.APP_SOCIAL_INSTAGRAM,
                process.env.APP_SOCIAL_THREADS,
                process.env.APP_SOCIAL_FACEBOOK
            ].filter((link): link is string => !!link)
        },
        {
            '@type': 'WebSite',
            '@id': ids.website,
            name: process.env.APP_TITLE!,
            url: url('/'),
            publisher: { '@id': ids.organization }
        },
        {
            '@type': 'Service',
            '@id': ids.service,
            name: `${process.env.APP_TITLE!} prints`,
            serviceType: 'Gaming screenshot printing',
            description: process.env.APP_DESCRIPTION!,
            url: url('/'),
            provider: { '@id': ids.organization },
            areaServed: regionIds.map((region) => regions[region].name),
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Prints',
                itemListElement: (
                    Object.keys(productTypes) as ProductTypeId[]
                ).map(product)
            }
        }
    ]
}
