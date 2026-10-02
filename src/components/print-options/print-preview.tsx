'use client'

import type { ProductTypeId } from '@/assets/data/pricing'
import { frameSwatches, wrapDepthInches } from '@/assets/data/print-options'
import { formatSize } from '@/lib/print-quality'
import { cn } from '@/lib/utils'
import type { ImageMeta } from '@/types'
import Image from 'next/image'

interface PrintPreviewProps {
    previewUrl: string
    alt: string
    meta: ImageMeta
    productType: ProductTypeId
    size: string | null
    options: Record<string, string>
    /** Shown over the image, e.g. upload status and the details button */
    children?: React.ReactNode
}

/**
 * The screenshot as it'll look from the front: at the chosen size's shape,
 * cropped from the centre like Prodigi crops it (object-cover), in the
 * chosen frame colour. On an image-wrapped canvas the outer edge goes round
 * the sides, so it's zoomed in to show only the front.
 */
const PrintPreview = ({
    previewUrl,
    alt,
    meta,
    productType,
    size,
    options,
    children
}: PrintPreviewProps) => {
    const shape = size ? formatSize(size, meta) : null
    const isFramed =
        productType === 'framed-print' || productType === 'framed-canvas'
    const isCanvas = productType === 'canvas' || productType === 'framed-canvas'
    const frameColor = isFramed
        ? (frameSwatches[options.color] ?? frameSwatches.black)
        : undefined

    /**
     * How far to zoom in so only the front of an image-wrapped canvas shows:
     * the outer wrapDepthInches on each side goes round the sides
     */
    const wrapZoom =
        shape && isCanvas && options.wrap === 'ImageWrap'
            ? Math.max(
                  shape.width / (shape.width - 2 * wrapDepthInches),
                  shape.height / (shape.height - 2 * wrapDepthInches)
              )
            : 1

    return (
        <figure className='flex flex-col items-center gap-4'>
            <div
                style={{
                    backgroundColor: frameColor,
                    padding: frameColor ? '4%' : undefined
                }}
                className={cn(
                    ['relative', 'w-full', 'transition-colors', 'duration-200'],
                    meta.height > meta.width && 'max-w-sm',
                    /** Keeps a black frame visible on the dark theme */
                    frameColor && ['ring-1', 'ring-border'],
                    productType === 'art-print' ? 'shadow-lg' : 'shadow-2xl'
                )}>
                <div
                    className={cn(
                        productType === 'framed-canvas' && [
                            'bg-black/40',
                            'p-[1.5%]'
                        ]
                    )}>
                    <div
                        style={{
                            aspectRatio:
                                shape?.aspectRatio ??
                                `${meta.width} / ${meta.height}`
                        }}
                        className='relative overflow-hidden bg-muted'>
                        <Image
                            src={previewUrl}
                            alt={alt}
                            fill={true}
                            sizes='(min-width: 768px) 60vw, 100vw'
                            style={{ transform: `scale(${wrapZoom})` }}
                            className='object-cover object-center transition-transform duration-200'
                        />
                        {children}
                    </div>
                </div>
            </div>
            <figcaption className='eyebrow text-center text-muted-foreground'>
                {wrapZoom > 1
                    ? 'The outer edge of your screenshot wraps round the sides'
                    : 'Cropped from the centre to fit the print'}
            </figcaption>
        </figure>
    )
}

export default PrintPreview
