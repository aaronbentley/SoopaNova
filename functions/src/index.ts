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
        // Hardcode the notification destination email address for now
        // const notificationInbox = 'aaronbentley@me.com'

        // Hardcode the Resend API key for now
        // const resend_api_key = 're_5LbNDjCq_CNkGN67RzuGPtZoG7DWa5yoD'
        // Create a Resend instance
        // const resend = new Resend(resend_api_key)

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
            id: snapshot.id,
            'Created At': data.createdAt || 'not specified',
            'Product Type': data.productType || 'not specified',
            'Product Width': data.productWidth || 'not specified',
            'Product Height': data.productHeight || 'not specified',
            'Product Frame': data.productFrame || 'none',
            'Product Edge': data.productEdge || 'none',
            'Product Price': data.productPrice || 'not specified',
            'Order Markup Rate': data.orderMarkupRate || 'not specified',
            'Order Markup Profit': data.orderMarkupProfit || 'not specified'
        }

        // build html email
        // const html = `
        //     <h1>Order Created</h1>
        //     <hr />
        //     <p>Order ID: ${order.id}</p>
        //     <p>Created At: ${order['Created At']}</p>
        //     <p>Product Type: ${order['Product Type']}</p>
        //     <p>Product Width: ${order['Product Width']}</p>
        //     <p>Product Height: ${order['Product Height']}</p>
        //     <p>Product Frame: ${order['Product Frame']}</p>
        //     <p>Product Edge: ${order['Product Edge']}</p>
        //     <p>Product Price ($): ${order['Product Price']}</p>
        //     <p>Order Markup Rate (%): ${order['Order Markup Rate']}</p>
        //     <p>Order Markup Profit ($): ${order['Order Markup Profit']}</p>
        //     <hr />
        // `

        try {
            // Send email
            // const { data, error } = await resend.emails.send({
            //     from: 'Soopanova <notifications@soopanova.app>',
            //     to: [notificationInbox],
            //     subject: 'Order Created',
            //     html: html
            // })

            // if (error) {
            //     throw new Error(error.message)
            // }

            // logger.info('OK - Order Created email sent.', data)

            logger.info('OK', order)
        } catch (error) {
            let message = 'Something went wrong.'
            if (error instanceof Error) message = error.message
            console.error(message, error)
        }
    }
)
