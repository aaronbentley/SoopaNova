import { syncProdigiOrder } from '@/lib/orders'
import { ProdigiError } from '@/lib/prodigi'
import { createHash, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Prodigi status callbacks (no Clerk auth). Prodigi POSTs a CloudEvent to
 * the callbackUrl each order was submitted with (lib/orders.ts), which
 * carries PRODIGI_CALLBACK_SECRET as `?token=`. Callbacks aren't signed, so
 * the body only says which order changed: the order itself is fetched from
 * Prodigi.
 */

const sha256 = (value: string) => createHash('sha256').update(value).digest()

/**
 * Compare in constant time (hashing first evens out the lengths)
 */
const isValidToken = (token: string | null, secret: string) =>
    token !== null && timingSafeEqual(sha256(token), sha256(secret))

export const POST = async (request: NextRequest) => {
    const secret = process.env.PRODIGI_CALLBACK_SECRET

    if (!secret) {
        console.error('PRODIGI_CALLBACK_SECRET must be set')
        return NextResponse.json({ received: false }, { status: 500 })
    }

    if (!isValidToken(request.nextUrl.searchParams.get('token'), secret)) {
        return NextResponse.json({ received: false }, { status: 401 })
    }

    /**
     * The CloudEvent's subject is the Prodigi order id
     */
    const event = await request.json().catch(() => null)
    const prodigiOrderId = event?.subject ?? event?.data?.id

    if (typeof prodigiOrderId !== 'string' || !/^ord_\d+$/.test(prodigiOrderId)) {
        return NextResponse.json({ received: false }, { status: 400 })
    }

    try {
        const synced = await syncProdigiOrder(prodigiOrderId)

        if (!synced) {
            console.error('Prodigi callback for an unknown order', prodigiOrderId)
        }
    } catch (error) {
        /** Not an order on this Prodigi account: nothing to retry */
        if (error instanceof ProdigiError && error.status === 404) {
            return NextResponse.json({ received: false }, { status: 404 })
        }

        console.error('Prodigi callback failed', prodigiOrderId, error)
        return NextResponse.json({ received: false }, { status: 500 })
    }

    return NextResponse.json({ received: true })
}
