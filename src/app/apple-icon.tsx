import { brandColors } from '@/lib/brand-colors'
import { ImageResponse } from 'next/og'

export const size = {
    width: 180,
    height: 180
}

export const contentType = 'image/png'

/**
 * Home screen icon for iOS, which needs a PNG: the favicon's design (see
 * icon.tsx) without the rounded corners, as iOS applies its own mask and
 * would show transparent corners as black
 */
const appleIcon = () =>
    new ImageResponse(
        <div
            tw='flex h-full w-full items-center justify-center'
            style={{ backgroundColor: brandColors.background }}>
            <div
                tw='flex'
                style={{
                    width: 68,
                    height: 68,
                    backgroundColor: brandColors.primary
                }}
            />
        </div>,
        size
    )

export default appleIcon
