/**
 * Prodigi Print API v4 types (the parts we use).
 *
 * @link https://www.prodigi.com/print-api/docs/reference/
 */
import type { ShippingMethod } from '@/types'

export type Money = { amount: string; currency: string }

export type Issue = {
    objectId: string | null
    errorCode: string
    description: string
    authorisationDetails?: {
        authorisationUrl: string
        paymentDetails: Money
    }
}

export type Address = {
    line1: string
    line2?: string
    townOrCity: string
    stateOrCounty?: string
    postalOrZipCode: string
    /** Two-letter ISO country code */
    countryCode: string
}

export type Recipient = {
    name: string
    email?: string
    phoneNumber?: string
    address: Address
}

export type Sizing = 'fillPrintArea' | 'fitPrintArea' | 'stretchToPrintArea'

export type Asset = {
    printArea: string
    url: string
    md5Hash?: string
}

export type OrderItemRequest = {
    sku: string
    copies: number
    sizing: Sizing
    merchantReference?: string
    attributes?: Record<string, string>
    /** What the customer paid; helps couriers with customs */
    recipientCost?: Money
    assets: Asset[]
}

export type CreateOrderRequest = {
    merchantReference?: string
    shippingMethod: ShippingMethod
    /** Prodigi POSTs status changes here */
    callbackUrl?: string
    /** Duplicate requests with the same key return the existing order */
    idempotencyKey?: string
    /** Up to 2000 characters of JSON */
    metadata?: Record<string, string>
    recipient: Recipient
    items: OrderItemRequest[]
}

export type DetailStatus = 'NotStarted' | 'InProgress' | 'Complete' | 'Error'

export type OrderStatus = {
    stage: 'InProgress' | 'Complete' | 'Cancelled'
    details: {
        downloadAssets: DetailStatus
        printReadyAssetsPrepared: DetailStatus
        allocateProductionLocation: DetailStatus
        inProduction: DetailStatus
        shipping: DetailStatus
    }
    issues: Issue[]
}

export type Shipment = {
    id: string
    status: 'Processing' | 'Cancelled' | 'Shipped'
    carrier: { name: string; service: string }
    tracking: { url: string | null; number: string | null } | null
    dispatchDate: string | null
    items: { itemId: string }[]
    fulfillmentLocation: { countryCode: string; labCode: string }
}

export type Order = {
    id: string
    created: string
    lastUpdated: string
    merchantReference: string | null
    shippingMethod: ShippingMethod
    idempotencyKey: string | null
    callbackUrl: string | null
    status: OrderStatus
    charges: {
        id: string
        totalCost: Money
        items: { itemId: string; cost: Money }[]
    }[]
    shipments: Shipment[]
    recipient: Recipient
    items: (OrderItemRequest & { id: string; status: string })[]
    metadata: Record<string, string> | null
}

export type CreateOrderOutcome =
    'Created' | 'OnHold' | 'CreatedWithIssues' | 'AlreadyExists'

export type CancelOrderOutcome =
    'Cancelled' | 'FailedToCancel' | 'ActionNotAvailable'

export type QuoteRequest = {
    destinationCountryCode: string
    currencyCode?: string
    /** Omit to get a quote for every shipping method */
    shippingMethod?: ShippingMethod
    items: {
        sku: string
        copies: number
        attributes?: Record<string, string>
        assets: { printArea: string }[]
    }[]
}

export type Quote = {
    shipmentMethod: ShippingMethod
    costSummary: {
        items: Money
        shipping: Money
        /** Not in the docs, but returned: includes tax */
        totalCost?: Money
        totalTax?: Money
    }
    shipments: {
        carrier: { name: string; service: string }
        fulfillmentLocation: { countryCode: string; labCode: string }
        cost: Money
        tax?: Money
    }[]
    items: {
        sku: string
        copies: number
        unitCost: Money
        taxUnitCost?: Money
        attributes?: Record<string, string>
        additionalCosts?: { unitCost: Money; taxUnitCost?: Money }[]
    }[]
}

export type ProductDetails = {
    sku: string
    description: string
    productDimensions: { width: number; height: number; units: string }
    attributes: Record<string, string[]>
    printAreas: Record<string, { required: boolean }>
    variants: {
        attributes: Record<string, string>
        shipsTo: string[]
        printAreaSizes: Record<
            string,
            { horizontalResolution: number; verticalResolution: number }
        >
    }[]
}

/**
 * A callback Prodigi POSTs to an order's callbackUrl (CloudEvents 1.0). It
 * isn't signed, so treat it as a prompt to fetch the order.
 */
export type OrderCallback = {
    specversion: string
    type: string
    source: string
    id: string
    time: string
    /** The Prodigi order id */
    subject: string
    /** The order at the time of the event (shape not documented exactly) */
    data: unknown
}
