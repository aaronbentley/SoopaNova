'use client'

import { Heart } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

/**
 * Stripe's webhook usually records the order a few seconds after the
 * customer is back, so /orders refreshes a few times to show it
 */
const refreshDelays = [3000, 8000, 15000]

/**
 * A toast for coming back from Stripe Checkout: `?checkout=success` (to
 * /orders) or `?checkout=cancelled` (to /create). The parameter is removed
 * afterwards so a refresh doesn't show it again. The fixed toast id stops a
 * second toast when the effect runs twice (React Strict Mode in dev).
 */
const CheckoutToast = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const checkout = searchParams.get('checkout')
    const refreshTimers = useRef<ReturnType<typeof setTimeout>[]>([])

    useEffect(() => {
        if (checkout === 'success') {
            toast.success('Achievement unlocked: order placed', {
                id: 'checkout',
                description:
                    "Thanks for your order. Your payment went through, and it'll show here once it's confirmed.",
                duration: 8000,
                icon: <Heart className='size-4' />
            })

            refreshTimers.current.forEach(clearTimeout)
            refreshTimers.current = refreshDelays.map((delay) =>
                setTimeout(() => router.refresh(), delay)
            )
        } else if (checkout === 'cancelled') {
            toast.info('Checkout cancelled', {
                id: 'checkout',
                description:
                    "You haven't been charged. Choose your screenshot again to carry on."
            })
        } else {
            return
        }

        router.replace(pathname, { scroll: false })
    }, [checkout, pathname, router])

    /**
     * Stop refreshing when leaving the page (not when the parameter is
     * removed, which re-runs the effect above)
     */
    useEffect(() => () => refreshTimers.current.forEach(clearTimeout), [])

    return null
}

export default CheckoutToast
