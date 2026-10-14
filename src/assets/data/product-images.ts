import type { ProductTypeId } from '@/assets/data/pricing'
import artPrint from '@/assets/img/art-print-4x3.jpg'
import canvas from '@/assets/img/canvas-4x3.jpg'
import framedCanvas from '@/assets/img/framed-canvas-4x3.jpg'
import framedPrint from '@/assets/img/framed-print-4x3.jpg'
import type { StaticImageData } from 'next/image'

/**
 * Photos for the product cards and product pages, null until there's one (a
 * placeholder is shown instead). They're built by `yarn mockups` from the
 * rooms and artwork in design/mockups/.
 */
export const productImages: Record<
    ProductTypeId,
    { image: StaticImageData; alt: string } | null
> = {
    'art-print': {
        image: artPrint,
        alt: 'An unframed art print of a ringed planet seen from a space station, lying on a desk beside a poster tube and a game controller'
    },
    canvas: {
        image: canvas,
        alt: 'A canvas of a giant tree in misty ruins, hanging above a sofa'
    },
    'framed-print': {
        image: framedPrint,
        alt: 'A black framed print of a mountain valley at sunset, hanging above a desk with a monitor and headphones'
    },
    'framed-canvas': {
        image: framedCanvas,
        alt: 'A black float-framed canvas of a neon city street in the rain, hanging above a bed'
    }
}
