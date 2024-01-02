import { authMiddleware } from '@clerk/nextjs'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

// const middleware = authMiddleware({
export default authMiddleware({
    /**
     * Explicit list of public routes accessible to all users
     */
    // publicRoutes: [
    //     '/',
    //     '/screenshots/(.*)',
    //     '/faq',
    //     '/about',
    //     '/not-found',
    //     '/opengraph-image',
    //     '/icon',
    //     '/terms',
    //     '/privacy'
    // ],

    /**
     * Negative assertion that makes only the '/create/' & '/orders/**' routes protected
     */
    publicRoutes: ['((?!^/create/|^/orders/).*)'],
    debug: false
})

// export default middleware

export const config = {
    // matcher: ['/', '/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)']
    // matcher: ['/', '/((?!.+\\.[\\w]+$|_next|_vercel).*)', '/(api|trpc)(.*)']
    // matcher: ['/((?!api/|_next/|_static|_vercel|[\\w-]+\\.\\w+).*)']
    matcher: [
        '/',
        // '/((?!api|_next/static|_next/image|_vercel|favicon.ico).*)',
        '/((?!api|_next/static|_next|_vercel|favicon.ico).*)',
        '/(api|trpc)(.*)'
    ]
}
