'use client'

import { Heart } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

/**
 * A toast for coming back from Stripe Checkout: `?checkout=success` (to
 * /orders) or `?checkout=cancelled` (to /create). The parameter is removed
 * afterwards so a refresh doesn't show it again.
 */
const CheckoutToast = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const checkout = searchParams.get('checkout')

    useEffect(() => {
        if (checkout === 'success') {
            toast.success('Thanks for your order!', {
                description:
                    "Your payment went through. Your order will show here once it's confirmed.",
                duration: 8000,
                icon: <Heart className='size-4' />
            })
        } else if (checkout === 'cancelled') {
            toast.info('Checkout cancelled', {
                description:
                    "You haven't been charged. Choose your screenshot again to carry on."
            })
        } else {
            return
        }

        router.replace(pathname, { scroll: false })
    }, [checkout, pathname, router])

    return null
}

export default CheckoutToast
