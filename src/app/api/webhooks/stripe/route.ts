import { expireCheckout, fulfilCheckout } from '@/lib/orders'
import { getStripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'

/**
 * Stripe webhook (no Clerk auth: Stripe signs each event instead).
 * A paid Checkout session becomes an order and is submitted to Prodigi;
 * an expired one closes its print session. Answering 500 makes Stripe retry,
 * which lib/orders.ts makes safe.
 *
 * Endpoint: /api/webhooks/stripe/ (with the trailing slash: Stripe doesn't
 * follow the redirect). Events: checkout.session.completed,
 * checkout.session.async_payment_succeeded, checkout.session.expired.
 */
export const POST = async (request: NextRequest) => {
    const signature = request.headers.get('stripe-signature')
    const secret = process.env.STRIPE_WEBHOOK_SECRET

    if (!secret) {
        console.error('STRIPE_WEBHOOK_SECRET must be set')
        return NextResponse.json({ received: false }, { status: 500 })
    }

    /**
     * Verify the signature against the raw body
     */
    let event: Stripe.Event

    try {
        event = getStripe().webhooks.constructEvent(
            await request.text(),
            signature ?? '',
            secret
        )
    } catch {
        return NextResponse.json({ received: false }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded':
                await fulfilCheckout(event.data.object, request.nextUrl.origin)
                break
            case 'checkout.session.expired':
                await expireCheckout(event.data.object)
                break
        }
    } catch (error) {
        console.error(`Stripe webhook ${event.type} failed`, event.id, error)
        return NextResponse.json({ received: false }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
