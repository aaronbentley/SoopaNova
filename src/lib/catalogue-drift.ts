import 'server-only'

import { catalogue } from '@/assets/data/catalogue'
import {
    productTypes,
    regions,
    shipping,
    type ProductTypeId
} from '@/assets/data/pricing'
import { getMargin, getPrice, withSalesTaxBuffer } from '@/lib/pricing'
import { createQuote } from '@/lib/prodigi'
import { getQuoteCosts } from '@/lib/prodigi-costs'
import type { CatalogueCost, Region, ShippingMethod } from '@/types'

/**
 * The weekly catalogue check (api/cron/catalogue-drift): quote every SKU the
 * way `yarn catalogue` does and compare Prodigi's live costs with
 * catalogue.ts. It only reports; prices change when the catalogue is
 * regenerated and deployed.
 */

/**
 * Item cost changes this big (either way) are reported: they move the
 * margin on every sale of that print
 */
const itemCostThreshold = 0.03

/**
 * Shipping is charged at the live cost at checkout, so its changes only
 * affect the "+ shipping from" prices shown on the site
 */
const shippingThreshold = 0.1

export type CostDrift = {
    productType: ProductTypeId
    size: string
    sku: string
    region: Region
} & (
    | {
          kind: 'item'
          catalogue: number
          live: number
          /** Margin after the card fee at the live cost, and the minimum */
          margin: number | null
          minMargin: number
      }
    | {
          kind: 'shipping'
          method: ShippingMethod
          catalogue: number
          live: number | null
      }
    /** No cost in the quote, or the quote failed */
    | { kind: 'missing' }
    | { kind: 'unchecked' }
)

const change = (from: number, to: number) => (to - from) / from

/**
 * Quotes run this many at a time: one at a time the check took two
 * minutes, and five at once slowed Prodigi past the client's 15s timeout
 */
const concurrency = 3

type Check = {
    productType: ProductTypeId
    size: string
    sku: string
    region: Region
    attributes: Record<string, string>
    cost: CatalogueCost
}

/**
 * Quote one SKU to one region and list how its costs differ from the
 * catalogue's
 */
const compare = async ({
    attributes,
    cost,
    ...base
}: Check): Promise<CostDrift[]> => {
    const { quoteCountry, currency } = regions[base.region]
    const quote = await createQuote({
        destinationCountryCode: quoteCountry,
        currencyCode: currency,
        items: [
            {
                sku: base.sku,
                copies: 1,
                attributes,
                assets: [{ printArea: 'default' }]
            }
        ]
    })
    const live = getQuoteCosts(quote.quotes ?? [], shipping.methods)

    if (!live) return [{ ...base, kind: 'missing' }]

    const drifts: CostDrift[] = []

    if (Math.abs(change(cost.itemCost, live.itemCost)) >= itemCostThreshold) {
        const price = getPrice(base.productType, base.size, base.region)

        drifts.push({
            ...base,
            kind: 'item',
            catalogue: cost.itemCost,
            live: live.itemCost,
            margin: price
                ? getMargin(
                      price.amount,
                      withSalesTaxBuffer(live.itemCost, base.region),
                      base.region
                  )
                : null,
            minMargin: productTypes[base.productType].minMargin
        })
    }

    for (const method of shipping.methods) {
        const from = cost.shipping[method]
        const to = live.shipping[method] ?? null

        if (from === undefined) continue

        if (to === null || Math.abs(change(from, to)) >= shippingThreshold) {
            drifts.push({
                ...base,
                kind: 'shipping',
                method,
                catalogue: from,
                live: to
            })
        }
    }

    return drifts
}

/**
 * Compare every catalogue SKU and region with a live quote, using the first
 * value of each option like the catalogue script
 */
export const checkCatalogueDrift = async () => {
    const checks: Check[] = Object.entries(catalogue.products).flatMap(
        ([productType, items]) =>
            items.flatMap((item) =>
                Object.entries(item.costs).map(([region, cost]) => ({
                    productType: productType as ProductTypeId,
                    size: item.size,
                    sku: item.sku,
                    region: region as Region,
                    attributes: Object.fromEntries(
                        Object.entries(item.options).map(([name, values]) => [
                            name,
                            values[0]
                        ])
                    ),
                    cost
                }))
            )
    )

    const drifts: CostDrift[] = []
    const queue = [...checks]

    await Promise.all(
        Array.from({ length: concurrency }, async () => {
            for (let check = queue.shift(); check; check = queue.shift()) {
                drifts.push(
                    ...(await compare(check).catch((error) => {
                        console.error(
                            'Catalogue check quote failed',
                            check.sku,
                            error
                        )
                        return [
                            {
                                productType: check.productType,
                                size: check.size,
                                sku: check.sku,
                                region: check.region,
                                kind: 'unchecked'
                            } as const
                        ]
                    }))
                )
            }
        })
    )

    return {
        checked: checks.length,
        drifts,
        generatedAt: catalogue.generatedAt
    }
}
