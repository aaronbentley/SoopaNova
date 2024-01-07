import OrderEmail from '@/email/order'
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

/**
 * Initialize Resend
 */
const resend = new Resend(process.env.RESEND_API_KEY!)

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.json()
    console.log('🦄 ~ file: route.ts:16 ~ POST ~ data:', data)

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
        orderId = null,
        productType = null,
        productWidth = null,
        productHeight = null,
        productFrame = null,
        productEdge = null,
        productPrice = null
    }: {
        orderId: string | null
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
                    orderId,
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
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${process.env.APP_TITLE!} <notifications@soopanova.app>`,
            to: [process.env.RESEND_NOTIFICATION_EMAIL!],
            subject: `New Order: ${orderId}`,
            react: OrderEmail({
                orderId,
                productType,
                productWidth,
                productHeight,
                productFrame,
                productEdge,
                productPrice
            })
        })

        if (error) {
            throw new Error(error.message)
        }

        return NextResponse.json(
            {
                ok: true,
                message: 'success',
                data
            },
            { status: 200 }
        )
    } catch (error) {
        let message = 'Something went wrong.'
        if (error instanceof Error) message = error.message
        console.error(message, error)
        return NextResponse.json({ message: message }, { status: 500 })
    }
}
