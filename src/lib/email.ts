import 'server-only'

import { countries } from '@/assets/data/countries'
import { cardFees, productTypes } from '@/assets/data/pricing'
import type { ProductTypeId } from '@/assets/data/pricing'
import {
    FieldPath,
    FieldValue,
    firestore,
    ordersBucket
} from '@/lib/firebase-admin'
import type { ProdigiStatus } from '@/lib/orders'
import { formatMoney, toMinor } from '@/lib/pricing'
import { describeOptions, formatPrintSize } from '@/lib/print-labels'
import type { Currency, Region, ShippingMethod } from '@/types'
import type { Recipient } from '@/types/prodigi'
import type {
    DocumentReference,
    DocumentSnapshot
} from 'firebase-admin/firestore'
import { after } from 'next/server'
import { Resend } from 'resend'
import sharp from 'sharp'

/**
 * Order emails, sent through the Resend templates below (their HTML lives in
 * Resend; variables are filled in here). Each email goes once per order: it's
 * claimed under the order's `emails` map before sending, because Stripe and
 * Prodigi repeat their webhooks, and released if Resend fails. Emails are
 * sent after the response, so they never slow down or fail a webhook or a
 * customer's cancel.
 */

const templates = {
    confirmed: 'order-confirmed',
    shipped: 'order-shipped',
    cancelled: 'order-cancelled',
    refunded: 'order-refunded',
    admin: 'admin-order-update'
} as const

type EmailOptions = Parameters<Resend['emails']['send']>[0]

/** Template variables: optional ones are left out to use their fallback */
type Variables = Record<string, string>

let client: Resend | null = null

const getResend = () => {
    if (!client) client = new Resend(process.env.RESEND_API_KEY)

    return client
}

/**
 * Which deployment this is. Only Live emails customers: Preview and local
 * dev take sandbox orders, so their customer emails go to ADMIN_EMAIL.
 */
const getEnvironment = () => {
    if (process.env.VERCEL_ENV === 'production') return 'Live'
    if (process.env.VERCEL_ENV === 'preview') return 'Preview'

    return 'Local'
}

/** The templates' links point here too */
const siteUrl = 'https://soopanova.app'

/**
 * Resend rejects a template variable longer than this
 */
const maxVariableLength = 2000

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London'
})

const money = (order: DocumentSnapshot, amount: number) =>
    formatMoney({ amount, currency: order.get('currency') as Currency })

/**
 * e.g. 'Framed canvas, 40 × 22″'
 */
const printName = (order: DocumentSnapshot) => {
    const productType = productTypes[order.get('productType') as ProductTypeId]

    return `${productType?.name ?? 'Print'}, ${formatPrintSize(order.get('size'))}`
}

/**
 * The order's thumbnail as a small JPEG, attached inline as cid:thumbnail:
 * email apps don't all show WebP, and the orders bucket stays private
 */
const getThumbnail = async (order: DocumentSnapshot) => {
    const name: string | null = order.get('thumbnail') ?? null

    if (!name) return null

    try {
        const [webp] = await ordersBucket.file(name).download()
        const jpeg = await sharp(webp)
            .resize({ width: 480, withoutEnlargement: true })
            .jpeg({ quality: 82, mozjpeg: true })
            .toBuffer()

        return {
            filename: 'screenshot.jpg',
            content: jpeg,
            contentId: 'thumbnail',
            contentType: 'image/jpeg'
        }
    } catch (error) {
        console.error('Could not attach the order thumbnail', order.id, error)
        return null
    }
}

/**
 * The print card every template shows, and its thumbnail attachment
 */
const printCard = async (order: DocumentSnapshot) => {
    const thumbnail = await getThumbnail(order)

    return {
        variables: {
            ORDER_REF: order.id,
            ORDER_DATE: dateFormat.format(order.get('createdAt').toDate()),
            THUMBNAIL_URL: thumbnail
                ? 'cid:thumbnail'
                : `${siteUrl}/apple-icon`,
            PRINT_NAME: printName(order),
            PRINT_OPTIONS: escapeHtml(
                describeOptions(order.get('options') ?? {})
            )
        },
        attachments: thumbnail ? [thumbnail] : []
    }
}

/**
 * The customer's first name, if there is one (the templates fall back to
 * "there")
 */
const customerName = (recipient: Recipient | null): Variables => {
    const firstName = recipient?.name?.trim().split(/\s+/)[0]

    return firstName ? { CUSTOMER_NAME: escapeHtml(firstName) } : {}
}

const deliveryAddress = (recipient: Recipient) => {
    const { address } = recipient
    const country =
        countries.find(({ code }) => code === address.countryCode)?.name ??
        address.countryCode

    return [
        recipient.name,
        address.line1,
        address.line2,
        address.townOrCity,
        address.stateOrCounty,
        address.postalOrZipCode,
        country
    ]
        .filter(Boolean)
        .map((line) => escapeHtml(line!))
        .join('<br>')
}

