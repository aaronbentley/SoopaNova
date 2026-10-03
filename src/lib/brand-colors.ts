/**
 * The dark theme's tokens as hex, for images generated outside the page (OG
 * image, icons): Satori and favicon SVGs can't read globals.css, and Satori
 * doesn't understand oklch(). Keep in step with the `.dark` tokens there.
 */
export const brandColors = {
    background: '#0a0a0a',
    foreground: '#fafafa',
    muted: '#a3a3a3',
    border: '#262626',
    primary: '#ec4699'
}

/**
 * A hex colour as rgba() with the given alpha (0–1)
 */
export const withAlpha = (hex: string, alpha: number) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
