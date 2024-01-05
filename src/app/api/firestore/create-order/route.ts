import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { auth } from '@clerk/nextjs'
import * as admin from 'firebase-admin'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Initialize Firebase Admin SDK
 */
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
            privateKey:
                process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID!.replace(
                    /\\n/g,
                    '\n'
                )
        })
    })
}

/**
 * Initialize Firestore
 */
const firestore = admin.firestore()

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.json()
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
     * Bail if no order payload
     */
    if (!productType || !productWidth || !productHeight || !productPrice) {
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
    const { userId } = auth()

    if (!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

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
        orderMarkupProfit = productPrice * orderMarkupRate
        console.log(
            `🦄 ~ Markup Profit: ${productPrice} x ${orderMarkupRate} = $`,
            orderMarkupProfit
        )
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
                productWidth,
                productHeight,
                productFrame,
                productEdge,
                productPrice,
                orderMarkupRate,
                orderMarkupProfit,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            })

        /**
         * Return response
         */
        return NextResponse.json(
            {
                ok: true,
                message: 'success',
                data: {
                    orderId: order.id
                    // productType,
                    // productWidth,
                    // productHeight,
                    // productFrame,
                    // productEdge,
                    // productPrice
                }
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}
