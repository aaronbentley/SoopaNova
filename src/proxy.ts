import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * Define protected routes
 */
const isProtectedRoute = createRouteMatcher(['/create', '/orders(.*)'])

export default clerkMiddleware(
    async (auth, req) => {
        if (isProtectedRoute(req)) await auth.protect()
    },
    {
        debug: false
        // debug: process.env.NODE_ENV === 'development'
    }
)

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
