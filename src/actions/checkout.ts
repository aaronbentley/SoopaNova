'use server'

import { CheckoutError, startCheckout } from '@/lib/checkout'
import type { CheckoutRequest } from '@/lib/print-options-schema'
import { auth, currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'

export type CheckoutResult = { url: string } | { message: string }

/**
 * Start Stripe Checkout for a print chosen in the print options sheet.
 * Returns the Checkout url to go to, or a message for the customer (thrown
 * errors are hidden from the client in production).
 */
export const startCheckoutAction = async (
    input: CheckoutRequest
): Promise<CheckoutResult> => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) {
        return { message: 'Please sign in to order a print.' }
    }

    /**
     * Stripe returns to this origin. Next has already checked it matches the
     * host, as it does for every Server Action.
     */
    const requestHeaders = await headers()
    const origin =
        requestHeaders.get('origin') ?? `https://${requestHeaders.get('host')}`

    /**
     * Prefill Stripe Checkout with the account's email address
     */
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress

    try {
        const url = await startCheckout({ userId, email, origin, input })

        return { url }
    } catch (error) {
        if (error instanceof CheckoutError) {
            return { message: error.message }
        }

        console.error('Checkout failed', error)
        return { message: "We couldn't start checkout. Please try again." }
    }
}
