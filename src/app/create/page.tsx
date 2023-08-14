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
import roomImage from '../../assets/img/room.jpg'

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

            {/* <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2'>
                <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                    <CardHeader className='relative'>
                        <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                            Poster Prints
                            <XboxIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                        </CardTitle>
                        <CardDescription>Microsoft</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Image
                            src={roomImage}
                            // width={500}
                            // height={500}
                            alt='Picture of the author'
                            placeholder='blur'
                            className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                        />
                    </CardContent>
                    <CardContent>
                        Poster Prints are produced using premium 300gsm matte
                        fine art paper, ideal for high resolution digital art,
                        this results in extremely crisp and accurate detail in
                        tonal range for art prints that make a statement.
                    </CardContent>
                </Card>
                <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                    <CardHeader className='relative'>
                        <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                            Canvas Prints
                            <XboxIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                        </CardTitle>
                        <CardDescription>Microsoft</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Image
                            src={roomImage}
                            // width={500}
                            // height={500}
                            alt='Picture of the author'
                            placeholder='blur'
                            className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                        />
                    </CardContent>
                    <CardContent>
                        Canvas Prints are produced using the highest quality
                        canvas, UV coated and designed to last with no fading -
                        Canvas printing done right: museum-quality, expertly
                        crafted, ready to hang.
                    </CardContent>
                </Card>
                <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                    <CardHeader className='relative'>
                        <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                            Framed Prints
                            <XboxIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                        </CardTitle>
                        <CardDescription>Microsoft</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Image
                            src={roomImage}
                            // width={500}
                            // height={500}
                            alt='Picture of the author'
                            placeholder='blur'
                            className='shadow-neutral-300 dark:shadow-neutral-700 shadow-xl'
                        />
                    </CardContent>
                    <CardContent>
                        Our Framed Prints feature all the quality of our Poster
                        Prints, with premium solid wood frames (choose from
                        black, white, and dark brown coating options), and
                        paired with ultra-low glare plexiglass to ensure your
                        prints get all the attention.
                    </CardContent>
                </Card>
            </div> */}

            <div className='container'>
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

export default Create
