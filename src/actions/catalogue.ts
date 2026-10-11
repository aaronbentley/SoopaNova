'use server'

import { isAdmin } from '@/lib/admin'
import {
    applyCatalogue,
    catalogueTag,
    discardPendingCatalogue,
    getPendingCatalogue
} from '@/lib/catalogue-store'
import { auth } from '@clerk/nextjs/server'
import { updateTag } from 'next/cache'

export type CatalogueActionResult = { done: true } | { message: string }

/**
 * Apply the pending catalogue on /admin/catalogue: its prices go live as
 * pages are next visited
 */
export const applyPendingCatalogueAction =
    async (): Promise<CatalogueActionResult> => {
        /**
         * Check the caller is the site owner
         */
        const { userId } = await auth()

        if (!userId) return { message: 'Please sign in.' }
        if (!isAdmin(userId)) return { message: 'Not allowed.' }

        try {
            const pending = await getPendingCatalogue()

            if (!pending) return { message: 'Nothing is waiting to apply.' }

            await applyCatalogue(pending, 'admin')
            updateTag(catalogueTag)

            return { done: true }
        } catch (error) {
            console.error('Applying the pending catalogue failed', error)
            return { message: "Couldn't apply the changes. Please try again." }
        }
    }

/**
 * Throw the pending catalogue away; the site keeps its current prices
 */
export const discardPendingCatalogueAction =
    async (): Promise<CatalogueActionResult> => {
        /**
         * Check the caller is the site owner
         */
        const { userId } = await auth()

        if (!userId) return { message: 'Please sign in.' }
        if (!isAdmin(userId)) return { message: 'Not allowed.' }

        try {
            await discardPendingCatalogue()

            return { done: true }
        } catch (error) {
            console.error('Discarding the pending catalogue failed', error)
            return {
                message: "Couldn't discard the changes. Please try again."
            }
        }
    }
