/**
 * Import function triggers from their respective submodules:
 *
 * Writing functions using TypeScript:
 * @link https://firebase.google.com/docs/functions/typescript
 */

import vision from '@google-cloud/vision'
import { initializeApp } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'
import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'

/**
 * Initiate Services outside of the function.
 */
// Create a Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient()

// Initialize Firebase Admin
initializeApp()

/**
 * Callable function.
 * Function to moderate an uploaded image using Google Cloud Vision API SafeSearch.
 *
 * Callers must be signed in to Firebase Auth (the browser signs in with a
 * custom token whose uid is the Clerk user id) and can only moderate their
 * own uploads, which are named `{uuid}--{uid}--{filename}`.
 *
 * The verdict is written to the file's custom metadata as
 * `moderation: passed | rejected`. Storage rules stop clients setting it, so
 * server routes can trust it before sending a file to print.
 */
export const moderateImageUrl = onCall(async (request) => {
    // Reject callers who aren't signed in to Firebase Auth
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'You must be signed in.')
    }

    logger.log('Cloud Function has executed onCall', request.data)

    // Get request data
    const { data = undefined } = request

    // Bail if no data is provided
    if (!data) {
        logger.error('Error: No fileDownloadUrl provided.')

        return {
            status: 'error',
            message: 'No fileDownloadUrl provided.'
        }
    }

    // Destructure file ref & file metadata from data
    const { fileRef = undefined, fileMetadata = undefined } = data

    // Bail if no fileDownloadUrl is provided
    if (!fileRef || !fileMetadata) {
        logger.error('Error: No fileRef or fileMetadata provided.')

        return {
            status: 'error',
            message: 'No fileRef or fileMetadata provided.'
        }
    }

    // Get file data
    const {
        contentType = undefined,
        bucket = undefined,
        name = undefined
    } = fileMetadata

    // Only moderate files in this project's default Storage bucket
    if (
        bucket !== getStorage().bucket().name ||
        typeof name !== 'string' ||
        !name
    ) {
        logger.error('Error: invalid bucket or file name.', {
            bucket,
            name
        })

        return {
            status: 'error',
            message: 'Invalid file reference.'
        }
    }

    // Only moderate the caller's own uploads
    const [, fileOwner] = name.split('--')

    if (fileOwner !== request.auth.uid) {
        logger.error('Error: file does not belong to the caller.', {
            name,
            uid: request.auth.uid
        })

        throw new HttpsError(
            'permission-denied',
            'You can only moderate your own uploads.'
        )
    }

    // Ensure the content type is an image
    if (contentType && !contentType.startsWith('image/')) {
        logger.error('Error: file is not an image.')

        return {
            status: 'error',
            message: 'file is not an image.'
        }
    }

    // Perform safe search property detection on the remote file
    try {
        const [result] = await visionClient.safeSearchDetection(
            `gs://${bucket}/${name}`
        )

        // Get Cloud Vision API SafeSearch detections
        const detections = result.safeSearchAnnotation

        // Bail if detections is null or undefined
        if (!detections) {
            logger.warn('Warning: No detections found.', detections)
            return {
                status: 'warning',
                message: 'No detections found.'
            }
        }

        // Debug data
        logger.info('Cloud Vision SafeSearch Detections:', {
            adult: `${detections.adult}`,
            racy: `${detections.racy}`,
            violence: `${detections.violence}`
        })

        // Only adult content rated VERY_LIKELY is rejected (stricter
        // thresholds false-flag game screenshots)
        const verdict =
            `${detections.adult}` === 'VERY_LIKELY' ? 'rejected' : 'passed'

        // Record the verdict on the file for the push-image route to check
        await getStorage()
            .bucket(bucket)
            .file(name)
            .setMetadata({ metadata: { moderation: verdict } })

        // Return Cloud Vision SafeSearch Detections
        return {
            status: 'ok',
            message: 'Cloud Vision SafeSearch moderation completed',
            verdict,
            detections: {
                adult: `${detections.adult}`,
                racy: `${detections.racy}`,
                violence: `${detections.violence}`
            }
        }
    } catch (error) {
        logger.error('Error: Cloud Vision SafeSearch error', error)

        return {
            status: 'error',
            message: 'Error: Cloud Vision SafeSearch error',
            data: null
        }
    } finally {
        logger.info('OK - Cloud Vision SafeSearch moderation completed.')
    }
})

/**
 * Firestore trigger function.
 * Function to create a new order email confirmation and send it to admin.
 *
 * NOTE: the document path must match FIREBASE_FIRESTORE_COLLECTION and
 * FIREBASE_FIRESTORE_SUB_COLLECTION in the Next.js app's environment.
 */
export const onOrderCreated = onDocumentCreated(
    'customers/{userId}/orders/{orderId}',
    async (event) => {
        logger.info('Cloud Function has executed onDocumentCreated', event)

        // Get an object representing the document
        const snapshot = event.data

        if (!snapshot) {
            logger.error('Error: No document snapshot provided.')
            return
        }

        // Get the document data
        const data = snapshot.data()

        if (!data) {
            logger.error('Error: No document data provided.')
            return
        }

        // Get the order data properties with  fallbacks
        const order = {
            userId: event.params.userId,
            orderId: event.params.orderId,
            productType: data.productType || 'not specified',
            productWidth: data.productWidth || 'not specified',
            productHeight: data.productHeight || 'not specified',
            productFrame: data.productFrame || 'none',
            productEdge: data.productEdge || 'none',
            productPrice: data.productPrice || 'not specified',
            orderMarkupRate: data.orderMarkupRate || 'not specified',
            orderMarkupProfit: data.orderMarkupProfit || 'not specified'
        }

        logger.info('Order data', order)

        /**
         * TODO: Send email confirmation to admin - SendGrid?
         */
    }
)
