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
        orderId = 'orderId',
        productType = null,
        productWidth = 0,
        productHeight = 0,
        productFrame = null,
        productEdge = null,
        productPrice = 0,
        orderMarkupRate = 0,
        orderMarkupProfit = 0
    }: {
        orderId: string
        productType: ProductType
        productWidth: number
        productHeight: number
        productFrame: ProductFrame
        productEdge: ProductEdge
        productPrice: number
        orderMarkupRate: number
        orderMarkupProfit: number
    } = data

    /**
     * Bail if order payload data is missing
     */
    if (!productType || !productWidth || !productHeight || !productPrice) {
        return NextResponse.json(
            {
                message: 'error: missing order payload data',
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
                productPrice,
                orderMarkupRate,
                orderMarkupProfit
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
