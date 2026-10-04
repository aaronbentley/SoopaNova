import 'server-only'

import { printProperties } from '@/lib/analytics'
import { trackServerEvent } from '@/lib/analytics-server'
import {
    FieldValue,
    firestore,
    ordersCollection,
    printSessionsCollection,
    storageBucket
} from '@/lib/firebase-admin'
import { getCancellableUntil } from '@/lib/order-status'
import { cancelOrder, createOrder, getOrder, ProdigiError } from '@/lib/prodigi'
import { getStripe } from '@/lib/stripe'
import { getSignedReadUrl } from '@/lib/uploads'
import type { PrintOrderStatus, ShippingMethod } from '@/types'
import type { CreateOrderOutcome, Order, Recipient } from '@/types/prodigi'
import type { DocumentReference } from 'firebase-admin/firestore'
import type Stripe from 'stripe'

/**
 * Orders: a paid Stripe Checkout session claims its print session, becomes
 * an order (customers/{userId}/orders) and is submitted to Prodigi. Called
 * from the Stripe webhook, which Stripe retries until it gets a 2xx, so each
 * step can run again safely: the print session is claimed once, the order
 * resumes where it stopped, and Prodigi's idempotencyKey (the order id)
 * returns the existing Prodigi order rather than printing twice.
 */

const fromMinor = (amount: number | null | undefined) => (amount ?? 0) / 100

/**
 * Where an order's thumbnail is kept. The moderation thumbnail is deleted
 * with its upload, so each order copies it here.
 */
const orderThumbnailPath = (orderId: string) => `orders/${orderId}.webp`

/**
 * Copy the upload's moderation thumbnail for the order. Not fatal: the
 * order still prints without one.
 */
const keepThumbnail = async (fileName: string, orderId: string) => {
    const source = storageBucket.file(`thumbnails/${fileName}.webp`)
    const destination = storageBucket.file(orderThumbnailPath(orderId))

    try {
        /** The bucket's retention policy blocks overwrites, so a retry keeps the first copy */
        const [[copied], [exists]] = await Promise.all([
            destination.exists(),
            source.exists()
        ])

        if (copied) return destination.name
        if (!exists) return null

        await source.copy(destination)

        return destination.name
    } catch (error) {
        console.error('Could not keep the order thumbnail', orderId, error)
        return null
    }
}

/**
 * The delivery details from Stripe, in Prodigi's format
 */
const toRecipient = (checkout: Stripe.Checkout.Session): Recipient | null => {
    const shipping = checkout.collected_information?.shipping_details
    const address = shipping?.address

    if (!shipping || !address?.line1 || !address.country) return null

    return {
        name: shipping.name,
        email: checkout.customer_details?.email ?? undefined,
        phoneNumber: checkout.customer_details?.phone ?? undefined,
        address: {
            line1: address.line1,
            ...(address.line2 && { line2: address.line2 }),
            townOrCity: address.city ?? '',
            ...(address.state && { stateOrCounty: address.state }),
            postalOrZipCode: address.postal_code ?? '',
            countryCode: address.country
        }
    }
}

/**
 * The Prodigi shipping method the customer chose, from the shipping rate
 * checkout.ts created
 */
const toShippingMethod = (checkout: Stripe.Checkout.Session) => {
    const rate = checkout.shipping_cost?.shipping_rate

    return typeof rate === 'object' && rate
        ? ((rate.metadata?.prodigiShippingMethod as ShippingMethod) ?? null)
        : null
}

/**
 * Claim the print session and create its order, in one transaction. If an
 * earlier attempt already did, returns that order (`created: false`).
 */
