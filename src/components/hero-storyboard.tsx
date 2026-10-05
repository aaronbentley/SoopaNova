'use client'

import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import {
    AnimatePresence,
    domAnimation,
    LazyMotion,
    m,
    useInView,
    useReducedMotion
} from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * Lucide icons (lucide.dev, 24px grid) as plain paths so their strokes can
 * draw on; lines and circles are rewritten as paths
 */
const icons = {
    gamepadControls: ['M6 11h4', 'M8 9v4', 'M15 12h.01', 'M18 10h.01'],
    /**
     * The outline split into quarters that start at the top and bottom centres
     * and meet halfway down each side (the long side curves split at t = 0.5)
     */
    gamepad: [
        'M12 5H6.68A4 4 0 0 0 2.702 8.59C2.696 8.642 2.692 8.691 2.685 8.742C2.6445 9.079 2.4733 10.5075 2.3121 12.0448',
        'M12 5H17.32A4 4 0 0 1 21.298 8.591C21.304 8.642 21.308 8.692 21.315 8.742C21.3555 9.079 21.5273 10.5073 21.6879 12.0444',
        'M12 16H9.828A2 2 0 0 0 8.414 16.586L7 18C6.5 18.5 6 19 5 19A3 3 0 0 1 2 16C2 15.228 2.151 13.582 2.3121 12.0448',
        'M12 16H14.172A2 2 0 0 1 15.586 16.586L17 18C17.5 18.5 18 19 19 19A3 3 0 0 0 22 16C22 15.2275 21.849 13.5815 21.6879 12.0444'
    ],
    upload: [
        'M12 3v12',
        'm17 8-5-5-5 5',
        'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
    ],
    /** Lucide's check reversed, so it draws short stroke first like a hand */
    check: ['M4 12l5 5L20 6'],
    sparkle: [
        'M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z'
    ],
    moon: [
        'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401'
    ],
    /** mountain; mountain-snow is the same outline plus snowLine */
    mountain: ['m8 3 4 8 5-5 5 15H2L8 3z'],
    snowLine: [
        'M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19'
    ]
}

/**
 * The mountain range on the screen: x is the icon's left edge, size its
 * width on the 24px grid (it stands on rangeBase). The plain
 * mountains sit behind, with fainter outlines for depth; the snowy ones are
 * in front.
 */
/**
 * Where the mountains' flat base sits: just below the screen's bottom edge
 * (240), so the clip hides it rather than leaving half a line along the edge
 */
const rangeBase = 244

const range = [
    { x: 131, size: 108, snow: false, back: true },
    { x: 254, size: 132, snow: false, back: true },
    { x: 167, size: 156, snow: true, back: false },
    { x: 333, size: 144, snow: true, back: false }
]

/**
 * Drawn lines go a touch past their full length: the browser's measure of a
 * path is approximate, and stopping at exactly 1 can leave a hairline gap
 * where the line meets its start
 */
const drawn = 1.02

const scenes = ['play', 'capture', 'upload', 'print'] as const
type Scene = (typeof scenes)[number]

const durations: Record<Scene, number> = {
    play: 2600,
    capture: 900,
    upload: 2800,
    /** How long the finished print shows before the replay button */
    print: 1400
}

/**
 * A static Lucide icon: positioned by its top-left corner, sized in viewBox
 * units, with the stroke weight kept the same whatever the size
 */
const Glyph = ({
    paths,
    x,
    y,
    size,
    weight = 1.5,
    className
}: {
    paths: string[]
    x: number
    y: number
    size: number
    weight?: number
    className?: string
}) => (
    <g transform={`translate(${x} ${y}) scale(${size / 24})`}>
        {paths.map((d) => (
            <path
                key={d}
                d={d}
                fill='none'
                strokeWidth={(weight * 24) / size}
                strokeLinecap='round'
                strokeLinejoin='round'
                className={className}
            />
        ))}
    </g>
)

/**
 * A Lucide icon that draws on (pathLength) or just fades in when shown. It
 * fades as one layer, so where its lines overlap (the joins of split
 * outlines, the D-pad's cross) a translucent stroke doesn't darken.
 */
