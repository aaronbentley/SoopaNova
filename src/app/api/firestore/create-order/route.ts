import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.json()
    console.log('🦄 ~ file: route.ts:8 ~ POST ~ data:', data)

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
     * TODO: Save order to firestore
     */

    /**
     * Return response
     */
    return NextResponse.json(
        {
            message: 'success',
            data: {
                productType,
                productWidth,
                productHeight,
                productFrame,
                productEdge,
                productPrice
            }
        },
        { status: 200 }
    )
}
