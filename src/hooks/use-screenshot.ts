'use client'

import { getAspectRatio } from '@/lib/utils'
import { ImageMeta } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

/**
 * Minimum screenshot dimensions for a print
 */
export const imageMinWidth = parseInt(process.env.NEXT_PUBLIC_MIN_IMAGE_WIDTH!)
export const imageMinHeight = parseInt(
    process.env.NEXT_PUBLIC_MIN_IMAGE_HEIGHT!
)

/**
 * Read an image's dimensions from its object url
 */
const readImageMeta = (url: string) =>
    new Promise<ImageMeta>((resolve, reject) => {
        const image = new window.Image()

        image.onload = () =>
            resolve({
                width: image.naturalWidth,
                height: image.naturalHeight,
                aspectRatio: getAspectRatio(
                    image.naturalWidth,
                    image.naturalHeight
                )
            })
        image.onerror = reject
        image.src = url
    })

/**
 * Manage the selected screenshot: the file, its preview url, and its
 * dimensions. A screenshot is only selected once its dimensions are known
 * and big enough to print.
 */
export const useScreenshot = () => {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [meta, setMeta] = useState<ImageMeta | null>(null)

    /**
     * Revoke the preview url when it changes or the component unmounts
     */
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl])

    /**
     * Select a new screenshot. Resolves to the file and its dimensions, or
     * null (with an error toast) when it can't be read or is too small.
     */
    const select = useCallback(async (selected: File) => {
        const url = URL.createObjectURL(selected)
        const imageMeta = await readImageMeta(url).catch(() => null)

        if (!imageMeta) {
            URL.revokeObjectURL(url)
            toast.error("We couldn't read that image", {
                description: 'Please try a JPG or PNG screenshot.'
            })
            return null
        }

        if (
            imageMeta.width < imageMinWidth ||
            imageMeta.height < imageMinHeight
        ) {
            URL.revokeObjectURL(url)
            toast.error('Screenshot too small!', {
                description: `Screenshots need to be at least ${imageMinWidth}×${imageMinHeight}px to print well. This one is ${imageMeta.width}×${imageMeta.height}px.`
            })
            return null
        }

        setFile(selected)
        setPreviewUrl(url)
        setMeta(imageMeta)

        return { file: selected, meta: imageMeta }
    }, [])

    /**
     * Clear the selected screenshot
     */
    const clear = useCallback(() => {
        setFile(null)
        setPreviewUrl(null)
        setMeta(null)
    }, [])

    return { file, previewUrl, meta, select, clear }
}
