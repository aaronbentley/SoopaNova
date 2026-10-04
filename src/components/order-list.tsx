import { productTypes } from '@/assets/data/pricing'
import CancelOrderButton from '@/components/cancel-order-button'
import { Badge } from '@/components/ui/badge'
import type { OrderRefund, ProdigiStatus } from '@/lib/orders'
import {
    getOrderProgress,
    orderProgressLabels,
    type OrderProgress
} from '@/lib/order-status'
import { formatMoney } from '@/lib/pricing'
import { describeOptions, formatPrintSize } from '@/lib/print-labels'
import { cn } from '@/lib/utils'
import type { Currency, PrintOrderStatus } from '@/types'
import { format } from 'date-fns'
import { ExternalLink, ImageIcon } from 'lucide-react'
import Image from 'next/image'

/**
 * An order as the orders page shows it. Orders from before the Stripe +
 * Prodigi re-platform only have an id and a date.
 */
export type OrderListItem = {
    id: string
    createdAt: Date
    status?: PrintOrderStatus
    productType?: string
    size?: string
    options?: Record<string, string>
    currency?: Currency
    total?: number
    prodigi: ProdigiStatus | null
    refund: OrderRefund | null
    /** Until when the customer can cancel it, if they can */
    cancellableUntil: Date | null
    /** A short-lived signed link to the order's thumbnail */
    thumbnailUrl: string | null
}

const progressVariants: Record<
    OrderProgress,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    processing: 'secondary',
    received: 'secondary',
    printing: 'secondary',
    shipped: 'default',
    cancelled: 'outline',
    onHold: 'destructive'
}

const progressNotes: Partial<Record<OrderProgress, string>> = {
    processing: 'Payment received. Sending your order to the print lab.',
    onHold: "There's a problem with this order. We're looking into it."
}

const OrderThumbnail = ({ url }: { url: string | null }) => (
    <div className='relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted sm:size-24'>
        {url ? (
            <Image
                src={url}
                alt=''
                fill={true}
                sizes='96px'
                unoptimized={true}
                className='object-cover'
            />
        ) : (
            <ImageIcon
                aria-hidden={true}
                className='absolute inset-0 m-auto size-6 text-muted-foreground'
            />
        )}
    </div>
)

/**
 * Tracking links (or numbers) for each shipment that has one
 */
const Tracking = ({ prodigi }: { prodigi: ProdigiStatus | null }) => {
    const shipments = (prodigi?.shipments ?? []).filter(
        (shipment) => shipment.trackingUrl || shipment.trackingNumber
    )

    if (!shipments.length) return null

    return (
        <ul className='flex flex-col gap-1 text-sm sm:items-end'>
            {shipments.map((shipment, index) => (
                <li key={shipment.trackingNumber ?? index}>
                    {shipment.trackingUrl ? (
                        <a
                            href={shipment.trackingUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4'>
                            Track
                            {shipment.carrier
                                ? ` with ${shipment.carrier}`
                                : ''}
                            <ExternalLink
                                aria-hidden={true}
                                className='size-3.5'
                            />
                        </a>
                    ) : (
                        <span className='text-muted-foreground'>
                            {shipment.carrier} {shipment.trackingNumber}
                        </span>
                    )}
                </li>
            ))}
        </ul>
    )
}

const OrderRow = ({ order }: { order: OrderListItem }) => {
    const productName = order.productType
        ? productTypes[order.productType as keyof typeof productTypes]?.name
        : undefined
    const title =
        productName && order.size
            ? `${productName}, ${formatPrintSize(order.size)}`
            : 'Print order'
    const options = order.options ? describeOptions(order.options) : ''
    const progress = order.status
        ? getOrderProgress(order.status, order.prodigi)
        : null
    const total =
        order.total !== undefined && order.currency
            ? formatMoney({ amount: order.total, currency: order.currency })
            : null
    const refunded =
        order.refund && order.currency
            ? order.refund.full
                ? 'Refunded'
                : `${formatMoney({ amount: order.refund.amount, currency: order.currency })} refunded`
            : null

    return (
        <li className='flex gap-4 py-5'>
            <OrderThumbnail url={order.thumbnailUrl} />
            <div className='flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between sm:gap-6'>
                <div className='flex min-w-0 flex-col gap-1'>
                    <p className='font-medium'>{title}</p>
                    {options && (
                        <p className='text-sm text-muted-foreground'>
                            {options}
                        </p>
                    )}
                    <p className='font-mono text-xs text-muted-foreground'>
                        <time dateTime={order.createdAt.toISOString()}>
                            {format(order.createdAt, 'd MMM yyyy')}
                        </time>
                    </p>
                    <p className='font-mono text-xs break-all text-muted-foreground'>
                        Order ref {order.id}
                    </p>
                    {progress && progressNotes[progress] && (
                        <p className='text-sm text-pretty text-muted-foreground'>
                            {progressNotes[progress]}
                        </p>
                    )}
                </div>
                <div className='flex shrink-0 flex-col gap-2 sm:items-end'>
                    <div className='flex items-center gap-3 sm:flex-row-reverse'>
                        {total && (
                            <span
                                className={cn(
                                    ['font-semibold tabular-nums'],
                                    order.refund?.full && [
                                        'text-muted-foreground line-through'
                                    ]
                                )}>
                                {total}
                            </span>
                        )}
                        {progress && (
                            <Badge variant={progressVariants[progress]}>
                                {orderProgressLabels[progress]}
                            </Badge>
                        )}
                    </div>
                    {refunded && (
                        <p className='text-sm text-muted-foreground'>
                            {refunded}
                        </p>
                    )}
                    <Tracking prodigi={order.prodigi} />
                    {order.cancellableUntil && total && (
                        <CancelOrderButton
                            orderId={order.id}
                            total={total}
                            cancellableUntil={order.cancellableUntil}
                        />
                    )}
                </div>
            </div>
        </li>
    )
}

/**
 * The customer's orders, newest first: thumbnail, product, date, total,
 * progress and tracking
 */
const OrderList = ({
    orders,
    className
}: {
    orders: OrderListItem[]
    className?: string
}) => (
    <ul className={cn(['divide-y border-y'], className)}>
        {orders.map((order) => (
            <OrderRow
                key={order.id}
                order={order}
            />
        ))}
    </ul>
)

export default OrderList
