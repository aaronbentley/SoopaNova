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
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Steam Screenshots',
    description:
        "Here's how to get your Steam screenshots, ready to create awesome prints."
}

const ScreenshotsSteam = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Steam Screenshots</PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your Steam screenshots, ready to create
                        awesome prints.
                    </PageHeaderDescription>
                </PageHeader>
            </div>

            <div className='container'>
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

export default ScreenshotsSteam
