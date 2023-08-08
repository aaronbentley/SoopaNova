'use client'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
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
                        'justify-center'
                    ])}>
                    <Loader2 className='h-12 w-12 animate-spin' />
                </div>
            )}
        </div>
    )
}

export default CanvasPopCart
