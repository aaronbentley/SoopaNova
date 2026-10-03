import { platforms } from '@/assets/data/platforms'
import { productTypes } from '@/assets/data/pricing'
import { ctaButtonVariants } from '@/components/cta-button'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import PlatformTile, { PlatformStrip } from '@/components/platform-tile'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    formatInches,
    getPrintDpi,
    getPrintQuality,
    parseSize,
    qualityLabels,
    qualityThresholds,
    type PrintQuality
} from '@/lib/print-quality'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Screenshots',
    description:
        'How to download your gaming screenshots, and how to get one that prints well.',
    alternates: {
        canonical: '/screenshots/'
    }
}

const minWidth = Number(process.env.MIN_IMAGE_WIDTH)
const minHeight = Number(process.env.MIN_IMAGE_HEIGHT)
const maxFileSize = Number(process.env.MAX_UPLOAD_FILE_SIZE)

/**
 * Common screenshot resolutions, for the sizes table
 */
const resolutions = [
    { name: '1080p', width: 1920, height: 1080 },
    { name: '1440p', width: 2560, height: 1440 },
    { name: '4K', width: 3840, height: 2160 }
]

/**
 * Every size we sell (in any product), smallest first
 */
const sizes = [
    ...new Set(
        Object.values(productTypes).flatMap((productType) =>
            productType.sizes.map(({ size }) => size)
        )
    )
].sort((a, b) => {
    const area = (size: string) => parseSize(size)[0] * parseSize(size)[1]

    return area(a) - area(b)
})

/**
 * How sharply a resolution prints at a size, graded as the print options
 * sheet does
 */
const qualityAt = (
    { width, height }: { width: number; height: number },
    size: string
) =>
    getPrintQuality(
        getPrintDpi(
            { width, height, aspectRatio: `${width} / ${height}` },
            size
        )
    )

const qualityClasses: Record<PrintQuality, string> = {
    great: 'text-primary',
    good: 'text-foreground',
    ok: 'text-foreground',
    low: 'text-muted-foreground'
}

const tips = [
    {
        title: 'Use the original file',
        body: 'Download the screenshot straight from your console or PC (see the guides above). Copies shared on social media or messaging apps are usually shrunk and compressed, and print noticeably worse.'
    },
    {
        title: 'More pixels, bigger prints',
        body: `We need at least ${minWidth} × ${minHeight} pixels, and grade every size by how sharp your screenshot will print at it. Sizes it's too small for (under ${qualityThresholds.ok} pixels per inch) can't be ordered. If your console or PC can capture in 4K, use it.`
    },
    {
        title: 'JPG or PNG',
        body: `Upload a JPG or PNG file, up to ${maxFileSize}MB.`
    },
    {
        title: 'Hide the HUD',
        body: "If the game has a photo mode, use it: you can frame the shot and turn off health bars, maps and button prompts for a cleaner print. Otherwise, check the game's settings for a way to hide the HUD."
    },
    {
        title: 'Mind the edges',
        body: 'Our prints are long rectangles, close to a widescreen screenshot, and yours is cropped from the centre to fill one. Keep anything important away from the very edges. You can check the crop in the preview before you order.'
    }
]

const Screenshots = () => (
    <>
        <div>
            <PageHeader eyebrow='Screenshot tips'>
                <PageHeaderHeading>Choose your platform</PageHeaderHeading>
                <PageHeaderDescription>
                    Before creating your prints, you&apos;ll need to download
                    your screenshot files. Here&apos;s how to do it for popular
                    platforms, and how to get a screenshot that prints well.
                </PageHeaderDescription>

                <PlatformStrip className='mt-6 w-full overflow-hidden rounded-xl border bg-background'>
                    {platforms.map((platform) => (
                        <PlatformTile
                            key={platform.href}
                            href={platform.href}
                            name={platform.name}
                            detail={platform.maker}
                            className='px-6'
                        />
                    ))}
                </PlatformStrip>
            </PageHeader>
        </div>

        <div>
            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Pro tips</PageSectionHeading>
                <ol className='grid w-full gap-4 sm:grid-cols-2'>
                    {tips.map((tip, index) => (
                        <li
                            key={tip.title}
                            className='flex flex-col gap-2 rounded-lg border p-5'>
                            <span className='font-mono text-xs text-muted-foreground'>
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className='font-medium'>{tip.title}</span>
                            <span className='text-sm text-pretty text-muted-foreground'>
                                {tip.body}
                            </span>
                        </li>
                    ))}
                </ol>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>
                    What sizes can my screenshot print?
                </PageSectionHeading>
                <PageSectionDescription>
                    How sharply common screenshot resolutions print at each of
                    our sizes. Not every size is made in every product or sold
                    in every country.
                </PageSectionDescription>
                <Table className='min-w-xl'>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Screenshot</TableHead>
                            {sizes.map((size) => (
                                <TableHead key={size}>
                                    {formatInches(size)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {resolutions.map((resolution) => (
                            <TableRow key={resolution.name}>
                                <TableHead>
                                    {resolution.name}{' '}
                                    <span className='font-normal text-muted-foreground'>
                                        ({resolution.width} ×{' '}
                                        {resolution.height})
                                    </span>
                                </TableHead>
                                {sizes.map((size) => {
                                    const quality = qualityAt(resolution, size)

                                    return (
                                        <TableCell
                                            key={size}
                                            className={qualityClasses[quality]}>
                                            {quality === 'low'
                                                ? 'Too small'
                                                : qualityLabels[quality]}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <PageSectionDescription className='text-sm'>
                    Great is {qualityThresholds.great}+ pixels per inch, Good{' '}
                    {qualityThresholds.good}+, OK {qualityThresholds.ok}+.
                </PageSectionDescription>
                <Link
                    href='/create/'
                    className={cn(ctaButtonVariants(), 'mt-4')}>
                    Start creating
                    <ArrowRight aria-hidden='true' />
                </Link>
            </PageSection>
        </div>
    </>
)

export default Screenshots
