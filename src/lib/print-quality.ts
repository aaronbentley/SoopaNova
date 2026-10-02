import type { ImageMeta } from '@/types'

export type PrintQuality = 'great' | 'good' | 'ok' | 'low'

/**
 * Pixels per inch for each grade. Below `ok` a print looks noticeably soft,
 * so those sizes can't be ordered.
 */
export const qualityThresholds = { great: 150, good: 100, ok: 75 }

export const qualityLabels: Record<PrintQuality, string> = {
    great: 'Great',
    good: 'Good',
    ok: 'OK',
    low: 'Too low'
}

/**
 * A size like '14x24' as [width, height] in inches
 */
export const parseSize = (size: string) =>
    size.split('x').map(Number) as [number, number]

/**
 * A size as the screenshot is oriented: long edge first for landscape
 * screenshots (Prodigi rotates the print to match), in inches and cm
 */
export const formatSize = (size: string, meta: ImageMeta) => {
    const [a, b] = parseSize(size)
    const [long, short] = [Math.max(a, b), Math.min(a, b)]
    const [width, height] =
        meta.width >= meta.height ? [long, short] : [short, long]
    const cm = (inches: number) => Math.round(inches * 2.54)

    return {
        width,
        height,
        inches: `${width} × ${height}″`,
        cm: `${cm(width)} × ${cm(height)} cm`,
        aspectRatio: `${width} / ${height}`
    }
}

/**
 * Pixels per inch the screenshot gives at a size. Prodigi crops it from the
 * centre to fill the print, so the tighter of the two edges sets it.
 */
export const getPrintDpi = (meta: ImageMeta, size: string) => {
    const [a, b] = parseSize(size)
    const imageLong = Math.max(meta.width, meta.height)
    const imageShort = Math.min(meta.width, meta.height)

    return Math.min(imageLong / Math.max(a, b), imageShort / Math.min(a, b))
}

export const getPrintQuality = (dpi: number): PrintQuality => {
    if (dpi >= qualityThresholds.great) return 'great'
    if (dpi >= qualityThresholds.good) return 'good'
    if (dpi >= qualityThresholds.ok) return 'ok'
    return 'low'
}
