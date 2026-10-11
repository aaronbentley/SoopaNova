import { checkCatalogueDrift } from '@/lib/catalogue-drift'
import { sendCatalogueDriftEmail } from '@/lib/email'
import { isValidToken } from '@/lib/secrets'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Room for about 30 Prodigi quotes, 3 at a time
 */
export const maxDuration = 300

/**
 * The weekly catalogue check, run by Vercel Cron (vercel.json; production
 * only). No Clerk auth: Vercel sends `Authorization: Bearer CRON_SECRET`.
 * Emails the site owner if Prodigi's live costs differ from catalogue.ts.
 */
export const GET = async (request: NextRequest) => {
    const secret = process.env.CRON_SECRET

    if (!secret) {
        console.error('CRON_SECRET must be set')
        return NextResponse.json({ checked: false }, { status: 500 })
    }

    if (
        !isValidToken(request.headers.get('authorization'), `Bearer ${secret}`)
    ) {
        return NextResponse.json({ checked: false }, { status: 401 })
    }

    try {
        const result = await checkCatalogueDrift()
        const emailed = result.drifts.length
            ? await sendCatalogueDriftEmail(result)
            : false

        console.info('Catalogue check', {
            checked: result.checked,
            drifts: result.drifts.length,
            emailed
        })

        return NextResponse.json({
            checked: result.checked,
            drifts: result.drifts.length,
            emailed
        })
    } catch (error) {
        console.error('Catalogue check failed', error)
        return NextResponse.json({ checked: false }, { status: 500 })
    }
}
