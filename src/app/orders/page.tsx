import CheckoutToast from '@/components/checkout-toast'
import OrderList, { type OrderListItem } from '@/components/order-list'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { PageSection } from '@/components/page-section'
import { OrderListSkeleton } from '@/components/skeletons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ordersCollection } from '@/lib/firebase-admin'
import { getSignedReadUrl } from '@/lib/uploads'
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
 * Get the signed-in user's recent orders from Firestore, with a short-lived
 * link to each thumbnail
 */
const getOrders = async (): Promise<OrderListItem[] | null> => {
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

        return Promise.all(
            snapshot.docs.map(async (doc) => {
                const thumbnail: string | null = doc.get('thumbnail') ?? null

                return {
                    id: doc.id,
                    createdAt: doc.get('createdAt').toDate(),
                    status: doc.get('status'),
                    productType: doc.get('productType'),
                    size: doc.get('size'),
                    options: doc.get('options'),
                    currency: doc.get('currency'),
                    total: doc.get('amounts.total'),
                    prodigi: doc.get('prodigi') ?? null,
                    thumbnailUrl: thumbnail
                        ? await getSignedReadUrl(thumbnail, 60).catch(
                              () => null
                          )
                        : null
                }
            })
        )
    } catch (error) {
        console.error('Error getting documents: ', error)
        return null
    }
}

/**
 * The orders list, or a prompt to create the first one
 */
const OrdersList = async () => {
    const orders = await getOrders()

    /**
     * Show alert if no orders
     */
    if (!orders?.length) {
        return (
            <div className='w-full flex justify-center items-center'>
                <Alert className='max-w-96'>
                    <Info className='size-4' />
                    <AlertTitle>No print orders yet</AlertTitle>
                    <AlertDescription className='block'>
                        Your inventory&apos;s empty for now.{' '}
                        <Link
                            href='/create/'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary inline'>
                            Start creating
                        </Link>{' '}
                        your first print.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return <OrderList orders={orders} />
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
                <PageHeader eyebrow='Inventory'>
                    <PageHeaderHeading>Print orders</PageHeaderHeading>
                    <PageHeaderDescription>{displayName}</PageHeaderDescription>
                </PageHeader>

                <Suspense>
                    <CheckoutToast />
                </Suspense>

                <PageSection>
                    <Suspense fallback={<OrderListSkeleton />}>
                        <OrdersList />
                    </Suspense>
                </PageSection>
            </div>
        </>
    )
}

export default Orders
