import type { ProdigiStatus } from '@/lib/orders'
import type { PrintOrderStatus } from '@/types'

export type OrderProgress =
    'processing' | 'received' | 'printing' | 'shipped' | 'cancelled' | 'onHold'

export const orderProgressLabels: Record<OrderProgress, string> = {
    processing: 'Processing',
    received: 'Received',
    printing: 'Printing',
    shipped: 'Shipped',
    cancelled: 'Cancelled',
    onHold: 'On hold'
}

/**
 * How long customers can cancel after ordering. Prodigi's order edit window
 * pauses every order for 2 hours, so this stays well inside it.
 */
export const cancelWindowMinutes = 90

/**
 * Until when the customer can cancel the order, or null if they can't:
 * Prodigi has it but hasn't started production, it isn't refunded, and it's
 * within the window. The window starts when the order is created, before
 * Prodigi's pause does. Prodigi's sandbox has no edit window, so there it
 * depends on how soon the order goes into production; Prodigi refusing the
 * cancel is handled.
 */
export const getCancellableUntil = (order: {
    createdAt: Date
    status?: PrintOrderStatus
    prodigi: Pick<ProdigiStatus, 'stage' | 'details'> | null
    refunded: boolean
}) => {
    if (
        order.status !== 'submitted' ||
        order.prodigi?.stage !== 'InProgress' ||
        order.prodigi.details?.inProduction !== 'NotStarted' ||
        order.refunded
    ) {
        return null
    }

    const until = new Date(
        order.createdAt.getTime() + cancelWindowMinutes * 60 * 1000
    )

    return until > new Date() ? until : null
}

/**
 * Where an order is, for the customer: our own status until Prodigi has it,
 * then Prodigi's stage and progress
 */
export const getOrderProgress = (
    status: PrintOrderStatus | undefined,
    prodigi: Pick<ProdigiStatus, 'stage' | 'details' | 'shipments'> | null
): OrderProgress => {
    if (status === 'failed') return 'onHold'
    if (!prodigi) return 'processing'
    if (prodigi.stage === 'Cancelled') return 'cancelled'

    if (
        prodigi.stage === 'Complete' ||
        prodigi.shipments?.some((shipment) => shipment.status === 'Shipped')
    ) {
        return 'shipped'
    }

    if (['InProgress', 'Complete'].includes(prodigi.details?.inProduction)) {
        return 'printing'
    }

    return 'received'
}
