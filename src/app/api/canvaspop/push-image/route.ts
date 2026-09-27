import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Only accept download URLs for files in our own Firebase Storage bucket
 */
const isAllowedImageUrl = (imageUrl: string) => {
    try {
        const url = new URL(imageUrl)
        const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!
        return (
            url.protocol === 'https:' &&
            url.hostname === 'firebasestorage.googleapis.com' &&
            url.pathname.startsWith(`/v0/b/${bucket}/o/`)
        )
    } catch {
        return false
    }
}

export const POST = async (request: NextRequest) => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'unauthorized'
            },
            { status: 401 }
        )
    }

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
     * Destructure image url from data
     */
    const { imageUrl = undefined } = data

    /**
     * Bail if no image url, or the image url is not one of ours
     */
    if (typeof imageUrl !== 'string' || !isAllowedImageUrl(imageUrl)) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'invalid image url'
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
     * Bail if the image could not be downloaded
     */
    if (!imageResponse.ok) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'image download failed'
            },
            { status: 502 }
        )
    }

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
     * POST payload to Canvaspop Push API
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
     * Bail if response is not ok
     */
    if (!canvasPopPushResponse.ok) {
        console.error(
            'Error uploading image to Canvaspop Push API',
            canvasPopPushResponse.status
        )
        return NextResponse.json(
            {
                message: 'error',
                data: 'canvaspop upload failed'
            },
            { status: 502 }
        )
    }

    /**
     * Get Canvaspop Push API response data as json
     */
    const canvasPopPushResponseJson = await canvasPopPushResponse.json()

    /**
     * Return response
     */
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
