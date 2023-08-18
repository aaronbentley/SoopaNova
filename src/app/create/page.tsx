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
import UploadFile from '@/components/upload-file'
import { Metadata } from 'next'
import Image from 'next/image'
import bedroomPoster from '../../assets/img/bedroom-poster.jpg'
import galleryFrame from '../../assets/img/gallery-frame.jpg'
import roomCanvas from '../../assets/img/room-canvas.jpg'

export const metadata: Metadata = {
    title: 'Create Prints',
    description:
        'Transform your gaming screenshots into mighty-fine artwork for your space.'
}

const Create = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Power-up Prints</PageHeaderHeading>
                    <PageHeaderDescription>
                        Transform your gaming screenshots into mighty-fine
                        artwork for your space.
                    </PageHeaderDescription>
                    <UploadFile className='my-16' />
                </PageHeader>
            </div>

            <div className='container'>
                <PageSection>
                    <Image
                        src={bedroomPoster}
                        alt='Bedroom Poster Print'
                        placeholder='blur'
                        sizes='(max-width: 1023px) 100vw, (min-width: 1024px) 95vw, (min-width: 1536px) 33vw'
                        className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                    />
                    <PageSectionHeading>Poster Prints</PageSectionHeading>
                    <PageSectionDescription>
                        Poster Prints are produced using premium 300gsm matte
                        fine art paper, ideal for high resolution digital art,
                        this results in extremely crisp and accurate detail in
                        tonal range for art prints that make a statement.
                    </PageSectionDescription>
                </PageSection>

                <PageSection>
                    <Image
                        src={roomCanvas}
                        alt='Room Canvas Print'
                        placeholder='blur'
                        sizes='(max-width: 1023px) 100vw, (min-width: 1024px) 95vw, (min-width: 1536px) 33vw'
                        className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                    />
                    <PageSectionHeading>Canvas Prints</PageSectionHeading>
                    <PageSectionDescription>
                        Canvas Prints are produced using the highest quality
                        canvas, UV coated and designed to last with no fading -
                        Canvas printing done right: museum-quality, expertly
                        crafted, ready to hang.
                    </PageSectionDescription>
                </PageSection>

                <PageSection>
                    <Image
                        src={galleryFrame}
                        alt='Gallery Framed Print'
                        placeholder='blur'
                        sizes='(max-width: 1023px) 100vw, (min-width: 1024px) 95vw, (min-width: 1536px) 33vw'
                        className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                    />
                    <PageSectionHeading>Framed Prints</PageSectionHeading>
                    <PageSectionDescription>
                        Our Framed Prints feature all the quality of our Poster
                        Prints, with premium solid wood frames (choose from
                        black, white, and dark brown coating options), and
                        paired with ultra-low glare plexiglass to ensure your
                        prints get all the attention.
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Create
