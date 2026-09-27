import 'server-only'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

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
 * Export Firestore
 */
export const firestore = getFirestore(app)

/**
 * Export Firestore FieldValue helpers
 */
export { FieldValue }
