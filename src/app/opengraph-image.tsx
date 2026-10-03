import { brandColors, withAlpha } from '@/lib/brand-colors'
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = `${process.env.APP_TITLE!}: ${process.env.APP_DESCRIPTION!}`

export const size = {
    width: 2400,
    height: 1260
}

export const contentType = 'image/png'

/**
 * The homepage hero (dark theme) at 2x, without the buttons
 */
const colors = {
    ...brandColors,
    /** primary at 36% (a touch stronger than the hero's 28%, as cards are
     * shown small), fading to primary at 0%: Satori fades towards black if
     * the end stop is `transparent` */
    glow: withAlpha(brandColors.primary, 0.36),
    glowEnd: withAlpha(brandColors.primary, 0)
}

/**
 * Geist from the `geist` package (Satori needs ttf/otf/woff, not woff2)
 */
const font = (path: string) =>
    readFile(join(process.cwd(), 'node_modules/geist/dist/fonts', path))

const [geistRegular, geistBold, geistMonoMedium] = await Promise.all([
    font('geist-sans/Geist-Regular.ttf'),
    font('geist-sans/Geist-Bold.ttf'),
    font('geist-mono/GeistMono-Medium.ttf')
])

const Arrow = () => (
    <svg
        width={24}
        height={24}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        style={{ opacity: 0.5 }}>
        <path d='M5 12h14' />
        <path d='m12 5 7 7-7 7' />
    </svg>
)

const opengraphImage = async () => {
    return new ImageResponse(
        <div
            tw='flex h-full w-full flex-col items-center justify-center'
            style={{
                position: 'relative',
                backgroundColor: colors.background,
                color: colors.foreground,
                fontFamily: 'Geist'
            }}>
            {/* Grid backdrop, faded out towards the bottom (bg-grid mask-fade-top) */}
            <div
                tw='absolute inset-0 flex'
                style={{
                    backgroundImage: `linear-gradient(${colors.border} 2px, transparent 2px), linear-gradient(90deg, ${colors.border} 2px, transparent 2px)`,
                    backgroundSize: '128px 128px',
                    backgroundPosition: 'center -2px',
                    maskImage:
                        'radial-gradient(ellipse 70% 60% at 50% 0%, #000 20%, transparent 75%)'
                }}
            />
            {/* Pink glow from the top */}
            <div
                tw='absolute flex'
                style={{
                    left: 100,
                    top: -640,
                    width: 2200,
                    height: 1280,
                    backgroundImage: `radial-gradient(ellipse at center, ${colors.glow} 0%, ${colors.glowEnd} 68%)`
                }}
            />

            {/* Pill: Play → Capture → Upload → Print */}
            <div
                tw='flex items-center rounded-full'
                style={{
                    gap: 20,
                    padding: '14px 28px 14px 22px',
                    border: `2px solid ${colors.border}`,
                    backgroundColor: colors.background,
                    color: colors.muted,
                    fontFamily: 'Geist Mono',
                    fontSize: 26,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                }}>
                <div
                    tw='flex'
                    style={{
                        width: 12,
                        height: 12,
                        backgroundColor: colors.primary,
                        boxShadow: `0 0 24px ${colors.primary}`
                    }}
                />
                <div
                    tw='flex items-center'
                    style={{ gap: 16 }}>
                    <span>Play</span>
                    <Arrow />
                    <span>Capture</span>
                    <Arrow />
                    <span>Upload</span>
                    <Arrow />
                    <span style={{ color: colors.foreground }}>Print</span>
                </div>
            </div>

            {/* Heading */}
            <div
                tw='flex flex-col items-center'
                style={{
                    marginTop: 56,
                    fontSize: 240,
                    fontWeight: 700,
                    lineHeight: 0.95,
                    letterSpacing: '-0.055em'
                }}>
                <span>From Pixels</span>
                <span>
                    to Prints
                    <span style={{ color: colors.primary }}>.</span>
                </span>
            </div>

            {/* Description */}
            <div
                tw='flex'
                style={{
                    marginTop: 52,
                    fontSize: 48,
                    lineHeight: 1.5,
                    color: colors.muted
                }}>
                Print your gaming screenshots, preserve your gaming moments.
            </div>

            {/* Wordmark */}
            <div
                tw='absolute flex items-center'
                style={{
                    bottom: 72,
                    gap: 16,
                    fontSize: 40,
                    fontWeight: 700,
                    letterSpacing: '-0.035em'
                }}>
                <div
                    tw='flex'
                    style={{
                        width: 20,
                        height: 20,
                        backgroundColor: colors.primary
                    }}
                />
                {process.env.APP_TITLE!}
            </div>
        </div>,
        {
            ...size,
            fonts: [
                { name: 'Geist', data: geistRegular, weight: 400 },
                { name: 'Geist', data: geistBold, weight: 700 },
                { name: 'Geist Mono', data: geistMonoMedium, weight: 500 }
            ]
        }
    )
}

export default opengraphImage
