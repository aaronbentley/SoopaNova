'use client'

import { useClerk } from '@clerk/nextjs'
import type { SetActiveNavigate } from '@clerk/nextjs/types'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Navigate once a sign-in/up has created a session (finalize() and
 * HandleSSOCallback) to Clerk's after sign-in/up URL (the
 * NEXT_PUBLIC_CLERK_*_REDIRECT_URL env vars)
 */
export const useAuthNavigate = (flow: 'sign-in' | 'sign-up' = 'sign-in') => {
    const clerk = useClerk()
    const router = useRouter()

    return useCallback<SetActiveNavigate>(
        ({ session, decorateUrl }) => {
            /**
             * Session tasks aren't used by this instance (no orgs or forced
             * MFA), but don't stall if one ever appears
             */
            const after = session?.currentTask
                ? '/account/'
                : flow === 'sign-up'
                  ? clerk.buildAfterSignUpUrl()
                  : clerk.buildAfterSignInUrl()

            /**
             * Same-origin URLs become paths so the router can handle them
             */
            const afterUrl = new URL(after, window.location.href)
            const destination =
                afterUrl.origin === window.location.origin
                    ? `${afterUrl.pathname}${afterUrl.search}${afterUrl.hash}`
                    : afterUrl.href

            /**
             * decorateUrl can return an absolute URL (Safari ITP cookie
             * refresh), which needs a full page load
             */
            const url = decorateUrl(destination)

            if (url.startsWith('http')) {
                window.location.href = url
            } else {
                router.push(url)
            }
        },
        [clerk, flow, router]
    )
}
