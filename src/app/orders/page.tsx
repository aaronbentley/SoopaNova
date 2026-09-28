import {
    productEdgeSlugs,
    productFrameSlugs,
    productTypeSlugs
} from '@/assets/data/product-slugs'
import NewOrderToast from '@/components/new-order-toast'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { PageSection } from '@/components/page-section'
import { TableSkeleton } from '@/components/skeletons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { ordersCollection, printSessionsCollection } from '@/lib/firebase-admin'
import { formatPrice } from '@/lib/utils'
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Info } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: 'Orders',
    description: 'Print Orders.',
    alternates: {
        canonical: '/orders/'
    }
}

/**
 * A row in the orders table: a completed order, or a print session whose
 * checkout was continued in a new tab (no order details reach us from there)
 */
type OrderRow = {
    id: string
    status: 'completed' | 'continued'
    createdAt: Date
    productType: ProductType
    productWidth: number | null
    productHeight: number | null
    productFrame: ProductFrame
    productEdge: ProductEdge
    productPrice: number | null
}

/**
 * Get orders (and print sessions continued in a new tab) from firestore
 */
const getOrders = async (): Promise<OrderRow[] | null> => {
    /**
     * Get the userId from auth()
     */
    const { userId } = await auth()

    if (!userId) {
        return null
    }

    try {
        const [ordersSnapshot, continuedSnapshot] = await Promise.all([
            ordersCollection(userId)
                .orderBy('createdAt', 'desc')
                .limit(20)
                .get(),
            printSessionsCollection(userId)
                .where('continuedInTab', '==', true)
                .limit(20)
                .get()
        ])

        const orders: OrderRow[] = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            status: 'completed',
            createdAt: doc.get('createdAt').toDate(),
            productType: doc.get('productType'),
            productWidth: doc.get('productWidth'),
            productHeight: doc.get('productHeight'),
            productFrame: doc.get('productFrame'),
            productEdge: doc.get('productEdge'),
            productPrice: doc.get('productPrice')
        }))

        /**
         * Sessions that went on to complete in the embedded cart already
         * appear as orders
         */
        const continued: OrderRow[] = continuedSnapshot.docs
            .filter((doc) => !doc.get('orderId'))
            .map((doc) => ({
                id: doc.id,
                status: 'continued',
                createdAt: (
                    doc.get('continuedAt') ?? doc.get('createdAt')
                ).toDate(),
                productType: null,
                productWidth: null,
                productHeight: null,
                productFrame: null,
                productEdge: null,
                productPrice: null
            }))

        return [...orders, ...continued]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 20)
    } catch (error) {
        console.error('Error getting documents: ', error)
        return null
    }
}

/**
 * Create a table of orders
 */
const OrdersTable = async () => {
    /**
     * Get the orders from firestore
     */
    const orders = await getOrders()

    /**
     * Show alert if no orders
     */
    if (!orders?.length) {
        return (
            <div className='w-full flex justify-center items-center'>
                <Alert className='max-w-96'>
                    <Info className='size-4' />
                    <AlertTitle>No Print Orders Yet!</AlertTitle>
                    <AlertDescription className='block'>
                        Go{' '}
                        <Link
                            href='/create/'
                            title='Create your first Print Order'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary inline'>
                            create your first print order
                        </Link>{' '}
                        to get started.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    /**
     * Return orders table
     */
    return (
        <Table>
            <TableCaption>
                A list of your recent Print Orders. Totals are in the currency
                chosen at checkout. Orders continued in a new tab are confirmed
                by CanvasPop by email.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-[100px]'>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Frame</TableHead>
                    <TableHead>Edge</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell className='font-mono text-xs'>
                            {order.id}
                        </TableCell>
                        <TableCell>
                            {order.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            {order.status === 'completed' ? (
                                'Completed'
                            ) : (
                                <span title='Checkout was opened in a new tab, so the order details are with CanvasPop'>
                                    Continued in CanvasPop
                                </span>
                            )}
                        </TableCell>
                        <TableCell>
                            {order.productType
                                ? productTypeSlugs[order.productType]
                                : '-'}
                        </TableCell>
                        <TableCell>
                            {order.productWidth && order.productHeight
                                ? `${order.productWidth}" x ${order.productHeight}"`
                                : '-'}
                        </TableCell>
                        <TableCell>
                            {order.productFrame
                                ? productFrameSlugs[order.productFrame]
                                : '-'}
                        </TableCell>
                        <TableCell>
                            {order.productEdge
                                ? productEdgeSlugs[order.productEdge]
                                : '-'}
                        </TableCell>
                        <TableCell className='text-right'>
                            {order.productPrice !== null
                                ? formatPrice(order.productPrice)
                                : '-'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

const Orders = async () => {
    /**
     * Get the current user's name, falling back to their email address
     */
    const user = await currentUser()
    const displayName =
        user?.fullName || user?.primaryEmailAddress?.emailAddress || ''

    return (
        <>
            <div>
                <PageHeader>
                    <PageHeaderHeading>Print Orders</PageHeaderHeading>
                    <PageHeaderDescription>{displayName}</PageHeaderDescription>
                </PageHeader>

                <Suspense>
                    <NewOrderToast />
                </Suspense>

                <PageSection>
                    <Suspense fallback={<TableSkeleton />}>
                        <OrdersTable />
                    </Suspense>
                </PageSection>
            </div>
        </>
    )
}

export default Orders
