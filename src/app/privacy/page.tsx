import { privacyUpdated } from '@/assets/data/legal'
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
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Privacy',
    description: 'Privacy Policy',
    alternates: {
        canonical: '/privacy/'
    }
}

const linkClasses =
    'font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'

/**
 * Services that handle personal data for us, and what for
 */
const processors = [
    {
        name: 'Clerk',
        href: 'https://clerk.com/legal/privacy',
        purpose: 'accounts and sign-in'
    },
    {
        name: 'Google Firebase and Cloud Vision',
        href: 'https://firebase.google.com/support/privacy',
        purpose:
            'storing your uploads and orders, and checking uploads against our content rules'
    },
    {
        name: 'Stripe',
        href: 'https://stripe.com/privacy',
        purpose: 'payments'
    },
    {
        name: 'Prodigi',
        href: 'https://www.prodigi.com/privacy-and-cookie-policy/',
        purpose:
            'printing and delivering your order (with their couriers), so they receive your screenshot and delivery details'
    },
    {
        name: 'Vercel',
        href: 'https://vercel.com/legal/privacy-policy',
        purpose: 'hosting the website and anonymous visitor statistics'
    },
    {
        name: 'Cloudflare',
        href: 'https://www.cloudflare.com/privacypolicy/',
        purpose: 'protecting sign-in and sign-up from bots'
    }
]

