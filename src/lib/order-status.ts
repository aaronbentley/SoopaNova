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
