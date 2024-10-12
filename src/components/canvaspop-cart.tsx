'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import CanvasPopCartEventListener from './canvaspop-event-listener'

interface CanvaspopCartProps {
    src: string | null
}

const CanvaspopCart = ({ src = null }: CanvaspopCartProps) => {
    /**
     * Handle iframe content loading state
     */
    const [isMounted, setIsMounted] = useState(false)
    const iframeRef = useRef(null)

    /**
     * Bail if no src is provided
     */
    if (!src) {
        return null
    }

    const handleIframeLoad = () => {
        setIsMounted(true)
    }

    return (
        <div className='relative w-full h-full'>
            <iframe
                id='canvaspop-cart-iframe'
                src={src}
                ref={iframeRef}
                onLoad={handleIframeLoad}
                className='w-full h-full z-10'
            />
            {!isMounted && (
                <div
                    className={cn([
                        'absolute',
                        'inset-0',
                        'z-30',
                        'flex',
                        'items-center',
                        'justify-center'
                    ])}>
                    <Loader2 className='h-12 w-12 animate-spin text-primary' />
                </div>
            )}
            {isMounted && <CanvasPopCartEventListener />}
        </div>
    )
}

export default CanvaspopCart
