/**
 * Builds the product photos in src/assets/img/ from the room plates and
 * artwork in design/mockups/. Each product is drawn at its real size (a
 * Prodigi size from pricing.ts, at the plate's pixels per cm) with the
 * details product-pages.ts promises: the framed print's 20mm black frame
 * with no mount, the canvas with no frame, the framed canvas's float gap,
 * and the art print unframed. The artwork fills the print area from the
 * centre, like Prodigi's fillPrintArea.
 *
 *   yarn mockups
 *
 * To change a photo's artwork, swap `art` in design/mockups/mockups.json and
 * run it again; the plates don't need regenerating.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

type Light = 'left' | 'right'

type Mockup = {
    kind: 'frame' | 'canvas' | 'paper'
    plate: string
    art: string
    /** Prodigi size in inches, short side first ('20x36') */
    size: string
    /** Centre of the print area on the plate, in pixels */
    centre: [number, number]
    /** The plate's scale where the print hangs or lies */
    pxPerCm: number
    frameCm?: number
    /** Float frame's gap between the frame and the canvas */
    gapCm?: number
    /** How far it stands off the wall, for its shadow */
    depthCm?: number
    /** Perspex sheen */
    glazing?: boolean
    /** Keep dark things on the desk (a controller) on top of the print */
    objectsOnTop?: boolean
    /** Side the room's main light comes from */
    light: Light
    /** How bright the print is in the room (1 = as bright as the wall) */
    exposure: number
    /** Shadow strength */
    shadow: number
}

const root = new URL('../', import.meta.url)
const designDir = new URL('design/mockups/', root)
const outputDir = new URL('src/assets/img/', root)
const [width, height] = [1600, 1200]
const cmPerInch = 2.54

const mockups: Record<string, Mockup> = JSON.parse(
    readFileSync(new URL('mockups.json', designDir), 'utf8')
)

const svg = (body: string) =>
    Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${body}</svg>`
    )

/**
 * Dark things on the desk where the print lies (e.g. a controller resting
 * on its corner), as a layer to put back over the print
 */
const objectsOver = async (plate: Buffer, print: Rect) => {
    const { data, info } = await sharp(plate)
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
    const objects = Buffer.alloc(info.width * info.height * 4)

    for (let y = print.y; y < print.y + print.h; y++) {
        for (let x = print.x; x < print.x + print.w; x++) {
            const i = y * info.width + x
            const [r, g, b] = data.subarray(i * 3, i * 3 + 3)
            const dark = Math.min(Math.max((130 - (r + g + b) / 3) / 50, 0), 1)
            objects.set([r, g, b, Math.round(dark * 255)], i * 4)
        }
    }

    return sharp(objects, {
        raw: { width: info.width, height: info.height, channels: 4 }
    })
        .png()
        .toBuffer()
}

type Rect = { x: number; y: number; w: number; h: number }

/**
 * The room's light across the print: the plate behind it, blurred and
 * scaled so the wall's average brightness leaves the artwork as it is
 */
const lightMap = async (
    plate: Buffer,
    area: { left: number; top: number; width: number; height: number },
    exposure: number,
    /** Brightness only, so a coloured surface doesn't tint the print */
    grey: boolean
) => {
    let region = sharp(plate).extract(area).removeAlpha().blur(60)
    if (grey) region = region.greyscale().toColourspace('srgb')
    const { channels } = await region.clone().stats()
    const mean =
        (channels[0].mean + channels[1].mean + channels[2].mean) / 3 || 1
    return region.linear(Math.min((255 / mean) * exposure, 8), 0).toBuffer()
}

/**
 * A soft gradient along one inside edge of the print (for the frame's
 * shadow on it), as an SVG rect
 */
const edgeShade = (
    id: string,
    side: 'top' | 'left' | 'right',
    x: number,
    y: number,
    w: number,
    h: number,
    size: number,
    opacity: number
) => {
    const vector = {
        top: 'x1="0" y1="0" x2="0" y2="1"',
        left: 'x1="0" y1="0" x2="1" y2="0"',
        right: 'x1="1" y1="0" x2="0" y2="0"'
    }[side]
    const rect = {
        top: [x, y, w, size],
        left: [x, y, size, h],
        right: [x + w - size, y, size, h]
    }[side]
    return `<linearGradient id="${id}" ${vector}><stop offset="0" stop-color="#000" stop-opacity="${opacity}"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
<rect x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" fill="url(#${id})"/>`
}

