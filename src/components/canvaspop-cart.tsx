'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React from 'react'
import CanvasPopCartEventListener from './canvaspop-event-listener'

interface CanvaspopCartProps {
    src: string | null
}

const CanvaspopCart = ({ src = null }: CanvaspopCartProps) => {
    /**
     * Handle iframe content loading state
     */
    const [isMounted, setIsMounted] = React.useState(false)
    const iframeRef = React.useRef(null)

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
        <div className='relative w-full h-full bg-neutral-50 dark:bg-neutral-950'>
            <iframe
                id='canvaspop-cart-iframe'
                src={src}
                ref={iframeRef}
                onLoad={handleIframeLoad}
                className='w-full h-full z-10 bg-neutral-50 dark:bg-neutral-950'
            />
            {!isMounted && (
                <div
                    className={cn([
                        'absolute',
                        'inset-0',
                        'z-30',
                        'flex',
                        'items-center',
                        'justify-center',
                        'bg-neutral-50',
                        'dark:bg-neutral-950'
                    ])}>
                    <Loader2 className='h-12 w-12 animate-spin text-pink-500' />
                </div>
            )}
            {isMounted && <CanvasPopCartEventListener />}
        </div>
    )
}

export default CanvaspopCart
