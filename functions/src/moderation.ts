import vision from '@google-cloud/vision'
import { getStorage } from 'firebase-admin/storage'
import { logger } from 'firebase-functions'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { makeDerivedImages, thumbnailPath } from './images'

/**
 * Cloud Vision client, created once per instance rather than per call
 */
const visionClient = new vision.ImageAnnotatorClient()

/**
 * The upload's Storage name. Clients before October 2026 sent the whole
 * upload result instead (`fileMetadata.name`); both are accepted until the
 * Prodigi re-platform is live.
 */
type ModerationRequest = {
    name?: unknown
    fileMetadata?: { name?: unknown }
}

/**
 * Callable function.
 * Moderates an uploaded image using Google Cloud Vision API SafeSearch.
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
 * Decoding large screenshots needs the extra memory, and each instance takes
 * at most 4 calls at once (image work is CPU-bound on its 1 vCPU, so more
 * only adds decoded images to memory). Failures throw an HttpsError, which
 * the app shows as "couldn't check, try again".
 */
export const moderateImageUrl = onCall<ModerationRequest>(
    { memory: '1GiB', timeoutSeconds: 120, maxInstances: 10, concurrency: 4 },
    async (request) => {
        if (!request.auth) {
            throw new HttpsError('unauthenticated', 'You must be signed in.')
        }

        const name = request.data?.name ?? request.data?.fileMetadata?.name

        /**
         * Only root-level uploads, not thumbnails or anything else
         */
        if (typeof name !== 'string' || !name || name.includes('/')) {
            throw new HttpsError('invalid-argument', 'Invalid file reference.')
        }

        /**
         * Only the caller's own uploads
         */
        const [, fileOwner] = name.split('--')

        if (fileOwner !== request.auth.uid) {
            logger.warn('Upload does not belong to the caller', {
                name,
                uid: request.auth.uid
            })

            throw new HttpsError(
                'permission-denied',
                'You can only moderate your own uploads.'
            )
        }

        const bucket = getStorage().bucket()
        const file = bucket.file(name)

        /**
         * Check it's an image (from its stored metadata, not the caller), then
         * download it once and make a small copy for Cloud Vision plus a
         * thumbnail
         */
        let images: Awaited<ReturnType<typeof makeDerivedImages>>

        try {
            const [metadata] = await file.getMetadata()

            if (
                metadata.contentType &&
                !metadata.contentType.startsWith('image/')
            ) {
                throw new HttpsError(
                    'invalid-argument',
                    'File is not an image.'
                )
            }

            const [original] = await file.download()
            images = await makeDerivedImages(original)
        } catch (error) {
            if (error instanceof HttpsError) throw error

            logger.error('Could not read or resize the upload', { name, error })

            throw new HttpsError(
                'invalid-argument',
                'Could not process the image.'
            )
        }

        /**
         * SafeSearch on the small copy. No result is treated as a failure
         * (try again), not a flag.
         */
        let annotation

        try {
            const [result] = await visionClient.safeSearchDetection({
                image: { content: images.moderationCopy }
            })
            annotation = result.safeSearchAnnotation
        } catch (error) {
            logger.error('Cloud Vision SafeSearch failed', { name, error })

            throw new HttpsError('unavailable', 'Could not check the image.')
        }

        if (!annotation) {
            logger.warn('Cloud Vision returned no SafeSearch result', { name })

            throw new HttpsError('unavailable', 'Could not check the image.')
        }

        const detections = {
            adult: `${annotation.adult}`,
            racy: `${annotation.racy}`,
            violence: `${annotation.violence}`
        }

        /**
         * Only adult content rated VERY_LIKELY is rejected (stricter
         * thresholds false-flag game screenshots)
         */
        const verdict =
            detections.adult === 'VERY_LIKELY' ? 'rejected' : 'passed'

        /**
         * Record the verdict on the file for server routes to check
         */
        await file.setMetadata({ metadata: { moderation: verdict } })

        /**
         * Keep a thumbnail of approved uploads. The bucket's retention policy
         * stops objects being overwritten, so a retry keeps the first one. A
         * missing thumbnail shouldn't fail moderation, so errors are logged.
         */
        if (verdict === 'passed') {
            try {
                const thumbnail = bucket.file(thumbnailPath(name))
                const [exists] = await thumbnail.exists()

                if (!exists) {
                    await thumbnail.save(images.thumbnail, {
                        resumable: false,
                        contentType: 'image/webp',
                        metadata: { metadata: { upload: name } }
                    })
                }
            } catch (error) {
                logger.warn('Could not save the thumbnail', { name, error })
            }
        }

        logger.info('Moderated upload', { name, verdict, ...detections })

        return {
            status: 'ok',
            message: 'Cloud Vision SafeSearch moderation completed',
            verdict,
            detections
        }
    }
)
