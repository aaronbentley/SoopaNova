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
                        We currently offer handcrafted canvas, poster and framed
                        prints, made with love by real people, using only the
                        highest quality materials for your prints.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        What sizes can I print?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Print size options can vary depending on the resolution
                        of the image file you want to print and the print
                        product you choose.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        We offer prints ranging in size from 8&Prime;x14&Prime;
                        all the way to 38&Prime;x70&Prime;.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        How long will it take to receive my print?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Standard shipping orders are dispatched within 5-7 days,
                        plus 3-7 business days for delivery (depending on your
                        location). Expedited shipping orders are dispatched
                        within 3-5, plus 2 business days for delivery.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10'>
                    <PageSectionHeading>
                        Where are you able to ship to?
                    </PageSectionHeading>
                    <PageSectionDescription>
                        We currently ship to the United States, the European
                        Union and Canada.
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
