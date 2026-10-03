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
import { parseSize } from '@/lib/print-quality'
import type { Currency, Region, ShippingMethod } from '@/types'

export type Price = { amount: number; currency: Currency }

/**
 * Work in whole cents/pence so rounding isn't thrown by float errors
 */
export const toMinor = (amount: number) => Math.round(amount * 100)

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

    return withSalesTaxBuffer(cost.itemCost, region)
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
 * The lowest of some prices, ignoring sizes that aren't sold (null)
 */
export const cheapest = (prices: (Price | null)[]) =>
    prices
        .filter((price): price is Price => price !== null)
        .sort((a, b) => a.amount - b.amount)[0] ?? null

/**
 * A product type's starting price in a region (its cheapest size sold
 * there), or null when none of its sizes is
 */
export const getFromPrice = (productType: ProductTypeId, region: Region) =>
    cheapest(
        productTypes[productType].sizes.map(({ size }) =>
            getPrice(productType, size, region)
        )
    )

/**
 * A size's price in every region (null where it isn't sold)
 */
export const getRegionPrices = (productType: ProductTypeId, size: string) =>
    Object.fromEntries(
        (Object.keys(regions) as Region[]).map((region) => [
            region,
            getPrice(productType, size, region)
        ])
    ) as Record<Region, Price | null>

/**
 * A product type's starting price in every region
 */
export const getFromPrices = (productType: ProductTypeId) =>
    Object.fromEntries(
        (Object.keys(regions) as Region[]).map((region) => [
            region,
            getFromPrice(productType, region)
        ])
    ) as Record<Region, Price | null>

/**
 * Every option a product type has across its sizes (frame colours, canvas
 * edges), as read from Prodigi by the catalogue script
 */
export const getProductOptions = (productType: ProductTypeId) => {
    const options: Record<string, string[]> = {}

    for (const item of catalogue.products[productType] ?? []) {
        for (const [name, values] of Object.entries(item.options)) {
            options[name] = [...new Set([...(options[name] ?? []), ...values])]
        }
    }

    return options
}

/**
 * The smallest and largest sizes on offer across all products and regions,
 * by area ('14x24')
 */
export const getSizeRange = () => {
    const area = (size: string) => {
        const [width, height] = parseSize(size)

        return width * height
    }
    const sizes = Object.values(productTypes)
        .flatMap((productType) => productType.sizes.map(({ size }) => size))
        .sort((a, b) => area(a) - area(b))

    return { smallest: sizes[0], largest: sizes[sizes.length - 1] }
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

    return { amount: roundShipping(cost), currency: regions[region].currency }
}

/**
 * Round a shipping cost up to the next shipping.roundUpTo (0.50)
 */
export const roundShipping = (cost: number) => {
    const step = toMinor(shipping.roundUpTo)

    return (Math.ceil(toMinor(cost) / step) * step) / 100
}

/**
 * Prodigi's item cost as used for margins: US quotes exclude sales tax, so
 * the US gets an allowance on top
 */
export const withSalesTaxBuffer = (cost: number, region: Region) =>
    region === 'us' ? cost * (1 + usSalesTaxBuffer) : cost

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
