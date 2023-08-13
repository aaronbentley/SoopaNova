import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About',
    description: 'Let me tell you a story.'
}

const Create = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Create Your Prints</PageHeaderHeading>
                    <PageHeaderDescription>
                        Create something fantastic.
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default Create
