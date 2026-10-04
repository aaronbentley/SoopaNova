import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { Metadata } from 'next'
import AboutContent from '@/content/about.mdx'

export const metadata: Metadata = {
    title: 'About',
    description: 'TLDR; I love coding, I love video games, I love art.',
    alternates: {
        canonical: '/about/'
    }
}

const About = () => {
    return (
        <>
            <div>
                <PageHeader>
                    <PageHeaderHeading>About</PageHeaderHeading>
                    <PageHeaderDescription>
                        TLDR; I love coding, video games & art - therefore
                        SoopaNova was forged.
                    </PageHeaderDescription>
                </PageHeader>

                <AboutContent />
            </div>
        </>
    )
}

export default About
