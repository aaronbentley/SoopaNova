'use client'
import CanvasPopCartEventListener from '@/components/canvaspop-event-listener'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { track } from '@vercel/analytics'
import { ExternalLink, Info, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

/**
 * How long to wait after the iframe loads for the cart to post its first
 * message. A working cart posts `appPageLoaded--cart` before the iframe's
 * load event fires.
 */
const cartReadyTimeout = 3000

/**
 * - loading: waiting for the cart
 * - ready: the cart has posted a message, so it's working
 * - blocked: the iframe loaded but the cart never posted. This happens when
 *   the browser blocks CanvasPop's session cookie inside our iframe (Safari,
 *   all iOS browsers, Brave, private windows) and CanvasPop shows its
 *   "session expired" page instead.
 */
type CartState = 'loading' | 'ready' | 'blocked'

interface CanvaspopCartProps {
    src: string | null
}

const CanvaspopCart = ({ src = null }: CanvaspopCartProps) => {
    const [cartState, setCartState] = useState<CartState>('loading')
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const timeoutRef = useRef<number | undefined>(undefined)

    /**
     * Mark the cart ready as soon as it posts a message
     */
    useEffect(() => {
        const cartOrigin = src ? new URL(src).origin : null

        const onMessage = (event: MessageEvent) => {
            if (
                event.source === iframeRef.current?.contentWindow &&
                event.origin === cartOrigin
            ) {
                window.clearTimeout(timeoutRef.current)
                setCartState('ready')
            }
        }

        window.addEventListener('message', onMessage)

        return () => {
            window.removeEventListener('message', onMessage)
            window.clearTimeout(timeoutRef.current)
        }
    }, [src])

    /**
     * Track how often the embedded cart is blocked
     */
    useEffect(() => {
        if (cartState === 'blocked') track('print-cart-blocked')
    }, [cartState])

    /**
     * Bail if no src is provided
     */
    if (!src) return null

    /**
     * When the iframe loads, give the cart a moment to post before treating
     * it as blocked
     */
    const handleIframeLoad = () => {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
            setCartState((state) => (state === 'loading' ? 'blocked' : state))
        }, cartReadyTimeout)
    }

    return (
        <div className='flex flex-col gap-y-4 w-full h-full'>
            {cartState === 'blocked' && (
                <Alert>
                    <Info className='size-4' />
                    <AlertTitle>Checkout not loading?</AlertTitle>
                    <AlertDescription className='flex flex-col gap-y-3'>
                        <p>
                            Your browser is blocking the embedded CanvasPop
                            checkout (this happens in Safari and private
                            browsing). You can finish your order in a new tab
                            instead - CanvasPop will email your order
                            confirmation.
                        </p>
                        <Button
                            asChild
                            size='sm'>
                            <a
                                href={src}
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={() =>
                                    track('print-cart-opened-in-tab')
                                }>
                                <ExternalLink className='mr-2 size-4' />
                                Open checkout in a new tab
                            </a>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            <div className='relative w-full flex-1'>
                <iframe
                    id='canvaspop-cart-iframe'
                    src={src}
                    ref={iframeRef}
                    onLoad={handleIframeLoad}
                    className='w-full h-full z-10'
                />
                {cartState === 'ready' && <CanvasPopCartEventListener />}
                {cartState === 'loading' && (
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
            </div>
        </div>
    )
}

export default CanvaspopCart
