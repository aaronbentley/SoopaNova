import { authMiddleware } from '@clerk/nextjs'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

const middleware = authMiddleware({
    // export default authMiddleware({
    // Public routes accessible to all users
    publicRoutes: [
        '/',
        '/screenshots/',
        '/faq/',
        '/about/',
        '/sign-up/',
        '/sign-in/'
    ],
    debug: false
})

export default middleware

export const config = {
    matcher: ['/', '/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)']
}
