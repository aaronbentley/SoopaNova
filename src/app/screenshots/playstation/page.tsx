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
    title: 'PlayStation Screenshots',
    description:
        "Here's how to get your PlayStation screenshots, ready to create awesome prints."
}

const ScreenshotsPlaystation = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>
                        PlayStation Screenshots
                    </PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your PlayStation screenshots, ready to
                        create awesome prints.
                    </PageHeaderDescription>
                </PageHeader>
            </div>

            <div className='container'>
                <PageSection>
                    <PageSectionHeading>PlayStation</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your PlayStation screenshots.
                    </PageSectionDescription>

                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 gap-8 mt-2'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    On Your Phone
                                    <Smartphone className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-1 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>
                                    PlayStation App
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex gap-2 mt-2'>
                                    <Link
                                        href='https://apps.apple.com/app/apple-store/id410896080'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline'
                                            })
                                        )}>
                                        App Store
                                    </Link>
                                    <Link
                                        href='https://play.google.com/store/apps/details?id=com.scee.psxandroid'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline'
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
                                    On Your PC
                                    <Laptop2 className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-2 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>
                                    Xbox App for Windows
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsPlaystation
