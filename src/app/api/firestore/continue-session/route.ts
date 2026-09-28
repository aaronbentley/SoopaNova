import { FieldValue, printSessionsCollection } from '@/lib/firebase-admin'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Mark a print session as continued in a new tab.
 *
 * When the embedded CanvasPop cart is blocked (Safari etc.) the user can open
 * checkout in a new tab, where we receive no order events. /orders lists these
 * sessions as "Continued in CanvasPop" so they don't silently disappear.
 */
export const POST = async (request: NextRequest) => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ ok: false }, { status: 401 })
    }

    /**
     * Get the session id from the request body
     */
    const data = await request.json().catch(() => null)
    const sessionId: unknown = data?.sessionId

    if (
        typeof sessionId !== 'string' ||
        !/^[A-Za-z0-9]{1,64}$/.test(sessionId)
    ) {
        return NextResponse.json({ ok: false }, { status: 400 })
    }

    /**
     * Mark the user's session (update fails if it doesn't exist)
     */
    try {
        await printSessionsCollection(userId).doc(sessionId).update({
            continuedInTab: true,
            continuedAt: FieldValue.serverTimestamp()
        })

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch {
        return NextResponse.json({ ok: false }, { status: 404 })
    }
}