/**
 * Who gets a customer email: the address from checkout, or ADMIN_EMAIL
 * outside Live
 */
const customerAddress = (order: DocumentSnapshot) =>
    getEnvironment() === 'Live'
        ? ((order.get('recipient') as Recipient | null)?.email ?? null)
        : process.env.ADMIN_EMAIL!

/**
 * A row of the order confirmation's price summary (styled like the
 * template's own rows)
 */
const summaryRow = (label: string, value: string) => {
    const cell =
        'padding-top:6px;padding-right:0px;padding-bottom:6px;padding-left:0px;'
    const text = (color: string) =>
        `margin-top:0;margin-bottom:0;font-family:Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;font-size:15px;line-height:22px;color:${color};`

    return `<tr><td style="${cell}"><p style="${text('#737373')}">${label}</p></td><td align="right" style="${cell}"><p style="${text('#0a0a0a')}">${value}</p></td></tr>`
}

/**
 * The admin email's details table: compact rows that inherit the
 * template's font, cut short rather than break Resend's limit
 */
const detailRows = (rows: [label: string, value: string][]) => {
    let html = ''

    for (const [label, value] of rows) {
        const row = `<tr><td style="padding:5px 0;color:#737373">${label}</td><td align="right">${value}</td></tr>`

        if (html.length + row.length > maxVariableLength) break

        html += row
    }

    return html
}

const mono = (value: string) =>
    `<span style="font-family:monospace">${escapeHtml(value)}</span>`

const muted = (value: string) => `<span style="color:#737373">${value}</span>`

const stripeUrl = (order: DocumentSnapshot) => {
    const isTest = /^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY ?? '')

    return `https://dashboard.stripe.com/${isTest ? 'test/' : ''}payments/${order.get('paymentIntentId')}`
}

const customerRow = (order: DocumentSnapshot): [string, string] => {
    const recipient: Recipient | null = order.get('recipient') ?? null

    return [
        'Customer',
        recipient
            ? `${escapeHtml(recipient.name)}${recipient.email ? `<br>${muted(escapeHtml(recipient.email))}` : ''}`
            : 'No delivery details'
    ]
}

/**
 * An email to the site owner about an order
 */
const adminEmail = async (
    order: DocumentSnapshot,
    {
        event,
        headline,
        intro,
        rows
    }: {
        event: string
        headline: string
        intro: string
        rows: [label: string, value: string][]
    }
): Promise<EmailOptions> => {
    const card = await printCard(order)

    return {
        to: process.env.ADMIN_EMAIL!,
        template: {
            id: templates.admin,
            variables: {
                ...card.variables,
                ENVIRONMENT: getEnvironment(),
                EVENT: event,
                HEADLINE: headline,
                INTRO: intro.slice(0, maxVariableLength),
                DETAILS: detailRows(rows),
                STRIPE_URL: stripeUrl(order)
            }
        },
        attachments: card.attachments
    }
}

/**
 * Send an email once per order: claim `emails.{key}`, send, and release the
 * claim if sending fails. `build` returns null when there's nothing to send.
 */
const sendOnce = async (
    orderRef: DocumentReference,
    key: string,
    build: (order: DocumentSnapshot) => Promise<EmailOptions | null>
) => {
    const field = new FieldPath('emails', key)

    const order = await firestore.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(orderRef)

        if (!snapshot.exists || snapshot.get(field)) return null

        transaction.update(orderRef, field, FieldValue.serverTimestamp())

        return snapshot
    })

    if (!order) return

    try {
        const email = await build(order)

        if (!email) return

        const { error } = await getResend().emails.send(email, {
            idempotencyKey: `${key}/${orderRef.id}`
        })

        if (error) throw error
    } catch (error) {
        console.error('Order email failed', {
            orderId: orderRef.id,
            key,
            error
        })
        await orderRef.update(field, FieldValue.delete()).catch(() => {})
    }
}

/**
 * Run the sends after the response. Without Resend configured, they're
 * only logged.
 */
const queue = (name: string, send: () => Promise<void>) => {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
        console.info(
            `Order email skipped (no RESEND_API_KEY/ADMIN_EMAIL): ${name}`
        )
        return
    }

    after(() =>
        send().catch((error) =>
            console.error(`Order emails failed: ${name}`, error)
        )
    )
}

/**
 * A new order, once it's been sent to Prodigi (or refused): the
 * confirmation for the customer, and the new order (or what needs
 * attention) for the site owner
 */
