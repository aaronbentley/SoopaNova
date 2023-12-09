import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'About',
    description: 'Wanna hear a story?',
    openGraph: {
        url: '/about/'
    }
})

const About = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>About</PageHeaderHeading>
                    <PageHeaderDescription>
                        Wanna hear a story?
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default About
