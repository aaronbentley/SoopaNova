import 'server-only'

import type { AnalyticsEvent, AnalyticsProperties } from '@/lib/analytics'
import { track } from '@vercel/analytics/server'
import { headers } from 'next/headers'
import { after } from 'next/server'

/**
 * Track a custom event from a Server Action or route handler, after the
 * response is sent so it never slows it down. Vercel needs the request's
 * headers to attribute it; without VERCEL_URL (local dev) it's only logged.
 */
export const trackServerEvent = (
    name: AnalyticsEvent,
    properties: AnalyticsProperties
) =>
    after(async () => {
        await track(name, properties, { headers: await headers() })
    })