const compose = async (name: string, mockup: Mockup) => {
    const plate = readFileSync(new URL(mockup.plate, designDir))

    /** The print area, landscape, at the plate's scale */
    const [shortIn, longIn] = mockup.size.split('x').map(Number)
    const printW = Math.round(longIn * cmPerInch * mockup.pxPerCm)
    const printH = Math.round(shortIn * cmPerInch * mockup.pxPerCm)
    const printX = Math.round(mockup.centre[0] - printW / 2)
    const printY = Math.round(mockup.centre[1] - printH / 2)

    const objects = mockup.objectsOnTop
        ? await objectsOver(plate, {
              x: printX,
              y: printY,
              w: printW,
              h: printH
          })
        : undefined

    /** The frame (and float gap) around it */
    const frame = Math.round((mockup.frameCm ?? 0) * mockup.pxPerCm)
    const gap = Math.round((mockup.gapCm ?? 0) * mockup.pxPerCm)
    const border = frame + gap
    const outer = {
        x: printX - border,
        y: printY - border,
        w: printW + border * 2,
        h: printH + border * 2
    }

    /** Its shadow, falling away from the light */
    const depth = (mockup.depthCm ?? 0.15) * mockup.pxPerCm
    const away = mockup.light === 'left' ? 1 : -1
    const shadow =
        svg(`<filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.max(depth * 0.55, 2)}"/></filter>
<rect x="${outer.x + depth * 0.35 * away}" y="${outer.y + depth * 0.55}" width="${outer.w}" height="${outer.h}" fill="#000" fill-opacity="${mockup.shadow}" filter="url(#blur)"/>`)

    /** The frame: satin black, catching the light on one side */
    const lit = mockup.light === 'left' ? 0 : 1
    const frameSvg =
        mockup.kind === 'frame'
            ? svg(`<linearGradient id="satin" x1="${lit}" y1="0" x2="${1 - lit}" y2="1"><stop offset="0" stop-color="#2b2b2b"/><stop offset="1" stop-color="#0d0d0d"/></linearGradient>
<rect x="${outer.x}" y="${outer.y}" width="${outer.w}" height="${outer.h}" fill="url(#satin)"/>
<rect x="${outer.x + 0.5}" y="${outer.y + 0.5}" width="${outer.w - 1}" height="${outer.h - 1}" fill="none" stroke="#fff" stroke-opacity="0.08"/>
<line x1="${outer.x}" y1="${outer.y + 0.5}" x2="${outer.x + outer.w}" y2="${outer.y + 0.5}" stroke="#fff" stroke-opacity="0.16"/>
${gap ? `<rect x="${outer.x + frame}" y="${outer.y + frame}" width="${outer.w - frame * 2}" height="${outer.h - frame * 2}" fill="#050505"/>` : ''}
<rect x="${printX - 0.5}" y="${printY - 0.5}" width="${printW + 1}" height="${printH + 1}" fill="none" stroke="#000" stroke-opacity="0.6"/>`)
            : null

    /** The artwork, filled from the centre and lit like the room */
    const area = { left: printX, top: printY, width: printW, height: printH }
    const art = await sharp(readFileSync(new URL(mockup.art, designDir)))
        .resize(printW, printH, { fit: 'cover', position: 'centre' })
        /** Matte paper and canvas don't reach a true black */
        .linear(0.94, 8)
        .composite([
            {
                input: await lightMap(
                    plate,
                    area,
                    mockup.exposure,
                    mockup.kind === 'paper'
                ),
                blend: 'multiply'
            }
        ])
        .toBuffer()

    /** Finishing touches over the artwork */
    const lightSide = mockup.light === 'left' ? 'left' : 'right'
    const top = svg(
        [
            mockup.kind === 'frame' &&
                edgeShade(
                    't',
                    'top',
                    printX,
                    printY,
                    printW,
                    printH,
                    Math.max(frame * 0.5, 3),
                    0.35
                ),
            mockup.kind === 'frame' &&
                edgeShade(
                    's',
                    lightSide,
                    printX,
                    printY,
                    printW,
                    printH,
                    Math.max(frame * 0.4, 3),
                    0.3
                ),
            mockup.glazing &&
                `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.09"/><stop offset="0.42" stop-color="#fff" stop-opacity="0"/><stop offset="0.62" stop-color="#fff" stop-opacity="0.035"/><stop offset="0.8" stop-color="#fff" stop-opacity="0"/></linearGradient>
<rect x="${printX}" y="${printY}" width="${printW}" height="${printH}" fill="url(#sheen)"/>`,
            mockup.kind === 'canvas' &&
                `<filter id="weave" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/></filter>
<rect x="${printX}" y="${printY}" width="${printW}" height="${printH}" filter="url(#weave)" opacity="0.07"/>
<line x1="${mockup.light === 'left' ? printX + 0.5 : printX + printW - 0.5}" y1="${printY}" x2="${mockup.light === 'left' ? printX + 0.5 : printX + printW - 0.5}" y2="${printY + printH}" stroke="#fff" stroke-opacity="0.25"/>
<line x1="${printX}" y1="${printY + printH - 0.5}" x2="${printX + printW}" y2="${printY + printH - 0.5}" stroke="#000" stroke-opacity="0.35"/>`,
            mockup.kind === 'paper' &&
                `<linearGradient id="paper" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.06"/><stop offset="1" stop-color="#000" stop-opacity="0.05"/></linearGradient>
<rect x="${printX}" y="${printY}" width="${printW}" height="${printH}" fill="url(#paper)"/>
<rect x="${printX + 0.5}" y="${printY + 0.5}" width="${printW - 1}" height="${printH - 1}" fill="none" stroke="#fff" stroke-opacity="0.25"/>`
        ]
            .filter(Boolean)
            .join('\n')
    )

    const output = new URL(`${name}-4x3.jpg`, outputDir)
    await sharp(plate)
        .resize(width, height)
        .composite([
            { input: shadow, blend: 'multiply' },
            ...(frameSvg ? [{ input: frameSvg }] : []),
            { input: art, left: printX, top: printY },
            { input: top },
            ...(objects ? [{ input: objects }] : [])
        ])
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(fileURLToPath(output))

    console.log(
        `${name}: ${mockup.size}″ at ${printW}×${printH}px → ${fileURLToPath(output)}`
    )
}

for (const [name, mockup] of Object.entries(mockups)) {
    await compose(name, mockup)
}
