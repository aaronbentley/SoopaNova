/**
 * Mint a Firebase custom token for the signed-in Clerk user.
 *
 * The browser exchanges it with signInWithCustomToken, so Firebase Auth's
 * uid matches the Clerk user id - which is what Storage rules and the
 * moderateImageUrl callable check.
 */
import { adminAuth } from '@/lib/firebase-admin'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const POST = async () => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'unauthorized'
            },
            { status: 401 }
        )
    }

    try {
        const token = await adminAuth.createCustomToken(userId)

        return NextResponse.json(
            {
                message: 'success',
                data: { token }
            },
            {
                status: 200,
                headers: { 'Cache-Control': 'no-store' }
            }
        )
    } catch (error) {
        console.error('Error creating Firebase custom token', error)
        return NextResponse.json(
            {
                message: 'error',
                data: 'token creation failed'
            },
            { status: 500 }
        )
    }
}
