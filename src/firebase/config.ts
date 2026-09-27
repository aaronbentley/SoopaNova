import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFunctions } from 'firebase/functions'
import { getStorage } from 'firebase/storage'

/**
 * Firebase configuration
 */
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

/**
 * Export Firebase
 */
export const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

/**
 * Export Firebase Auth. Clerk is the source of truth for users; the browser
 * signs in to Firebase with a custom token for the same user id (see
 * src/firebase/sign-in.ts) so Storage rules and callables can check it.
 */
export const firebaseAuth = getAuth(app)

/**
 * Export Firebase Storage
 */
export const storage = getStorage(app)

/**
 * Export Firebase Functions
 */
export const functions = getFunctions(app)
