import { Hero, HeroDescription, HeroHeading } from '@/components/hero'
import { Badge } from '@/components/ui/badge'
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
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import UploadFile from '@/components/upload-file'
import {
    BoxSelect,
    Gamepad2,
    Image as LucideImage,
    Package,
    ShoppingBag
} from 'lucide-react'

const Frontpage = () => {
    return (
        <>
            <Hero className='h-screen'>
                <TooltipProvider>
                    <Badge
                        variant='secondary'
                        className='flex justify-around py-2 px-4'>
                        <Tooltip>
                            <TooltipTrigger>
                                <Gamepad2 className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                            </TooltipTrigger>
                            <TooltipContent>Play Games</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <BoxSelect className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                            </TooltipTrigger>
                            <TooltipContent>Capture Screenshots</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <ShoppingBag className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                            </TooltipTrigger>
                            <TooltipContent>
                                Choose Print Options
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Package className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                            </TooltipTrigger>
                            <TooltipContent>Fast Shipping</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <LucideImage className='h-4 hover:text-pink-500 hover:scale-150 transition-all duration-200' />
                            </TooltipTrigger>
                            <TooltipContent>
                                Pixel-Perfect Prints
                            </TooltipContent>
                        </Tooltip>
                    </Badge>
                </TooltipProvider>
                <HeroHeading>From Pixels to Prints</HeroHeading>
                <HeroDescription>
                    Print your gaming screenshots and preserve your gaming
                    moments.
                </HeroDescription>
                <UploadFile className='mt-2' />
                {/* <Button
                    size='icon'
                    variant='ghost'
                    className='w-9 px-0'>
                    <ChevronDown className='h-9 w-9 text-neutral-400 dark:text-neutral-600' />
                    <span className='sr-only'>View more</span>
                </Button> */}
            </Hero>

            <div
                // ref={ref}
                className='container w-full flex flex-col items-center gap-8 py-24 md:py-48'>
                <h2 className='text-2xl font-extrabold tracking-tight sm:text-4xl text-center md:text-5xl lg:tracking-tighter lg:text-6xl xl:text-7xl'>
                    Customise Your Prints
                </h2>

                <p className='text-xl text-neutral-500 dark:text-neutral-500 max-w-[500px]'>
                    Make something awesome - make it your own.
                </p>

                <div className='grid md:grid-flow-dense md:grid-cols-3 gap-8'>
                    <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                        <CardHeader>
                            <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                Choose a print
                            </CardTitle>
                            <CardDescription>Take your pick</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Select a Poster, Canvas or Framed Print and opt
                                for gallery-quality frames if you wanna.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                        <CardHeader>
                            <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                Pick a size
                            </CardTitle>

                            <CardDescription>
                                Go big (or go small)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Everything looks better, bigger. Sizes from
                                8&Prime;x14&Prime; all the way to
                                38&Prime;x70&Prime;.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                        <CardHeader>
                            <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                You&apos;re all done
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
            </div>
        </>
    )
}

export default Frontpage
