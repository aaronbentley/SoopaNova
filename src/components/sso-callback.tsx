'use client'

import { useAuthNavigate } from '@/hooks/use-auth-navigate'
/**
 * @clerk/nextjs 7.9.9 bundles HandleSSOCallback but doesn't export it; import
 * it from @clerk/react (the same copy @clerk/nextjs uses) until it does
 */
import { HandleSSOCallback } from '@clerk/react'
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
