import { optionNames } from '@/assets/data/print-options'
import {
    productTypes,
    regions,
    type ProductTypeId
} from '@/assets/data/pricing'
import { productImages } from '@/assets/data/product-images'
import { productPages } from '@/assets/data/product-pages'
import { productCopy, productPath } from '@/assets/data/products'
import { getPrice, getProductOptions } from '@/lib/pricing'
import { optionLabel, sortOptionValues } from '@/lib/print-labels'
import { formatInches } from '@/lib/print-quality'
import type { Region } from '@/types'
import type {
    AggregateOffer,
    Graph,
    Offer,
    Organization,
    Product,
    PropertyValue,
    WebSite
} from 'schema-dts'

/**
 * Structured data: the homepage's business, website and printing service
 * with its products, and each product page's product. Products, prices,
 * options, specs and images come from the same data as the pages, worked out
 * at build time, so they can't say anything the pages don't.
 *
 * Validate with https://validator.schema.org/ after changing it.
 */

const url = (path: string) => new URL(path, process.env.APP_URL!).href

const ids = {
    organization: url('/#organization'),
    website: url('/#website'),
    service: url('/#service'),
    product: (productType: ProductTypeId) =>
        `${url(productPath(productType))}#product`,
    webpage: (productType: ProductTypeId) =>
        `${url(productPath(productType))}#webpage`,
    breadcrumb: (productType: ProductTypeId) =>
        `${url(productPath(productType))}#breadcrumb`,
    prints: url('/prints/#webpage'),
    printsBreadcrumb: url('/prints/#breadcrumb')
}

const breadcrumbs = (pages: { name: string; url: string }[]) =>
    pages.map((page, index) => ({
        '@type': 'ListItem' as const,
        position: index + 1,
        name: page.name,
        item: page.url
    }))

const regionIds = Object.keys(regions) as Region[]

const productTypeIds = Object.keys(productTypes) as ProductTypeId[]

const organization: Organization = {
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
}

const website: WebSite = {
    '@type': 'WebSite',
    '@id': ids.website,
    name: process.env.APP_TITLE!,
    url: url('/'),
    publisher: { '@id': ids.organization }
}

/**
 * A product's sizes sold in a region, each as an offer, under a price range
 * for the region. Null when none of its sizes is sold there.
 */
const regionOffer = (
    productType: ProductTypeId,
    region: Region
): AggregateOffer | null => {
    const productUrl = url(productPath(productType))
    const { currency, name: regionName } = regions[region]

    const offers: Offer[] = productTypes[productType].sizes.flatMap(
        ({ size }) => {
            const price = getPrice(productType, size, region)

            if (!price) return []

            return [
                {
                    '@type': 'Offer',
                    name: formatInches(size),
                    sku: `${productType}-${size}`,
                    price: price.amount,
                    priceCurrency: currency,
                    eligibleRegion: regionName,
                    availability: 'https://schema.org/InStock',
                    itemCondition: 'https://schema.org/NewCondition',
                    url: productUrl,
                    seller: { '@id': ids.organization }
                }
            ]
        }
    )

    if (!offers.length) return null

    const amounts = offers.map((offer) => Number(offer.price))

    return {
        '@type': 'AggregateOffer',
        lowPrice: Math.min(...amounts),
        highPrice: Math.max(...amounts),
        offerCount: offers.length,
        priceCurrency: currency,
        eligibleRegion: regionName,
        availability: 'https://schema.org/InStock',
        url: productUrl,
        seller: { '@id': ids.organization },
        offers
    }
}

/**
 * The product page's specs, then its options ('Frame colour: Black, White…')
 */
const productProperties = (productType: ProductTypeId): PropertyValue[] => [
    ...productPages[productType].specs.map(
        ({ label, value }): PropertyValue => ({
            '@type': 'PropertyValue',
            name: label,
            value
        })
    ),
    ...Object.entries(getProductOptions(productType)).map(
        ([optionName, values]): PropertyValue => ({
            '@type': 'PropertyValue',
            name: optionNames[optionName] ?? optionName,
            value: sortOptionValues(optionName, values)
                .map((value) => optionLabel(optionName, value))
                .join(', ')
        })
    )
]

const product = (productType: ProductTypeId): Product => {
    const image = productImages[productType]

    return {
        '@type': 'Product',
        '@id': ids.product(productType),
        name: productTypes[productType].name,
        description: productCopy[productType].description,
        url: url(productPath(productType)),
        category: 'Wall art',
        brand: { '@type': 'Brand', name: process.env.APP_TITLE! },
        ...(image && { image: url(image.src) }),
        additionalProperty: productProperties(productType),
        offers: regionIds
            .map((region) => regionOffer(productType, region))
            .filter((offer): offer is AggregateOffer => offer !== null)
    }
}

/**
 * The homepage: the business, the website and the printing service, whose
 * catalogue lists every product
 */
export const jsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
        organization,
        website,
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
                itemListElement: productTypeIds.map(product)
            }
        }
    ]
}

/**
 * /prints: a collection page listing every product's page
 */
export const printsJsonLd: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
        organization,
        website,
        {
            '@type': 'CollectionPage',
            '@id': ids.prints,
            url: url('/prints/'),
            name: 'Prints',
            isPartOf: { '@id': ids.website },
            breadcrumb: { '@id': ids.printsBreadcrumb },
            mainEntity: {
                '@type': 'ItemList',
                itemListElement: productTypeIds.map((productType, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    url: url(productPath(productType)),
                    name: productTypes[productType].name
                }))
            }
        },
        {
            '@type': 'BreadcrumbList',
            '@id': ids.printsBreadcrumb,
            itemListElement: breadcrumbs([
                { name: process.env.APP_TITLE!, url: url('/') },
                { name: 'Prints', url: url('/prints/') }
            ])
        }
    ]
}

/**
 * A product page: the product, the page it's the subject of, and a
 * breadcrumb back through Prints to the homepage
 */
export const productJsonLd = (productType: ProductTypeId): Graph => {
    const pageUrl = url(productPath(productType))
    const { name } = productTypes[productType]

    return {
        '@context': 'https://schema.org',
        '@graph': [
            organization,
            website,
            {
                '@type': 'WebPage',
                '@id': ids.webpage(productType),
                url: pageUrl,
                name,
                description: productCopy[productType].description,
                isPartOf: { '@id': ids.website },
                mainEntity: { '@id': ids.product(productType) },
                breadcrumb: { '@id': ids.breadcrumb(productType) }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': ids.breadcrumb(productType),
                itemListElement: breadcrumbs([
                    { name: process.env.APP_TITLE!, url: url('/') },
                    { name: 'Prints', url: url('/prints/') },
                    { name, url: pageUrl }
                ])
            },
            product(productType)
        ]
    }
}
