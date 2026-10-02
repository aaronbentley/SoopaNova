import 'server-only'

import { storageBucket } from '@/lib/firebase-admin'

/**
 * Uploads are named `{uuid}--{userId}--{filename}` at the bucket root
 */
export const isOwnUpload = (fileName: string, userId: string) => {
    const [uuid, owner, name] = fileName.split('--')

    return (
        /^[0-9a-f-]{36}$/.test(uuid) &&
        owner === userId &&
        !!name &&
        !fileName.includes('/')
    )
}

/**
 * Whether an upload exists and passed moderation. Only the moderateImageUrl
 * Cloud Function can set the `moderation` metadata (see storage.rules).
 */
export const isApprovedUpload = async (fileName: string) => {
    const [metadata] = await storageBucket
        .file(fileName)
        .getMetadata()
        .catch(() => [null])

    return metadata?.metadata?.moderation === 'passed'
}

/**
 * A signed link to read a file in the uploads bucket (signed locally with
 * the service account key, so no request is made)
 */
export const getSignedReadUrl = async (
    path: string,
    expiresInMinutes: number
) => {
    const [url] = await storageBucket.file(path).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000
    })

    return url
}

/**
 * A short-lived link to an upload's thumbnail, made by moderateImageUrl at
 * `thumbnails/{name}.webp` (functions/src/images.ts). Null if there isn't
 * one, e.g. for uploads moderated before thumbnails existed.
 */
export const getThumbnailUrl = async (
    fileName: string,
    expiresInMinutes = 120
) => {
    const path = `thumbnails/${fileName}.webp`
    const [exists] = await storageBucket
        .file(path)
        .exists()
        .catch(() => [false])

    if (!exists) return null

    return getSignedReadUrl(path, expiresInMinutes)
}
