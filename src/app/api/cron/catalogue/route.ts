import { env } from '@/config/env'
import { refreshCatalogue } from '@/lib/catalogue-refresh'
import { catalogueTag } from '@/lib/catalogue-store'
import { sendCatalogueRefreshEmail } from '@/lib/email'
import { isValidToken } from '@/lib/secrets'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Room for about 40 Prodigi requests, 3 at a time
 */
export const maxDuration = 300

/**
 * The daily catalogue refresh, run by Vercel Cron (vercel.json; production
 * only, or `vercel crons run /api/cron/catalogue/` after adding a size to
 * pricing.ts). No Clerk auth: Vercel sends `Authorization: Bearer
 * CRON_SECRET`. Rebuilds the catalogue from Prodigi, applies small changes
 * (pages update as they're next visited) or keeps big ones for approval,
 * and emails the site owner what it did.
 */
export const GET = async (request: NextRequest) => {
    const secret = env.CRON_SECRET

    if (!secret) {
        console.error('CRON_SECRET must be set')
        return NextResponse.json({ refreshed: false }, { status: 500 })
    }

    if (
        !isValidToken(request.headers.get('authorization'), `Bearer ${secret}`)
    ) {
        return NextResponse.json({ refreshed: false }, { status: 401 })
    }

    try {
        const result = await refreshCatalogue()

        if (result.outcome === 'applied') {
            revalidateTag(catalogueTag, { expire: 0 })
        }

        const emailed =
            result.changes.length || result.problems.length
                ? await sendCatalogueRefreshEmail({
                      ...result,
                      trigger: 'daily'
                  })
                : false

        const summary = {
            refreshed: true,
            outcome: result.outcome,
            changes: result.changes.length,
            problems: result.problems.length,
            emailed
        }

        console.info('Catalogue refresh', summary)

        return NextResponse.json(summary)
    } catch (error) {
        console.error('Catalogue refresh failed', error)
        return NextResponse.json({ refreshed: false }, { status: 500 })
    }
}
