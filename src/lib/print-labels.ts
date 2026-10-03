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
 * Option values in the order of optionValueLabels; unknown ones go last
 */
export const sortOptionValues = (name: string, values: string[]) => {
    const order = Object.keys(optionValueLabels[name] ?? {})
    const rank = (value: string) =>
        order.includes(value) ? order.indexOf(value) : order.length

    return [...values].sort((a, b) => rank(a) - rank(b))
}

/**
 * An option value's label, e.g. 'MirrorWrap' → 'Mirror wrap'; unknown values
 * are capitalised
 */
export const optionLabel = (name: string, value: string) =>
    optionValueLabels[name]?.[value] ??
    value.charAt(0).toUpperCase() + value.slice(1)

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
