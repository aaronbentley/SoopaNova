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
 * How to count an option's values ('8 frame colours')
 */
export const optionCountNames: Record<string, string> = {
    color: 'frame colours',
    wrap: 'edge finishes'
}

/**
 * Labels for option values, in the order they're shown. Use Prodigi's names
 * for them (their product pages), so we describe what's actually made.
 */
export const optionValueLabels: Record<string, Record<string, string>> = {
    color: {
        black: 'Black',
        white: 'White',
        natural: 'Natural',
        brown: 'Brown',
        silver: 'Antique silver',
        gold: 'Antique gold',
        'dark grey': 'Dark grey',
        'light grey': 'Light grey'
    },
    wrap: {
        MirrorWrap: 'Mirror wrap',
        ImageWrap: 'Image wrap',
        White: 'White edge',
        Black: 'Black edge'
    }
}

export const wrapDescriptions: Record<string, string> = {
    MirrorWrap:
        'The edge of your screenshot is repeated on the sides, so all of it stays on the front',
    ImageWrap:
        'Your screenshot wraps round the sides, so its outer edge is on the sides, not the front',
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
