import { PlaystationIcon, SteamIcon, XboxIcon } from '@/components/brand-icons'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'Screenshots',
    description:
        "Here's how to get your gaming screenshots, ready to create awesome prints.",
    openGraph: {
        url: '/screenshots/'
    }
})

const Screenshots = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Choose Your Platform.</PageHeaderHeading>
                    <PageHeaderDescription>
                        Before creating your prints, you&apos;ll need to
                        download your screenshot files. Here&apos;s how to do it
                        for popular platforms:
                    </PageHeaderDescription>

                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-24'>
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
                </PageHeader>
            </div>
        </>
    )
}

export default Screenshots
