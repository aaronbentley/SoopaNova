import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { Metadata } from 'next'
import AboutContent from '@/content/about.mdx'

/**
 * Fail the build if anything makes this page render per request
 */
export const ensureStatic = 'navigation'

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
                <PageHeader eyebrow='Origin story'>
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
