import 'server-only'

import { cacheLife } from 'next/cache'

/**
 * Dates fixed when a page is generated. Cache Components can't prerender
 * `new Date()`, so these are cached (refreshed at most monthly, and on each
 * deploy) to keep the pages that use them static. Server only: client
 * components can't define 'use cache' functions, so they can't live in
 * utils.ts.
 */

/**
 * The current year, for the footer's copyright line
 */
export const getCurrentYear = async () => {
    'use cache'
    cacheLife('max')
    return new Date().getFullYear()
}

/**
 * When the sitemap was generated
 */
export const getLastModified = async () => {
    'use cache'
    cacheLife('max')
    return new Date()
}
