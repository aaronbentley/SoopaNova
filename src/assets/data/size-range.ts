import { getSizeRange } from '@/lib/pricing'
import { formatInches } from '@/lib/print-quality'

const { smallest, largest } = getSizeRange()

/**
 * The sizes on offer, from pricing.ts ('14 × 24″ to 28 × 48″'). What's sold
 * varies by product and delivery region.
 */
export const sizeRange = `${formatInches(smallest)} to ${formatInches(largest)}`
