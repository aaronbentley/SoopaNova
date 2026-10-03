import type { ProductTypeId } from '@/assets/data/pricing'

/**
 * The product preselected when the print options sheet opens
 */
export const defaultProductType: ProductTypeId = 'framed-print'

/**
 * Names for Prodigi's option attributes and their values. Anything missing
 * (e.g. a colour Prodigi adds later) falls back to the raw value.
 */
export const optionNames: Record<string, string> = {
    color: 'Frame colour',
    wrap: 'Canvas edges'
}

/**
 * Labels for option values, in the order they're shown
 */
export const optionValueLabels: Record<string, Record<string, string>> = {
    color: {
        black: 'Black',
        white: 'White',
        natural: 'Natural',
        brown: 'Brown',
        silver: 'Silver',
        gold: 'Gold',
        'dark grey': 'Dark grey',
        'light grey': 'Light grey'
    },
    wrap: {
        MirrorWrap: 'Mirrored',
        ImageWrap: 'Image wrap',
        White: 'White',
        Black: 'Black'
    }
}

export const wrapDescriptions: Record<string, string> = {
    MirrorWrap:
        'The edges mirror your screenshot, so all of it stays on the front',
    ImageWrap:
        'Your screenshot wraps round the sides, so its outer edge is on the sides',
    Black: 'Plain black edges',
    White: 'Plain white edges'
}

/**
 * Frame swatch colours. These stand for physical frames, not the site
 * theme, so they're fixed colours rather than theme tokens.
 */
export const frameSwatches: Record<string, string> = {
    black: '#1c1c1c',
    white: '#f4f4f2',
    natural: '#d3b58e',
    brown: '#5b3a24',
    silver: '#b9bdc3',
    gold: '#c8a24e',
    'dark grey': '#4b4b4d',
    'light grey': '#a9a9ab'
}

/**
 * Preselected options, when the product offers them
 */
export const defaultOptions: Record<string, string> = {
    color: 'black',
    wrap: 'MirrorWrap'
}

/**
 * How far an image-wrapped canvas wraps round each side (38mm)
 */
export const wrapDepthInches = 1.5
