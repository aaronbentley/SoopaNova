import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: `Not Found - ${process.env.APP_TITLE!}`,
    description: "We couldn't find the requested resource."
}

const NotFound = () => (
    <>
        <div className='container'>
            <PageHeader>
                <PageHeaderHeading>Not Found</PageHeaderHeading>
                <PageHeaderDescription>
                    We couldn&apos;t find the requested resource.
                </PageHeaderDescription>
                <Link
                    href='/'
                    className={cn(buttonVariants({ variant: 'link' }), [
                        'px-0',
                        'mt-4',
                        'hover:text-pink-500',
                        'hover:dark:text-pink-500'
                    ])}>
                    Return Home
                </Link>
            </PageHeader>
        </div>
    </>
)

export default NotFound
