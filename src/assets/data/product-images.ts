import type { ProductTypeId } from '@/assets/data/pricing'
import canvasPrint from '@/assets/img/canvas-print-4x3.jpg'
import framedPrint from '@/assets/img/framed-print-4x3.jpg'
import posterPrint from '@/assets/img/poster-print-4x3.jpg'
import heroPrint from '@/assets/img/poster-print-3x2.jpg'
import type { StaticImageData } from 'next/image'

/**
 * Photos for the homepage product cards, null until there's one (a
 * placeholder is shown instead)
 */
export const productImages: Record<ProductTypeId, StaticImageData | null> = {
    'art-print': posterPrint,
    canvas: canvasPrint,
    'framed-print': framedPrint,
    'framed-canvas': null
}

/**
 * The homepage hero shows a larger crop of the art print photo
 */
export const heroImage = heroPrint
