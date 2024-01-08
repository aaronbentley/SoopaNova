/**
 * Import function triggers from their respective submodules:
 *
 * Writing functions using TypeScript:
 * @link https://firebase.google.com/docs/functions/typescript
 */

import vision from '@google-cloud/vision'
import { initializeApp } from 'firebase-admin/app'
import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'

/**
 * Initiate Services outside of the function.
 */
// Create a Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient()

// Initialize Firebase Admin
initializeApp()

/**
 * Callable function.
 * Function to moderate an image url using Google Cloud Vision API SafeSearch.
 *
 * See CORS settings:
 * @link https://firebase.google.com/docs/functions/callable?gen=2nd
 */
export const moderateImageUrl = onCall(
    // {
    //     cors: [
    //         // /firebase\.com$/,
    //         // "flutter.com",
    //         'localhost:3000',
    //         'soopanova.app',
    //         'vercel.app'
    //     ],
    //     enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
    // },
    async (request) => {
        logger.log('Cloud Function has executed onCall', request)

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

            // Return Cloud Vision SafeSearch Detections
            return {
                status: 'ok',
                message: 'Cloud Vision SafeSearch moderation completed',
                detections: {
                    adult: `${detections.adult}`,
                    racy: `${detections.racy}`,
                    violence: `${detections.violence}`
                }
            }
        } catch (error) {
            logger.error('Error: Cloud Vision SafeSearch error', error)

            return {
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
 */
export const onOrderCreated = onDocumentCreated(
    'customers/{userId}/orders/{orderId}',
    async (event) => {
        logger.info('Cloud Function has executed onDocumentCreated', event)

        // Set baseUrl - hardcode for now
        // const baseUrl = 'https://soopanova.app'

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

        // try {
        //     const emailNotification = await fetch(
        //         `${baseUrl}/api/resend/notification`,
        //         {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(order)
        //         }
        //     )

        //     if (!emailNotification.ok) {
        //         throw new Error('Email notification failed.')
        //     }

        //     return logger.info(
        //         'Email notification sent successfully.',
        //         emailNotification
        //     )
        // } catch (error) {
        //     let message = 'Something went wrong.'
        //     if (error instanceof Error) message = error.message
        //     console.error(message, error)
        // }
    }
)
