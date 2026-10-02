import type { Region } from '@/types'

/**
 * Countries we deliver to, by pricing region (see regions in pricing.ts).
 * The EU is its 27 member states.
 */
export const countries: { code: string; name: string; region: Region }[] = [
    { code: 'GB', name: 'United Kingdom', region: 'gb' },
    { code: 'AT', name: 'Austria', region: 'eu' },
    { code: 'BE', name: 'Belgium', region: 'eu' },
    { code: 'BG', name: 'Bulgaria', region: 'eu' },
    { code: 'HR', name: 'Croatia', region: 'eu' },
    { code: 'CY', name: 'Cyprus', region: 'eu' },
    { code: 'CZ', name: 'Czechia', region: 'eu' },
    { code: 'DK', name: 'Denmark', region: 'eu' },
    { code: 'EE', name: 'Estonia', region: 'eu' },
    { code: 'FI', name: 'Finland', region: 'eu' },
    { code: 'FR', name: 'France', region: 'eu' },
    { code: 'DE', name: 'Germany', region: 'eu' },
    { code: 'GR', name: 'Greece', region: 'eu' },
    { code: 'HU', name: 'Hungary', region: 'eu' },
    { code: 'IE', name: 'Ireland', region: 'eu' },
    { code: 'IT', name: 'Italy', region: 'eu' },
    { code: 'LV', name: 'Latvia', region: 'eu' },
    { code: 'LT', name: 'Lithuania', region: 'eu' },
    { code: 'LU', name: 'Luxembourg', region: 'eu' },
    { code: 'MT', name: 'Malta', region: 'eu' },
    { code: 'NL', name: 'Netherlands', region: 'eu' },
    { code: 'PL', name: 'Poland', region: 'eu' },
    { code: 'PT', name: 'Portugal', region: 'eu' },
    { code: 'RO', name: 'Romania', region: 'eu' },
    { code: 'SK', name: 'Slovakia', region: 'eu' },
    { code: 'SI', name: 'Slovenia', region: 'eu' },
    { code: 'ES', name: 'Spain', region: 'eu' },
    { code: 'SE', name: 'Sweden', region: 'eu' },
    { code: 'US', name: 'United States', region: 'us' }
]

export const defaultCountry = 'GB'
