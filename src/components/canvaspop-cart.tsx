'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'
import React from 'react'

interface CanvasPopCartProps {
    src: string | null
}

const CanvasPopCart = ({ src = null }: CanvasPopCartProps) => {
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
            <Script id='canvaspop-events'>
                {`
                    const cartWindow = document.getElementById('canvaspop-cart-iframe').contentWindow;
                    window.addEventListener( 'message', ( event ) => {
                    
                        // Ignore events outside of CanvasPop Cart
                        if (event.source !== cartWindow) {
                            return;
                        }
                        
                        console.log('🦄 ~ file: canvaspop-cart.tsx ~ CanvasPopCart ~ event:', event)
                    }, false );`}
            </Script>
        </div>
    )
}

export default CanvasPopCart
