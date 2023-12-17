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

const About = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>About</PageHeaderHeading>
                    <PageHeaderDescription>
                        TLDR; I love coding, I love video games, I love art -
                        therefore SoopaNova was forged.
                    </PageHeaderDescription>
                </PageHeader>
            </div>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Prologue</PageSectionHeading>
                <PageSectionDescription>Hey,</PageSectionDescription>

                <PageSectionDescription>
                    I&apos;m Aaron, a software developer from the UK.
                </PageSectionDescription>

                <PageSectionDescription>
                    I love coding, I love video games, I love art.
                </PageSectionDescription>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Objective</PageSectionHeading>
                <PageSectionDescription>
                    To power-up your favourite video game screenshots into
                    mighty-fine artwork for your space, so you can display your
                    victories, scenic views, and crazy in-game moments IRL.
                </PageSectionDescription>
                <PageSectionDescription>
                    SoopaNova is here to make sure those memories last.
                </PageSectionDescription>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>History</PageSectionHeading>
                <PageSectionDescription>
                    Way back in April 2009, it was coming up to my brother, Jims
                    birthday.
                </PageSectionDescription>

                <PageSectionDescription>
                    He&apos;s a total petrol-head and was really into Forza
                    Motorsport 3 at the time. Jim had been taking loads of
                    screenshots of his cars and online victories.
                </PageSectionDescription>

                <PageSectionDescription>
                    I thought it would be a great idea to get one of his
                    screenshots printed onto a framed print for his birthday.
                </PageSectionDescription>

                <PageSectionDescription>
                    I secretly grabbed the screenshot file and ordered a print
                    of his favourite car (a McLaren F1 in papaya orange) from a
                    local print shop, then took the print to another company to
                    get it framed.
                </PageSectionDescription>

                <PageSectionDescription>
                    Jims birthday came around, and I handed over his gift.
                </PageSectionDescription>

                <PageSectionDescription>
                    <Typography variant='strong'>He loved it.</Typography>
                </PageSectionDescription>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Genesis</PageSectionHeading>
                <PageSectionDescription>
                    This got me thinking, there must be others out there who
                    would love to get their favourite screenshots printed,
                    without the effort of having to find a print shop and a
                    frame shop.
                </PageSectionDescription>

                <PageSectionDescription>
                    I noodled on this idea for a while, but never really threw
                    myself into it.
                </PageSectionDescription>
                <PageSectionDescription>
                    After all, the image resolution of screenshots at the time
                    were pretty low, and I didn&apos;t think that would
                    translate well into prints.
                </PageSectionDescription>

                <PageSectionDescription>
                    I felt, to quote Howard Stark,{' '}
                    <Typography variant='em'>
                        &quot;limited by the technology of my time&quot;
                    </Typography>
                    .
                </PageSectionDescription>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Evolution</PageSectionHeading>

                <PageSectionDescription>
                    Fast forward to 2022, and look how far we&apos;ve come. 4K
                    gaming is the norm, and the image resolution of screenshot
                    images are pretty damn good.
                </PageSectionDescription>

                <PageSectionDescription>
                    I thought to myself,{' '}
                    <Typography variant='strong'>
                        &quot;the time is right - I&apos;ve got to do this&quot;
                    </Typography>
                    .
                </PageSectionDescription>

                <PageSectionDescription>
                    I&apos;ve always wanted to start my own business, and I
                    thought this would be a great opportunity to do so.
                </PageSectionDescription>

                <PageSectionDescription>
                    Plus I now had 20+ years of experience in software and web
                    development, so I had the skills to build the app and
                    supporting systems to make it all work.
                </PageSectionDescription>

                <PageSectionDescription>
                    So I got to work - coding away in the dark hours, working
                    around a full time job and fulfilling my dad duties.
                </PageSectionDescription>

                <PageSectionDescription>
                    It took a little while, but I got there.
                </PageSectionDescription>
                <PageSectionDescription>
                    SoopaNova — a one-stop service for transforming your
                    favourite video game screenshots into mighty-fine artwork
                    for your space.
                </PageSectionDescription>
            </PageSection>

            <PageSection className='md:py-10 w-full'>
                <PageSectionHeading>Epilogue</PageSectionHeading>
                <PageSectionDescription>
                    At the time of writing, SoopaNova is on the verge of launch,
                    it&apos;s quite exciting!
                </PageSectionDescription>
                <PageSectionDescription>
                    Here&apos;s hoping I&apos;ve made something fun, that helps
                    people present their favourite gaming memories in a unique
                    way.
                </PageSectionDescription>
                <PageSectionDescription>
                    Thank you to my wife Eva & my darling daughters Lexi & Maddi
                    for your love & support, and for putting up with me
                    disappearing into the home office for hours at a time.
                </PageSectionDescription>
            </PageSection>
        </>
    )
}

export default About
