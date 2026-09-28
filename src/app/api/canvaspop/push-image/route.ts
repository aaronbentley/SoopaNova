import {
    FieldValue,
    printSessionsCollection,
    storageBucket
} from '@/lib/firebase-admin'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Uploads are named `{uuid}--{userId}--{filename}` at the bucket root
 */
const isOwnUpload = (fileName: string, userId: string) => {
    const [uuid, owner, name] = fileName.split('--')
    return (
        /^[0-9a-f-]{36}$/.test(uuid) &&
        owner === userId &&
        !!name &&
        !fileName.includes('/')
    )
}

const errorResponse = (data: string, status: number) =>
    NextResponse.json({ message: 'error', data }, { status })

/**
 * Push a moderated upload to CanvasPop and open a print session for it.
 *
 * The file must belong to the signed-in user and carry the `moderation:
 * passed` metadata that only the moderateImageUrl Cloud Function can write.
 */
export const POST = async (request: NextRequest) => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) return errorResponse('unauthorized', 401)

    /**
     * Get the uploaded file name from the request body
     */
    const data = await request.json().catch(() => null)
    const fileName: unknown = data?.fileName

    /**
     * Bail if no file name, or the file isn't one of the user's uploads
     */
    if (typeof fileName !== 'string' || !isOwnUpload(fileName, userId)) {
        return errorResponse('invalid file', 400)
    }

    /**
     * Check the file exists and passed moderation
     */
    const file = storageBucket.file(fileName)

    const [metadata] = await file.getMetadata().catch(() => [null])

    if (!metadata) return errorResponse('file not found', 404)

    if (metadata.metadata?.moderation !== 'passed') {
        return errorResponse('image not approved', 403)
    }

    /**
     * Download the image file
     */
    const [imageBuffer] = await file.download().catch(() => [null])

    if (!imageBuffer) return errorResponse('image download failed', 502)

    /**
     * Compose payload formData
     */
    const payload = new FormData()
    payload.append(
        'image',
        new Blob([new Uint8Array(imageBuffer)], {
            type: metadata.contentType
        })
    )

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
        return errorResponse('canvaspop upload failed', 502)
    }

    /**
     * Get Canvaspop Push API response data as json
     */
    const canvasPopPushResponseJson = await canvasPopPushResponse.json()
    const imageToken: unknown = canvasPopPushResponseJson?.image_token

    if (typeof imageToken !== 'string' || !imageToken) {
        return errorResponse('canvaspop upload failed', 502)
    }

    /**
     * Open a print session. create-order will only record an order that
     * claims an unused session belonging to the user.
     */
    try {
        const session = await printSessionsCollection(userId).add({
            imageToken,
            fileName,
            orderId: null,
            continuedInTab: false,
            createdAt: FieldValue.serverTimestamp()
        })

        return NextResponse.json(
            {
                message: 'success',
                data: {
                    ...canvasPopPushResponseJson,
                    sessionId: session.id
                }
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error creating print session', error)
        return errorResponse('could not start print session', 500)
    }
}
