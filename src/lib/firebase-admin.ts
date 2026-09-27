import 'server-only'

import * as admin from 'firebase-admin'

/**
 * Initialize Firebase Admin SDK (once per server instance)
 */
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID!,
            clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
            privateKey:
                process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(
                    /\\n/g,
                    '\n'
                )
        })
    })
}

/**
 * Export Firestore
 */
export const firestore = admin.firestore()

/**
 * Export Firestore FieldValue helpers
 */
export const { FieldValue } = admin.firestore
