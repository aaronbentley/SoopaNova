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
    title: 'Xbox Screenshots',
    description:
        "Here's how to get your Xbox screenshots, ready to create awesome prints."
}

const ScreenshotsXbox = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Xbox Screenshots</PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your Xbox screenshots, ready to create
                        awesome prints.
                    </PageHeaderDescription>
                </PageHeader>
            </div>

            <div className='container'>
                <PageSection>
                    <PageSectionHeading>Xbox</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your Xbox screenshots.
                    </PageSectionDescription>

                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 gap-8 mt-2'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    On Your Phone
                                    <Smartphone className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-1 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>Xbox App</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    The Xbox App for mobile lets you save your
                                    screenshots to your phone.
                                </p>

                                <ol className='list-decimal list-inside mt-4'>
                                    <li>Open the Xbox App</li>
                                    <li>
                                        Navigate to the{' '}
                                        <strong>
                                            &ldquo;My Library&rdquo;
                                        </strong>{' '}
                                        tab
                                    </li>
                                    <li>
                                        Choose the screenshot you want and tap{' '}
                                        <strong>&ldquo;Save&rdquo;</strong>
                                    </li>
                                </ol>
                            </CardContent>
                            <CardContent>
                                <div className='flex gap-2 mt-2'>
                                    <Link
                                        href='https://apps.apple.com/app/xbox/id736179781'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline'
                                            })
                                        )}>
                                        App Store
                                    </Link>
                                    <Link
                                        href='https://play.google.com/store/apps/details?id=com.microsoft.xboxone.smartglass&hl'
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
                            <CardContent>
                                <p>
                                    The Xbox App for Windows lets you save your
                                    screenshots to your PC.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsXbox
