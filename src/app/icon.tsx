import { brandColors } from '@/lib/brand-colors'

export const contentType = 'image/svg+xml'

/**
 * The wordmark's pink square on a dark rounded box, as SVG so it's sharp at
 * every size (no `size` export, so the link has no fixed sizes). The square
 * is 3/8 of the box, so it lands on whole pixels at 16px (6px) and 32px
 * (12px). Browsers without SVG favicons (older Safari) use favicon.ico.
 */
const icon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
    <rect width='512' height='512' rx='96' fill='${brandColors.background}'/>
    <rect x='160' y='160' width='192' height='192' fill='${brandColors.primary}'/>
</svg>`

const iconImage = () =>
    new Response(icon, { headers: { 'Content-Type': contentType } })

export default iconImage
