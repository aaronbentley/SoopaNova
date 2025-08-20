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

export const metadata: Metadata = {
    title: 'Screenshots',
    description:
        'How to download your gaming screenshots, ready to create awesome prints.',
    alternates: {
        canonical: '/screenshots/'
    }
}

const Screenshots = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Choose Your Platform</PageHeaderHeading>
                    <PageHeaderDescription>
                        Before creating your prints, you&apos;ll need to
                        download your screenshot files. Here&apos;s how to do it
                        for popular platforms:
                    </PageHeaderDescription>

                    <div className='w-full grid md:grid-flow-dense md:grid-cols-3 gap-8 mt-12 md:mt-24'>
                        <Link href='/screenshots/xbox/'>
                            <Card className='group transition-all duration-200 hover:border-primary dark:hover:border-primary'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-primary transition-colors duration-200'>
                                        Xbox
                                        <XboxIcon className='absolute opacity-20 text-muted-foreground group-hover:fill-primary transition-all duration-200 top-0 right-6 size-8 sm:size-10 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                    <CardDescription>Microsoft</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href='/screenshots/playstation/'>
                            <Card className='group transition-all duration-200 hover:border-primary dark:hover:border-primary'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-primary transition-colors duration-200'>
                                        PlayStation
                                        <PlaystationIcon className='absolute opacity-20 text-muted-foreground group-hover:fill-primary transition-all duration-200 top-0 right-6 size-8 sm:size-10 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                    <CardDescription>Sony</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href='/screenshots/steam/'>
                            <Card className='group transition-all duration-200 hover:border-primary dark:hover:border-primary'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-primary transition-colors duration-200'>
                                        Steam
                                        <SteamIcon className='absolute opacity-20 text-muted-foreground group-hover:fill-primary transition-all duration-200 top-0 right-6 size-8 sm:size-10 group-hover:opacity-100 stroke-1' />
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
