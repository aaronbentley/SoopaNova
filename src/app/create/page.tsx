import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import UploadFile from '@/components/upload-file'
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'Create',
    description:
        'Transform your gaming screenshots into mighty-fine artwork for your space.',
    openGraph: {
        url: '/create/'
    }
})

const Create = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Power-up Prints</PageHeaderHeading>
                    <PageHeaderDescription>
                        Transform your gaming screenshots into mighty-fine
                        artwork for your space.
                    </PageHeaderDescription>
                    <UploadFile className='my-16' />
                </PageHeader>
            </div>
        </>
    )
}

export default Create
