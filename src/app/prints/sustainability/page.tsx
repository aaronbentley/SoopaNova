import { sustainabilityPoints } from '@/assets/data/sustainability'
import { ctaButtonVariants } from '@/components/cta-button'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageSection } from '@/components/page-section'
import SustainabilityContent from '@/content/sustainability.mdx'

export const metadata: Metadata = {
    title: 'Sustainability',
    description:
        'Every SoopaNova print is made to order, printed close to where it’s going, and packed with as little plastic as possible.',
    alternates: {
        canonical: '/prints/sustainability/'
    }
}

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
                    {sustainabilityPoints.map((point, index) => (
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
                <SustainabilityContent />
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
