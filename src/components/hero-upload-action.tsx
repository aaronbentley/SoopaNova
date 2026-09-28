'use client'

import { ctaButtonVariants } from '@/components/cta-button'
import UploadFile from '@/components/upload-file'
import { useAuth } from '@clerk/nextjs'
import { UploadCloud } from 'lucide-react'
import Link from 'next/link'

/**
 * Hero "Upload a screenshot" button.
 *
 * Auth is read on the client so the homepage can be statically rendered.
 * Until Clerk confirms a signed-in user it's a link to /create/ (which goes
 * through sign-in); the two look the same, so nothing shifts on load.
 */
const HeroUploadAction = () => {
    const { isLoaded, isSignedIn } = useAuth()

    if (isLoaded && isSignedIn) return <UploadFile variant='button' />

    return (
        <Link
            href='/create/'
            className={ctaButtonVariants()}>
            <UploadCloud aria-hidden='true' />
            Upload a screenshot
        </Link>
    )
}

export default HeroUploadAction
