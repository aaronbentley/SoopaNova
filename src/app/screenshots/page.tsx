import { PlaystationIcon, SteamIcon, XboxIcon } from '@/components/brand-icons'
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
import ScrollToTarget from '@/components/scroll-to-target'
import { buttonVariants } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Laptop2, Smartphone } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Screenshots',
    description:
        "Here's how to get your gaming screenshots, ready to create awesome prints."
}

const Screenshots = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Screenshots</PageHeaderHeading>
                    <PageHeaderDescription>
                        Here&apos;s how to get your gaming screenshots, ready to
                        create awesome prints.
                    </PageHeaderDescription>
                </PageHeader>

                <PageSection>
                    <PageSectionHeading>
                        Get your screenshot files
                    </PageSectionHeading>
                    <PageSectionDescription>
                        You&apos;ll need to get your screenshot files before
                        creating your prints. Here&apos;s how to do it for the
                        most popular platforms:
                    </PageSectionDescription>
                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-2'>
                        <ScrollToTarget
                            target='xbox'
                            className='cursor-pointer'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        Xbox
                                        <XboxIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                    <CardDescription>Microsoft</CardDescription>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                        <ScrollToTarget
                            target='playstation'
                            className='cursor-pointer'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        PlayStation
                                        <PlaystationIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                    <CardDescription>Sony</CardDescription>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                        <ScrollToTarget
                            target='steam'
                            className='cursor-pointer'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        Steam
                                        <SteamIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-8 w-8 sm:h-10 sm:w-10 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                    <CardDescription>Valve</CardDescription>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                    </div>
                </PageSection>
            </div>

            <div
                id='xbox'
                className='container'>
                <PageSection>
                    <PageSectionHeading>Xbox</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your Xbox screenshots.
                    </PageSectionDescription>

                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 gap-8 mt-2'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    Phone
                                    <Smartphone className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-1 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>Xbox App</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>App Store links</p>

                                <div className='flex gap-2 mt-2'>
                                    <Link
                                        href='https://apps.apple.com/app/xbox/id736179781'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'default'
                                            })
                                        )}>
                                        App Store
                                    </Link>
                                    <Link
                                        href='https://play.google.com/store/apps/details?id=com.microsoft.xboxone.smartglass&hl'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'default'
                                            })
                                        )}>
                                        Google Play
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    PC
                                    <Laptop2 className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-2 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>
                                    Xbox app for Windows PC
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </PageSection>
            </div>

            <div
                id='playstation'
                className='container'>
                <PageSection>
                    <PageSectionHeading>PlayStation</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your PlayStation screenshots.
                    </PageSectionDescription>
                </PageSection>
            </div>

            <div
                id='steam'
                className='container'>
                <PageSection>
                    <PageSectionHeading>Steam</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your Steam screenshots.
                    </PageSectionDescription>
                </PageSection>
            </div>
        </>
    )
}

export default Screenshots
