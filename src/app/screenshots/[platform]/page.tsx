import { platforms } from '@/assets/data/platforms'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { PageSection } from '@/components/page-section'
import PlatformTile, { PlatformStrip } from '@/components/platform-tile'
import type { MDXContent } from 'mdx/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ platform: string }> }

const findPlatform = (slug: string) =>
    platforms.find((platform) => platform.slug === slug)

/**
 * One static page per platform; anything else is a 404
 */
export const dynamicParams = false

export const generateStaticParams = () =>
    platforms.map(({ slug }) => ({ platform: slug }))

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const platform = findPlatform((await params).platform)

    if (!platform) return {}

    return {
        title: `${platform.name} Screenshots`,
        description: platform.description,
        alternates: {
            canonical: platform.href
        }
    }
}

const ScreenshotGuide = async ({ params }: Props) => {
    const platform = findPlatform((await params).platform)

    if (!platform) notFound()

    /**
     * The guide's copy, from src/content/screenshots/
     */
    const { default: Guide }: { default: MDXContent } = await import(
        `@/content/screenshots/${platform.slug}.mdx`
    )

    return (
        <>
            <div>
                <PageHeader eyebrow='Screenshots'>
                    <PageHeaderHeading>{platform.name}</PageHeaderHeading>
                    <PageHeaderDescription>
                        {platform.description}
                    </PageHeaderDescription>
                    <PlatformStrip className='mt-6 w-full overflow-hidden rounded-xl border bg-background'>
                        {platform.sections.map((section) => (
                            <PlatformTile
                                key={section.id}
                                href={`#${section.id}`}
                                name={section.name}
                                className='px-6'
                            />
                        ))}
                    </PlatformStrip>
                </PageHeader>
            </div>

            <div>
                <Guide components={{ Section: PageSection }} />
            </div>
        </>
    )
}

export default ScreenshotGuide
