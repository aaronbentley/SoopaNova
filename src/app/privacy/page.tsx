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
    title: 'Privacy',
    description: 'Privacy Policy',
    openGraph: {
        url: '/privacy/'
    }
})

const Privacy = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Privacy</PageHeaderHeading>
                    <PageHeaderDescription>
                        Our Privacy Policy explains what personal information we
                        collect, how we use personal information, how personal
                        information is shared, and privacy rights.
                    </PageHeaderDescription>
                </PageHeader>
                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Context</PageSectionHeading>
                    <PageSectionDescription>
                        This Privacy Policy is designed to help you understand
                        how we collect, use, disclose, and safeguard your
                        personal information when you use our website and
                        services.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        By accessing or using our website, you consent to the
                        practices described in this Privacy Policy. Please take
                        a moment to review the following information.
                    </PageSectionDescription>
                </PageSection>
                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Information We Collect
                    </PageSectionHeading>
                    <PageSectionDescription>
                        When you sign up for an account or use our services, we
                        may collect personal information, such as your name,
                        email address, and other details necessary for account
                        creation and authentication.
                    </PageSectionDescription>
                    <Typography variant='h3'>Personal Information</Typography>

                    <PageSectionDescription>
                        We may collect information about how you interact with
                        our website, including your IP address, browser type,
                        operating system, and pages visited.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        This data helps us improve our services and provide a
                        better user experience.
                    </PageSectionDescription>

                    <Typography variant='h3'>Services</Typography>
                    <PageSectionDescription>
                        We use Clerk for authentication services, and you can
                        refer to{' '}
                        <a
                            href='https://clerk.com/privacy'
                            title='View Clerk Privacy Policy'
                            target='_blank'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                            Clerk&apos;s
                        </a>{' '}
                        Privacy Policy for more information on how they handle
                        your data.
                    </PageSectionDescription>

                    <PageSectionDescription>
                        We use Canvaspop for print fulfillment services, and you
                        can refer to{' '}
                        <a
                            href='https://www.canvaspop.com/privacy-policy'
                            title='View Canvaspop Privacy Policy'
                            target='_blank'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                            Canvaspop&apos;s
                        </a>{' '}
                        Privacy Policy for more information on how they handle
                        your data.
                    </PageSectionDescription>

                    <Typography variant='h3'>Cookies</Typography>
                    <PageSectionDescription>
                        We use cookies to enhance your experience on our
                        website. Cookies are small pieces of data stored on your
                        device that help us track and analyze usage patterns.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        You can configure your browser to refuse cookies, but
                        some features of the website may not function properly
                        as a result.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        How We Use Your Information
                    </PageSectionHeading>
                    <PageSectionDescription>
                        We use your personal information to:
                        <Typography
                            variant='ul'
                            className='font-normal'>
                            <Typography variant='li'>
                                Provide and improve our services
                            </Typography>
                            <Typography variant='li'>
                                Communicate with you about your account and our
                                services
                            </Typography>
                            <Typography variant='li'>
                                Customize your experience on our website
                            </Typography>
                            <Typography variant='li'>
                                Analyze and enhance our website&apos;s
                                performance
                            </Typography>
                        </Typography>
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        How We Share Your Information
                    </PageSectionHeading>
                    <PageSectionDescription>
                        We do not sell, trade, or rent your personal information
                        to third parties.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        However, we may share your information with trusted
                        third parties where necessary for business operations,
                        authentication purposes and order fulfillment.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Security</PageSectionHeading>
                    <PageSectionDescription>
                        We take the security of your personal information
                        seriously. We implement industry-standard security
                        measures to protect your data from unauthorized access,
                        disclosure, alteration, and destruction.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Your Choices</PageSectionHeading>
                    <PageSectionDescription>
                        You have the right to access, correct, or delete your
                        personal information. You can manage your account
                        settings or contact us for assistance.
                    </PageSectionDescription>

                    {/* <PageSectionDescription>
                        You can also opt-out of receiving promotional emails,
                        but transactional emails related to your account will
                        still be sent.
                    </PageSectionDescription> */}
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Updates</PageSectionHeading>
                    <PageSectionDescription>
                        We may update this Privacy Policy periodically. Any
                        changes will be posted on this page, and the date of the
                        latest revision will be indicated at the top.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        Your continued use of our website after changes are made
                        constitutes your acceptance of the revised policy.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Contact Us</PageSectionHeading>
                    <PageSectionDescription>
                        If you have any questions or concerns about this Privacy
                        Policy or our data practices, please contact us via DM
                        on:
                        <Typography
                            variant='ul'
                            className='font-normal'>
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

export default Privacy
