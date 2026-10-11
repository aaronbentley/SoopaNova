import {
    productTypes,
    regions,
    shipping,
    type ProductTypeId
} from '@/assets/data/pricing'
import { optionNames } from '@/assets/data/print-options'
import type { CatalogueProblem } from '@/lib/catalogue-build'
import {
    formatMoney,
    getMargin,
    getPrice,
    getShippingCharge,
    withSalesTaxBuffer,
    type Price
} from '@/lib/pricing'
import { formatPrintSize, optionLabel } from '@/lib/print-labels'
import type { Catalogue, CatalogueItem, Region, ShippingMethod } from '@/types'

/**
 * What changes between two catalogues (the stored one and a fresh build),
 * in the terms customers see: our prices and shipping charges, options and
 * print areas. The weekly refresh applies a catalogue on its own when every
 * change is small (needsApproval), and lists the changes in its email and
 * on /admin/catalogue.
 */

/**
 * A retail price moving more than this (either way) waits for approval
 */
export const maxAutoPriceChange = 0.1

/**
 * Item cost changes this big are listed even when rounding keeps the price
 * the same, because they move the margin on every sale
 */
const itemCostThreshold = 0.03

type Base = { productType: ProductTypeId; size: string; sku: string }

export type CatalogueChange = Base &
    (
        | {
              kind: 'price'
              region: Region
              cost: { from: number; to: number }
              price: { from: Price | null; to: Price | null }
              /** Margin after the card fee at the new price and cost */
              margin: number | null
              minMargin: number
          }
        | {
              kind: 'shipping'
              region: Region
              method: ShippingMethod
              /** What we charge (null: no longer offered, or new) */
              charge: { from: number | null; to: number | null }
          }
        | {
              kind: 'options'
              option: string
              added: string[]
              removed: string[]
          }
        | {
              kind: 'print-area'
              from: CatalogueItem['printArea']
              to: CatalogueItem['printArea']
          }
        /** A size or region added to or removed from pricing.ts */
        | { kind: 'added' | 'removed'; region: Region | null }
    )

const change = (from: number, to: number) => (to - from) / from

/**
 * The changes that need the site owner's approval before they're applied:
 * big price moves, and options or print areas Prodigi has changed
 */
export const needsApproval = (entry: CatalogueChange) =>
    entry.kind === 'options' ||
    entry.kind === 'print-area' ||
    (entry.kind === 'price' &&
        entry.price.from !== null &&
        entry.price.to !== null &&
        Math.abs(change(entry.price.from.amount, entry.price.to.amount)) >
            maxAutoPriceChange)

/**
 * JSON with sorted keys, so catalogues compare equal whatever order the
 * store returns their keys in
 */
const stable = (value: unknown): string =>
    JSON.stringify(value, (_key, inner) =>
        inner && typeof inner === 'object' && !Array.isArray(inner)
            ? Object.fromEntries(
                  Object.entries(inner).sort(([a], [b]) => a.localeCompare(b))
              )
            : inner
    )

/**
 * Whether two catalogues hold the same data (generatedAt aside)
 */
export const sameCatalogue = (a: Catalogue, b: Catalogue) =>
    stable(a.products) === stable(b.products)

const findItem = (catalogue: Catalogue, productType: string, size: string) =>
    catalogue.products[productType]?.find((item) => item.size === size)

/**
 * Compare one size in both catalogues
 */
const diffItem = (
    current: Catalogue,
    fresh: Catalogue,
    base: Base
): CatalogueChange[] => {
    const before = findItem(current, base.productType, base.size)
    const after = findItem(fresh, base.productType, base.size)

    if (!before && !after) return []
    if (!before) return [{ ...base, kind: 'added', region: null }]
    if (!after) return [{ ...base, kind: 'removed', region: null }]

    const changes: CatalogueChange[] = []

    for (const region of Object.keys(regions) as Region[]) {
        const from = before.costs[region]
        const to = after.costs[region]

        if (!from && !to) continue

        if (!from || !to) {
            changes.push({ ...base, kind: from ? 'removed' : 'added', region })
            continue
        }

        const priceFrom = getPrice(current, base.productType, base.size, region)
        const priceTo = getPrice(fresh, base.productType, base.size, region)
        const priceChanged = priceFrom?.amount !== priceTo?.amount

        if (
            priceChanged ||
            Math.abs(change(from.itemCost, to.itemCost)) >= itemCostThreshold
        ) {
            changes.push({
                ...base,
                kind: 'price',
                region,
                cost: { from: from.itemCost, to: to.itemCost },
                price: { from: priceFrom, to: priceTo },
                margin: priceTo
                    ? getMargin(
                          priceTo.amount,
                          withSalesTaxBuffer(to.itemCost, region),
                          region
                      )
                    : null,
                minMargin: productTypes[base.productType].minMargin
            })
        }

        /**
         * Shipping is charged at the live cost at checkout, so only list it
         * when the "+ shipping from" charge shown would change
         */
        for (const method of shipping.methods) {
            const chargeFrom =
                from.shipping[method] === undefined
                    ? null
                    : getShippingCharge(from.shipping[method], region)
            const chargeTo =
                to.shipping[method] === undefined
                    ? null
                    : getShippingCharge(to.shipping[method], region)

            if (chargeFrom !== chargeTo) {
                changes.push({
                    ...base,
                    kind: 'shipping',
                    region,
                    method,
                    charge: { from: chargeFrom, to: chargeTo }
                })
            }
        }
    }

    const optionNames = new Set([
        ...Object.keys(before.options),
        ...Object.keys(after.options)
    ])

    for (const option of optionNames) {
        const valuesFrom = before.options[option] ?? []
        const valuesTo = after.options[option] ?? []
        const added = valuesTo.filter((value) => !valuesFrom.includes(value))
        const removed = valuesFrom.filter((value) => !valuesTo.includes(value))

        if (added.length || removed.length) {
            changes.push({ ...base, kind: 'options', option, added, removed })
        }
    }

    if (
        before.printArea.width !== after.printArea.width ||
        before.printArea.height !== after.printArea.height
    ) {
        changes.push({
            ...base,
            kind: 'print-area',
            from: before.printArea,
            to: after.printArea
        })
    }

    return changes
}

