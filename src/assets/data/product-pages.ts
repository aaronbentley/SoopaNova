import type { ProductTypeId } from '@/assets/data/pricing'

/**
 * The longer copy on each product's page (/prints/[product]/). The short
 * description and tags are in products.ts; names, sizes and prices in
 * pricing.ts; options (frame colours, edges) come from the catalogue.
 *
 * Written from Prodigi's product pages and API for each SKU. Check a claim
 * there before adding one, and leave out what we don't sell (mounts, other
 * papers, glass glazing, metallic canvas).
 */
/**
 * The rows of the /prints comparison, in order
 */
export const compareRows = {
    material: 'Material',
    frame: 'Frame',
    glazing: 'Glazing',
    depth: 'Depth from wall',
    hanging: 'Hanging',
    delivered: 'Delivered in'
}

export type CompareRow = keyof typeof compareRows

export const productPages: Record<
    ProductTypeId,
    {
        intro: string[]
        features: string[]
        specs: { label: string; value: string }[]
        /** Who it suits, on /prints */
        bestFor: string
        /** Its column in the /prints comparison (rows in compareRows) */
        compare: Record<CompareRow, string>
    }
> = {
    'art-print': {
        intro: [
            'A heavyweight 200gsm fine art paper with a smooth, natural white surface. Your screenshot is giclée printed with pigment-based archival inks, for smooth gradients, rich colour and detail that stays crisp up close.',
            'The matte finish doesn’t reflect light, so your print looks good from any angle. It arrives unframed and rolled, ready for a frame or poster hanger of your choice.'
        ],
        features: [
            'Heavyweight 200gsm fine art paper',
            'Smooth matte finish with no glare',
            'Giclée printed with pigment-based archival inks',
            'Won’t fade when displayed indoors',
            'Posted rolled, ready to frame'
        ],
        bestFor: 'You’d like to choose your own frame or poster hanger.',
        compare: {
            material: '200gsm matte art paper',
            frame: 'None',
            glazing: 'None',
            depth: 'Flat',
            hanging: 'Frame it or use a poster hanger',
            delivered: 'Rolled'
        },
        specs: [
            { label: 'Paper', value: 'Enhanced matte art paper, 200gsm' },
            { label: 'Finish', value: 'Smooth matte, natural white' },
            {
                label: 'Printing',
                value: 'Giclée, with pigment-based archival inks'
            },
            { label: 'Frame', value: 'None: it arrives unframed' },
            { label: 'Delivered', value: 'Rolled' }
        ]
    },
    canvas: {
        intro: [
            'Your screenshot printed on heavyweight 400gsm artist-grade canvas. The fine woven texture brings out subtle detail and depth, and gives your print a rich, tactile finish.',
            'Each canvas is hand-stretched over 38mm kiln-dried pine bars, with crisp edges and neat folded corners. Choose how the edges are finished, then hang it on a single nail or screw.'
        ],
        features: [
            '400gsm artist-grade canvas',
            'Hand-stretched over 38mm kiln-dried pine bars',
            'Four ways to finish the edges',
            'Up to 200 years display permanence',
            'Posted in a double-walled box'
        ],
        bestFor:
            'You want a frameless, textured look with depth, and to choose how the edges are finished.',
        compare: {
            material: '400gsm artist-grade canvas',
            frame: 'None: stretched over 38mm pine bars',
            glazing: 'None',
            depth: '38mm',
            hanging: 'On a nail or screw (no fixings included)',
            delivered: 'Double-walled cardboard box'
        },
        specs: [
            { label: 'Canvas', value: '400gsm artist-grade canvas' },
            { label: 'Depth', value: '38mm' },
            {
                label: 'Stretcher bars',
                value: 'Kiln-dried knotless pine, hand-stretched'
            },
            {
                label: 'Display life',
                value: 'Up to 200 years display permanence'
            },
            {
                label: 'Hanging',
                value: 'No fixings included: it hangs on a nail or screw'
            },
            { label: 'Delivered', value: 'In a double-walled cardboard box' }
        ]
    },
    'framed-print': {
        intro: [
            'A classic: our 200gsm matte art print in a solid wood frame with a smooth satin finish, glazed with perspex.',
            'There’s no mount, so your screenshot fills the frame. It arrives framed with a hanger already fitted, ready to go straight on the wall.'
        ],
        features: [
            'Solid wood frame with a satin finish',
            'Perspex glazing',
            'No mount: your screenshot fills the frame',
            'Giclée printed on 200gsm matte art paper',
            'Delivered framed and ready to hang'
        ],
        bestFor:
            'You want it on the wall the day it arrives, in a frame colour to suit your room.',
        compare: {
            material: '200gsm matte art paper',
            frame: 'Solid wood, satin finish',
            glazing: 'Perspex',
            depth: '22mm',
            hanging: 'Hanger fitted, ready to hang',
            delivered: 'Rigid box made from recycled cardboard'
        },
        specs: [
            { label: 'Frame', value: 'Solid wood, satin finish' },
            { label: 'Frame width', value: '20mm' },
            { label: 'Depth from wall', value: '22mm' },
            { label: 'Glazing', value: 'Perspex' },
            { label: 'Mount', value: 'None' },
            {
                label: 'Print',
                value: 'Enhanced matte art paper, 200gsm, giclée printed'
            },
            { label: 'Hanging', value: 'Hanger fitted, ready to hang' },
            {
                label: 'Delivered',
                value: 'In a rigid box made from recycled cardboard'
            }
        ]
    },
    'framed-canvas': {
        intro: [
            'Our 38mm stretched canvas, set in a slim wooden float frame. The frame sits just away from the canvas, leaving a narrow shadow gap that makes it look like it’s floating.',
            'It’s printed on the same 400gsm artist-grade canvas as our canvas, with your choice of edge finish and frame colour. Hang it on a single nail or screw.'
        ],
        features: [
            '400gsm artist-grade canvas, 38mm deep',
            'Slim wooden float frame with a 5mm shadow gap',
            'Four ways to finish the edges',
            'Up to 200 years display permanence',
            'Posted in a sturdy cardboard box'
        ],
        bestFor:
            'You love the texture of canvas but want a finished, gallery-style frame around it.',
        compare: {
            material: '400gsm artist-grade canvas',
            frame: 'Wooden float frame, 5mm shadow gap',
            glazing: 'None',
            depth: '53mm',
            hanging: 'On a nail or screw (no fixings included)',
            delivered: 'Sturdy cardboard box'
        },
        specs: [
            { label: 'Canvas', value: '400gsm artist-grade canvas, 38mm deep' },
            { label: 'Frame', value: 'Wooden float frame' },
            {
                label: 'Frame width',
                value: '12mm, with a 5mm gap around the canvas'
            },
            { label: 'Depth from wall', value: '53mm' },
            {
                label: 'Display life',
                value: 'Up to 200 years display permanence'
            },
            {
                label: 'Hanging',
                value: 'No fixings included: it hangs on a nail or screw'
            },
            { label: 'Delivered', value: 'In a sturdy cardboard box' }
        ]
    }
}

/**
 * Care advice for every product (from Prodigi's care instructions)
 */
export const careNote =
    'Hang your print out of direct sunlight and away from radiators, fires and damp. To clean it, gently brush off any dust with a soft, dry brush: no water or cleaning products.'
