import 'server-only'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

/**
 * Initialize Firebase Admin SDK (once per server instance)
 */
const app =
    getApps()[0] ??
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
            privateKey:
                process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(
                    /\\n/g,
                    '\n'
                )
        })
    })

/**
 * Export Firebase Auth (used to mint custom tokens for Clerk users)
 */
export const adminAuth = getAuth(app)

/**
 * Export Firestore
 */
export const firestore = getFirestore(app)

/**
 * Export the uploads Storage bucket
 */
export const storageBucket = getStorage(app).bucket(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!
)

/**
 * Export Firestore FieldValue helpers
 */
export { FieldValue }

/**
 * A user's document in the customers collection
 */
const customerDoc = (userId: string) =>
    firestore.collection(process.env.FIREBASE_FIRESTORE_COLLECTION!).doc(userId)

/**
 * A user's orders: customers/{userId}/orders
 */
export const ordersCollection = (userId: string) =>
    customerDoc(userId).collection(
        process.env.FIREBASE_FIRESTORE_SUB_COLLECTION!
    )

/**
 * A user's print sessions: customers/{userId}/printSessions.
 * One per checkout started; an order must claim an unused session.
 */
export const printSessionsCollection = (userId: string) =>
    customerDoc(userId).collection('printSessions')
