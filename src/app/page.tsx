import { PlaystationIcon, SteamIcon, XboxIcon } from '@/components/brand-icons'
import { Hero, HeroDescription, HeroHeading } from '@/components/hero'
import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import ScrollToTarget from '@/components/scroll-to-target'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import UploadFile from '@/components/upload-file'
import { cn } from '@/lib/utils'
import { SignedIn, auth } from '@clerk/nextjs'
import {
    BoxSelect,
    ChevronDown,
    Expand,
    Frame,
    Gamepad2,
    Image as LucideImage,
    Package,
    ShoppingBag,
    UploadCloud
} from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import bedroomPoster from '../assets/img/bedroom-poster.jpg'
import galleryFrame from '../assets/img/gallery-frame.jpg'
import roomCanvas from '../assets/img/room-canvas.jpg'

export const metadata: Metadata = {
    title: {
        absolute: `${process.env.APP_TITLE!} - ${process.env.APP_STRAPLINE!}`
    }
}

const Frontpage = () => {
    /**
     * Get the userId from auth()
     */
    const { userId } = auth()
    return (
        <>
            <Hero className='h-screen md:h-full pt-16 md:pt-0'>
                <Badge
                    variant='secondary'
                    className='flex justify-around py-2 px-4'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Gamepad2 className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                        </TooltipTrigger>
                        <TooltipContent>Play Games</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <BoxSelect className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                        </TooltipTrigger>
                        <TooltipContent>Capture Screenshots</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <UploadCloud className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                        </TooltipTrigger>
                        <TooltipContent>Upload Screenshots</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ShoppingBag className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                        </TooltipTrigger>
                        <TooltipContent>Choose Print Options</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Package className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                        </TooltipTrigger>
                        <TooltipContent>Fast Shipping</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <LucideImage className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                        </TooltipTrigger>
                        <TooltipContent>Pixel-Perfect Prints</TooltipContent>
                    </Tooltip>
                </Badge>
                <HeroHeading>From Pixels to Prints</HeroHeading>
                <HeroDescription>
                    Print your gaming screenshots, preserve your gaming moments.
                </HeroDescription>

                <SignedIn>
                    <UploadFile className='mt-2' />
                </SignedIn>

                <ScrollToTarget
                    target='customise-your-prints'
                    className={cn(!userId && 'mt-8')}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size='icon'
                                variant='link'
                                className='w-9 px-0'>
                                <ChevronDown className='h-9 w-9 text-neutral-300 dark:text-neutral-700 origin-bottom animate-bounce ease-in-out hover:text-pink-500 hover:dark:text-pink-500' />
                                <span className='sr-only'>View more</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Learn more</TooltipContent>
                    </Tooltip>
                </ScrollToTarget>
            </Hero>

            <PageSection
                id='customise-your-prints'
                className='w-full flex flex-col items-center gap-8 py-16 md:py-24'>
                <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl text-center md:text-5xl lg:tracking-[-0.035em] lg:text-6xl xl:text-7xl'>
                    Upload Your Screenshots. Create Your Prints.
                </h2>
                <p className='text-lg sm:text-2xl text-neutral-500 dark:text-neutral-500 max-w-[240px] sm:max-w-[340px] text-center'>
                    Make something awesome. Make it your own.
                </p>

                <div className='grid md:grid-flow-dense md:grid-cols-3 gap-8 mt-2'>
                    <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                        <CardHeader className='relative'>
                            <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                Choose type
                                <Frame className='absolute opacity-20 text-neutral-500 group-hover:text-pink-500 transition-all duration-200 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 group-hover:opacity-100 stroke-1' />
                            </CardTitle>
                            <CardDescription>
                                Show your &apos;shot
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Choose a Poster, Canvas or Framed Print, add
                                gallery-quality frames if it takes your fancy.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                        <CardHeader className='relative'>
                            <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                Pick size
                                <Expand className='absolute opacity-20 text-neutral-500 group-hover:text-pink-500 transition-all duration-200 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 group-hover:opacity-100 stroke-1' />
                            </CardTitle>
                            <CardDescription>
                                Go big (or go small)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Everything looks better, bigger. Sizes from
                                8&Prime;x14&Prime; all the way up to
                                38&Prime;x70&Prime;.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                        <CardHeader className='relative'>
                            <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                You&apos;re done
                                <ShoppingBag className='absolute opacity-20 text-neutral-500 group-hover:text-pink-500 transition-all duration-200 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 group-hover:opacity-100 stroke-1' />
                            </CardTitle>
                            <CardDescription>
                                Get back to gaming
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                We&apos;ll do the rest, your prints are expertly
                                crafted by hand and delivered to you in a few
                                days.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Link
                    href='/create/'
                    title='Create your prints'
                    className={cn([
                        buttonVariants({ variant: 'default', size: 'lg' }),
                        'bg-pink-500 dark:bg-pink-500 hover:bg-pink-500/90 dark:hover:bg-pink-500/90 mt-8'
                    ])}>
                    Get Started
                </Link>
            </PageSection>

            <PageSection
                id='screenshot-guides'
                className='w-full flex flex-col items-center gap-8 py-16 md:pt-24 md:pb-48'>
                <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl text-center md:text-5xl lg:tracking-[-0.035em] lg:text-6xl xl:text-7xl'>
                    Choose Your Platform
                </h2>
                <p className='text-lg sm:text-2xl text-neutral-500 dark:text-neutral-500 max-w-[240px] sm:max-w-[340px] text-center'>
                    Here&apos;s how to download your gaming screenshots.
                </p>

                <div className='w-full grid md:grid-flow-dense md:grid-cols-3 gap-8 mt-2'>
                    <Link href='/screenshots/xbox/'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    Xbox
                                    <XboxIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                                </CardTitle>
                                <CardDescription>Microsoft</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href='/screenshots/playstation/'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    PlayStation
                                    <PlaystationIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                                </CardTitle>
                                <CardDescription>Sony</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href='/screenshots/steam/'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    Steam
                                    <SteamIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                                </CardTitle>
                                <CardDescription>Valve</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </PageSection>

            <PageSection
                id='product-types'
                className='w-full flex flex-col items-center gap-8 py-16 md:pt-24 md:pb-48'>
                <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl text-center md:text-5xl lg:tracking-[-0.035em] lg:text-6xl xl:text-7xl'>
                    Power-up Prints
                </h2>
                <p className='text-lg sm:text-2xl text-neutral-500 dark:text-neutral-500 max-w-[240px] sm:max-w-[340px] text-center'>
                    Create mighty-fine artwork for your space.
                </p>

                <div className='flex flex-col gap-24 mt-12 md:mt-24'>
                    <div className='w-full grid md:grid-flow-dense md:grid-cols-2 gap-12 mt-2 place-content-center'>
                        <div className='flex flex-col justify-center gap-4 order-2 md:order-1'>
                            <PageSectionHeading>
                                Poster Prints
                            </PageSectionHeading>
                            <PageSectionDescription>
                                Poster Prints are produced using premium 300gsm
                                matte fine art paper, ideal for high resolution
                                digital art, this results in extremely crisp and
                                accurate detail in tonal range for art prints
                                that make a statement.
                            </PageSectionDescription>
                        </div>
                        <div className='order-1 md:order-2'>
                            <Image
                                src={bedroomPoster}
                                alt='Bedroom Poster Print'
                                placeholder='blur'
                                sizes='(max-width: 767px) 100vw, (min-width: 768px) 50vw'
                                className='shadow-neutral-300/75 dark:shadow-neutral-700/75 shadow-xl'
                            />
                        </div>
                    </div>

                    <div className='w-full grid md:grid-flow-dense md:grid-cols-2 gap-12 mt-2 place-content-center'>
                        <div className='flex flex-col justify-center gap-4 order-2'>
                            <PageSectionHeading>
                                Canvas Prints
                            </PageSectionHeading>
                            <PageSectionDescription>
                                Canvas Prints are produced using the highest
                                quality canvas, UV coated and designed to last
                                with no fading - Canvas printing done right:
                                museum-quality, expertly crafted, ready to hang.
                            </PageSectionDescription>
                        </div>
                        <div className='order-1'>
                            <Image
                                src={roomCanvas}
                                alt='Room Canvas Print'
                                placeholder='blur'
                                sizes='(max-width: 767px) 100vw, (min-width: 768px) 50vw'
                                className='shadow-neutral-300/75 dark:shadow-neutral-700/75 shadow-xl'
                            />
                        </div>
                    </div>

                    <div className='w-full grid md:grid-flow-dense md:grid-cols-2 gap-12 mt-2 place-content-center'>
                        <div className='flex flex-col justify-center gap-4 order-2 md:order-1'>
                            <PageSectionHeading>
                                Framed Prints
                            </PageSectionHeading>
                            <PageSectionDescription>
                                Our Framed Prints feature all the quality of our
                                Poster Prints, with premium solid wood frames
                                (choose from black, white, and dark brown
                                coating options), and paired with ultra-low
                                glare plexiglass to ensure your prints get all
                                the attention.
                            </PageSectionDescription>
                        </div>
                        <div className='order-1 md:order-2'>
                            <Image
                                src={galleryFrame}
                                alt='Gallery Framed Print'
                                placeholder='blur'
                                sizes='(max-width: 767px) 100vw, (min-width: 768px) 50vw'
                                className='shadow-neutral-300/75 dark:shadow-neutral-700/75 shadow-xl'
                            />
                        </div>
                    </div>
                </div>
            </PageSection>
        </>
    )
}

export default Frontpage
