import { clerkMiddleware } from '@clerk/nextjs/server'

/**
 * Clerk middleware only: each page, route handler and Server Function checks
 * auth itself (enforced by @clerk/next/require-auth-protection)
 */
export default clerkMiddleware({
    debug: false
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