const Icon = ({
    paths,
    x,
    y,
    size = 24,
    show,
    delay = 0,
    weight = 1.5,
    draw = true,
    duration = 0.7,
    opacity = 1,
    layerClassName,
    className = 'stroke-foreground'
}: {
    paths: string[]
    x: number
    y: number
    size?: number
    show: boolean
    delay?: number
    /** Stroke width in viewBox units, whatever the icon's size */
    weight?: number
    /** Draw the lines on, or only fade them in */
    draw?: boolean
    /** Seconds to draw or fade in */
    duration?: number
    /** Use this rather than a translucent stroke colour */
    opacity?: number
    /** Classes for the icon's layer, e.g. a different opacity per theme */
    layerClassName?: string
    className?: string
}) => {
    const transition = {
        duration: show ? duration : 0.3,
        delay: show ? delay : 0,
        ease: 'easeInOut'
    } as const

    return (
        <g
            transform={`translate(${x} ${y}) scale(${size / 24})`}
            opacity={opacity}
            className={layerClassName}>
            <m.g
                initial={false}
                animate={{ opacity: show ? 1 : 0 }}
                transition={transition}>
                {paths.map((d) => (
                    <m.path
                        key={d}
                        d={d}
                        fill='none'
                        strokeWidth={(weight * 24) / size}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className={className}
                        initial={false}
                        animate={
                            draw ? { pathLength: show ? drawn : 0 } : undefined
                        }
                        transition={transition}
                    />
                ))}
            </m.g>
        </g>
    )
}

/**
 * The screenshot itself: sky, moon, stars and the mountain range, clipped to
 * the screen (150, 70, 300 × 170, rounded). Shared by the stage's screen and
 * the grand print, so the picture that flies up is the same one.
 */
const Sky = ({
    clipId,
    skyRef
}: {
    clipId: string
    skyRef?: React.Ref<SVGRectElement>
}) => (
    <g clipPath={`url(#${clipId})`}>
        <rect
            ref={skyRef}
            x='150'
            y='70'
            width='300'
            height='170'
            className='fill-neutral-200 dark:fill-neutral-800'
        />
        {/** Moon (Lucide moon) */}
        <Glyph
            paths={icons.moon}
            x={388}
            y={80}
            size={40}
            className='stroke-primary/80 dark:stroke-primary/60'
        />

        {/** Stars (Lucide sparkle), in one muted layer */}
        <g className='opacity-70 dark:opacity-50'>
            {[
                [168, 84, 14],
                [236, 92, 8],
                [250, 78, 11],
                [330, 82, 8],
                [430, 132, 9]
            ].map(([x, y, size]) => (
                <Glyph
                    key={x}
                    paths={icons.sparkle}
                    x={x}
                    y={y}
                    size={size}
                    weight={1}
                    className='stroke-primary'
                />
            ))}
        </g>

        {/**
         * Mountain range: Lucide mountain and mountain-snow, back row first,
         * standing just below the bottom edge. Filled so front peaks hide the
         * ones behind, in one translucent layer so overlaps don't show
         * through.
         */}
        <g opacity={0.6}>
            {range.map(({ x, size, snow, back }) => {
                const scale = size / 24
                return (
                    <g
                        key={x}
                        transform={`translate(${x} ${rangeBase - 21 * scale}) scale(${scale})`}
                        strokeWidth={1.5 / scale}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className={
                            back ? 'stroke-foreground/50' : 'stroke-foreground'
                        }>
                        <path
                            d={icons.mountain[0]}
                            className='fill-neutral-100 dark:fill-neutral-900'
                        />
                        {snow && (
                            <path
                                d={icons.snowLine[0]}
                                fill='none'
                            />
                        )}
                    </g>
                )
            })}
        </g>
    </g>
)

/**
 * How big the finished print is, as a multiple of the TV screen's width (the
 * frame included), so it ends up a little larger than the screen it came from
 */
const grandScale = 1.25

/** The screenshot's shape: the 300 × 170 screen */
const pictureAspect = 300 / 170

