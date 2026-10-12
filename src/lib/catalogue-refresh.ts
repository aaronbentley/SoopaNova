import 'server-only'

import { buildCatalogue } from '@/lib/catalogue-build'
import {
    diffCatalogues,
    needsApproval,
    sameCatalogue
} from '@/lib/catalogue-diff'
import {
    applyCatalogue,
    discardPendingCatalogue,
    getPendingCatalogue,
    readStoredCatalogue,
    savePendingCatalogue
} from '@/lib/catalogue-store'
import { claimAlert, getEnvironment } from '@/lib/email'
import { createQuote, getProductDetails } from '@/lib/prodigi'

/**
 * Refresh the catalogue from Prodigi: the daily cron does every SKU, and
 * the margin guard does the one it refused. Small changes are applied
 * straight away; big price moves and changed options or print areas are
 * kept as the pending catalogue for the site owner to approve on
 * /admin/catalogue (catalogue-diff.ts decides which). The caller expires
 * the catalogue cache when it's applied and emails the result.
 */
export const refreshCatalogue = async ({ skus }: { skus?: string[] } = {}) => {
    const current = await readStoredCatalogue()
    const { catalogue: fresh, problems } = await buildCatalogue({
        prodigi: { getProduct: getProductDetails, quote: createQuote },
        fallback: current,
        skus
    })

    /**
     * Nothing has changed: an older pending catalogue is out of date, so
     * drop it
     */
    if (current && sameCatalogue(current, fresh)) {
        if (await getPendingCatalogue()) await discardPendingCatalogue()

        return { outcome: 'unchanged' as const, changes: [], problems }
    }

    const changes = current ? diffCatalogues(current, fresh) : []

    if (changes.some(needsApproval)) {
        await savePendingCatalogue(fresh)

        return { outcome: 'pending' as const, changes, problems }
    }

    await applyCatalogue(fresh, 'cron')

    return { outcome: 'applied' as const, changes, problems }
}

export type CatalogueRefresh = Awaited<ReturnType<typeof refreshCatalogue>>

/**
 * The margin guard refused a checkout: refresh that SKU's costs, at most
 * once a day per SKU (claimed in adminAlerts like the alert email). Null
 * when it already ran today or failed.
 */
export const refreshRefusedSku = async (sku: string) => {
    const release = await claimAlert(`refresh-${getEnvironment()}-${sku}`)

    if (!release) return null

    try {
        return await refreshCatalogue({ skus: [sku] })
    } catch (error) {
        console.error('Catalogue refresh after the margin guard failed', {
            sku,
            error
        })
        await release()

        return null
    }
}
