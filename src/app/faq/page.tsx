import { sizeRange } from '@/assets/data/size-range'
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
                        It&apos;s dangerous to go alone. Take these answers.
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
                        one to five working days, depending on the product
                        (framed canvases take longest). Standard delivery then
                        takes around 2–3 working days in the UK, 4–6 in the US
                        and 5–7 in the EU. Express is quicker: you&apos;ll see
                        the options and their prices at checkout.
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
                        Our print partner, Prodigi. Your print is made and
                        posted from one of their labs, usually in the market
                        it&apos;s going to: the UK, the Netherlands or the US.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        What if something&apos;s wrong with my print?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        If your print arrives damaged, faulty or isn&apos;t what
                        you ordered, tell us within 14 days of delivery and
                        we&apos;ll replace it or refund you. The same goes if
                        your order hasn&apos;t arrived 30 days after you placed
                        it. Every print is made to order just for you, so we
                        can&apos;t take it back if you simply change your mind.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        Send us your order details and photos of the problem
                        (and the packaging, if it was damaged in the post) by DM
                        on{' '}
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
                        and we&apos;ll put it right. Our{' '}
                        <Link
                            href='/terms/'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary inline'>
                            Terms
                        </Link>{' '}
                        have the details.
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Faq
