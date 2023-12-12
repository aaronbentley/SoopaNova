import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
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
                        Here&apos;s our Privacy Policy
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default Privacy