const claimPrintSession = async (
    checkout: Stripe.Checkout.Session,
    userId: string,
    printSessionId: string
): Promise<{ orderRef: DocumentReference; created: boolean } | null> => {
    const sessionRef = printSessionsCollection(userId).doc(printSessionId)

    return firestore.runTransaction(async (transaction) => {
        const session = await transaction.get(sessionRef)

        if (!session.exists || session.get('stripeSessionId') !== checkout.id) {
            console.error('Paid checkout has no matching print session', {
                userId,
                printSessionId,
                stripeSessionId: checkout.id
            })
            return null
        }

        const existingOrderId: string | null = session.get('orderId')

        if (existingOrderId)
            return {
                orderRef: ordersCollection(userId).doc(existingOrderId),
                created: false
            }

        const recipient = toRecipient(checkout)
        const shippingMethod = toShippingMethod(checkout)
        const orderRef = ordersCollection(userId).doc()
        const promotionCode = checkout.discounts
            ?.map(({ promotion_code: code }) =>
                typeof code === 'object' && code ? code.code : null
            )
            .find(Boolean)

        transaction.create(orderRef, {
            status: 'paid' satisfies PrintOrderStatus,
            printSessionId,
            stripeSessionId: checkout.id,
            paymentIntentId:
                typeof checkout.payment_intent === 'string'
                    ? checkout.payment_intent
                    : (checkout.payment_intent?.id ?? null),
            fileName: session.get('fileName'),
            thumbnail: null,
            productType: session.get('productType'),
            size: session.get('size'),
            sku: session.get('sku'),
            options: session.get('options'),
            country: session.get('country'),
            region: session.get('region'),
            currency: session.get('currency'),
            price: session.get('price'),
            shippingMethod,
            /** What the customer paid, from Stripe */
            amounts: {
                subtotal: fromMinor(checkout.amount_subtotal),
                shipping: fromMinor(checkout.total_details?.amount_shipping),
                discount: fromMinor(checkout.total_details?.amount_discount),
                tax: fromMinor(checkout.total_details?.amount_tax),
                total: fromMinor(checkout.amount_total)
            },
            promotionCode: promotionCode ?? null,
            /** Prodigi's costs when checkout started */
            cost: session.get('cost'),
            recipient,
            personalUse: session.get('personalUse'),
            prodigi: null,
            error: null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp()
        })

        transaction.update(sessionRef, {
            status: 'paid',
            orderId: orderRef.id,
            completedAt: FieldValue.serverTimestamp()
        })

        return { orderRef, created: true }
    })
}

/**
 * What an order keeps of its Prodigi order: the stage, progress, issues and
 * shipments with tracking. `lastUpdated` orders the snapshots.
 */
const toProdigiStatus = (order: Order) => ({
    orderId: order.id,
    stage: order.status.stage,
    details: order.status.details,
    issues: order.status.issues ?? [],
    shipments: (order.shipments ?? []).map((shipment) => ({
        status: shipment.status,
        carrier: shipment.carrier?.name ?? null,
        service: shipment.carrier?.service ?? null,
        trackingNumber: shipment.tracking?.number ?? null,
        trackingUrl: shipment.tracking?.url ?? null,
        dispatchDate: shipment.dispatchDate ?? null
    })),
    lastUpdated: order.lastUpdated
})

export type ProdigiStatus = ReturnType<typeof toProdigiStatus> & {
    /** How Prodigi answered the submission (Created, OnHold...) */
    outcome: CreateOrderOutcome | null
}

/**
 * Save a Prodigi order onto ours, unless ours already has a newer snapshot
 * (callbacks and the submission can arrive in any order). Returns false if
 * the order doesn't exist or belongs to a different Prodigi order.
 */
const saveProdigiOrder = (
    orderRef: DocumentReference,
    prodigiOrder: Order,
    outcome?: CreateOrderOutcome
) =>
    firestore.runTransaction(async (transaction) => {
        const order = await transaction.get(orderRef)
        const saved: ProdigiStatus | null = order.get('prodigi') ?? null

        if (!order.exists || (saved && saved.orderId !== prodigiOrder.id)) {
            console.error('Prodigi order does not match ours', {
                orderId: orderRef.id,
                prodigiOrderId: prodigiOrder.id
            })
            return false
        }

        const isNewer =
            !saved?.lastUpdated ||
            Date.parse(prodigiOrder.lastUpdated) >=
                Date.parse(saved.lastUpdated)

        transaction.update(orderRef, {
            status: 'submitted' satisfies PrintOrderStatus,
            prodigi: {
                ...(isNewer ? toProdigiStatus(prodigiOrder) : saved),
                outcome: outcome ?? saved?.outcome ?? null
            } satisfies ProdigiStatus,
            error: null,
            ...(!saved && { submittedAt: FieldValue.serverTimestamp() }),
            updatedAt: FieldValue.serverTimestamp()
        })

        return true
    })

