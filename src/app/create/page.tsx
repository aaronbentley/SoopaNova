import CatalogueProvider from '@/components/catalogue-provider'
import CheckoutToast from '@/components/checkout-toast'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import UploadFile from '@/components/upload-file'
import { getCatalogue } from '@/lib/catalogue-store'
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next'
import { Suspense } from 'react'

/**
 * Signed-in content renders per request, but the header, footer and
 * loading state must stay static so the page appears at once
 */
export const ensureStatic = 'shell'

/**
 * instant = false: kept on purpose. auth.protect() must run before the page
 * renders (the Clerk ESLint rule requires it at the top), so navigating here
 * waits for the server and shows the loading spinner meanwhile
 */
export const instant = false

export const metadata: Metadata = {
    title: 'Create',
    description:
        'Turn your gaming screenshots into mighty-fine artwork for your space.',
    alternates: {
        canonical: '/create/'
    }
}

const Create = async () => {
    /**
     * Redirect signed-out visitors to sign-in
     */
    await auth.protect()

    const catalogue = await getCatalogue()

    return (
        <>
            <div>
                <PageHeader eyebrow='Power-up prints'>
                    <PageHeaderHeading>
                        Start with a screenshot
                    </PageHeaderHeading>
                    <PageHeaderDescription>
                        Turn your gaming screenshots into mighty-fine artwork
                        for your space.
                    </PageHeaderDescription>
                    <CatalogueProvider catalogue={catalogue}>
                        <UploadFile className='my-16' />
                    </CatalogueProvider>
                    <Suspense>
                        <CheckoutToast />
                    </Suspense>
                </PageHeader>
            </div>
        </>
    )
}

export default Create
