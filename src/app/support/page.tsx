import { TextLink } from '@/components/mdx/text-link'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { PageSection } from '@/components/page-section'
import SupportForm from '@/components/support-form'
import { Metadata } from 'next'

/**
 * Fail the build if anything makes this page render per request
 */
export const ensureStatic = 'navigation'

export const metadata: Metadata = {
    title: 'Support',
    description:
        'Questions about an order, a problem with a print, or a copyright concern? Send us a message.',
    alternates: {
        canonical: '/support/'
    }
}

/**
 * Shortcuts beside the form, for things customers can sort out themselves
 */
const shortcuts = [
    {
        title: 'Quick answers',
        body: (
            <>
                Delivery, sizes, cancelling and more are covered in the{' '}
                <TextLink href='/faq/'>FAQ</TextLink>.
            </>
        )
    },
    {
        title: 'Cancel an order',
        body: (
            <>
                You can cancel from your{' '}
                <TextLink href='/orders/'>orders</TextLink> for 90 minutes after
                you order, with a full refund.
            </>
        )
    }
]

const Support = () => {
    return (
        <>
            <div>
                <PageHeader eyebrow='Help'>
                    <PageHeaderHeading>Support</PageHeaderHeading>
                    <PageHeaderDescription>
                        Stuck on a level? Send us a message and we&apos;ll reply
                        by email.
                    </PageHeaderDescription>
                </PageHeader>

                <PageSection className='md:py-10'>
                    <div className='grid w-full gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16'>
                        <SupportForm />
                        <aside className='flex flex-col gap-8'>
                            {shortcuts.map((shortcut) => (
                                <div
                                    key={shortcut.title}
                                    className='flex flex-col gap-2'>
                                    <p className='eyebrow text-muted-foreground'>
                                        {shortcut.title}
                                    </p>
                                    <p className='text-sm text-pretty text-muted-foreground'>
                                        {shortcut.body}
                                    </p>
                                </div>
                            ))}
                        </aside>
                    </div>
                </PageSection>
            </div>
        </>
    )
}

export default Support