/**
 * Submit an order to Prodigi, with a signed url to the original upload.
 * Prodigi refusing the order (4xx) marks it failed for us to sort out; any
 * other error is thrown so the webhook answers 500 and Stripe retries.
 */
const submitToProdigi = async (orderRef: DocumentReference, origin: string) => {
    const order = await orderRef.get()
    const userId = orderRef.parent.parent!.id

    if (!order.get('recipient') || !order.get('shippingMethod')) {
        await orderRef.update({
            status: 'failed' satisfies PrintOrderStatus,
            error: 'Missing delivery address or shipping method',
            updatedAt: FieldValue.serverTimestamp()
        })
        console.error('Order is missing delivery details', {
            orderId: order.id
        })
        return
    }

    /**
     * Uploads are deleted after 3 days, and Prodigi downloads within minutes
     * of the order (retrying for a while), so the url lasts as long
     */
    const assetUrl = await getSignedReadUrl(order.get('fileName'), 3 * 24 * 60)

    const callbackSecret = process.env.PRODIGI_CALLBACK_SECRET
    const options: Record<string, string> = order.get('options') ?? {}

    try {
        const { outcome, order: prodigiOrder } = await createOrder({
            merchantReference: order.id,
            idempotencyKey: order.id,
            shippingMethod: order.get('shippingMethod'),
            ...(callbackSecret && {
                callbackUrl: `${origin}/api/webhooks/prodigi/?token=${encodeURIComponent(callbackSecret)}`
            }),
            metadata: { userId, orderId: order.id },
            recipient: order.get('recipient'),
            items: [
                {
                    merchantReference: order.id,
                    sku: order.get('sku'),
                    copies: 1,
                    sizing: 'fillPrintArea',
                    ...(Object.keys(options).length && { attributes: options }),
                    recipientCost: {
                        amount: Number(order.get('price')).toFixed(2),
                        currency: order.get('currency')
                    },
                    assets: [{ printArea: 'default', url: assetUrl }]
                }
            ]
        })

        /**
         * OnHold is normal: the order edit window pauses every order for 2
         * hours, so customers can cancel (Prodigi's "attention" email covers
         * other holds). CreatedWithIssues still prints, but needs a look.
         */
        if (outcome === 'OnHold') {
            console.info('Prodigi order on hold', {
                orderId: order.id,
                prodigiOrderId: prodigiOrder.id
            })
        }

        if (outcome === 'CreatedWithIssues') {
            console.error(`Prodigi order ${outcome}`, {
                orderId: order.id,
                prodigiOrderId: prodigiOrder.id,
                issues: prodigiOrder.status.issues
            })
        }

        await saveProdigiOrder(orderRef, prodigiOrder, outcome)
    } catch (error) {
        if (
            error instanceof ProdigiError &&
            error.status >= 400 &&
            error.status < 500 &&
            error.status !== 429
        ) {
            console.error('Prodigi refused the order', {
                orderId: order.id,
                status: error.status,
                message: error.message,
                data: error.data
            })
            await orderRef.update({
                status: 'failed' satisfies PrintOrderStatus,
                error: error.message,
                updatedAt: FieldValue.serverTimestamp()
            })
            return
        }

        throw error
    }
}

/**
 * Local dev and the preview share the Stripe sandbox, so both receive every
 * event. Checkout's metadata (also on its payment intent) records where it
 * started. The dev server (via `stripe listen`) only handles checkouts started
 * on localhost, and deployments only handle the rest.
 */
const isOwnCheckout = (metadata: Stripe.Metadata | null) => {
    const origin = metadata?.origin
    const isLocal = !!origin && new URL(origin).hostname === 'localhost'

    return isLocal === (process.env.NODE_ENV === 'development')
}

/**
 * Turn a paid Checkout session into a Prodigi order. `origin` is this
 * deployment's url, for Prodigi's status callbacks.
 */
