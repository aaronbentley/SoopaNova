/**
 * Import function triggers from their respective submodules:
 *
 * See a full list of supported triggers:
 * @link https://firebase.google.com/docs/functions
 *
 * Start writing functions
 * @link https://firebase.google.com/docs/functions/typescript
 */

import vision from '@google-cloud/vision'
import { logger } from 'firebase-functions'
import { onObjectFinalized } from 'firebase-functions/v2/storage'

// Create a Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient()

/**
 * Use Google Cloud Vison API SafeSearch to moderate images uploaded to Cloud Storage.
 */
export const moderateUserImageUpload = onObjectFinalized(async (event) => {
    // Degub
    // logger.log('Event Data:', event)

    // Storage bucket containing the file
    const fileBucket = event.data.bucket

    // File path in the bucket
    const filePath = event.data.name

    // File content type
    const contentType = event.data.contentType

    // Debug info
    logger.log('Cloud Function has executed on Storage upload', {
        fileBucket,
        filePath,
        contentType
    })

    // Exit if this is triggered on a file that is not an image
    if (contentType && !contentType.startsWith('image/')) {
        return logger.error('Error: file is not an image.')
    }

    // Create a Cloud Vision client
    // const visionClient = new vision.ImageAnnotatorClient()

    try {
        // Performs safe search property detection on the remote file
        const [result] = await visionClient.safeSearchDetection(
            `gs://${fileBucket}/${filePath}`
        )

        // Get Cloud Vision API SafeSearch detections
        const detections = result.safeSearchAnnotation

        // Bail if detections is null or undefined
        if (!detections) {
            logger.warn('Warning: No detections found.', detections)
            return
        }

        logger.info('Cloud Vision SafeSearch Detections:', {
            adult: `${detections.adult}`,
            spoof: `${detections.spoof}`,
            medical: `${detections.medical}`,
            violence: `${detections.violence}`
        })
    } catch (error) {
        logger.error('Error: Cloud Vision SafeSearch error', error)
    }

    /**
     * TODO: Write Cloud Vision SafeSearch Detections to Firestore
     */

    /**
     * Write Cloud Vision SafeSearch Detections to the image metadata in Cloud Storage
     */
    // try {
    //     // Get a ref to the image in Storage
    //     const imageRef = ref(getStorage(), filePath)

    //     // Get the image metadata
    //     const metadata = await getMetadata(imageRef)

    //     // Build new metadata
    //     const newCustomMetadata = {
    //         ...metadata.customMetadata,
    //         adult: `${detections.adult}`,
    //         spoof: `${detections.spoof}`,
    //         medical: `${detections.medical}`,
    //         violence: `${detections.violence}`
    //     }

    //     await updateMetadata(ref(imageRef), {
    //         customMetadata: {
    //             ...metadata.customMetadata,
    //             ...newCustomMetadata
    //         }
    //     })

    //     // Check for updated metadata
    //     const updatedMetadata = await getMetadata(imageRef)
    //     logger.log('Updated Metadata:', updatedMetadata)
    // } catch (error) {
    //     logger.error('Error: Could not update metadata.', error)
    // }

    logger.info('OK - Image moderation complete.')
})
