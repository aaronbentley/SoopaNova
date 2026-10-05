import sharp from 'sharp'

/**
 * Largest image we'll decode, in pixels (8K is ~33 million). Decoding needs
 * a few bytes per pixel, so this stops a huge capture running the function
 * out of memory.
 */
export const maxInputPixels = 100_000_000

/**
 * Long edge of the copy sent to Cloud Vision, which rejects files over 20MB
 * and doesn't need full resolution for SafeSearch
 */
const moderationSize = 2048

/**
 * Long edge of the thumbnail shown with an order
 */
const thumbnailSize = 480

/**
 * Where an upload's thumbnail is stored. It's outside the root, so the
 * Storage rules don't let clients read or write it, and the uploads
 * bucket's 3-day lifecycle rule cleans it up. An order copies it to the
 * orders bucket.
 */
export const thumbnailPath = (uploadName: string) =>
    `thumbnails/${uploadName}.webp`

/**
 * From the original upload, make a small JPEG for moderation and a WebP
 * thumbnail. Throws if the image can't be decoded or is too large.
 */
export const makeDerivedImages = async (original: Buffer) => {
    const image = sharp(original, { limitInputPixels: maxInputPixels })

    const [moderationCopy, thumbnail] = await Promise.all([
        image
            .clone()
            .resize({
                width: moderationSize,
                height: moderationSize,
                fit: 'inside',
                withoutEnlargement: true
            })
            .flatten({ background: '#ffffff' })
            .jpeg({ quality: 80 })
            .toBuffer(),
        image
            .clone()
            .resize({
                width: thumbnailSize,
                height: thumbnailSize,
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 75 })
            .toBuffer()
    ])

    return { moderationCopy, thumbnail }
}
