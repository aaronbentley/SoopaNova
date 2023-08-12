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

const About = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>About</PageHeaderHeading>
                    <PageHeaderDescription>
                        Let me tell you a story.
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default About
