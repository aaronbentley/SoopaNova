import { optionNames, optionValueLabels } from '@/assets/data/print-options'
import { parseSize } from '@/lib/print-quality'

/**
 * A print size with the long edge first, e.g. '24 × 14″' (for checkout and
 * orders, where the screenshot's orientation isn't known)
 */
export const formatPrintSize = (size: string) => {
    const [a, b] = parseSize(size)

    return `${Math.max(a, b)} × ${Math.min(a, b)}″`
}

/**
 * Chosen options as text, e.g. 'Frame colour: Black · Canvas edges: Mirror wrap'
 */
export const describeOptions = (options: Record<string, string>) =>
    Object.entries(options)
        .map(
            ([name, value]) =>
                `${optionNames[name] ?? name}: ${optionValueLabels[name]?.[value] ?? value}`
        )
        .join(' · ')
