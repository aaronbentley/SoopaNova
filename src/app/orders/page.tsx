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
 * A row in the orders table. Product, status and total columns come with
 * the Stripe + Prodigi order format.
 */
type OrderRow = {
    id: string
    createdAt: Date
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
            createdAt: doc.get('createdAt').toDate()
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
            <TableCaption>A list of your recent Print Orders.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-25'>Order ID</TableHead>
                    <TableHead>Date</TableHead>
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
