import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import UploadFile from '@/components/upload-file'
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create',
    description:
        'Transform your gaming screenshots into mighty-fine artwork for your space.',
    alternates: {
        canonical: '/create/'
    }
}

const Create = async () => {
    /**
     * Redirect signed-out visitors to sign-in
     */
    await auth.protect()

    return (
        <>
            <div>
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
