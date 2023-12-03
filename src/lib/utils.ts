import { clsx, type ClassValue } from 'clsx'
import { format, fromUnixTime } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

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
            ? accurateSizes[i] ?? 'Bytest'
            : sizes[i] ?? 'Bytes'
    }`
}

export const getAspectRatio = (width: number, height: number) => {
    const gcd = (a: number, b: number): number => {
        if (b === 0) return a
        return gcd(b, a % b)
    }

    const divisor = gcd(width, height)
    return `${width / divisor}:${height / divisor}`
}

export const getDateFromUnixTimestamp = (timestamp: number) => {
    if (!timestamp) throw new Error('Timestamp is required')
    const fileDate = fromUnixTime(timestamp / 1000)
    return format(fileDate, 'dd MMM yyyy')
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}
