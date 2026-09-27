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
 * Manage the selected screenshot: the file, its preview url, and its
 * dimensions (read once the preview image loads).
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
     * Select a new screenshot
     */
    const select = useCallback((file: File) => {
        setFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setMeta(null)
    }, [])

    /**
     * Clear the selected screenshot
     */
    const clear = useCallback(() => {
        setFile(null)
        setPreviewUrl(null)
        setMeta(null)
    }, [])

    /**
     * Read the screenshot dimensions from the loaded preview image
     */
    const onImageLoad = useCallback(
        (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const { naturalWidth, naturalHeight } = event.currentTarget

            if (
                naturalWidth < imageMinWidth ||
                naturalHeight < imageMinHeight
            ) {
                toast.error('Screenshot too small!', {
                    description: `Minimum dimensions are ${imageMinWidth}px width and minimum ${imageMinHeight}px height.`
                })
            }

            setMeta({
                width: naturalWidth,
                height: naturalHeight,
                aspectRatio: getAspectRatio(naturalWidth, naturalHeight)
            })
        },
        []
    )

    /**
     * Whether the screenshot is below the minimum print dimensions
     */
    const isTooSmall =
        meta !== null &&
        (meta.width < imageMinWidth || meta.height < imageMinHeight)

    return { file, previewUrl, meta, isTooSmall, select, clear, onImageLoad }
}
