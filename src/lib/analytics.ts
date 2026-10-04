import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { describeOptions, formatPrintSize } from '@/lib/print-labels'
import { track } from '@vercel/analytics'

/**
 * Vercel Web Analytics custom events (lib/analytics-server.ts tracks the
 * server-side ones). The Pro plan keeps 2 properties per event, so each
 * property holds a readable label rather than an id.
 */
export type AnalyticsEvent =
    /** A screenshot uploaded to start a print (once per file) */
    | 'Screenshot uploaded'
    /** A change in the print options sheet */
    | 'Print option chosen'
    /** Stripe Checkout created */
    | 'Checkout started'
    /** "Continue to checkout" refused or failed */
    | 'Checkout failed'
    /** Paid, and the order created (once per order) */
    | 'Order placed'

export type AnalyticsProperties = Record<string, string>

/**
 * A print's choices as two properties: the product and size, e.g.
 * 'Canvas, 24 × 16″', and its options, e.g. 'Canvas edges: Mirror wrap'
 */
export const printProperties = ({
    productType,
    size,
    options
}: {
    productType: ProductTypeId
    size: string
    options: Record<string, string>
}): AnalyticsProperties => ({
    print: `${productTypes[productType].name}, ${formatPrintSize(size)}`,
    options: describeOptions(options) || 'None'
})

/**
 * Track a custom event from the browser (logged to the console in dev)
 */
export const trackEvent = (
    name: AnalyticsEvent,
    properties: AnalyticsProperties
) => track(name, properties)
