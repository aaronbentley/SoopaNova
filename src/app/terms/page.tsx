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
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'Terms',
    description: 'Terms of Service',
    openGraph: {
        url: '/terms/'
    }
})

const Terms = () => {
    return (
        <>
            <div className='container'>
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
                        by these Terms.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        If you do not agree to these Terms, please do not use
                        the Service.
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
                        You retain ownership of any content you submit, post, or
                        display on or through the Service (&quot;User
                        Content&quot;).
                    </PageSectionDescription>
                    <PageSectionDescription>
                        By submitting User Content, you grant SoopaNova a
                        worldwide, non-exclusive, royalty-free license to use,
                        copy, reproduce, process, adapt, modify, publish,
                        transmit, display, and distribute such User Content.
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
                    <PageSectionHeading>Prohibited Conduct</PageSectionHeading>
                    <PageSectionDescription>
                        You agree not to:
                        <Typography variant='ul'>
                            <Typography variant='li'>
                                Violate any applicable laws or regulations
                            </Typography>
                            <Typography variant='li'>
                                Infringe on any third-party rights
                            </Typography>
                            <Typography variant='li'>
                                Attempt to gain unauthorized access to the
                                Service
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
                    </PageSectionDescription>
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
                        directly or indirectly.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Policy Updates</PageSectionHeading>
                    <PageSectionDescription>
                        We reserve the right to update or modify these Terms at
                        any time without prior notice. The most current version
                        of the Terms will supersede all previous versions.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Contact Us</PageSectionHeading>
                    <PageSectionDescription>
                        If you have any questions or concerns regarding these
                        Terms, please contact us via DM on:
                        <Typography variant='ul'>
                            <Typography variant='li'>
                                <a
                                    href={process.env.APP_SOCIAL_TWITTER!}
                                    title='DM us on Twitter'
                                    target='_blank'
                                    className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                    Twitter
                                </a>
                            </Typography>
                            <Typography variant='li'>
                                <a
                                    href={process.env.APP_SOCIAL_INSTAGRAM!}
                                    title='DM os on Instagram'
                                    target='_blank'
                                    className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                    Instagram
                                </a>
                            </Typography>
                        </Typography>
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionDescription>
                        Last updated: December, 2023
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Terms
