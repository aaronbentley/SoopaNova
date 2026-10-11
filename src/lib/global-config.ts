import { createClient, parseConnectionString } from '@vercel/global-config'

/**
 * Vercel Global Config (formerly Edge Config): where the catalogue lives.
 * Shared by the app and `yarn catalogue`, so it has no @/ imports and Node
 * can run it directly.
 *
 * Reads use the GLOBAL_CONFIG connection string (Vercel adds it when the
 * store is connected to the project). Writes go through the Vercel REST API
 * with VERCEL_API_TOKEN, scoped to VERCEL_TEAM_ID.
 *
 * @link https://vercel.com/docs/global-config
 */

/**
 * Keys follow the Prodigi API in use, so sandbox costs never reach the
 * live site: catalogue_live / catalogue_sandbox, and a _pending copy of
 * each waiting for approval
 */
export const catalogueKeys = () => {
    const environment = process.env.PRODIGI_API_URL?.includes('sandbox')
        ? 'sandbox'
        : 'live'

    return {
        current: `catalogue_${environment}`,
        pending: `catalogue_${environment}_pending`
    }
}

const connectionString = () => {
    const value = process.env.GLOBAL_CONFIG

    if (!value) throw new Error('GLOBAL_CONFIG must be set')

    return value
}

/**
 * Read one item, bypassing Vercel's local copy (it can lag a write by a
 * few seconds). Reads are cached by the callers, so this stays cheap.
 * Undefined when the key doesn't exist.
 */
export const readItem = (key: string) =>
    createClient(connectionString()).get(key, { consistentRead: true })

type ItemChange =
    | { operation: 'upsert'; key: string; value: unknown }
    | { operation: 'delete'; key: string }

/**
 * Change items in one request: every change is applied, or none is
 */
export const writeItems = async (items: ItemChange[]) => {
    const token = process.env.VERCEL_API_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID
    const storeId = parseConnectionString(connectionString())?.id

    if (!token || !teamId || !storeId) {
        throw new Error(
            'VERCEL_API_TOKEN, VERCEL_TEAM_ID and a valid GLOBAL_CONFIG must be set to write to Global Config'
        )
    }

    const response = await fetch(
        `https://api.vercel.com/v1/global-config/${storeId}/items?teamId=${encodeURIComponent(teamId)}`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items }),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000)
        }
    )

    if (!response.ok) {
        const json = await response.json().catch(() => null)
        throw new Error(
            `Global Config write failed: HTTP ${response.status} ${json?.error?.message ?? ''}`
        )
    }
}
