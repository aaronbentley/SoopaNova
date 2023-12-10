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

/**
 * About page content
 *
 * 1. Establish a mission statement.
 * 2. Outline your company story.
 * 3. Reveal how you’ve evolved.
 * 4. State your “aha!” moment.
 * 5. Explain whom you serve.
 * 6. Explain what you’re offering them.
 * 7. Cite examples of whom you’ve served.
 * 8. Describe your values.
 *
 * @link https://blog.hubspot.com/marketing/remarkable-about-us-page-examples
 */

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

            {/* <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>
                    How do I download my screenshots?
                </PageSectionHeading>
                <Typography variant='p'>
                    I love coding, I love video games, I love art - therefore
                    SoopaNova was forged.
                </Typography>
                <Typography variant='p'>
                    I love coding, I love video games, I love art - therefore
                    SoopaNova was forged.
                </Typography>
                <PageSectionDescription>
                    I love coding, I love video games, I love art - therefore
                    SoopaNova was forged.
                </PageSectionDescription>
            </PageSection> */}
        </>
    )
}

export default About
