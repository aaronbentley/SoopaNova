import { Hero, HeroDescription, HeroHeading } from '@/components/hero'
import ScrollToTarget from '@/components/scroll-to-target'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

export const metadata: Metadata = {
    title: {
        absolute: `${process.env.APP_TITLE!} - From Pixels to Prints`
    }
}

const Frontpage = () => {
    return (
        <>
            <Hero className='h-screen sm:h-full'>
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
                    Print your gaming screenshots and preserve your gaming
                    moments.
                </HeroDescription>
                <UploadFile className='mt-2' />
                <ScrollToTarget target='customise-your-prints'>
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

            <section
                id='customise-your-prints'
                className='container w-full flex flex-col items-center gap-8 py-24 md:py-48 min-h-screen'>
                <h2 className='text-2xl font-extrabold tracking-tight sm:text-4xl text-center md:text-5xl lg:tracking-tighter lg:text-6xl xl:text-7xl'>
                    Customise Your Prints
                </h2>
                <p className='text-lg sm:text-2xl text-neutral-500 dark:text-neutral-500 max-w-[240px] sm:max-w-[340px] text-center'>
                    Make something awesome. Make it your own.
                </p>

                <div className='grid md:grid-flow-dense sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2'>
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
                                Choose a Poster, Canvas or Framed Print, and opt
                                for gallery-quality frames if it takes your
                                fancy.
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
            </section>
        </>
    )
}

export default Frontpage
