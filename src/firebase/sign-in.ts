import { firebaseAuth } from '@/firebase/config'
import { signInWithCustomToken } from 'firebase/auth'

/**
 * Shared in-flight sign in, so concurrent callers make one token request
 */
let pendingSignIn: Promise<void> | null = null

/**
 * Make sure Firebase Auth is signed in as the given Clerk user.
 *
 * Waits for Firebase to restore any persisted session first, and only
 * fetches a custom token (from /api/firebase/token) when the Firebase user
 * is missing or belongs to a different Clerk user.
 */
export const ensureFirebaseUser = async (userId: string) => {
    await firebaseAuth.authStateReady()

    if (firebaseAuth.currentUser?.uid === userId) return

    pendingSignIn ??= (async () => {
        const response = await fetch('/api/firebase/token/', {
            method: 'POST'
        })
        const json = response.ok ? await response.json() : null
        const token: string | undefined = json?.data?.token

        if (!token) {
            throw new Error('Could not get a Firebase sign-in token')
        }

        await signInWithCustomToken(firebaseAuth, token)
    })().finally(() => {
        pendingSignIn = null
    })

    return pendingSignIn
}
