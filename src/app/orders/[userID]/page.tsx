import {
    productEdgeSlugs,
    productFrameSlugs,
    productTypeSlugs
} from '@/assets/data/product-slugs'
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
import { formatCurrency } from '@/lib/utils'
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { auth } from '@clerk/nextjs'
import * as admin from 'firebase-admin'
import { DocumentData } from 'firebase/firestore'
import { Info } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const generateMetadata = async ({
    params
}: {
    params: { userID: string }
}): Promise<Metadata> => ({
    title: 'Orders',
    description: 'Print Orders.',
    openGraph: {
        url: `/orders/${params.userID}/`
    }
})

/**
 * Initialize Firebase Admin SDK
 */
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
            privateKey:
                process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID!.replace(
                    /\\n/g,
                    '\n'
                )
        })
    })
}

/**
 * Initialize Firestore
 */
const firestore = admin.firestore()

/**
 * Get orders from firestore
 */
const getOrders = async () => {
    /**
     * Get the userId from auth()
     */
    const { userId } = auth()

    if (!userId) {
        return null
    }

    try {
        // Get orders from firestore
        const orders: DocumentData[] = []
        const snapshot = await firestore
            .collection(process.env.FIREBASE_FIRESTORE_COLLECTION!)
            .doc(userId)
            .collection(process.env.FIREBASE_FIRESTORE_SUB_COLLECTION!)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get()

        // Add doc data properties to orders array
        snapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                productPrice: doc.data().productPrice,
                productWidth: doc.data().productWidth,
                productHeight: doc.data().productHeight,
                productType: doc.data().productType,
                productFrame: doc.data().productFrame,
                productEdge: doc.data().productEdge,
                createdAt: doc.data().createdAt.toDate()
            })
        })

        return orders
    } catch (error) {
        console.error('Error getting documents: ', error)
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
                <Alert className='w-max'>
                    <Info className='h-4 w-4' />
                    <AlertTitle>No Print Orders Yet!</AlertTitle>
                    <AlertDescription>
                        Go{' '}
                        <Link
                            href='/create/'
                            title='Create your first Print Order'
                            className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
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
                    <TableHead className='w-[100px]'>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Frame</TableHead>
                    <TableHead>Edge</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                </TableRow>
            </TableHeader>
            {orders && (
                <TableBody>
                    {orders.map((order, index) => {
                        // Get order data properties
                        const id: string = order.id
                        const createdAt: Date = order.createdAt
                        const productPrice: number = order.productPrice
                        const productWidth: number = order.productWidth
                        const productHeight: number = order.productHeight
                        const productType: ProductType = order.productType
                        const productFrame: ProductFrame = order.productFrame
                        const productEdge: ProductEdge = order.productEdge

                        return (
                            <TableRow
                                key={index}
                                className='border-neutral-400/25'>
                                <TableCell className='font-medium'>
                                    {id}
                                </TableCell>
                                <TableCell className='text-neutral-500'>
                                    {createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell className='text-neutral-500'>
                                    {productType
                                        ? productTypeSlugs[productType]
                                        : '-'}
                                </TableCell>
                                <TableCell className='text-neutral-500'>
                                    {`${productWidth}" x ${productHeight}"`}
                                </TableCell>
                                <TableCell className='text-neutral-500'>
                                    {productFrame
                                        ? productFrameSlugs[productFrame]
                                        : '-'}
                                </TableCell>
                                <TableCell className='text-neutral-500'>
                                    {productEdge
                                        ? productEdgeSlugs[productEdge]
                                        : '-'}
                                </TableCell>
                                <TableCell className='text-right text-neutral-500'>
                                    {formatCurrency(productPrice)}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            )}
        </Table>
    )
}

const Orders = async ({ params }: { params: { userID: string } }) => {
    /**
     * Get sessionClaims from auth()
     */
    const { sessionClaims } = auth()

    /**
     * Get custom sessionClaims tokens with fallbacks
     */
    const fullName = sessionClaims?.fullName || ''
    const primaryEmail = sessionClaims?.primaryEmail || ''

    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Print Orders</PageHeaderHeading>
                    <PageHeaderDescription>{`${
                        fullName !== null ? fullName : primaryEmail
                    }`}</PageHeaderDescription>
                </PageHeader>

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
