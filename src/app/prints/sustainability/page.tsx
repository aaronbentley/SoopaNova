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
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Sustainability',
    description:
        'Every SoopaNova print is made to order, printed close to where it’s going, and packed with as little plastic as possible.',
    alternates: {
        canonical: '/prints/sustainability/'
    }
}

/**
 * Every claim here is one Prodigi makes for the products we sell (their
 * sustainability and product pages). Green claims have to be accurate and
 * backed up (the CMA's Green Claims Code): check there before adding one,
 * and don't round them up ("eco-friendly", "zero waste", "carbon neutral").
 */
const points = [
    {
        tagline: 'One shot, one print',
        title: 'Made to order',
        body: 'Nothing is printed until you order it. There’s no warehouse of unsold prints and no overproduction: your screenshot is printed once, for you.'
    },
    {
        tagline: 'Short trip',
        title: 'Printed near you',
        body: 'Your print is usually made in the market it’s going to: the UK for UK orders, the Netherlands for EU orders and the US for US orders. Shorter journeys mean less shipping, and your print gets to you sooner.'
    },
    {
        tagline: 'Good stuff in',
        title: 'Responsible materials',
        body: 'Our paper, and the wood in our frames and canvas stretcher bars, is sustainably sourced. Prints are made with water-based, eco-solvent or low-VOC UV inks, and our canvases are vegan-friendly, with no animal products.'
    },
    {
        tagline: 'Less plastic',
        title: 'Packaging',
        body: 'No shrink wrap, and plastic is avoided wherever possible. Art prints posted in tubes in the UK and US have plastic-free end caps, and framed prints travel in boxes made from recycled cardboard.'
    },
    {
        tagline: 'Built to last',
        title: 'Made to last',
        body: 'The greenest print is the one you keep. Our canvases have up to 200 years display permanence, and art prints use archival pigment inks that won’t fade indoors. Hang yours out of direct sunlight and it’ll look good for years.'
    }
]

const Sustainability = () => (
    <>
        <div>
            <PageHeader eyebrow='Sustainability'>
                <PageHeaderHeading>Less waste, fewer miles</PageHeaderHeading>
                <PageHeaderDescription>
                    Every SoopaNova print is made to order, printed close to
                    where it&apos;s going, and packed with as little plastic as
                    possible. Here&apos;s what that means.
                </PageHeaderDescription>
            </PageHeader>
        </div>

        <div>
            <PageSection className='md:py-10 w-full'>
                <ol className='grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {points.map((point, index) => (
                        <li
                            key={point.title}
                            className='flex flex-col gap-3 rounded-xl border p-6'>
                            <div className='flex items-center justify-between gap-4'>
                                <span className='font-mono text-xs text-muted-foreground'>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className='eyebrow text-[11px] text-primary'>
                                    {point.tagline}
                                </span>
                            </div>
                            <h2 className='text-xl font-semibold tracking-[-0.03em]'>
                                {point.title}
                            </h2>
                            <p className='text-[15px] leading-[1.55] text-pretty text-muted-foreground'>
                                {point.body}
                            </p>
                        </li>
                    ))}
                </ol>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>The honest bit</PageSectionHeading>
                <PageSectionDescription>
                    Making and shipping anything has a footprint, and we&apos;re
                    not going to pretend otherwise: we don&apos;t claim to be
                    carbon neutral, and we can&apos;t put a carbon number on
                    your print. What we can do is make it only when you want it,
                    close to home, and built to last.
                </PageSectionDescription>
                <PageSectionDescription>
                    Our prints are made by our print partner, Prodigi. Their{' '}
                    <a
                        href='https://www.prodigi.com/sustainability/'
                        target='_blank'
                        className='font-medium text-primary underline underline-offset-4'>
                        sustainability page
                    </a>{' '}
                    has more on how they work.
                </PageSectionDescription>
                <Link
                    href='/prints/'
                    className={cn(ctaButtonVariants(), 'mt-4')}>
                    Browse prints
                    <ArrowRight aria-hidden='true' />
                </Link>
            </PageSection>
        </div>
    </>
)

export default Sustainability
