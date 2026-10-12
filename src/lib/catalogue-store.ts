import 'server-only'

import { storedCatalogueSchema } from '@/lib/catalogue-schema'
import { catalogueKeys, readItem, writeItems } from '@/lib/global-config'
import type { Catalogue, CatalogueSource, StoredCatalogue } from '@/types'
import { cacheLife, cacheTag } from 'next/cache'

/**
 * The catalogue (Prodigi's costs, options and print areas for every size in
 * pricing.ts) lives in Global Config, so prices can change without a
 * deploy. See src/lib/global-config.ts for the keys.
 */

/**
 * Pages, the print options sheet and checkout all read the catalogue under
 * this tag; writers expire it (revalidateTag in route handlers, updateTag
 * in Server Actions)
 */
export const catalogueTag = 'catalogue'

const parse = (key: string, value: unknown) => {
    const parsed = storedCatalogueSchema.safeParse(value)

    if (!parsed.success) {
        throw new Error(
            `Global Config ${key} is not a valid catalogue: ${parsed.error.issues[0]?.message}`
        )
    }

    return parsed.data
}

const read = async (key: string) => {
    const value = await readItem(key)

    return value === undefined || value === null ? null : parse(key, value)
}

/**
 * The stored catalogue, uncached, for the refresh to compare against. Null
 * before the store is first filled.
 */
export const readStoredCatalogue = () => read(catalogueKeys().current)

/**
 * The catalogue prices come from. Cached until a writer expires the tag,
 * so static pages are prerendered with it and stay static. Throws when it's
 * missing or invalid, failing the build rather than selling at made-up
 * prices.
 */
export const getCatalogue = async (): Promise<StoredCatalogue> => {
    'use cache'
    cacheLife('max')
    cacheTag(catalogueTag)

    const catalogue = await readStoredCatalogue()

    if (!catalogue) {
        throw new Error(
            `Global Config has no ${catalogueKeys().current}: run \`yarn catalogue\` to fill it`
        )
    }

    return catalogue
}

/**
 * A catalogue the daily refresh wants approved (uncached: only the admin
 * page, its actions and the refresh read it)
 */
export const getPendingCatalogue = () => read(catalogueKeys().pending)

const stored = (
    catalogue: Catalogue,
    appliedBy: CatalogueSource
): StoredCatalogue => ({
    generatedAt: catalogue.generatedAt,
    appliedAt: new Date().toISOString(),
    appliedBy,
    products: catalogue.products
})

/**
 * Make a catalogue the one prices come from, and drop any pending one it
 * replaces. The caller expires catalogueTag.
 */
export const applyCatalogue = (
    catalogue: Catalogue,
    appliedBy: CatalogueSource
) => {
    const { current, pending } = catalogueKeys()

    return writeItems([
        {
            operation: 'upsert',
            key: current,
            value: stored(catalogue, appliedBy)
        },
        { operation: 'upsert', key: pending, value: null }
    ])
}

/**
 * Keep a catalogue for the site owner to approve on /admin/catalogue,
 * replacing any older one
 */
export const savePendingCatalogue = (catalogue: Catalogue) =>
    writeItems([
        {
            operation: 'upsert',
            key: catalogueKeys().pending,
            value: stored(catalogue, 'cron')
        }
    ])

export const discardPendingCatalogue = () =>
    writeItems([
        { operation: 'upsert', key: catalogueKeys().pending, value: null }
    ])
