import {
    productEdgeSlugs,
    productFrameSlugs,
    productTypeSlugs
} from '@/assets/data/product-slugs'
import {
    FieldValue,
    firestore,
    ordersCollection,
    printSessionsCollection
} from '@/lib/firebase-admin'
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Thrown inside the transaction when the print session can't be claimed
 */
class SessionError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message)
    }
}

/**
 * Record an order for the signed-in user.
 *
 * CanvasPop has no order API, so the product details and price come from
 * the cart's postMessage events and can't be verified. What is enforced: the
 * order must claim one of the user's own print sessions (created by
 * push-image), and each session can only be claimed once.
 */
export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.json().catch(() => null)

    /**
     * Bail if no data
     */
    if (!data) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'no data'
            },
            { status: 400 }
        )
    }

    /**
     * Destructure order payload from data
     */
    const {
        sessionId = null,
        productType = null,
        productWidth = null,
        productHeight = null,
        productFrame = null,
        productEdge = null,
        productPrice = null
    }: {
        sessionId: string | null
        productType: ProductType
        productWidth: number | null
        productHeight: number | null
        productFrame: ProductFrame
        productEdge: ProductEdge
        productPrice: number | null
    } = data

    /**
     * Bail if order payload is missing or invalid
     */
    const toPositiveNumber = (value: unknown) => {
        if (typeof value !== 'number' && typeof value !== 'string') return null
        const number = Number(value)
        return Number.isFinite(number) && number > 0 ? number : null
    }

    const orderWidth = toPositiveNumber(productWidth)
    const orderHeight = toPositiveNumber(productHeight)
    const orderPrice = toPositiveNumber(productPrice)

    if (
        typeof sessionId !== 'string' ||
        !/^[A-Za-z0-9]{1,64}$/.test(sessionId) ||
        !productType ||
        !Object.hasOwn(productTypeSlugs, productType) ||
        (productFrame !== null &&
            !Object.hasOwn(productFrameSlugs, productFrame)) ||
        (productEdge !== null &&
            !Object.hasOwn(productEdgeSlugs, productEdge)) ||
        !orderWidth ||
        !orderHeight ||
        !orderPrice
    ) {
        return NextResponse.json(
            {
                message: 'error: no order payload',
                data: {
                    productType,
                    productWidth,
                    productHeight,
                    productFrame,
                    productEdge,
                    productPrice
                }
            },
            { status: 400 }
        )
    }

    /**
     * Get current user
     */
    const { userId } = await auth()

    /**
     * Check if user is authenticated
     */
    if (!userId) return new Response('Unauthorized', { status: 401 })

    /**
     * Get canvaspop product type markup percentage rates
     */
    const canvaspopMarkupRatePoster = Number(
        process.env.CANVASPOP_MARKUP_RATE_POSTER!
    )
    const canvaspopMarkupRateCanvas = Number(
        process.env.CANVASPOP_MARKUP_RATE_CANVAS!
    )
    const canvaspopMarkupRateFramedPrint = Number(
        process.env.CANVASPOP_MARKUP_RATE_FRAMED_PRINT!
    )

    /**
     * Create map of canvaspop product type slugs to markup percentage rates
     */
    const productMarkupRates = new Map<string, number>()
    productMarkupRates.set('PO', canvaspopMarkupRatePoster)
    productMarkupRates.set('S', canvaspopMarkupRateCanvas)
    productMarkupRates.set('FP', canvaspopMarkupRateFramedPrint)

    /**
     * Calculate order markup rate
     */
    const orderMarkupRate = productMarkupRates.get(productType)

    let orderMarkupProfit = null

    if (orderMarkupRate) {
        orderMarkupProfit = orderPrice * orderMarkupRate
    }

    /**
     * Claim the print session and save the order in one transaction
     */
    try {
        const sessionRef = printSessionsCollection(userId).doc(sessionId)
        const orderRef = ordersCollection(userId).doc()

        await firestore.runTransaction(async (transaction) => {
            const session = await transaction.get(sessionRef)

            if (!session.exists) {
                throw new SessionError('Print session not found.', 404)
            }

            if (session.get('orderId')) {
                throw new SessionError(
                    'This print session already has an order.',
                    409
                )
            }

            transaction.create(orderRef, {
                sessionId,
                imageToken: session.get('imageToken'),
                productType,
                productWidth: orderWidth,
                productHeight: orderHeight,
                productFrame,
                productEdge,
                productPrice: orderPrice,
                orderMarkupRate,
                orderMarkupProfit,
                createdAt: FieldValue.serverTimestamp()
            })

            transaction.update(sessionRef, {
                orderId: orderRef.id,
                completedAt: FieldValue.serverTimestamp()
            })
        })

        /**
         * Return response
         */
        return NextResponse.json(
            {
                ok: true,
                message: 'success',
                data: { orderId: orderRef.id }
            },
            { status: 200 }
        )
    } catch (error) {
        if (error instanceof SessionError) {
            return NextResponse.json(
                { ok: false, message: error.message },
                { status: error.status }
            )
        }

        console.error('Error saving order to firestore', error)
        return NextResponse.json(
            { ok: false, message: 'Something went wrong.' },
            { status: 500 }
        )
    }
}
