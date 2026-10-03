import { platforms } from '@/assets/data/platforms'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import PlatformTile, { PlatformStrip } from '@/components/platform-tile'
import { Metadata } from 'next'

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
            <div>
                <PageHeader>
                    <PageHeaderHeading>Choose Your Platform</PageHeaderHeading>
                    <PageHeaderDescription>
                        Before creating your prints, you&apos;ll need to
                        download your screenshot files. Here&apos;s how to do it
                        for popular platforms:
                    </PageHeaderDescription>

                    <PlatformStrip className='mt-6 w-full overflow-hidden rounded-xl border bg-background'>
                        {platforms.map((platform) => (
                            <PlatformTile
                                key={platform.href}
                                href={platform.href}
                                name={platform.name}
                                detail={platform.maker}
                                className='px-6'
                            />
                        ))}
                    </PlatformStrip>
                </PageHeader>
            </div>
        </>
    )
}

export default Screenshots
