'use server'

import { printProperties } from '@/lib/analytics'
import { trackServerEvent } from '@/lib/analytics-server'
import { CancelOrderError, cancelCustomerOrder } from '@/lib/orders'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

export type CancelOrderResult = { cancelled: true } | { message: string }

const orderIdSchema = z.string().min(1).max(64)

/**
 * Cancel one of the customer's orders while Prodigi has it paused, and
 * refund it in full. Returns a message for the customer if it can't
 * (thrown errors are hidden from the client in production).
 */
export const cancelOrderAction = async (
    orderId: string
): Promise<CancelOrderResult> => {
    /**
     * Check if user is authenticated
     */
    const { userId } = await auth()

    if (!userId) {
        return { message: 'Please sign in to cancel an order.' }
    }

    const parsed = orderIdSchema.safeParse(orderId)

    if (!parsed.success) {
        return { message: "We couldn't find that order." }
    }

    try {
        const print = await cancelCustomerOrder(userId, parsed.data)

        trackServerEvent('Order cancelled', printProperties(print))

        return { cancelled: true }
    } catch (error) {
        if (error instanceof CancelOrderError) {
            return { message: error.message }
        }

        console.error('Cancelling an order failed', orderId, error)
        return {
            message: "We couldn't cancel your order. Please try again."
        }
    }
}
