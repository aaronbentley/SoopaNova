import { privacyUpdated } from '@/assets/data/legal'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { format, parseISO } from 'date-fns'
import { Metadata } from 'next'
import { PageSection, PageSectionDescription } from '@/components/page-section'
import PrivacyContent from '@/content/privacy.mdx'

export const metadata: Metadata = {
    title: 'Privacy',
    description: 'Privacy Policy',
    alternates: {
        canonical: '/privacy/'
    }
}

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

                <PrivacyContent />

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
