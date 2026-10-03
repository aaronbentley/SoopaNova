import { sizeRange } from '@/assets/data/products'
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
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'FAQ',
    description: 'Got questions? We got answers.',
    alternates: {
        canonical: '/faq/'
    }
}

const Faq = () => {
    return (
        <>
            <div>
                <PageHeader>
                    <PageHeaderHeading>FAQ</PageHeaderHeading>
                    <PageHeaderDescription>
                        Got questions? Here&apos;s the answers.
                    </PageHeaderDescription>
                </PageHeader>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        How do I download my screenshots?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        It depends on the platform you play on. Check out our{' '}
                        <Link
                            href='/screenshots/'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary inline'>
                            screenshot guides
                        </Link>{' '}
                        to help you get started.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        What products do you offer?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Art prints, canvases, framed prints and framed canvases,
                        each made to order. You can choose the frame colour or
                        how a canvas&apos;s edges wrap, and see the details of
                        each one when you create your print.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        What sizes can I print?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Sizes run from {sizeRange}, depending on the product and
                        where we&apos;re delivering to.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        When you upload a screenshot, we grade each size by how
                        sharp it will print. Sizes too big for your
                        screenshot&apos;s resolution can&apos;t be ordered.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        How long will it take to receive my print?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Every print is made to order and usually sent out within
                        two working days. Standard delivery then takes around
                        2–3 working days in the UK, 4–6 in the US and 5–7 in the
                        EU. Express is quicker: you&apos;ll see the options and
                        their prices at checkout.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        Where are you able to ship to?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        The United Kingdom, the 27 countries of the European
                        Union and the United States.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        Who does your printing?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Print orders are made and shipped by our trusted print
                        partner, using only the highest quality print materials.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        Do you guarantee your products?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        All of our prints come with a 100% satisfaction
                        guarantee.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        If you&apos;re unhappy with your print, DM us on{' '}
                        <a
                            href={process.env.APP_SOCIAL_TWITTER!}
                            title='DM us on Twitter'
                            target='_blank'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                            Twitter
                        </a>{' '}
                        or{' '}
                        <a
                            href={process.env.APP_SOCIAL_INSTAGRAM!}
                            title='DM us on Instagram'
                            target='_blank'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                            Instagram
                        </a>{' '}
                        and we&apos;ll make it right.
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Faq
