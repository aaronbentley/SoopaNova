import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import { Typography } from '@/components/typography'
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
                    {/* <PageHeaderDescription>
                        A worthy side quest
                    </PageHeaderDescription> */}
                </PageHeader>
            </div>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Mission Objective</PageSectionHeading>
                <PageSectionDescription>
                    To power-up your favourite video game screenshots into
                    mighty-fine artwork for your space, so you can display your
                    victories, scenic views, and crazy in-game moments IRL.
                </PageSectionDescription>
                <PageSectionDescription>
                    We&apos;re here to make sure those memories last.
                </PageSectionDescription>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>
                    Outline your company story
                </PageSectionHeading>
                <Typography
                    variant='p'
                    className='italic'>
                    [[Outline your company story]]
                </Typography>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>
                    Reveal how you&apos;ve evolved
                </PageSectionHeading>
                <Typography
                    variant='p'
                    className='italic'>
                    [[Reveal how you&apos;ve evolved]]
                </Typography>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>
                    State your &ldquo;aha!&rdquo; moment
                </PageSectionHeading>
                <Typography
                    variant='p'
                    className='italic'>
                    [[State your &ldquo;aha!&rdquo; moment]]
                </Typography>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Explain whom you serve</PageSectionHeading>
                <Typography
                    variant='p'
                    className='italic'>
                    [[Explain whom you serve]]
                </Typography>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>
                    Explain what you&apos;re offering them
                </PageSectionHeading>
                <Typography
                    variant='p'
                    className='italic'>
                    [[Explain what you&apos;re offering them]]
                </Typography>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Describe your values</PageSectionHeading>
                <Typography
                    variant='p'
                    className='italic'>
                    [[Describe your values]]
                </Typography>
            </PageSection>
        </>
    )
}

export default About