export const fulfilCheckout = async (
    event: Stripe.Checkout.Session,
    origin: string
) => {
    /**
     * Delayed payment methods complete unpaid and send
     * checkout.session.async_payment_succeeded once paid
     */
    if (event.payment_status !== 'paid') return

    const { userId, printSessionId } = event.metadata ?? {}

    /** Not one of ours (e.g. `stripe trigger`), or another deployment's */
    if (!userId || !printSessionId || !isOwnCheckout(event.metadata)) return

    /**
     * The full session: the chosen shipping rate (for its Prodigi method)
     * and any promotion code
     */
    const checkout = await getStripe().checkout.sessions.retrieve(event.id, {
        expand: ['shipping_cost.shipping_rate', 'discounts.promotion_code']
    })

    const claim = await claimPrintSession(checkout, userId, printSessionId)

    if (!claim) return

    const { orderRef, created } = claim
    const order = await orderRef.get()
    const status: PrintOrderStatus = order.get('status')

    /**
     * Only for the attempt that created the order, so Stripe's retries
     * don't count it again
     */
    if (created) {
        trackServerEvent(
            'Order placed',
            printProperties({
                productType: order.get('productType'),
                size: order.get('size'),
                options: order.get('options')
            })
        )
    }

    if (status !== 'paid') return

    if (!order.get('thumbnail')) {
        const thumbnail = await keepThumbnail(order.get('fileName'), order.id)

        if (thumbnail) await orderRef.update({ thumbnail })
    }

    await submitToProdigi(orderRef, origin)
}

/**
 * An unpaid Checkout session expired (after an hour): close its print
 * session. The customer starts again from the upload.
 */
export const expireCheckout = async (checkout: Stripe.Checkout.Session) => {
    const { userId, printSessionId } = checkout.metadata ?? {}

    if (!userId || !printSessionId || !isOwnCheckout(checkout.metadata)) return

    const sessionRef = printSessionsCollection(userId).doc(printSessionId)

    await firestore.runTransaction(async (transaction) => {
        const session = await transaction.get(sessionRef)

        if (
            session.exists &&
            session.get('status') === 'checkout' &&
            session.get('stripeSessionId') === checkout.id
        ) {
            transaction.update(sessionRef, {
                status: 'expired',
                expiredAt: FieldValue.serverTimestamp()
            })
        }
    })
}

/**
 * Refresh an order from Prodigi, for a status callback. The callback isn't
 * signed, so its body is only a prompt: the order is fetched with our API
 * key and found through the metadata we gave it. Returns false if it isn't
 * one of ours.
 */
export const syncProdigiOrder = async (prodigiOrderId: string) => {
    const prodigiOrder = await getOrder(prodigiOrderId)
    const { userId, orderId } = prodigiOrder.metadata ?? {}

    if (!userId || !orderId) return false

    return saveProdigiOrder(ordersCollection(userId).doc(orderId), prodigiOrder)
}

/**
 * What a customer has been refunded in Stripe: the running total, and
 * whether it's all of it
 */
export type OrderRefund = { amount: number; full: boolean }

/**
 * A cancellation that didn't go through, with a message for the customer
 */
export class CancelOrderError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'CancelOrderError'
    }
}

const tooLateToCancel =
    "This order's already on its way to the printer, so it can't be cancelled now."

/**
 * A customer cancelling their own order while Prodigi has it paused: cancel
 * it at Prodigi first, so nothing that still prints is refunded, then
 * refund the payment in full. Returns the order's print, for analytics.
 */
