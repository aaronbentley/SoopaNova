'use client'

import { startCheckoutAction } from '@/actions/checkout'
import type { PrintOptionsValues } from '@/lib/print-options-schema'
import { useState } from 'react'

const checkoutFailed = "We couldn't start checkout. Please try again."

/**
 * Start Stripe Checkout for a print: call the checkout Server Action and go
 * to the Checkout page, or keep the error message to show in the sheet
 */
export const useCheckout = () => {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const checkout = async (fileName: string, values: PrintOptionsValues) => {
        setPending(true)
        setError(null)

        /**
         * The action returns a message for the customer. It only throws when
         * it can't run at all (offline, or a new deployment), and those
         * errors aren't worded for customers.
         */
        const result = await startCheckoutAction({ ...values, fileName }).catch(
            () => ({ message: checkoutFailed })
        )

        if ('message' in result) {
            setError(result.message)
            setPending(false)
            return
        }

        /**
         * Leave pending on, as the page is navigating away
         */
        window.location.assign(result.url)
    }

    const clearError = () => setError(null)

    return { checkout, pending, error, clearError }
}
