import type { ProductTypeId } from '@/assets/data/pricing'
import { getSizeRange } from '@/lib/pricing'
import { formatInches } from '@/lib/print-quality'

/**
 * Customer-facing copy for each product, used by the homepage and the print
 * options sheet. Names, sizes and prices come from pricing.ts.
 *
 * Every claim here should match Prodigi's spec for the SKU (their product
 * API and product pages): check before adding one. Notably, canvases come
 * without hanging fixings, so they aren't "ready to hang".
 */
export const productCopy: Record<
    ProductTypeId,
    { description: string; tags: string[] }
> = {
    'art-print': {
        description:
            'Giclée printed with pigment inks on 200gsm enhanced matte art paper, for crisp detail with no glare. Unframed, and posted rolled.',
        tags: ['200gsm', 'Matte', 'Giclée']
    },
    canvas: {
        description:
            'Printed on 400gsm artist-grade canvas and hand-stretched over 38mm pine bars. Choose how the edges wrap, then hang it on a nail or screw.',
        tags: ['400gsm canvas', '38mm deep', 'Hand-stretched']
    },
    'framed-print': {
        description:
            'Our 200gsm matte art print in a solid wood frame with a satin finish, behind perspex. Delivered framed and ready to hang.',
        tags: ['Solid wood', 'Perspex', 'Ready to hang']
    },
    'framed-canvas': {
        description:
            'Our 38mm stretched canvas, set in a slim wooden float frame with a small gap all round, so it looks like it’s floating. Hangs on a nail or screw.',
        tags: ['400gsm canvas', 'Float frame', 'Wood']
    }
}

const { smallest, largest } = getSizeRange()

/**
 * The sizes on offer, from pricing.ts ('14 × 24″ to 28 × 48″'). What's sold
 * varies by product and delivery region.
 */
export const sizeRange = `${formatInches(smallest)} to ${formatInches(largest)}`
