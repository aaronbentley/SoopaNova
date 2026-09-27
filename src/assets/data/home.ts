import canvasPrint from '@/assets/img/canvas-print-4x3.jpg'
import framedPrint from '@/assets/img/framed-print-4x3.jpg'
import posterPrint from '@/assets/img/poster-print-4x3.jpg'
import { PlaystationIcon, SteamIcon, XboxIcon } from '@/components/brand-icons'

/**
 * Homepage content
 */
export const platforms = [
    {
        name: 'Xbox',
        maker: 'Microsoft',
        href: '/screenshots/xbox/',
        Icon: XboxIcon
    },
    {
        name: 'PlayStation',
        maker: 'Sony',
        href: '/screenshots/playstation/',
        Icon: PlaystationIcon
    },
    {
        name: 'Steam',
        maker: 'Valve',
        href: '/screenshots/steam/',
        Icon: SteamIcon
    }
]

export const steps = [
    {
        title: 'Choose type',
        tagline: "Show your 'shot",
        body: 'Choose a Poster, Canvas or Framed Print, add gallery-quality frames if it takes your fancy.'
    },
    {
        title: 'Pick size',
        tagline: 'Go big (or go small)',
        body: 'Everything looks better, bigger. Sizes from 8″×14″ all the way up to 38″×70″.'
    },
    {
        title: "You're done",
        tagline: 'Get back to gaming',
        body: "We'll do the rest, your prints are expertly crafted by hand and delivered to you in a few days."
    }
]

export const products = [
    {
        name: 'Poster Prints',
        price: '$12',
        image: posterPrint,
        body: 'Premium 300gsm matte fine art paper - extremely crisp, accurate detail in tonal range for art prints that make a statement.',
        tags: ['300gsm', 'Matte fine art']
    },
    {
        name: 'Canvas Prints',
        price: '$53',
        image: canvasPrint,
        body: 'The highest quality canvas, UV coated and designed to last with no fading. Museum-quality, expertly crafted, ready to hang.',
        tags: ['UV coated', 'Ready to hang']
    },
    {
        name: 'Framed Prints',
        price: '$73',
        image: framedPrint,
        body: 'All the quality of our Poster Prints with premium solid wood frames and ultra-low glare plexiglass, so your prints get all the attention.',
        tags: ['Solid wood', 'Black · White · Dark brown', 'Low-glare']
    }
]

/**
 * The hero shows the poster print photo (as in the design)
 */
export const heroImage = posterPrint