type Box = { left: number; top: number; width: number; height: number }

/**
 * The grand print, all in pixels so the frame and mount stay the same size
 * however big the picture grows (they don't scale up with it)
 */
type Grand = {
    /** The print, relative to the storyboard's stage */
    box: Box
    /** The picture inside the print, relative to the print */
    picture: Box
    /** Frame and mount widths */
    frame: number
    mount: number
    replayTop: number
    /** The stage's thumbnail it takes off from */
    from: Box | null
}

/**
 * Where the finished print lands, relative to the storyboard's stage: centred
 * in the stage, grandScale × the TV screen's width (it stays below the hero's
 * strapline and buttons), and never so big that it crowds out the replay
 * button. The frame and mount scale with the print's width.
 */
const measureGrand = (stage: HTMLElement, thumbnail: Element | null): Grand => {
    const root = stage.getBoundingClientRect()
    /** A rect relative to the stage (DOMRect's fields don't spread) */
    const relative = (rect: Box): Box => ({
        left: rect.left - root.left,
        top: rect.top - root.top,
        width: rect.width,
        height: rect.height
    })
    const from = thumbnail ? relative(thumbnail.getBoundingClientRect()) : null

    /** The stage's SVG: a 600 × 300 viewBox, fitted (meet) */
    const unit = Math.min(root.width / 600, root.height / 300)
    const screenWidth = 300 * unit
    /** Room under the print for the replay button */
    const maxHeight = root.height - 96
    const maxWidth = root.width - 48

    /** Frame and mount in proportion to the print: 16 and 40 at ~1000px */
    const sizes = (width: number) => ({
        frame: Math.min(16, Math.max(6, width * 0.016)),
        mount: Math.min(40, Math.max(14, width * 0.04))
    })
    const heightOf = (width: number) => {
        const { frame, mount } = sizes(width)
        const edge = frame + mount
        return (width - edge * 2) / pictureAspect + edge * 2
    }
    /** Shrink to fit the stage if need be */
    let width = Math.min(screenWidth * grandScale, maxWidth)
    while (heightOf(width) > maxHeight && width > 120) width -= 4
    const height = heightOf(width)
    const { frame, mount } = sizes(width)
    const edge = frame + mount

    const box = {
        left: (root.width - width) / 2,
        top: (maxHeight - height) / 2 + 8,
        width,
        height
    }

    return {
        box,
        picture: {
            left: edge,
            top: edge,
            width: width - edge * 2,
            height: height - edge * 2
        },
        frame,
        mount,
        replayTop: box.top + height + 24,
        from
    }
}

/**
 * The first frame of the scale-up: the grand print shrunk and moved so its
 * picture sits exactly over the stage's thumbnail (scaling about its centre)
 */
const flyFrom = ({ box, picture, from }: Grand) => {
    if (!from) return { x: 0, y: (box.height / 2) * 0.6, scale: 0.2 }
    const scale = from.width / picture.width
    const boxCentre = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2
    }
    const pictureCentre = {
        x: box.left + picture.left + picture.width / 2,
        y: box.top + picture.top + picture.height / 2
    }
    return {
        scale,
        x:
            from.left +
            from.width / 2 -
            (boxCentre.x + (pictureCentre.x - boxCentre.x) * scale),
        y:
            from.top +
            from.height / 2 -
            (boxCentre.y + (pictureCentre.y - boxCentre.y) * scale)
    }
}

/**
 * The grand finale: the screenshot springs up from the stage's thumbnail into
 * a framed print a little larger than the screen, while the mount fades in and
 * the frame draws on from the top and bottom centres. Drawn in pixels, so the
 * frame and mount keep their size while the picture grows.
 */