const Privacy = () => {
    return (
        <>
            <div>
                <PageHeader>
                    <PageHeaderHeading>Privacy</PageHeaderHeading>
                    <PageHeaderDescription>
                        What personal information we collect, how we use and
                        share it, how long we keep it, and your rights.
                    </PageHeaderDescription>
                </PageHeader>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Context</PageSectionHeading>
                    <PageSectionDescription>
                        This Privacy Policy explains how SoopaNova
                        (&quot;we&quot;) handles your personal information when
                        you use our website and order prints. We&apos;re
                        responsible for that information as its data controller.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Information We Collect
                    </PageSectionHeading>
                    <Typography variant='h3'>Your account</Typography>
                    <PageSectionDescription>
                        Your email address. If you sign in with Google, Discord
                        or Microsoft, we also receive your name and profile
                        picture from them.
                    </PageSectionDescription>

                    <Typography variant='h3'>Your screenshots</Typography>
                    <PageSectionDescription>
                        The screenshots you upload. They&apos;re deleted
                        automatically after 3 days. We keep a small preview
                        image with each order so you can see it on your orders
                        page.
                    </PageSectionDescription>

                    <Typography variant='h3'>Your orders</Typography>
                    <PageSectionDescription>
                        What you ordered and paid, your delivery name, address,
                        email and phone number (which you enter at checkout),
                        your delivery&apos;s progress and tracking, and your
                        confirmation that the print is for personal use, with
                        when you gave it.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        Payments are handled by Stripe. We never see or store
                        your card details.
                    </PageSectionDescription>

                    <Typography variant='h3'>Visits to our website</Typography>
                    <PageSectionDescription>
                        Anonymous statistics about the pages visited and how
                        quickly they load, including the type of browser and
                        device and the country. These don&apos;t use cookies or
                        identify you.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        How We Use Your Information
                    </PageSectionHeading>
                    <Typography
                        variant='ul'
                        muted>
                        <Typography variant='li'>
                            To run your account and sign you in
                        </Typography>
                        <Typography variant='li'>
                            To make and deliver your prints, and help with any
                            problems with your order
                        </Typography>
                        <Typography variant='li'>
                            To check uploads automatically against our content
                            rules, and keep the website secure
                        </Typography>
                        <Typography variant='li'>
                            To keep the records our accounts and taxes need
                        </Typography>
                        <Typography variant='li'>
                            To see how the website is used, so we can improve it
                        </Typography>
                    </Typography>
                    <PageSectionDescription>
                        We use your information to fulfil our contract with you
                        (your account and orders), to meet our legal obligations
                        (our records), and for our legitimate interests in
                        keeping the service safe and improving it. We don&apos;t
                        send marketing emails, and we never sell your
                        information.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Who We Share It With
                    </PageSectionHeading>
                    <PageSectionDescription>
                        Only the services we use to run SoopaNova, each for its
                        own part of the job:
                    </PageSectionDescription>
                    <Typography
                        variant='ul'
                        muted>
                        {processors.map((processor) => (
                            <Typography
                                key={processor.name}
                                variant='li'>
                                <a
                                    href={processor.href}
                                    title={`${processor.name} Privacy Policy`}
                                    target='_blank'
                                    className={linkClasses}>
                                    {processor.name}
                                </a>
                                : {processor.purpose}
                            </Typography>
                        ))}
                    </Typography>
                    <PageSectionDescription>
                        Some of these services store or process information in
                        the United States, under safeguards such as standard
                        contractual clauses.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>How Long We Keep It</PageSectionHeading>
                    <Typography
                        variant='ul'
                        muted>
                        <Typography variant='li'>
                            Uploaded screenshots: 3 days
                        </Typography>
                        <Typography variant='li'>
                            Your account: until you delete it
                        </Typography>
                        <Typography variant='li'>
                            Orders and their preview images: as long as our
                            accounts and taxes need them, even if you delete
                            your account
                        </Typography>
                    </Typography>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>
                        Cookies and Browser Storage
                    </PageSectionHeading>
                    <PageSectionDescription>
                        We only use what the website needs to work: cookies and
                        browser storage that keep you signed in, and browser
                        storage that remembers your theme and delivery country.
                        There are no advertising or tracking cookies. Stripe
                        sets its own cookies on its checkout page.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Your Rights</PageSectionHeading>
                    <PageSectionDescription>
                        You can ask for a copy of your information, ask us to
                        correct or delete it, or object to how we use it. You
                        can delete your account yourself on your{' '}
                        <Link
                            href='/account/'
                            className={linkClasses}>
                            account page
                        </Link>
                        , and contact us about anything else.
                    </PageSectionDescription>
                    <PageSectionDescription>
                        If you&apos;re unhappy with how we handle your
                        information, you can complain to the Information
                        Commissioner&apos;s Office (UK) or your local data
                        protection authority.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Security</PageSectionHeading>
                    <PageSectionDescription>
                        Uploads and orders are only available to your own
                        account, and everything is sent over encrypted
                        connections. No system is perfectly secure, but we take
                        care to protect your information.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Children</PageSectionHeading>
                    <PageSectionDescription>
                        SoopaNova is for adults: you must be 18 or over to use
                        it.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Policy Updates</PageSectionHeading>
                    <PageSectionDescription>
                        We may update this Privacy Policy. Any changes will be
                        posted here, with the date of the latest version below.
                    </PageSectionDescription>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionHeading>Contact Us</PageSectionHeading>
                    <PageSectionDescription>
                        If you have any questions about this Privacy Policy or
                        your information, please contact us via DM on:
                    </PageSectionDescription>
                    <Typography
                        variant='ul'
                        muted>
                        <Typography variant='li'>
                            <a
                                href={process.env.APP_SOCIAL_TWITTER!}
                                title='DM us on Twitter'
                                target='_blank'
                                className={linkClasses}>
                                Twitter
                            </a>
                        </Typography>
                        <Typography variant='li'>
                            <a
                                href={process.env.APP_SOCIAL_INSTAGRAM!}
                                title='DM us on Instagram'
                                target='_blank'
                                className={linkClasses}>
                                Instagram
                            </a>
                        </Typography>
                    </Typography>
                </PageSection>

                <PageSection className='md:py-10 w-full'>
                    <PageSectionDescription>
                        Last updated:{' '}
                        {format(parseISO(privacyUpdated), 'MMMM, yyyy')}
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Privacy
