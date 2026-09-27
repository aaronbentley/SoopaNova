import {
    productEdgeSlugs,
    productFrameSlugs,
    productTypeSlugs
} from '@/assets/data/product-slugs'
import { FieldValue, firestore } from '@/lib/firebase-admin'
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.json().catch(() => null)
    // console.log('🦄 ~ file: route.ts:8 ~ POST ~ data:', data)

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
        productType = null,
        productWidth = null,
        productHeight = null,
        productFrame = null,
        productEdge = null,
        productPrice = null
    }: {
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
        // console.log(
        //     `🦄 ~ Markup Profit: ${productPrice} x ${orderMarkupRate} = $`,
        //     orderMarkupProfit
        // )
    }

    /**
     * Save order to firestore
     */
    try {
        const order = await firestore
            .collection(process.env.FIREBASE_FIRESTORE_COLLECTION!)
            .doc(userId)
            .collection(process.env.FIREBASE_FIRESTORE_SUB_COLLECTION!)
            .add({
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

        /**
         * Return response
         */
        return NextResponse.json(
            {
                ok: true,
                message: 'success',
                data: { orderId: order.id }
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error saving order to firestore', error)
        return NextResponse.json(
            { ok: false, message: 'Something went wrong.' },
            { status: 500 }
        )
    }
}
