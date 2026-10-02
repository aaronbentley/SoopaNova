import 'server-only'

import { countries } from '@/assets/data/countries'
import { termsVersion } from '@/assets/data/legal'
import { productTypes, shipping } from '@/assets/data/pricing'
import { optionNames, optionValueLabels } from '@/assets/data/print-options'
import { FieldValue, printSessionsCollection } from '@/lib/firebase-admin'
import {
    getCatalogueItem,
    getMargin,
    getPrice,
    roundShipping,
    toMinor,
    withSalesTaxBuffer
} from '@/lib/pricing'
import { checkoutRequestSchema } from '@/lib/print-options-schema'
import { parseSize } from '@/lib/print-quality'
import { createQuote } from '@/lib/prodigi'
import { getQuoteCosts } from '@/lib/prodigi-costs'
import { getStripe } from '@/lib/stripe'
import { getThumbnailUrl, isApprovedUpload, isOwnUpload } from '@/lib/uploads'
import type { ShippingMethod } from '@/types'
import type Stripe from 'stripe'

/**
 * A request that can't go to checkout, with a message for the customer
 */
export class CheckoutError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'CheckoutError'
        this.status = status
    }
}

const shippingNames: Partial<Record<ShippingMethod, string>> = {
    Standard: 'Standard delivery',
    Express: 'Express delivery'
}

/**
 * Check the request with the same zod schema as the print options form:
 * types, a product type and size sold in the country's region, every option
 * valid, and the personal-use confirmation
 */
const validate = (input: unknown) => {
    const parsed = checkoutRequestSchema.safeParse(input)

    if (!parsed.success) {
        throw new CheckoutError(
            parsed.error.issues[0]?.message ?? 'Invalid checkout request.',
            400
        )
    }

    const { fileName, productType, size, options, country: code } = parsed.data

    /**
     * The schema has checked these exist
     */
    const country = countries.find((entry) => entry.code === code)!
    const item = getCatalogueItem(productType, size)!

    return {
        fileName,
        productType,
        size,
        options,
        country,
        region: country.region,
        item
    }
}

/**
 * Start checkout for a print: check the upload, price it from the catalogue,
 * check Prodigi's live cost still leaves at least the product type's
 * minMargin, record a print session and create a Stripe Checkout session.
 * Returns the Checkout url; throws CheckoutError for the customer.
 */
export const startCheckout = async ({
    userId,
    email,
    origin,
    input
}: {
    userId: string
    email?: string
    origin: string
    input: unknown
}) => {
    const { fileName, productType, size, options, country, region, item } =
        validate(input)

    /**
     * The upload must be the customer's own and approved by moderation
     */
    if (!isOwnUpload(fileName, userId) || !(await isApprovedUpload(fileName))) {
        throw new CheckoutError(
            "We couldn't verify your screenshot. Please upload it again.",
            403
        )
    }

    /**
     * Our price, from the catalogue and pricing config (never the browser)
     */
    const price = getPrice(productType, size, region)

    if (!price) {
        throw new CheckoutError(
            `That size isn't available to ${country.name}.`,
            400
        )
    }

    /**
     * Prodigi's live cost for the exact product, options and country
     */
    const quote = await createQuote({
        destinationCountryCode: country.code,
        currencyCode: price.currency,
        items: [
            {
                sku: item.sku,
                copies: 1,
                attributes: options,
                assets: [{ printArea: 'default' }]
            }
        ]
    }).catch((error) => {
        console.error('Prodigi quote failed', error)
        throw new CheckoutError(
            "We couldn't start checkout. Please try again.",
            502
        )
    })

    const costs = getQuoteCosts(quote.quotes ?? [], shipping.methods)
    const itemCost = costs ? withSalesTaxBuffer(costs.itemCost, region) : null
    const { minMargin, name: productName } = productTypes[productType]

    /**
     * The margin guard: refuse rather than sell at a loss if Prodigi's cost
     * has risen (or this country costs more than the catalogue's)
     */
    if (
        !costs ||
        itemCost === null ||
        getMargin(price.amount, itemCost) < minMargin
    ) {
        console.error('Checkout refused by the margin guard', {
            sku: item.sku,
            country: country.code,
            price,
            itemCost,
            minMargin,
            issues: quote.issues
        })
        throw new CheckoutError(
            `This print isn't available to ${country.name} right now. Please try another size or product.`,
            422
        )
    }

    /**
     * Shipping options at Prodigi's cost for this country, rounded up
     */
    const shippingRates = shipping.methods.flatMap((method) => {
        const cost = costs.shipping[method]
        return cost === undefined
            ? []
            : [{ method, amount: roundShipping(cost) }]
    })

    /**
     * Record the print session; the Stripe webhook claims it when paid
     */
    const session = await printSessionsCollection(userId).add({
        status: 'checkout',
        fileName,
        productType,
        size,
        sku: item.sku,
        options,
        country: country.code,
        region,
        currency: price.currency,
        price: price.amount,
        shipping: Object.fromEntries(
            shippingRates.map(({ method, amount }) => [method, amount])
        ),
        cost: { item: costs.itemCost, shipping: costs.shipping },
        personalUse: {
            confirmed: true,
            termsVersion,
            confirmedAt: FieldValue.serverTimestamp()
        },
        stripeSessionId: null,
        orderId: null,
        createdAt: FieldValue.serverTimestamp()
    })

    /**
     * The line item: product, size and options, with the thumbnail if
     * moderation made one
     */
    const description = Object.entries(options)
        .map(
            ([name, value]) =>
                `${optionNames[name] ?? name}: ${optionValueLabels[name]?.[value] ?? value}`
        )
        .join(' · ')
    const thumbnailUrl = await getThumbnailUrl(fileName).catch(() => null)
    const [width, height] = parseSize(size)
    const sizeLabel = `${Math.max(width, height)} × ${Math.min(width, height)}″`
    const metadata = {
        userId,
        printSessionId: session.id,
        sku: item.sku
    }

    const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        client_reference_id: session.id,
        customer_email: email,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: price.currency.toLowerCase(),
                    unit_amount: toMinor(price.amount),
                    product_data: {
                        name: `${productName}, ${sizeLabel}`,
                        ...(description && { description }),
                        ...(thumbnailUrl && { images: [thumbnailUrl] }),
                        metadata: { sku: item.sku }
                    }
                }
            }
        ],
        shipping_address_collection: {
            allowed_countries: [
                country.code as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry
            ]
        },
        shipping_options: shippingRates.map(({ method, amount }) => ({
            shipping_rate_data: {
                type: 'fixed_amount',
                display_name: shippingNames[method] ?? method,
                fixed_amount: {
                    amount: toMinor(amount),
                    currency: price.currency.toLowerCase()
                },
                metadata: { prodigiShippingMethod: method }
            }
        })),
        phone_number_collection: { enabled: true },
        metadata,
        payment_intent_data: { metadata },
        /** Prices and costs can change, so a session lasts an hour */
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
        success_url: `${origin}/orders/?checkout=success`,
        cancel_url: `${origin}/create/?checkout=cancelled`
    }

    try {
        const checkout = await getStripe().checkout.sessions.create(params, {
            idempotencyKey: session.id
        })

        await session.update({ stripeSessionId: checkout.id })

        if (!checkout.url) throw new Error('Stripe returned no checkout url')

        return checkout.url
    } catch (error) {
        console.error('Stripe Checkout session failed', error)
        await session.update({ status: 'failed' }).catch(() => {})
        throw new CheckoutError(
            "We couldn't start checkout. Please try again.",
            502
        )
    }
}
