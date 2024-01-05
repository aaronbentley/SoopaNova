'use client'
import { Heart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

const NewOrderToast = () => {
    const searchParams = useSearchParams()
    const newOrderID = searchParams.get('orderId')

    useEffect(() => {
        if (newOrderID) {
            toast.success('Thank you for your order', {
                description: "We've sent an order confirmation to your inbox.",
                duration: 7000,
                dismissible: false,
                icon: <Heart className='size-4' />
            })
        }
    }, [newOrderID])

    return null
}

export default NewOrderToast