/**
 * Every customer-facing change from the current catalogue to a fresh one,
 * for every size in either
 */
export const diffCatalogues = (current: Catalogue, fresh: Catalogue) => {
    const sizes = new Map<string, Base>()

    for (const catalogue of [current, fresh]) {
        for (const [productType, items] of Object.entries(catalogue.products)) {
            if (!(productType in productTypes)) continue

            for (const item of items) {
                sizes.set(`${productType} ${item.size}`, {
                    productType: productType as ProductTypeId,
                    size: item.size,
                    sku: item.sku
                })
            }
        }
    }

    return [...sizes.values()].flatMap((base) => diffItem(current, fresh, base))
}

const signedPercent = (value: number) =>
    `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`

const percent = (value: number) => `${Math.round(value * 100)}%`

/**
 * A change in words, for the refresh email and /admin/catalogue: what it
 * applies to, what moved, and whether it's worth a closer look (an option
 * dropped, or a margin below the minimum)
 */
export const describeChange = (entry: CatalogueChange) => {
    const print = `${productTypes[entry.productType].name}, ${formatPrintSize(entry.size)}`

    switch (entry.kind) {
        case 'price': {
            const { currency } = regions[entry.region]
            const { from, to } = entry.price
            const prices =
                from && to && from.amount !== to.amount
                    ? `${formatMoney(from)} → ${formatMoney(to)} (${signedPercent((to.amount - from.amount) / from.amount)})`
                    : to
                      ? `${formatMoney(to)}, unchanged`
                      : 'No price'
            const cost = `cost ${formatMoney({ amount: entry.cost.from, currency })} → ${formatMoney({ amount: entry.cost.to, currency })}`
            const belowMinimum =
                entry.margin !== null && entry.margin < entry.minMargin

            return {
                label: `${print} · ${entry.region.toUpperCase()}`,
                detail: `${prices} · ${cost}${entry.margin === null ? '' : ` · ${percent(entry.margin)} margin`}`,
                warning: belowMinimum
            }
        }
        case 'shipping': {
            const { currency } = regions[entry.region]
            const charge = (amount: number) => formatMoney({ amount, currency })
            const { from, to } = entry.charge

            return {
                label: `${print} · ${entry.region.toUpperCase()} · ${entry.method} shipping`,
                detail:
                    to === null
                        ? 'No longer offered'
                        : from === null
                          ? `New: ${charge(to)}`
                          : `${charge(from)} → ${charge(to)}`,
                warning: to === null
            }
        }
        case 'options': {
            const name = (value: string) => optionLabel(entry.option, value)

            return {
                label: `${print} · ${optionNames[entry.option] ?? entry.option}`,
                detail: [
                    ...entry.added.map((value) => `+ ${name(value)}`),
                    ...entry.removed.map((value) => `− ${name(value)}`)
                ].join(', '),
                warning: entry.removed.length > 0
            }
        }
        case 'print-area':
            return {
                label: `${print} · Print area`,
                detail: `${entry.from.width} × ${entry.from.height} → ${entry.to.width} × ${entry.to.height} px`,
                warning: false
            }
        case 'added':
        case 'removed':
            return {
                label: entry.region
                    ? `${print} · ${entry.region.toUpperCase()}`
                    : print,
                detail: entry.kind === 'added' ? 'Added' : 'Removed',
                warning: false
            }
    }
}

/**
 * Something Prodigi couldn't price, in words
 */
export const describeProblem = (problem: CatalogueProblem) => ({
    label: `${productTypes[problem.productType as ProductTypeId]?.name ?? problem.productType}, ${formatPrintSize(problem.size)}${problem.region ? ` · ${problem.region.toUpperCase()}` : ''}`,
    detail: `${problem.kind === 'missing' ? 'No quote' : 'Couldn’t check'}, kept the old costs`,
    warning: true
})

const kindOrder: Record<CatalogueChange['kind'], number> = {
    options: 0,
    'print-area': 1,
    price: 2,
    shipping: 3,
    added: 4,
    removed: 5
}

/**
 * Changes needing approval first, then by kind
 */
export const sortChanges = (changes: CatalogueChange[]) =>
    [...changes].sort(
        (a, b) =>
            Number(needsApproval(b)) - Number(needsApproval(a)) ||
            kindOrder[a.kind] - kindOrder[b.kind]
    )