const GrandPrint = ({ grand }: { grand: Grand }) => {
    const { box, picture, frame } = grand
    const { width, height } = box
    const inset = frame / 2
    const radius = 4
    /** The scale-up, mount and frame all run together */
    const duration = 1.2
    const quarters = [
        `M${width / 2} ${inset} H${width - inset - radius} A${radius} ${radius} 0 0 1 ${width - inset} ${inset + radius} V${height / 2}`,
        `M${width / 2} ${inset} H${inset + radius} A${radius} ${radius} 0 0 0 ${inset} ${inset + radius} V${height / 2}`,
        `M${width / 2} ${height - inset} H${width - inset - radius} A${radius} ${radius} 0 0 0 ${width - inset} ${height - inset - radius} V${height / 2}`,
        `M${width / 2} ${height - inset} H${inset + radius} A${radius} ${radius} 0 0 1 ${inset} ${height - inset - radius} V${height / 2}`
    ]

    return (
        <m.div
            className='pointer-events-none absolute'
            style={box}
            initial={flyFrom(grand)}
            animate={{ x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.35 } }}
            transition={{ type: 'spring', bounce: 0.22, duration }}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden='true'
                className='size-full overflow-visible'>
                {/**
                 * The mount, between the frame and the picture: the page
                 * colour, with the picture a step away from it in each theme
                 */}
                <m.rect
                    x={inset}
                    y={inset}
                    width={width - frame}
                    height={height - frame}
                    rx={radius}
                    className='fill-white dark:fill-neutral-950'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: duration * 0.75 }}
                />

                {/** The screenshot, in its own 300 × 170 coordinates */}
                <svg
                    x={picture.left}
                    y={picture.top}
                    width={picture.width}
                    height={picture.height}
                    viewBox='150 70 300 170'>
                    <defs>
                        <clipPath id='storyboard-print'>
                            <rect
                                x='150'
                                y='70'
                                width='300'
                                height='170'
                                rx='10'
                            />
                        </clipPath>
                    </defs>
                    <Sky clipId='storyboard-print' />
                </svg>

                {/**
                 * The frame, drawn as four quarters from the top and bottom
                 * centres to halfway down each side, faded as one layer so
                 * the overlapping caps don't darken
                 */}
                <m.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}>
                    {quarters.map((d, index) => (
                        <m.path
                            key={index}
                            d={d}
                            fill='none'
                            strokeWidth={frame}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='stroke-foreground'
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: drawn }}
                            transition={{ duration, ease: 'easeInOut' }}
                        />
                    ))}
                </m.g>
            </svg>
        </m.div>
    )
}

/**
 * The homepage hero's Motion SVG storyboard, full width under the actions: game screen → capture
 * flash → upload and check → the screenshot springs up into a framed print,
 * a little larger than the screen. It follows the theme: a pale grey
 * sky with dark line art in light mode, a dark grey sky with light line art
 * in dark mode. It starts empty, plays once in view and stops on the print
 * with a replay button; reduced motion stops on the first scene.
 */
