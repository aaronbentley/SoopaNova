import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import FaqContent from '@/content/faq.mdx'
import { Metadata } from 'next'

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

                <FaqContent />
            </div>
        </>
    )
}

export default Faq
