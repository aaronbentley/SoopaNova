import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
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
                        Here&apos;s our Terms of Service
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default Terms
