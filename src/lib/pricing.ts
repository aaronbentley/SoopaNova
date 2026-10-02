import { catalogue } from '@/assets/data/catalogue'
import {
    overrides,
    priceStep,
    productTypes,
    regions,
    shipping,
    usSalesTaxBuffer,
    type ProductTypeId
} from '@/assets/data/pricing'
import type { Currency, Region, ShippingMethod } from '@/types'

export type Price = { amount: number; currency: Currency }

/**
 * Work in whole cents/pence so rounding isn't thrown by float errors
 */
const toMinor = (amount: number) => Math.round(amount * 100)

/**
 * A catalogue item by product type and size ('14x24')
 */
export const getCatalogueItem = (productType: ProductTypeId, size: string) =>
    catalogue.products[productType]?.find((item) => item.size === size)

/**
 * Prodigi's cost for an item in a region, plus the US sales tax allowance
 */
const getItemCost = (
    productType: ProductTypeId,
    size: string,
    region: Region
) => {
    const cost = getCatalogueItem(productType, size)?.costs[region]

    if (!cost) return null

    return region === 'us'
        ? cost.itemCost * (1 + usSalesTaxBuffer)
        : cost.itemCost
}

/**
 * Round up to the next price ending in 4 or 9 (with priceStep 5)
 */
const roundPrice = (amount: number) =>
    Math.ceil((amount + 1) / priceStep) * priceStep - 1

/**
 * The retail price of a product size in a region: Prodigi's cost marked up
 * to the product type's margin, unless it has a hand-set override. Null when
 * the size isn't sold there.
 */
export const getPrice = (
    productType: ProductTypeId,
    size: string,
    region: Region
): Price | null => {
    const item = getCatalogueItem(productType, size)
    const cost = getItemCost(productType, size, region)

    if (!item || cost === null) return null

    const { currency } = regions[region]
    const override = overrides[item.sku]?.[currency]

    if (override !== undefined) return { amount: override, currency }

    const { margin } = productTypes[productType]

    return { amount: roundPrice(cost / (1 - margin)), currency }
}

/**
 * The shipping price for a method: Prodigi's cost (incl. tax), rounded up.
 * Null when the method isn't offered for that size and region.
 */
export const getShippingPrice = (
    productType: ProductTypeId,
    size: string,
    region: Region,
    method: ShippingMethod
): Price | null => {
    const cost = getCatalogueItem(productType, size)?.costs[region]?.shipping[
        method
    ]

    if (cost === undefined || !shipping.methods.includes(method)) return null

    const step = toMinor(shipping.roundUpTo)

    return {
        amount: (Math.ceil(toMinor(cost) / step) * step) / 100,
        currency: regions[region].currency
    }
}

/**
 * The gross margin a price makes on a cost (0.4 = 40%), for the checkout
 * guard to compare with the product type's minMargin
 */
export const getMargin = (price: number, cost: number) => (price - cost) / price

/**
 * Format a price for display: whole amounts without decimals (£34), others
 * with two (£7.50)
 */
const currencyLocales: Record<Currency, string> = {
    GBP: 'en-GB',
    EUR: 'en-IE',
    USD: 'en-US'
}

export const formatMoney = ({ amount, currency }: Price) =>
    new Intl.NumberFormat(currencyLocales[currency], {
        style: 'currency',
        currency,
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2
    }).format(amount)
