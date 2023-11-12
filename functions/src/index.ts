/**
 * Import function triggers from their respective submodules:
 *
 * Writing functions using TypeScript:
 * @link https://firebase.google.com/docs/functions/typescript
 */

import vision from '@google-cloud/vision'
import { initializeApp } from 'firebase-admin/app'
// import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onCall } from 'firebase-functions/v2/https'
// import { onObjectFinalized } from 'firebase-functions/v2/storage'

/**
 * Initiate Services outside of the function.
 */
// Create a Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient()

// Initialize Firebase Admin
initializeApp()

// Initialize Firestore
// const firestore = getFirestore()

/**
 * Define firestore contstants
 */
// const contentModerationCollection = 'content-moderation'
// const filesCollection = 'files'
// const documentNameSeparator = '--'

/**
 * Firebase Storage Triggered Function.
 * Use Google Cloud Vison API SafeSearch to moderate images uploaded to Cloud Storage.
 */
// export const moderateUserImageUpload = onObjectFinalized(async (event) => {
//     // Storage bucket containing the file
//     const fileBucket = event.data.bucket

//     // File path in the bucket
//     const filePath = event.data.name

//     // File content type
//     const contentType = event.data.contentType

//     // Debug info
//     logger.log('Cloud Function has executed on Storage upload', {
//         fileBucket,
//         filePath,
//         contentType
//     })

//     // Exit if this is triggered on a file that is not an image
//     if (contentType && !contentType.startsWith('image/')) {
//         return logger.error('Error: file is not an image.')
//     }

//     try {
//         // Performs safe search property detection on the remote file
//         const [result] = await visionClient.safeSearchDetection(
//             `gs://${fileBucket}/${filePath}`
//         )

//         // Get Cloud Vision API SafeSearch detections
//         const detections = result.safeSearchAnnotation

//         // Bail if detections is null or undefined
//         if (!detections) {
//             logger.warn('Warning: No detections found.', detections)
//             return
//         }

//         logger.info('Cloud Vision SafeSearch Detections:', {
//             adult: `${detections.adult}`,
//             racy: `${detections.racy}`,
//             violence: `${detections.violence}`
//         })

//         /**
//          * Write Cloud Vision SafeSearch Detections to Firestore
//          */
//         try {
//             // Get userId from filePath string (pattern: <uuid>--<userId>--<fileName>)
//             const [uuid, userId, fileName] = filePath.split(
//                 documentNameSeparator
//             )

//             // Write to firestore collection
//             firestore
//                 .collection(contentModerationCollection)
//                 .doc(userId)
//                 .collection(filesCollection)
//                 .doc(`${uuid}--${fileName}`)
//                 .set({
//                     adult: `${detections.adult}`,
//                     racy: `${detections.racy}`,
//                     violence: `${detections.violence}`
//                 })
//         } catch (error) {
//             logger.error(
//                 'Error: Writing Cloud Vision SafeSearch Detections to Firestore',
//                 error
//             )
//         } finally {
//             logger.info(
//                 'OK - Saved Cloud Vision SafeSearch file detections to Firestore.'
//             )
//         }
//     } catch (error) {
//         logger.error('Error: Cloud Vision SafeSearch error', error)
//     } finally {
//         logger.info('OK - Cloud Vision SafeSearch completed.')
//     }
// })

/**
 * Callable function.
 * Callable function to moderate an image url using Google Cloud Vision API SafeSearch.
 */
export const moderateImageUrl = onCall(
    // { cors: [/firebase\.com$/, "flutter.com"] }, // https://firebase.google.com/docs/functions/callable?gen=2nd
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
