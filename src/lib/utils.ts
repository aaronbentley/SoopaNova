import { clsx, type ClassValue } from 'clsx'
import { format, fromUnixTime } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

/**
 * Formats bytes into a human-readable string with optional accuracy.
 * @param bytes - The number of bytes to format.
 * @param decimals - The number of decimal places to include.
 * @param sizeType - Whether to use accurate (binary) or normal (decimal) units.
 * @returns A human-readable string representing the formatted bytes.
 */
export const formatBytes = (
    bytes: number,
    decimals = 0,
    sizeType: 'accurate' | 'normal' = 'normal'
) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
    if (bytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
        sizeType === 'accurate'
            ? (accurateSizes[i] ?? 'Bytes')
            : (sizes[i] ?? 'Bytes')
    }`
}

/**
 * Calculates the aspect ratio of an image given its width and height.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @returns The aspect ratio in the format "width:height".
 */
export const getAspectRatio = (width: number, height: number) => {
    const gcd = (a: number, b: number): number => {
        if (b === 0) return a
        return gcd(b, a % b)
    }

    const divisor = gcd(width, height)
    return `${width / divisor}:${height / divisor}`
}

/**
 * Converts a Unix timestamp in milliseconds to a formatted date string.
 * @param timestamp - The Unix timestamp in milliseconds.
 * @returns The formatted date string in the format "dd MMM yyyy".
 */
export const getDateFromUnixTimestamp = (timestamp: number) => {
    if (!timestamp) throw new Error('Timestamp is required')
    const fileDate = fromUnixTime(timestamp / 1000)
    return format(fileDate, 'dd MMM yyyy')
}

/**
 * A nav link is active on its own page and on any page below it (e.g.
 * Screenshots on /screenshots/xbox/). Hrefs end in a slash, so /screenshots/
 * doesn't match /screenshots-foo/.
 */
export const isNavLinkActive = (pathname: string, href: string) =>
    pathname.startsWith(href)
