'use client'

import type {
    CheckoutRequest,
    PrintOptionsValues
} from '@/lib/print-options-schema'
import { useState } from 'react'

/**
 * Start Stripe Checkout for a print: POST it to /api/checkout and go to the
 * Checkout page, or keep the error message to show in the sheet
 */
export const useCheckout = () => {
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const checkout = async (fileName: string, values: PrintOptionsValues) => {
        setPending(true)
        setError(null)

        try {
            const response = await fetch('/api/checkout/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    fileName
                } satisfies CheckoutRequest)
            })

            const json = await response.json().catch(() => null)

            if (!response.ok || typeof json?.url !== 'string') {
                throw new Error(
                    json?.message ??
                        "We couldn't start checkout. Please try again."
                )
            }

            /**
             * Leave pending on, as the page is navigating away
             */
            window.location.assign(json.url)
        } catch (checkoutError) {
            setError(
                checkoutError instanceof Error
                    ? checkoutError.message
                    : "We couldn't start checkout. Please try again."
            )
            setPending(false)
        }
    }

    const clearError = () => setError(null)

    return { checkout, pending, error, clearError }
}
