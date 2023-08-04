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

// export function isArrayOfFile(files: unknown): files is File[] {
//     const isArray = Array.isArray(files)
//     if (!isArray) return false
//     return files.every((file) => file instanceof File)
// }

// export function catchError(err: unknown) {
//     if (err instanceof z.ZodError) {
//         const errors = err.issues.map((issue) => {
//             return issue.message
//         })
//         return toast(errors.join('\n'))
//     } else if (err instanceof Error) {
//         return toast(err.message)
//     } else {
//         return toast('Something went wrong, please try again later.')
//     }
// }

// export const getImageDimensions = async (file: File) => {
//     return new Promise((resolve, reject) => {
//         const img = new Image()
//         img.onload = () => {
//             resolve({
//                 width: img.width,
//                 height: img.height
//             })
//         }
//         img.onerror = reject
//         img.src = URL.createObjectURL(file)
//     })
// }
