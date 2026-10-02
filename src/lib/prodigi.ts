import 'server-only'

import type {
    CancelOrderOutcome,
    CreateOrderOutcome,
    CreateOrderRequest,
    Issue,
    Order,
    ProductDetails,
    Quote,
    QuoteRequest
} from '@/types/prodigi'

/**
 * Prodigi Print API v4 client. Server-only: the API key gives full access to
 * the Prodigi account.
 *
 * PRODIGI_API_URL is https://api.sandbox.prodigi.com (sandbox: never charges
 * or prints) or https://api.prodigi.com (live).
 *
 * @link https://www.prodigi.com/print-api/docs/reference/
 */

/**
 * A failed request: HTTP error, or still rate-limited after retrying
 */
export class ProdigiError extends Error {
    status: number
    data?: unknown
    traceParent?: string

    constructor(
        message: string,
        status: number,
        data?: unknown,
        traceParent?: string
    ) {
        super(message)
        this.name = 'ProdigiError'
        this.status = status
        this.data = data
        this.traceParent = traceParent
    }
}

/**
 * Retry rate-limited requests (HTTP 429) a few times. Kept short because
 * these run inside a customer's request.
 */
const retryDelays = [500, 1000, 2000]

const request = async <T>(path: string, body?: unknown): Promise<T> => {
    const apiUrl = process.env.PRODIGI_API_URL
    const apiKey = process.env.PRODIGI_API_KEY

    if (!apiUrl || !apiKey) {
        throw new Error('PRODIGI_API_URL and PRODIGI_API_KEY must be set')
    }

    for (let attempt = 0; ; attempt++) {
        const response = await fetch(`${apiUrl}/v4.0${path}`, {
            method: body === undefined ? 'GET' : 'POST',
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: body === undefined ? undefined : JSON.stringify(body),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000)
        })

        if (response.status === 429 && attempt < retryDelays.length) {
            await new Promise((resolve) =>
                setTimeout(resolve, retryDelays[attempt])
            )
            continue
        }

        const json = await response.json().catch(() => null)

        if (!response.ok) {
            throw new ProdigiError(
                `Prodigi ${path}: ${json?.statusText ?? response.statusText}`,
                response.status,
                json?.data,
                json?.traceParent
            )
        }

        return json as T
    }
}

/**
 * Quote items to a destination. Without a shippingMethod there's one quote
 * per available method. Costs include Prodigi's tax (not US sales tax).
 */
export const createQuote = (quote: QuoteRequest) =>
    request<{ outcome: string; quotes: Quote[]; issues: Issue[] | null }>(
        '/quotes',
        quote
    )

/**
 * Submit an order. Business outcomes come back with HTTP 200: Created,
 * OnHold (paused or awaiting payment), CreatedWithIssues, or AlreadyExists
 * (same idempotencyKey). AlreadyExists only returns the existing order's id,
 * so that order is fetched.
 */
export const createOrder = async (order: CreateOrderRequest) => {
    const created = await request<{
        outcome: CreateOrderOutcome
        order: Order
    }>('/orders', order)

    if (created.outcome === 'AlreadyExists') {
        return { ...created, order: await getOrder(created.order.id) }
    }

    return created
}

/**
 * Get an order by its Prodigi id (ord_...)
 */
export const getOrder = async (orderId: string) => {
    const { order } = await request<{ outcome: string; order: Order }>(
        `/orders/${encodeURIComponent(orderId)}`
    )

    return order
}

/**
 * Cancel an order. Fully refunded by Prodigi before fulfilment starts;
 * afterwards only shipping is refunded, or ActionNotAvailable.
 */
export const cancelOrder = (orderId: string) =>
    request<{ outcome: CancelOrderOutcome; order: Order }>(
        `/orders/${encodeURIComponent(orderId)}/actions/cancel`,
        {}
    )

/**
 * Product details for a SKU: options, destinations and print pixel sizes
 */
export const getProductDetails = async (sku: string) => {
    const { product } = await request<{
        outcome: string
        product: ProductDetails
    }>(`/products/${encodeURIComponent(sku)}`)

    return product
}