export const queueOrderPlacedEmails = (orderRef: DocumentReference) =>
    queue('order placed', async () => {
        await sendOnce(orderRef, 'order-confirmed', async (order) => {
            const to = customerAddress(order)
            const recipient: Recipient | null = order.get('recipient') ?? null
            const amounts = order.get('amounts')
            const promotionCode: string | null = order.get('promotionCode')

            if (!to || !recipient) {
                console.error('Order has no email address to confirm to', {
                    orderId: order.id
                })
                return null
            }

            const card = await printCard(order)

            return {
                to,
                template: {
                    id: templates.confirmed,
                    variables: {
                        ...card.variables,
                        ...customerName(recipient),
                        ITEM_PRICE: money(order, amounts.subtotal),
                        SHIPPING_METHOD: order.get('shippingMethod'),
                        SHIPPING_PRICE: money(order, amounts.shipping),
                        DISCOUNT_ROW:
                            amounts.discount > 0
                                ? summaryRow(
                                      promotionCode
                                          ? `Discount (${escapeHtml(promotionCode)})`
                                          : 'Discount',
                                      `−${money(order, amounts.discount)}`
                                  )
                                : '',
                        TOTAL: money(order, amounts.total),
                        DELIVERY_ADDRESS: deliveryAddress(recipient)
                    }
                },
                attachments: card.attachments
            }
        })

        await sendOnce(orderRef, 'admin-new-order', (order) =>
            adminEmail(order, newOrderSummary(order))
        )
    })

/**
 * What the site owner needs to know about a new order: what it made, or
 * why it needs attention
 */
const newOrderSummary = (order: DocumentSnapshot) => {
    const print = printName(order)
    const prodigi: ProdigiStatus | null = order.get('prodigi') ?? null
    const amounts = order.get('amounts')
    const total = money(order, amounts.total)
    const region = order.get('region') as Region
    const method = order.get('shippingMethod') as ShippingMethod
    const cost = order.get('cost')
    const prodigiCost =
        cost && method in (cost.shipping ?? {})
            ? cost.item + cost.shipping[method]
            : null
    const fee =
        amounts.total * cardFees[region].percent + cardFees[region].fixed
    const profit =
        prodigiCost === null ? null : amounts.total - prodigiCost - fee
    const recipient: Recipient | null = order.get('recipient') ?? null
    const country =
        countries.find(({ code }) => code === order.get('country'))?.name ??
        order.get('country')

    const rows: [string, string][] = [
        customerRow(order),
        [
            'Ship to',
            escapeHtml(
                [recipient?.address.townOrCity, country]
                    .filter(Boolean)
                    .join(', ')
            )
        ],
        ['Shipping', escapeHtml(method ?? 'Unknown')],
        [
            'Charged',
            `${total}<br>${muted(`${money(order, amounts.subtotal)} + ${money(order, amounts.shipping)} shipping`)}`
        ],
        ...(amounts.discount > 0
            ? [
                  [
                      'Discount',
                      `−${money(order, amounts.discount)}${order.get('promotionCode') ? ` (${mono(order.get('promotionCode'))})` : ''}`
                  ] as [string, string]
              ]
            : []),
        [
            'Prodigi cost',
            prodigiCost === null ? 'Unknown' : money(order, prodigiCost)
        ],
        ['Card fee (est.)', money(order, Math.round(fee * 100) / 100)],
        [
            'Profit',
            profit === null
                ? 'Unknown'
                : `<strong>${money(order, Math.round(profit * 100) / 100)}</strong> (${Math.round((profit / amounts.total) * 1000) / 10}%)`
        ],
        ['SKU', mono(order.get('sku'))],
        [
            'Prodigi order',
            prodigi
                ? mono(
                      `${prodigi.orderId} · ${prodigi.outcome ?? prodigi.stage}`
                  )
                : 'Not submitted'
        ]
    ]

    if (order.get('status') === 'failed') {
        return {
            event: 'Needs attention',
            headline: `Order not placed with Prodigi: ${print}`,
            intro: `Prodigi didn't take this order: <strong>${escapeHtml(String(order.get('error') ?? 'unknown error'))}</strong>. The customer has paid ${total}, so place it in Prodigi's dashboard once the problem's fixed, or refund it in Stripe.`,
            rows
        }
    }

    if (prodigi?.outcome === 'CreatedWithIssues' || prodigi?.issues?.length) {
        return {
            event: 'Needs attention',
            headline: `New order with issues: ${print} · ${total}`,
            intro: `Prodigi took the order but flagged ${prodigi.issues.length === 1 ? 'an issue' : 'issues'}: ${prodigi.issues.map(({ description }) => `<strong>${escapeHtml(description)}</strong>`).join('; ')}. Check it in Prodigi's dashboard.`,
            rows
        }
    }

    return {
        event: 'New order',
        headline: `New order: ${print} · ${total}`,
        intro: 'Paid, and sent to Prodigi, where it waits out the 2-hour edit window before production.',
        rows
    }
}

/**
 * Tracking details when the carrier gave them (the template falls back to
 * "Not available yet" and the orders page)
 */
