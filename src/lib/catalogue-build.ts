import type {
    Catalogue,
    CatalogueCost,
    CatalogueItem,
    ProductTypeConfig,
    Region
} from '@/types'
import type {
    Issue,
    ProductDetails,
    Quote,
    QuoteRequest
} from '@/types/prodigi'
import { productTypes, regions, shipping } from '../assets/data/pricing.ts'
import { getQuoteCosts } from './prodigi-costs.ts'

/**
 * Build the catalogue from Prodigi: for each product size in pricing.ts, the
 * options customers can choose, the pixels it needs, and what it costs
 * (incl. Prodigi's tax) to make and ship to each region. Shared by
 * `yarn catalogue` and the weekly cron (catalogue-refresh.ts), so it only
 * has relative and type imports and Node can run it directly.
 */

/**
 * The Prodigi calls the build needs. The script and the app each pass
 * their own client: src/lib/prodigi.ts is server-only, and Node can't load
 * it.
 */
export type CatalogueProdigi = {
    getProduct: (sku: string) => Promise<ProductDetails>
    quote: (
        request: QuoteRequest
    ) => Promise<{ quotes?: Quote[] | null; issues?: Issue[] | null }>
}

/**
 * Something Prodigi couldn't tell us. The fallback catalogue's values are
 * kept in its place, so one failed quote never drops a size from the site.
 */
export type CatalogueProblem = {
    productType: string
    size: string
    sku: string
    region?: Region
    /** missing: Prodigi answered without a cost; failed: the call failed */
    kind: 'missing' | 'failed'
    detail: string
}

/**
 * Requests run this many at a time: one at a time took two minutes, and
 * five at once slowed Prodigi past the client's 15s timeout
 */
const concurrency = 3

/**
 * The options customers can choose (attributes with more than one value),
 * keeping only values that ship to every country the size is sold in
 */
const getOptions = (product: ProductDetails, countries: string[]) => {
    const variants = product.variants.filter((variant) =>
        countries.every((country) => variant.shipsTo.includes(country))
    )

    const options: Record<string, string[]> = {}

    for (const [name, values] of Object.entries(product.attributes)) {
        if (values.length < 2) continue
        options[name] = values.filter((value) =>
            variants.some((variant) => variant.attributes[name] === value)
        )
    }

    return { options, variant: variants[0] }
}

const message = (error: unknown) =>
    error instanceof Error ? error.message : String(error)

type Task = {
    productType: string
    config: ProductTypeConfig
    size: string
    regions?: Region[]
    sku: string
}

/**
 * Build one size: its product details, then a quote to each region
 */
const buildItem = async (
    { productType, config, size, regions: only, sku }: Task,
    prodigi: CatalogueProdigi,
    fallback: CatalogueItem | undefined,
    problems: CatalogueProblem[]
): Promise<CatalogueItem | null> => {
    const sellIn = only ?? (Object.keys(regions) as Region[])
    const countries = sellIn.map((region) => regions[region].quoteCountry)
    const base = { productType, size, sku }

    let product: ProductDetails

    try {
        product = await prodigi.getProduct(sku)
    } catch (error) {
        problems.push({ ...base, kind: 'failed', detail: message(error) })
        return fallback ?? null
    }

    const { options, variant } = getOptions(product, countries)

    for (const [name, excluded] of Object.entries(
        config.excludeOptions ?? {}
    )) {
        if (options[name]) {
            options[name] = options[name].filter(
                (value) => !excluded.includes(value)
            )
        }
    }

    if (!variant) {
        problems.push({
            ...base,
            kind: 'missing',
            detail: `doesn't ship to ${countries.join(', ')}`
        })
        return fallback ?? null
    }

    const printArea = variant.printAreaSizes.default

    /**
     * Quote with the first value of each option (options don't change the
     * price; checkout re-quotes the customer's exact choice)
     */
    const attributes = Object.fromEntries(
        Object.entries(options).map(([name, values]) => [name, values[0]])
    )

    const costs: Partial<Record<Region, CatalogueCost>> = {}

    for (const region of sellIn) {
        const { quoteCountry, currency } = regions[region]

        try {
            const quote = await prodigi.quote({
                destinationCountryCode: quoteCountry,
                currencyCode: currency,
                items: [
                    {
                        sku,
                        copies: 1,
                        attributes,
                        assets: [{ printArea: 'default' }]
                    }
                ]
            })
            const cost = getQuoteCosts(quote.quotes ?? [], shipping.methods)

            if (cost) {
                costs[region] = cost
                continue
            }

            problems.push({
                ...base,
                region,
                kind: 'missing',
                detail: `no quote ${JSON.stringify(quote.issues ?? [])}`
            })
        } catch (error) {
            problems.push({
                ...base,
                region,
                kind: 'failed',
                detail: message(error)
            })
        }

        const previous = fallback?.costs[region]
        if (previous) costs[region] = previous
    }

    return {
        sku,
        size,
        description: product.description.replace(/\s+/g, ' ').trim(),
        printArea: {
            width: printArea.horizontalResolution,
            height: printArea.verticalResolution
        },
        options,
        costs
    }
}

/**
 * Build the catalogue for every size in pricing.ts, or only some SKUs (the
 * rest are copied from the fallback). Whatever Prodigi couldn't answer is
 * listed in problems and kept from the fallback (the current catalogue).
 */
export const buildCatalogue = async ({
    prodigi,
    fallback,
    skus,
    onItem
}: {
    prodigi: CatalogueProdigi
    fallback?: Catalogue | null
    skus?: string[]
    /** Called as each size is built, for the script's progress log */
    onItem?: (item: CatalogueItem) => void
}) => {
    const config: Record<string, ProductTypeConfig> = productTypes

    const tasks: Task[] = Object.entries(config).flatMap(
        ([productType, productConfig]) =>
            productConfig.sizes.map((entry) => ({
                productType,
                config: productConfig,
                size: entry.size,
                regions: entry.regions,
                sku: `${productConfig.prodigiSku}-${entry.size.toUpperCase()}`
            }))
    )

    const findFallback = (task: Task) =>
        fallback?.products[task.productType]?.find(
            (item) => item.size === task.size
        )

    const problems: CatalogueProblem[] = []
    const items = new Map<Task, CatalogueItem | null>()
    const queue = tasks.filter((task) => !skus || skus.includes(task.sku))

    for (const task of tasks) {
        if (!queue.includes(task)) items.set(task, findFallback(task) ?? null)
    }

    await Promise.all(
        Array.from({ length: concurrency }, async () => {
            for (let task = queue.shift(); task; task = queue.shift()) {
                const item = await buildItem(
                    task,
                    prodigi,
                    findFallback(task),
                    problems
                )

                items.set(task, item)
                if (item) onItem?.(item)
            }
        })
    )

    /**
     * Keep pricing.ts's order, whatever order the requests finished in
     */
    const products: Catalogue['products'] = {}

    for (const task of tasks) {
        const item = items.get(task)

        products[task.productType] ??= []
        if (item) products[task.productType].push(item)
    }

    const catalogue: Catalogue = {
        generatedAt: new Date().toISOString().slice(0, 10),
        products
    }

    return { catalogue, problems }
}
