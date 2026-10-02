/**
 * Build src/assets/data/catalogue.ts from Prodigi: for each product size in
 * src/assets/data/pricing.ts, the options customers can choose, the pixels it
 * needs, and what it costs (incl. Prodigi's tax) to make and ship to each
 * region.
 *
 *   yarn catalogue
 *
 * Reads PRODIGI_API_KEY and PRODIGI_API_URL from .env.local. Prices are
 * quoted for the API's environment, so run it against the live API (or check
 * the sandbox matches) before launch.
 */
import type {
    Catalogue,
    CatalogueCost,
    CatalogueItem,
    ProductTypeConfig,
    Region
} from '@/types'
import type {
    ProductDetails as ProdigiProduct,
    Quote as ProdigiQuote
} from '@/types/prodigi'
import { writeFile } from 'node:fs/promises'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import * as prettier from 'prettier'
import { productTypes, regions, shipping } from '../src/assets/data/pricing.ts'
import { getQuoteCosts } from '../src/lib/prodigi-costs.ts'

/**
 * The script can't import src/lib/prodigi.ts (it's server-only and uses @/
 * imports Node can't resolve), so it has its own small request helper but
 * shares the API types.
 */

const outFile = fileURLToPath(
    new URL('../src/assets/data/catalogue.ts', import.meta.url)
)

process.loadEnvFile(fileURLToPath(new URL('../.env.local', import.meta.url)))

const apiUrl = process.env.PRODIGI_API_URL
const apiKey = process.env.PRODIGI_API_KEY

if (!apiUrl || !apiKey) {
    console.error(
        'PRODIGI_API_URL and PRODIGI_API_KEY must be set in .env.local'
    )
    process.exit(1)
}

/**
 * Call the Prodigi API. It rate-limits bursts (HTTP 429), so requests are
 * spaced out and retried with a growing delay.
 */
const prodigi = async (path: string, body?: unknown) => {
    for (let attempt = 0; attempt < 5; attempt++) {
        await sleep(attempt ? 2000 * 2 ** attempt : 500)

        const response = await fetch(`${apiUrl}/v4.0${path}`, {
            method: body ? 'POST' : 'GET',
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        })

        if (response.status === 429) continue

        const json = await response.json().catch(() => null)

        if (!response.ok) {
            throw new Error(
                `${path}: HTTP ${response.status} ${json?.statusText ?? ''}`
            )
        }

        return json
    }

    throw new Error(`${path}: still rate-limited after 5 attempts`)
}

/**
 * The options customers can choose (attributes with more than one value),
 * keeping only values that ship to every country the size is sold in
 */
const getOptions = (product: ProdigiProduct, countries: string[]) => {
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

/**
 * Quote one item to a country, for every shipping method we offer.
 * Costs include Prodigi's tax (US quotes have none; see usSalesTaxBuffer).
 */
const quoteCost = async (
    sku: string,
    attributes: Record<string, string>,
    country: string,
    currency: string
): Promise<CatalogueCost> => {
    const json = await prodigi('/quotes', {
        destinationCountryCode: country,
        currencyCode: currency,
        items: [
            { sku, copies: 1, attributes, assets: [{ printArea: 'default' }] }
        ]
    })

    const quotes: ProdigiQuote[] = json?.quotes ?? []
    const costs = getQuoteCosts(quotes, shipping.methods)

    if (!costs) {
        throw new Error(
            `${sku} → ${country}: no quote ${JSON.stringify(json?.issues)}`
        )
    }

    return costs
}

const config: Record<string, ProductTypeConfig> = productTypes
const allRegions = Object.keys(regions) as Region[]
const products: Catalogue['products'] = {}

for (const [id, productType] of Object.entries(config)) {
    products[id] = []

    for (const entry of productType.sizes) {
        const sku = `${productType.prodigiSku}-${entry.size.toUpperCase()}`
        const sellIn = entry.regions ?? allRegions
        const countries = sellIn.map((region) => regions[region].quoteCountry)

        /**
         * Product details: options and the pixels Prodigi asks for
         */
        const { product }: { product: ProdigiProduct } = await prodigi(
            `/products/${sku}`
        )
        const { options, variant } = getOptions(product, countries)

        if (!variant) {
            throw new Error(`${sku} doesn't ship to ${countries.join(', ')}`)
        }

        const printArea = variant.printAreaSizes.default

        /**
         * Quote with the first value of each option (options don't change
         * the price; checkout re-quotes the customer's exact choice)
         */
        const attributes = Object.fromEntries(
            Object.entries(options).map(([name, values]) => [name, values[0]])
        )

        const costs: CatalogueItem['costs'] = {}

        for (const region of sellIn) {
            const { quoteCountry, currency } = regions[region]
            costs[region] = await quoteCost(
                sku,
                attributes,
                quoteCountry,
                currency
            )
            console.log(
                `${sku.padEnd(24)} ${region}  item ${costs[region].itemCost} ${currency}, shipping ${JSON.stringify(costs[region].shipping)}, made in ${costs[region].madeIn}`
            )
        }

        products[id].push({
            sku,
            size: entry.size,
            description: product.description.replace(/\s+/g, ' ').trim(),
            printArea: {
                width: printArea.horizontalResolution,
                height: printArea.verticalResolution
            },
            options,
            costs
        })
    }
}

/**
 * Write the catalogue, formatted like the rest of the codebase
 */
const catalogue: Catalogue = {
    generatedAt: new Date().toISOString().slice(0, 10),
    products
}

const source = `/**
 * Generated by scripts/prodigi-catalogue.ts (\`yarn catalogue\`). Don't edit.
 */
import type { Catalogue } from '@/types'

export const catalogue: Catalogue = ${JSON.stringify(catalogue)}
`

const prettierConfig = await prettier.resolveConfig(outFile)
await writeFile(
    outFile,
    await prettier.format(source, { ...prettierConfig, filepath: outFile })
)

console.log(`\nWrote ${outFile}`)
