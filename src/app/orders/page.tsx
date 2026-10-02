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
import { ordersCollection } from '@/lib/firebase-admin'
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
 * A row in the orders table
 */
type OrderRow = {
    id: string
    createdAt: Date
    productType: ProductType
    productWidth: number | null
    productHeight: number | null
    productFrame: ProductFrame
    productEdge: ProductEdge
    productPrice: number | null
}

/**
 * Get orders from firestore
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
        const snapshot = await ordersCollection(userId)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get()

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            createdAt: doc.get('createdAt').toDate(),
            productType: doc.get('productType'),
            productWidth: doc.get('productWidth'),
            productHeight: doc.get('productHeight'),
            productFrame: doc.get('productFrame'),
            productEdge: doc.get('productEdge'),
            productPrice: doc.get('productPrice')
        }))
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
                chosen at checkout.
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-25'>Order ID</TableHead>
                    <TableHead>Date</TableHead>
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
     * Redirect signed-out visitors to sign-in
     */
    await auth.protect()

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
