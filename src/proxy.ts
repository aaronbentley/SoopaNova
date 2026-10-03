import { locationCookie } from '@/lib/delivery-country'
import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Clerk middleware: each page, route handler and Server Function checks auth
 * itself (enforced by @clerk/next/require-auth-protection).
 *
 * It also passes on the visitor's country, from Vercel's geolocation header,
 * as a cookie the browser reads to show prices in their currency
 * (lib/delivery-country.ts). Pages stay static: this runs before the cached
 * page is served. There's no header in local dev, so no cookie either.
 */
export default clerkMiddleware(
    (_auth, request) => {
        const country = request.headers.get('x-vercel-ip-country')

        if (!country || request.cookies.get(locationCookie)?.value === country)
            return

        const response = NextResponse.next()
        response.cookies.set(locationCookie, country, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax',
            secure: true
        })

        return response
    },
    { debug: false }
)

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
