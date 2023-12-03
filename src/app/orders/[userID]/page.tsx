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
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Orders',
    description: 'Print Orders.'
}

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

const getOrders = async () => {
    /**
     * Get the userId from auth() -- if null, the user is not logged in
     */
    const { userId } = auth()

    if (!userId) {
        return null
    }

    try {
        //
        const orders: DocumentData[] = []
        const snapshot = await firestore
            .collection('orders')
            .doc(userId)
            .collection('order')
            .orderBy('createdAt', 'desc')
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
                ProductEdge: doc.data().ProductEdge
            })
        })

        return orders
    } catch (error) {
        console.error('Error getting documents: ', error)
    }
}

const Orders = async ({ params }: { params: { userID: string } }) => {
    /**
     * Get the orders from firestore
     */
    const orders = await getOrders()
    // console.log('🦄 ~ file: page.tsx:38 ~ Orders ~ orders:', orders)

    /**
     * Get the sessionClaims from auth()
     */
    const { sessionClaims } = auth()

    // Get session claims tokens with fallbacks
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
                    <Table>
                        <TableCaption>
                            A list of your Print Orders.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[100px]'>
                                    Order ID
                                </TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Frame</TableHead>
                                <TableHead>Edge</TableHead>
                                <TableHead className='text-right'>
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        {orders && (
                            <TableBody>
                                {orders.map((order, index) => {
                                    // Get order data properties
                                    const id: string = order.id
                                    const productPrice: number =
                                        order.productPrice
                                    const productWidth: number =
                                        order.productWidth
                                    const productHeight: number =
                                        order.productHeight
                                    const productType: ProductType =
                                        order.productType
                                    const productFrame: ProductFrame =
                                        order.productFrame
                                    const productEdge: ProductEdge =
                                        order.ProductEdge

                                    return (
                                        <TableRow
                                            key={index}
                                            className='border-neutral-400/25'>
                                            <TableCell className='font-medium'>
                                                {order.id}
                                            </TableCell>
                                            <TableCell className='text-neutral-500'>
                                                {productType
                                                    ? productTypeSlugs[
                                                          productType
                                                      ]
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className='text-neutral-500'>
                                                {`${order.productWidth}" x ${order.productHeight}"`}
                                            </TableCell>
                                            <TableCell className='text-neutral-500'>
                                                {productFrame
                                                    ? productFrameSlugs[
                                                          productFrame
                                                      ]
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className='text-neutral-500'>
                                                {productEdge
                                                    ? productEdgeSlugs[
                                                          productEdge
                                                      ]
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className='text-right text-neutral-500'>
                                                {formatCurrency(
                                                    order.productPrice
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        )}
                    </Table>
                </PageSection>
            </div>
        </>
    )
}

export default Orders