const tracking = ({
    trackingNumber,
    trackingUrl
}: ProdigiStatus['shipments'][number]): Variables => ({
    ...(trackingNumber && { TRACKING_NUMBER: escapeHtml(trackingNumber) }),
    ...(trackingUrl?.startsWith('https://') && {
        TRACKING_URL: escapeHtml(trackingUrl)
    })
})

/**
 * A Prodigi update: tell the customer about each shipment once it's
 * shipped
 */
export const queueShippedEmails = (orderRef: DocumentReference) =>
    queue('shipped', async () => {
        const order = await orderRef.get()
        const prodigi: ProdigiStatus | null = order.get('prodigi') ?? null
        const shipments = prodigi?.shipments ?? []

        for (const [index, shipment] of shipments.entries()) {
            if (shipment.status !== 'Shipped') continue

            await sendOnce(
                orderRef,
                `order-shipped-${shipment.id ?? index}`,
                async (order) => {
                    const to = customerAddress(order)
                    const recipient: Recipient | null =
                        order.get('recipient') ?? null

                    if (!to || !recipient) return null

                    const card = await printCard(order)

                    return {
                        to,
                        template: {
                            id: templates.shipped,
                            variables: {
                                ...card.variables,
                                ...customerName(recipient),
                                CARRIER: escapeHtml(
                                    shipment.carrier ?? 'our courier'
                                ),
                                CARRIER_SERVICE: escapeHtml(
                                    shipment.service ??
                                        shipment.carrier ??
                                        'Tracked delivery'
                                ),
                                ...tracking(shipment),
                                DELIVERY_ADDRESS: deliveryAddress(recipient)
                            }
                        },
                        attachments: card.attachments
                    }
                }
            )
        }
    })

/**
 * A customer cancelled and was refunded in full: confirm it to them, and
 * let the site owner know
 */
export const queueCancelledEmails = (orderRef: DocumentReference) =>
    queue('cancelled', async () => {
        await sendOnce(orderRef, 'order-cancelled', async (order) => {
            const to = customerAddress(order)

            if (!to) return null

            const card = await printCard(order)

            return {
                to,
                template: {
                    id: templates.cancelled,
                    variables: {
                        ...card.variables,
                        ...customerName(order.get('recipient') ?? null),
                        REFUND_AMOUNT: money(order, order.get('refund').amount)
                    }
                },
                attachments: card.attachments
            }
        })

        await sendOnce(orderRef, 'admin-customer-cancelled', (order) =>
            adminEmail(order, {
                event: 'Customer cancelled',
                headline: `Cancelled by the customer: ${printName(order)}`,
                intro: `Cancelled at Prodigi and refunded ${money(order, order.get('refund').amount)} in full. Nothing to do.`,
                rows: [
                    customerRow(order),
                    ['Refunded', money(order, order.get('refund').amount)],
                    [
                        'Prodigi order',
                        mono(order.get('prodigi')?.orderId ?? 'None')
                    ]
                ]
            })
        )
    })

/**
 * A customer's cancel went through at Prodigi, but Stripe didn't refund
 * them: the site owner refunds by hand
 */
export const queueRefundFailedEmail = (orderRef: DocumentReference) =>
    queue('refund failed', () =>
        sendOnce(orderRef, 'admin-refund-failed', (order) =>
            adminEmail(order, {
                event: 'Needs attention',
                headline: `Refund failed: ${printName(order)}`,
                intro: `The customer cancelled and Prodigi cancelled the order, but the Stripe refund failed. Refund them ${money(order, order.get('amounts').total)} in full in Stripe.`,
                rows: [
                    customerRow(order),
                    ['Paid', money(order, order.get('amounts').total)]
                ]
            })
        )
    )

/**
 * A refund made in Stripe's dashboard (a customer's own cancel has its
 * own email). `refunded` is the running total, `amount` this refund.
 */
export const queueRefundedEmail = (
    orderRef: DocumentReference,
    {
        amount,
        refunded,
        full
    }: { amount: number; refunded: number; full: boolean }
) =>
    queue('refunded', () =>
        sendOnce(
            orderRef,
            `order-refunded-${toMinor(refunded)}`,
            async (order) => {
                const to = customerAddress(order)

                if (!to) return null

                const card = await printCard(order)

                return {
                    to,
                    template: {
                        id: templates.refunded,
                        variables: {
                            ...card.variables,
                            ...customerName(order.get('recipient') ?? null),
                            REFUND_AMOUNT: money(order, amount),
                            REFUND_NOTE: full
                                ? "You've now had back everything you paid for this order. "
                                : '',
                            TOTAL: money(order, order.get('amounts').total),
                            REFUNDED_TOTAL: money(order, refunded)
                        }
                    },
                    attachments: card.attachments
                }
            }
        )
    )
