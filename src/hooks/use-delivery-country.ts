'use client'

import { countries, defaultCountry } from '@/assets/data/countries'
import { useState } from 'react'

const storageKey = 'deliveryCountry'

const isDeliveryCountry = (code: string | null | undefined): code is string =>
    !!code && countries.some((country) => country.code === code)

/**
 * The visitor's last chosen country, else a guess from their browser
 * language (en-GB → GB), else the UK
 */
const detectCountry = () => {
    if (typeof window === 'undefined') return defaultCountry

    try {
        const stored = window.localStorage.getItem(storageKey)
        if (isDeliveryCountry(stored)) return stored
    } catch {
        /** Storage can be unavailable (private windows, blocked cookies) */
    }

    const fromLanguage = navigator.languages
        .map((language) => language.split('-')[1]?.toUpperCase())
        .find(isDeliveryCountry)

    return fromLanguage ?? defaultCountry
}

/**
 * The delivery country for prices and checkout, remembered in this browser
 */
export const useDeliveryCountry = () => {
    const [country, setCountry] = useState(detectCountry)

    const update = (code: string) => {
        setCountry(code)

        try {
            window.localStorage.setItem(storageKey, code)
        } catch {
            /** Not remembered, but still used for this order */
        }
    }

    return [country, update] as const
}
