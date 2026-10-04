import { platforms } from '@/assets/data/platforms'
import { productTypes } from '@/assets/data/pricing'
import { resolutions, screenshotTips } from '@/assets/data/screenshots'
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
                    {screenshotTips.map((tip, index) => (
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
