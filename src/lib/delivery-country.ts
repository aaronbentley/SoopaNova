import { countries, defaultCountry } from '@/assets/data/countries'
import type { Region } from '@/types'

/**
 * The delivery country for prices and checkout, remembered in this browser
 */
const storageKey = 'deliveryCountry'

const isDeliveryCountry = (code: string | null | undefined): code is string =>
    !!code && countries.some((country) => country.code === code)

/**
 * The visitor's country from their connection, set by proxy.ts from Vercel's
 * x-vercel-ip-country header (not set in local dev)
 */
export const locationCookie = 'visitorCountry'

const getLocationCountry = () =>
    document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${locationCookie}=`))
        ?.split('=')[1]

/**
 * The visitor's last chosen country, else where they're connecting from
 * (when we deliver there), else a guess from their browser language
 * (en-GB → GB), else the UK
 */
export const detectDeliveryCountry = () => {
    if (typeof window === 'undefined') return defaultCountry

    try {
        const stored = window.localStorage.getItem(storageKey)
        if (isDeliveryCountry(stored)) return stored
    } catch {
        /** Storage can be unavailable (private windows, blocked cookies) */
    }

    const fromLocation = getLocationCountry()
    if (isDeliveryCountry(fromLocation)) return fromLocation

    const fromLanguage = navigator.languages
        .map((language) => language.split('-')[1]?.toUpperCase())
        .find(isDeliveryCountry)

    return fromLanguage ?? defaultCountry
}

/**
 * The pricing region a country is in (the UK's when it isn't one we deliver
 * to)
 */
export const getRegion = (country: string): Region =>
    countries.find((entry) => entry.code === country)?.region ?? 'gb'

/**
 * Remember the chosen country for next time
 */
export const rememberDeliveryCountry = (code: string) => {
    try {
        window.localStorage.setItem(storageKey, code)
    } catch {
        /** Not remembered, but still used for this order */
    }
}
