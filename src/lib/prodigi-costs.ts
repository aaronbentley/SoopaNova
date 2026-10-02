import type { CatalogueCost, ShippingMethod } from '@/types'
import type { Money, Quote } from '@/types/prodigi'

/**
 * Prodigi's costs from a quote response, shared by the catalogue script and
 * checkout. It only has type imports, so Node can run it directly.
 */

const money = (value?: Money) => (value ? Number(value.amount) : 0)
const round2 = (value: number) => Math.round(value * 100) / 100

/**
 * Item and shipping costs (each including Prodigi's tax) for the shipping
 * methods we offer, from the quotes for one item to one country. Each method
 * can be routed to a different lab at a different item cost, so the item
 * cost and lab come from the first of `methods` that was quoted. Null when
 * none of them was.
 */
export const getQuoteCosts = (
    quotes: Quote[],
    methods: ShippingMethod[]
): CatalogueCost | null => {
    const offered = quotes.filter((quote) =>
        methods.includes(quote.shipmentMethod)
    )

    const reference = methods
        .map((method) =>
            offered.find((quote) => quote.shipmentMethod === method)
        )
        .find((quote) => quote !== undefined)

    if (!reference) return null

    const [item] = reference.items
    const itemCost =
        money(item.unitCost) +
        money(item.taxUnitCost) +
        (item.additionalCosts ?? []).reduce(
            (sum, cost) => sum + money(cost.unitCost) + money(cost.taxUnitCost),
            0
        )

    const shipping: CatalogueCost['shipping'] = {}

    for (const quote of offered) {
        shipping[quote.shipmentMethod] = round2(
            quote.shipments.reduce(
                (sum, shipment) =>
                    sum + money(shipment.cost) + money(shipment.tax),
                0
            )
        )
    }

    return {
        itemCost: round2(itemCost),
        shipping,
        madeIn: reference.shipments[0].fulfillmentLocation.countryCode
    }
}