export const cancelCustomerOrder = async (userId: string, orderId: string) => {
    /** The path makes sure it's the customer's own order */
    const orderRef = ordersCollection(userId).doc(orderId)
    const order = await orderRef.get()

    if (!order.exists) {
        throw new CancelOrderError("We couldn't find that order.")
    }

    const prodigi: ProdigiStatus | null = order.get('prodigi') ?? null
    const cancellableUntil = getCancellableUntil({
        createdAt: order.get('createdAt').toDate(),
        status: order.get('status'),
        prodigi,
        refunded: !!order.get('refund')
    })

    if (!cancellableUntil || !prodigi) {
        throw new CancelOrderError(tooLateToCancel)
    }

    /**
     * The cancel reply may only carry the order's id, so the order is
     * fetched. It counts as cancelled if it is, whatever the outcome (a
     * double click may have cancelled it already). Either way the fresh
     * order is saved, so a refused cancel takes the button away (Prodigi's
     * callbacks may not have caught it up yet, and never do locally).
     */
    const { outcome } = await cancelOrder(prodigi.orderId)
    let prodigiOrder = await getOrder(prodigi.orderId)

    /**
     * Prodigi's sandbox has no edit window and can put an order into
     * production within a second, refusing the cancel. To try the rest of
     * the flow locally anyway, PRODIGI_SANDBOX_FAKE_CANCEL=true treats a refusal as a
     * cancel (dev server and sandbox only): the Stripe refund is real, the
     * Prodigi order isn't cancelled.
     */
    if (
        prodigiOrder.status.stage !== 'Cancelled' &&
        process.env.PRODIGI_SANDBOX_FAKE_CANCEL === 'true' &&
        process.env.NODE_ENV === 'development' &&
        process.env.PRODIGI_API_URL?.includes('sandbox')
    ) {
        console.warn('Faking a Prodigi cancel (PRODIGI_SANDBOX_FAKE_CANCEL)', {
            orderId,
            prodigiOrderId: prodigi.orderId,
            outcome
        })
        prodigiOrder = {
            ...prodigiOrder,
            status: { ...prodigiOrder.status, stage: 'Cancelled' }
        }
    }

    await saveProdigiOrder(orderRef, prodigiOrder)

    if (prodigiOrder.status.stage !== 'Cancelled') {
        console.warn('Prodigi did not cancel the order', {
            orderId,
            prodigiOrderId: prodigi.orderId,
            outcome
        })
        throw new CancelOrderError(tooLateToCancel)
    }

    /**
     * Refund in full. The idempotency key stops a retry refunding twice.
     */
    try {
        const refund = await getStripe().refunds.create(
            {
                payment_intent: order.get('paymentIntentId'),
                reason: 'requested_by_customer',
                metadata: { userId, orderId }
            },
            { idempotencyKey: `cancel-${orderId}` }
        )

        await orderRef.update({
            cancelledAt: FieldValue.serverTimestamp(),
            cancelledBy: 'customer',
            refund: {
                amount: fromMinor(refund.amount),
                full: true,
                refundedAt: FieldValue.serverTimestamp()
            },
            updatedAt: FieldValue.serverTimestamp()
        })
    } catch (error) {
        console.error('Order cancelled at Prodigi but not refunded', {
            orderId,
            userId,
            error
        })
        await orderRef.update({
            cancelledAt: FieldValue.serverTimestamp(),
            cancelledBy: 'customer',
            updatedAt: FieldValue.serverTimestamp()
        })
        throw new CancelOrderError(
            "Your order's cancelled, but the refund didn't go through. We'll sort it out and refund you in full."
        )
    }

    return {
        productType: order.get('productType'),
        size: order.get('size'),
        options: order.get('options') ?? {}
    }
}

/**
 * A refund made in Stripe (a customer's cancellation, or one made in the
 * dashboard, full or partial): keep the running total on the order. Each
 * event carries the charge's total so far, so a late, older event is
 * ignored.
 */
export const recordRefund = async (charge: Stripe.Charge) => {
    const paymentIntentId =
        typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id

    if (!paymentIntentId) return

    /**
     * Checkout's metadata is on the payment intent, not the charge
     */
    const { metadata } =
        await getStripe().paymentIntents.retrieve(paymentIntentId)
    const { userId, printSessionId } = metadata

    if (!userId || !printSessionId || !isOwnCheckout(metadata)) return

    const session = await printSessionsCollection(userId)
        .doc(printSessionId)
        .get()
    const orderId: string | undefined = session.get('orderId')

    if (!orderId) {
        console.error('Refunded payment has no order', {
            userId,
            printSessionId,
            paymentIntentId
        })
        return
    }

    const orderRef = ordersCollection(userId).doc(orderId)
    const amount = fromMinor(charge.amount_refunded)

    await firestore.runTransaction(async (transaction) => {
        const order = await transaction.get(orderRef)
        const saved: OrderRefund | null = order.get('refund') ?? null

        if (!order.exists || (saved && saved.amount > amount)) return

        transaction.update(orderRef, {
            refund: {
                amount,
                full: charge.refunded,
                refundedAt: FieldValue.serverTimestamp()
            },
            updatedAt: FieldValue.serverTimestamp()
        })
    })
}
