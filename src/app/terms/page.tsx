import { termsVersion } from '@/assets/data/legal'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { format, parseISO } from 'date-fns'
import { Metadata } from 'next'
import { PageSection, PageSectionDescription } from '@/components/page-section'
import TermsContent from '@/content/terms.mdx'

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

                <TermsContent />

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
