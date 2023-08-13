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
import { Metadata } from 'next'
import Image from 'next/image'
import roomImage from '../../assets/img/room.jpg'

export const metadata: Metadata = {
    title: 'Prints',
    description:
        'Transform your gaming screenshots into mighty-fine artwork for your space.'
}

const Prints = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Power-up Prints</PageHeaderHeading>
                    <PageHeaderDescription>
                        Transform your gaming screenshots into mighty-fine
                        artwork for your space.
                    </PageHeaderDescription>
                </PageHeader>

                <PageSection>
                    <PageSectionHeading>Poster Prints</PageSectionHeading>
                    <PageSectionDescription>
                        Poster Prints are produced using premium 300gsm matte
                        fine art paper, ideal for high resolution digital art,
                        this results in extremely crisp and accurate detail in
                        tonal range for art prints that make a statement.
                    </PageSectionDescription>
                    <Image
                        src={roomImage}
                        // width={500}
                        // height={500}
                        alt='Picture of the author'
                        placeholder='blur'
                        className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                    />
                </PageSection>

                <PageSection>
                    <PageSectionHeading>Canvas Prints</PageSectionHeading>
                    <PageSectionDescription>
                        Canvas Prints are produced using the highest quality
                        canvas, UV coated and designed to last with no fading -
                        Canvas printing done right: museum-quality, expertly
                        crafted, ready to hang.
                    </PageSectionDescription>
                    <Image
                        src={roomImage}
                        // width={500}
                        // height={500}
                        alt='Picture of the author'
                        placeholder='blur'
                        className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                    />
                </PageSection>

                <PageSection>
                    <PageSectionHeading>Framed Prints</PageSectionHeading>
                    <PageSectionDescription>
                        Our Framed Prints feature all the quality of our Poster
                        Prints, with premium solid wood frames (choose from
                        black, white, and dark brown coating options), and
                        paired with ultra-low glare plexiglass to ensure your
                        prints get all the attention.
                    </PageSectionDescription>
                    <Image
                        src={roomImage}
                        // width={500}
                        // height={500}
                        alt='Picture of the author'
                        placeholder='blur'
                        className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                    />
                </PageSection>
            </div>
        </>
    )
}

export default Prints
