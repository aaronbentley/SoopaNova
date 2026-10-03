'use client'

import { detectDeliveryCountry, getRegion } from '@/lib/delivery-country'
import { formatMoney, type Price } from '@/lib/pricing'
import type { Region } from '@/types'
import { useSyncExternalStore } from 'react'

/**
 * The visitor's region comes from the browser (their remembered delivery
 * country, else their language), so static pages render a placeholder and
 * fill it in after hydration. Updates if the country changes in another tab.
 */
const subscribe = (onChange: () => void) => {
    window.addEventListener('storage', onChange)

    return () => window.removeEventListener('storage', onChange)
}

const getRegionSnapshot = () => getRegion(detectDeliveryCountry())

const getServerSnapshot = () => null

/**
 * A price in the visitor's currency: a product's "from" price, or one
 * size's. The prices for every region are worked out at build time and
 * passed in; `unavailable` shows when it isn't sold in the visitor's region.
 */
const ProductPrice = ({
    prices,
    from = false,
    unavailable = null
}: {
    prices: Record<Region, Price | null>
    from?: boolean
    unavailable?: React.ReactNode
}) => {
    const region = useSyncExternalStore(
        subscribe,
        getRegionSnapshot,
        getServerSnapshot
    )

    if (!region) {
        return (
            <span
                aria-hidden='true'
                className='inline-block h-3.5 w-9 animate-pulse rounded-sm bg-muted align-middle'
            />
        )
    }

    const price = prices[region]

    if (!price) return unavailable

    return (
        <>
            {from && 'from '}
            <span className='text-foreground'>{formatMoney(price)}</span>
        </>
    )
}

export default ProductPrice
