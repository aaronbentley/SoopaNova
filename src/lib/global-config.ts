/**
 * Vercel Global Config (formerly Edge Config): where the catalogue lives.
 * Shared by the app and `yarn catalogue`, so it has no @/ imports and Node
 * can run it directly.
 *
 * Reads use the GLOBAL_CONFIG connection string (Vercel adds it when the
 * store is connected to the project). Writes go through the Vercel REST API
 * with VERCEL_API_TOKEN, scoped to VERCEL_TEAM_ID. It uses plain fetch, not
 * @vercel/global-config: in Next.js that SDK caches its reads with
 * 'use cache', so a page could show a catalogue that was just replaced.
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

/**
 * The store id and read token from GLOBAL_CONFIG
 * (https://global-config.vercel.com/ecfg_…?token=…)
 */
const connection = () => {
    const value = process.env.GLOBAL_CONFIG

    if (!value) throw new Error('GLOBAL_CONFIG must be set')

    const url = new URL(value)
    const id = url.pathname.split('/').find((part) => part.startsWith('ecfg_'))
    const token = url.searchParams.get('token')

    if (!id || !token)
        throw new Error('GLOBAL_CONFIG is not a valid connection string')

    return { id, token, baseUrl: `${url.origin}/${id}` }
}

/**
 * Read one item, uncached and asking for the latest write (Vercel's copies
 * can lag a write by a few seconds). Callers cache it where they want to.
 * Undefined when the key doesn't exist.
 */
export const readItem = async (key: string): Promise<unknown> => {
    const { baseUrl, token } = connection()
    const response = await fetch(`${baseUrl}/item/${key}?version=1`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'x-edge-config-min-updated-at': `${Number.MAX_SAFE_INTEGER}`
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(15000)
    })

    if (response.status === 404) return undefined
    if (!response.ok) {
        throw new Error(`Global Config read failed: HTTP ${response.status}`)
    }

    return response.json()
}

type ItemChange =
    | { operation: 'upsert'; key: string; value: unknown }
    | { operation: 'delete'; key: string }

/**
 * Change items in one request: every change is applied, or none is
 */
export const writeItems = async (items: ItemChange[]) => {
    const token = process.env.VERCEL_API_TOKEN
    const teamId = process.env.VERCEL_TEAM_ID
    const storeId = connection().id

    if (!token || !teamId) {
        throw new Error(
            'VERCEL_API_TOKEN and VERCEL_TEAM_ID must be set to write to Global Config'
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
