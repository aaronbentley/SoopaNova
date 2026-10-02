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
import { makeDerivedImages, thumbnailPath } from './images'

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
 *
 * Vision is sent a small copy (Cloud Vision rejects files over 20MB), and an
 * approved upload gets a thumbnail at `thumbnails/{name}.webp` for its order.
 * Decoding large screenshots needs the extra memory.
 */
export const moderateImageUrl = onCall(
    { memory: '1GiB', timeoutSeconds: 120 },
    async (request) => {
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

        // Only moderate uploads (root-level files) in this project's default
        // Storage bucket, not thumbnails or anything else
        if (
            bucket !== getStorage().bucket().name ||
            typeof name !== 'string' ||
            !name ||
            name.includes('/')
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

        const file = getStorage().bucket(bucket).file(name)

        // Download the upload once and make a small copy for Cloud Vision plus a
        // thumbnail
        let images: Awaited<ReturnType<typeof makeDerivedImages>>

        try {
            const [original] = await file.download()
            images = await makeDerivedImages(original)
        } catch (error) {
            logger.error('Error: could not read or resize the image', error)

            return {
                status: 'error',
                message: 'Could not process the image.'
            }
        }

        // Perform safe search property detection on the small copy
        try {
            const [result] = await visionClient.safeSearchDetection({
                image: { content: images.moderationCopy }
            })

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

            // Record the verdict on the file for server routes to check
            await file.setMetadata({ metadata: { moderation: verdict } })

            // Keep a thumbnail of approved uploads. The bucket's retention policy
            // stops objects being overwritten, so a retry keeps the first one.
            // A missing thumbnail shouldn't fail moderation, so errors are logged.
            if (verdict === 'passed') {
                try {
                    const thumbnail = getStorage()
                        .bucket(bucket)
                        .file(thumbnailPath(name))
                    const [exists] = await thumbnail.exists()

                    if (!exists) {
                        await thumbnail.save(images.thumbnail, {
                            resumable: false,
                            contentType: 'image/webp',
                            metadata: { metadata: { upload: name } }
                        })
                    }
                } catch (error) {
                    logger.warn('Warning: could not save the thumbnail', error)
                }
            }

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
    }
)

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
        logger.info('Cloud Function has executed onDocumentCreated')

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

        // Log which order was created (not its contents, which will hold
        // the customer's address)
        const order = {
            userId: event.params.userId,
            orderId: event.params.orderId
        }

        logger.info('Order data', order)

        /**
         * TODO: Send email confirmation to admin - SendGrid?
         */
    }
)
