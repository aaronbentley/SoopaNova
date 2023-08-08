import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.json()

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
     * Destructure image url from data
     */
    const { imageUrl = undefined } = data

    /**
     * Bail if no image url
     */
    if (!imageUrl) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'no image url'
            },
            { status: 400 }
        )
    }

    /**
     * Download the image file
     */
    const imageResponse = await fetch(imageUrl, {
        method: 'GET'
    })

    /**
     * Transform image response body as blob
     */
    const imageResponseBody = await imageResponse.blob()

    /**
     * Compose payload formData
     */
    const payload = new FormData()
    payload.append('image', imageResponseBody)

    /**
     * POST payload to CanvasPop Push API
     */
    const canvasPopPushResponse = await fetch(
        process.env.CANVASPOP_IMAGE_PUSH_ENDPOINT!,
        {
            method: 'POST',
            headers: {
                'CP-Authorization': 'basic',
                'CP-ApiKey': process.env.CANVASPOP_ACCESS_KEY!
            },
            body: payload
        }
    )

    /**
     * Throw error if response is not ok
     */
    if (!canvasPopPushResponse.ok) {
        throw new Error('Error uploading image to CanvasPop Push API')
    }

    /**
     * Get CanvasPop Push API response data as json
     */
    const canvasPopPushResponseJson = await canvasPopPushResponse.json()
    console.log(
        '🦄 ~ file: route.ts:60 ~ POST ~ canvasPopPushResponseJson:',
        canvasPopPushResponseJson
    )

    return NextResponse.json(
        {
            message: 'success',
            data: {
                ...canvasPopPushResponseJson
            }
        },
        { status: 200 }
    )
}