const HeroStoryboard = () => {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { amount: 0.5 })
    const reducedMotion = useReducedMotion()
    /** Nothing shows until the stage is in view, so the first pass animates in */
    const [scene, setScene] = useState<Scene | null>(null)
    /** It plays once, stopping on the print with a replay button */
    const [done, setDone] = useState(false)
    /** The thumbnail's sky, measured as the print takes off from it */
    const skyRef = useRef<SVGRectElement>(null)
    /** Where the grand print lands (null outside the print scene) */
    const [grand, setGrand] = useState<Grand | null>(null)

    useEffect(() => {
        if (!inView || done) return
        if (scene && reducedMotion) return
        const timer = window.setTimeout(
            () => {
                if (scene === 'print') return setDone(true)
                const next = scene ? scenes[scenes.indexOf(scene) + 1] : 'play'
                if (next === 'print' && ref.current)
                    setGrand(measureGrand(ref.current, skyRef.current))
                setScene(next)
            },
            scene ? durations[scene] : 300
        )

        return () => clearTimeout(timer)
    }, [scene, inView, reducedMotion, done])

    /** Keep the grand print in place if the window is resized */
    useEffect(() => {
        if (!grand) return
        const update = () =>
            ref.current &&
            setGrand((current) =>
                current
                    ? {
                          ...measureGrand(ref.current!, null),
                          from: current.from
                      }
                    : current
            )
        window.addEventListener('resize', update)

        return () => window.removeEventListener('resize', update)
    }, [grand])

    /** Clear the stage, then play from the start */
    const replay = () => {
        setDone(false)
        setGrand(null)
        setScene(null)
    }

    const is = (...names: Scene[]) => scene !== null && names.includes(scene)

    /**
     * The screen's contents shrink for the upload, then vanish where they are
     * as the grand print takes off from exactly that spot
     */
    const content = {
        opacity: scene && !is('print') ? 1 : 0,
        ...(is('upload', 'print')
            ? { scale: 0.62, y: -26 }
            : { scale: 1, y: 0 })
    }

    return (
        <LazyMotion features={domAnimation}>
            <div
                ref={ref}
                className='absolute inset-0 bg-[radial-gradient(ellipse_40%_55%_at_50%_50%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]'>
                <svg
                    viewBox='0 40 600 300'
                    preserveAspectRatio='xMidYMid meet'
                    aria-hidden='true'
                    className='absolute inset-0 size-full'>
                    <defs>
                        <clipPath id='storyboard-screen'>
                            <rect
                                x='150'
                                y='70'
                                width='300'
                                height='170'
                                rx='10'
                            />
                        </clipPath>
                    </defs>

                    {/** Screen contents: a tiny synthwave scene */}
                    <m.g
                        initial={false}
                        animate={content}
                        transition={{
                            default: {
                                type: 'spring',
                                bounce: 0.15,
                                duration: 0.9
                            },
                            opacity: { duration: is('print') ? 0 : 0.4 }
                        }}>
                        <Sky
                            clipId='storyboard-screen'
                            skyRef={skyRef}
                        />

                        {/** Camera flash, in the brand pink */}
                        <m.rect
                            x='150'
                            y='70'
                            width='300'
                            height='170'
                            rx='10'
                            className='fill-primary'
                            initial={false}
                            animate={{
                                opacity: is('capture') ? [0, 0, 0.85, 0] : 0
                            }}
                            transition={{
                                duration: 0.55,
                                times: [0, 0.2, 0.3, 1]
                            }}
                        />
                    </m.g>

                    {/** Screen bezel and stand */}
                    <m.g
                        initial={false}
                        animate={{ opacity: is('play', 'capture') ? 1 : 0 }}
                        transition={{ duration: 0.4 }}>
                        {/**
                         * Drawn as quarters from the top and bottom centres
                         * to halfway down each side, like the frame, inside
                         * one translucent layer so the joins don't darken
                         */}
                        <g opacity={0.8}>
                            {[
                                'M300 70 H440 A10 10 0 0 1 450 80 V155',
                                'M300 70 H160 A10 10 0 0 0 150 80 V155',
                                'M300 240 H440 A10 10 0 0 0 450 230 V155',
                                'M300 240 H160 A10 10 0 0 1 150 230 V155'
                            ].map((d) => (
                                <m.path
                                    key={d}
                                    d={d}
                                    fill='none'
                                    strokeWidth={2}
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='stroke-foreground'
                                    initial={false}
                                    animate={{
                                        pathLength: is('play')
                                            ? [0, drawn]
                                            : drawn
                                    }}
                                    transition={{
                                        duration: 0.9,
                                        ease: 'easeInOut'
                                    }}
                                />
                            ))}
                        </g>
                        {/**
                         * The stand draws on with it: the neck drops from the
                         * bezel's bottom centre, then the base spreads out
                         * from the middle, in one translucent layer so the
                         * joins don't darken
                         */}
                        <g opacity={0.4}>
                            {/**
                             * Each piece is held at nothing until its start
                             * (a fraction of the bezel's 0.9s) rather than
                             * delayed, which would show it whole meanwhile
                             */}
                            {[
                                { d: 'M300 241 V259', start: 0, end: 0.45 },
                                { d: 'M300 260 H262', start: 0.35, end: 1 },
                                { d: 'M300 260 H338', start: 0.35, end: 1 }
                            ].map(({ d, start, end }) => (
                                <m.path
                                    key={d}
                                    d={d}
                                    fill='none'
                                    strokeWidth={2}
                                    strokeLinecap='round'
                                    className='stroke-foreground'
                                    initial={false}
                                    animate={{
                                        pathLength: is('play')
                                            ? [0, 0, drawn, drawn]
                                            : drawn
                                    }}
                                    transition={{
                                        duration: 0.9,
                                        times: [0, start, end, 1],
                                        ease: 'easeInOut'
                                    }}
                                />
                            ))}
                        </g>
                    </m.g>

                    <Icon
                        paths={icons.gamepad}
                        x={272}
                        y={276}
                        size={56}
                        show={is('play', 'capture')}
                        duration={0.9}
                        weight={1.25}
                        opacity={0.7}
                    />
                    <Icon
                        paths={icons.gamepadControls}
                        x={272}
                        y={276}
                        size={56}
                        show={is('play', 'capture')}
                        duration={0.9}
                        weight={1.25}
                        draw={false}
                        layerClassName='opacity-80 dark:opacity-50'
                        className='stroke-primary'
                    />

                    {/** Upload card with progress, then the moderation tick */}
                    <m.g
                        initial={false}
                        animate={{
                            opacity: is('upload') ? 1 : 0,
                            y: is('upload') ? 0 : 12
                        }}
                        transition={{ duration: 0.4 }}>
                        {/** Drawn at 260 wide, shown at two-thirds under the screen */}
                        <g transform='translate(300 228) scale(0.66) translate(-300 -269)'>
                            <rect
                                x='170'
                                y='232'
                                width='260'
                                height='74'
                                rx='12'
                                strokeWidth={1}
                                className='fill-card stroke-border'
                            />
                            <Icon
                                paths={icons.upload}
                                x={190}
                                y={257}
                                size={24}
                                show={is('upload')}
                            />
                            <m.text
                                x='230'
                                y='264'
                                fontSize='11'
                                className='fill-foreground font-mono'
                                initial={false}
                                animate={{
                                    opacity: is('upload') ? [1, 1, 0] : 0
                                }}
                                transition={{
                                    duration: 1.7,
                                    times: [0, 0.9, 1]
                                }}>
                                Uploading…
                            </m.text>
                            <m.text
                                x='230'
                                y='264'
                                fontSize='11'
                                className='fill-foreground font-mono'
                                initial={false}
                                animate={{
                                    opacity: is('upload') ? [0, 0, 1] : 0
                                }}
                                transition={{
                                    duration: 1.8,
                                    times: [0, 0.94, 1]
                                }}>
                                Looks good
                            </m.text>
                            <rect
                                x='230'
                                y='276'
                                width='176'
                                height='4'
                                rx='2'
                                className='fill-foreground/10'
                            />
                            <m.rect
                                x='230'
                                y='276'
                                width='176'
                                height='4'
                                rx='2'
                                className='fill-primary'
                                style={{ originX: 0 }}
                                initial={false}
                                animate={{ scaleX: is('upload') ? [0, 1] : 0 }}
                                transition={{
                                    duration: 1.6,
                                    ease: 'easeInOut'
                                }}
                            />
                            <Icon
                                paths={icons.check}
                                x={378}
                                y={246}
                                size={20}
                                show={is('upload')}
                                delay={1.8}
                                className='stroke-primary'
                            />
                        </g>
                    </m.g>
                </svg>

                <AnimatePresence>
                    {grand && (
                        <GrandPrint
                            key='print'
                            grand={grand}
                        />
                    )}
                </AnimatePresence>

                {/** Replay, just under the grand print */}
                <AnimatePresence>
                    {done && grand && (
                        <m.div
                            className='absolute left-1/2 -translate-x-1/2'
                            style={{ top: grand.replayTop }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}>
                            <Button
                                variant='outline'
                                size='icon'
                                onClick={replay}
                                aria-label='Replay the animation'
                                className='rounded-full'>
                                <RotateCcw
                                    aria-hidden='true'
                                    className='text-primary transition-transform duration-500 group-hover/button:-rotate-180'
                                />
                            </Button>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </LazyMotion>
    )
}

export default HeroStoryboard
