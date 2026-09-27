'use client'

import { firebaseAuth } from '@/firebase/config'
import { ensureFirebaseUser } from '@/firebase/sign-in'
import { useAuth } from '@clerk/nextjs'
import { signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

/**
 * Keep Firebase Auth in step with Clerk: sign in to Firebase as the Clerk
 * user when signed in, and sign out of Firebase when signed out of Clerk.
 */
const FirebaseAuthSync = () => {
    const { isLoaded, userId } = useAuth()
    const [firebaseUser, firebaseLoading] = useAuthState(firebaseAuth)

    useEffect(() => {
        if (!isLoaded || firebaseLoading) return

        if (userId && firebaseUser?.uid !== userId) {
            ensureFirebaseUser(userId).catch((error) => {
                console.error('Error signing in to Firebase', error)
            })
        }

        if (!userId && firebaseUser) {
            signOut(firebaseAuth)
        }
    }, [isLoaded, userId, firebaseUser, firebaseLoading])

    return null
}

export default FirebaseAuthSync
