import { termsVersion } from '@/assets/data/legal'
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
import { Typography } from '@/components/typography'
import { format, parseISO } from 'date-fns'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms',
    description: 'Terms of Service',
    alternates: {
        canonical: '/terms/'
    }
}

const Terms = () => {
    return (
        <>
            <div>
                <PageHeader>
                    <PageHeaderHeading>Terms</PageHeaderHeading>
                    <PageHeaderDescription>
                        Our Terms of Service outline the conditions and
                        guidelines governing users&apos; access and utilization
                        of the SoopaNova website and services.
                    </PageHeaderDescription>
                </PageHeader>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Context</PageSectionHeading>
                    <PageSectionDescription>
                        These terms of service (&quot;Terms&quot;) govern your
                        use of our website and services, including any updates,
                        enhancements, new features, and/or the addition of any
                        new properties, content, or services (collectively
                        referred to as the &quot;Service&quot;).
                    </PageSectionDescription>
                    <PageSectionDescription>
                        By accessing or using the Service, you agree to be bound
                        by these Terms. If you do not agree to these Terms,
                        please do not use the Service.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Use of Service</PageSectionHeading>
                    <Typography variant='h3'>Eligibility</Typography>
                    <PageSectionDescription>
                        You must be at least 18 years old to use the Service. By
                        using the Service, you represent and warrant that you
                        are at least 18 years old.
                    </PageSectionDescription>
                    <Typography variant='h3'>Registration</Typography>
                    <PageSectionDescription>
                        To access certain features of the Service, you may need
                        to register for an account. You agree to provide
                        accurate, current, and complete information during the
                        registration process and to update such information to
                        keep it accurate, current, and complete.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Content and Intellectual Property
                    </PageSectionHeading>
                    <Typography variant='h3'>User Content</Typography>
                    <PageSectionDescription>
                        Images you upload to the Service (&quot;User
                        Content&quot;), such as game screenshots, usually
                        include material owned by others, including the artwork,
                        characters, and other content of the game&apos;s
                        publisher or developer. Uploading User Content does not
                        give you or SoopaNova ownership of that material.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        By uploading User Content, you confirm that you have the
                        rights needed to have it printed, and that any print you
                        order is for your own personal, non-commercial use.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        You grant SoopaNova a limited, non-exclusive,
                        royalty-free license to store, process, and copy your
                        User Content only as needed to provide the Service:
                        checking it against our content rules and sending it to
                        our print partner to produce and deliver your order.
                    </PageSectionDescription>
                    <Typography variant='h3'>Intellectual Property</Typography>
                    <PageSectionDescription>
                        All content and materials available on the Service,
                        including but not limited to text, graphics, logos,
                        button icons, images, and software, are the property of
                        SoopaNova or its licensors and are protected by
                        intellectual property laws.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Orders and Payment</PageSectionHeading>
                    <PageSectionDescription>
                        Prices are shown in pounds, euros or US dollars,
                        depending on the country you&apos;re delivering to. The
                        total at checkout, including delivery, is what you pay.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        Payments are handled by Stripe, so we never see or store
                        your card details. Your order is placed when your
                        payment is taken, and we then send it straight to our
                        print partner to be made.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        We check every upload automatically and won&apos;t print
                        sexually explicit images. If we can&apos;t fulfil an
                        order for any reason, we&apos;ll cancel it and refund
                        you in full.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Your Print</PageSectionHeading>
                    <PageSectionDescription>
                        Your screenshot is cropped from the centre to fill the
                        print, as the preview shows. We grade each size by how
                        sharp your screenshot will print and don&apos;t offer
                        sizes it&apos;s too small for, but how your print looks
                        still depends on the screenshot you upload. Colours in
                        print can look slightly different from your screen.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Delivery</PageSectionHeading>
                    <PageSectionDescription>
                        We deliver to the United Kingdom, the European Union and
                        the United States. Delivery times are estimates.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        Please check your delivery address at checkout. If an
                        order can&apos;t be delivered because the address was
                        wrong, sending it again will cost extra.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Cancellations, Returns and Problems
                    </PageSectionHeading>
                    <Typography variant='h3'>Changing your mind</Typography>
                    <PageSectionDescription>
                        Every print is made to order from your own screenshot,
                        so you can&apos;t cancel or return it just because you
                        change your mind. If you need to cancel, contact us
                        straight away: we&apos;ll cancel and refund your order
                        if it hasn&apos;t gone into production.
                    </PageSectionDescription>
                    <Typography variant='h3'>
                        Damaged, faulty or wrong prints
                    </Typography>
                    <PageSectionDescription>
                        If your print arrives damaged, faulty or isn&apos;t what
                        you ordered, tell us within 14 days of delivery, with
                        photos of the problem (and the packaging, if it was
                        damaged in the post). We&apos;ll replace it or refund
                        you.
                    </PageSectionDescription>
                    <Typography variant='h3'>
                        Orders that don&apos;t arrive
                    </Typography>
                    <PageSectionDescription>
                        If your order hasn&apos;t arrived 30 days after you
                        placed it, tell us and we&apos;ll send a replacement or
                        refund you.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        None of this affects your legal rights as a consumer.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Prohibited Conduct</PageSectionHeading>
                    <PageSectionDescription>
                        You agree not to:
                    </PageSectionDescription>
                    <Typography
                        variant='ul'
                        muted>
                        <Typography variant='li'>
                            Violate any applicable laws or regulations
                        </Typography>
                        <Typography variant='li'>
                            Infringe on any third-party rights
                        </Typography>
                        <Typography variant='li'>
                            Attempt to gain unauthorized access to the Service
                        </Typography>
                        <Typography variant='li'>
                            Engage in any activity that interferes with or
                            disrupts the Service
                        </Typography>
                        <Typography variant='li'>
                            Impersonate any person or entity
                        </Typography>
                        <Typography variant='li'>
                            Engage in any form of automated data collection
                        </Typography>
                        <Typography variant='li'>
                            Use the Service for any illegal or unauthorized
                            purpose
                        </Typography>
                    </Typography>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Termination</PageSectionHeading>
                    <PageSectionDescription>
                        We reserve the right to terminate or suspend your
                        account and access to the Service for any reason,
                        without notice, at our sole discretion.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Limitation of Liability
                    </PageSectionHeading>
                    <PageSectionDescription>
                        To the fullest extent permitted by applicable law,
                        SoopaNova shall not be liable for any indirect,
                        incidental, special, consequential, or punitive damages,
                        or any loss of profits or revenues, whether incurred
                        directly or indirectly. Nothing in these Terms limits
                        your legal rights as a consumer, or any liability that
                        can&apos;t be limited by law.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Policy Updates</PageSectionHeading>
                    <PageSectionDescription>
                        We may update these Terms at any time. The most current
                        version supersedes all previous versions, but an order
                        is covered by the Terms in place when you placed it.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Contact Us</PageSectionHeading>
                    <PageSectionDescription>
                        If you have a problem with an order, or any questions
                        about these Terms, please contact us via DM on:
                    </PageSectionDescription>
                    <Typography
                        variant='ul'
                        muted>
                        <Typography variant='li'>
                            <a
                                href={process.env.APP_SOCIAL_TWITTER!}
                                title='DM us on Twitter'
                                target='_blank'
                                className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                                Twitter
                            </a>
                        </Typography>
                        <Typography variant='li'>
                            <a
                                href={process.env.APP_SOCIAL_INSTAGRAM!}
                                title='DM us on Instagram'
                                target='_blank'
                                className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                                Instagram
                            </a>
                        </Typography>
                    </Typography>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionDescription>
                        Last updated:{' '}
                        {format(parseISO(termsVersion), 'MMMM, yyyy')}
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Terms
