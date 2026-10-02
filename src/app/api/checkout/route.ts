import { CheckoutError, startCheckout } from '@/lib/checkout'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Start Stripe Checkout for a print chosen in the print options sheet.
 * Responds with the Checkout url to redirect to, or a message for the
 * customer.
 */
export const POST = async (request: NextRequest) => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json(
            { message: 'Please sign in to order a print.' },
            { status: 401 }
        )
    }

    const input = await request.json().catch(() => null)

    /**
     * Prefill Stripe Checkout with the account's email address
     */
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress

    try {
        const url = await startCheckout({
            userId,
            email,
            origin: request.nextUrl.origin,
            input
        })

        return NextResponse.json({ url })
    } catch (error) {
        if (error instanceof CheckoutError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status }
            )
        }

        console.error('Checkout failed', error)
        return NextResponse.json(
            { message: "We couldn't start checkout. Please try again." },
            { status: 500 }
        )
    }
}
