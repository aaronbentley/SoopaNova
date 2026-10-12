/**
 * Refresh the catalogue in Global Config from Prodigi now, for the Prodigi
 * API in .env.local (catalogue_sandbox or catalogue_live): every size in
 * src/assets/data/pricing.ts, with its options, the pixels it needs, and
 * what it costs (incl. Prodigi's tax) to make and ship to each region.
 * Unlike the daily cron (/api/cron/catalogue/), it applies every change
 * without asking, and drops any pending catalogue.
 *
 *   yarn catalogue
 *
 * Reads PRODIGI_API_KEY, PRODIGI_API_URL, GLOBAL_CONFIG, VERCEL_API_TOKEN and
 * VERCEL_TEAM_ID from .env.local. Pages pick up the new catalogue when
 * they're next built or revalidated: run the cron (or deploy) to refresh the
 * live site straight away.
 */
import type { ProductDetails } from '@/types/prodigi'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { buildCatalogue } from '../src/lib/catalogue-build.ts'
import { storedCatalogueSchema } from '../src/lib/catalogue-schema.ts'
import {
    catalogueKeys,
    readItem,
    writeItems
} from '../src/lib/global-config.ts'

/**
 * The script can't import src/lib/prodigi.ts (it's server-only and uses @/
 * imports Node can't resolve), so it has its own small request helper but
 * shares the build with the cron.
 */

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

const { current, pending } = catalogueKeys()

/**
 * The stored catalogue fills in anything Prodigi doesn't answer
 */
const stored = await readItem(current)
const fallback = stored ? storedCatalogueSchema.parse(stored) : null

const { catalogue, problems } = await buildCatalogue({
    prodigi: {
        getProduct: async (sku) =>
            (
                (await prodigi(`/products/${encodeURIComponent(sku)}`)) as {
                    product: ProductDetails
                }
            ).product,
        quote: (request) => prodigi('/quotes', request)
    },
    fallback,
    onItem: (item) => {
        for (const [region, cost] of Object.entries(item.costs)) {
            console.log(
                `${item.sku.padEnd(24)} ${region}  item ${cost.itemCost}, shipping ${JSON.stringify(cost.shipping)}, made in ${cost.madeIn}`
            )
        }
    }
})

for (const problem of problems) {
    console.warn(
        `${problem.sku} ${problem.region ?? ''}: ${problem.kind}, ${problem.detail}${fallback ? ' (kept the stored costs)' : ''}`
    )
}

await writeItems([
    {
        operation: 'upsert',
        key: current,
        value: {
            ...catalogue,
            appliedAt: new Date().toISOString(),
            appliedBy: 'script'
        }
    },
    { operation: 'upsert', key: pending, value: null }
])

console.log(`\nWrote ${current} to Global Config`)
