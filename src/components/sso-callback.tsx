'use client'

import { useAuthNavigate } from '@/hooks/use-auth-navigate'
import { HandleSSOCallback } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Finish an OAuth sign-in/up after the provider redirects back. Clerk works
 * out whether it's a new or existing account, and may show a CAPTCHA.
 */
const SsoCallback = () => {
    const router = useRouter()
    const navigate = useAuthNavigate()

    return (
        <div className='flex flex-col items-center gap-4'>
            <Loader2 className='size-6 animate-spin text-primary' />
            <p className='text-sm text-muted-foreground'>Signing you in…</p>
            <HandleSSOCallback
                navigateToApp={navigate}
                navigateToSignIn={() => router.push('/sign-in/')}
                navigateToSignUp={() => router.push('/sign-up/')}
            />
        </div>
    )
}

export default SsoCallback
