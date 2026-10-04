'use client'

import { cancelOrderAction } from '@/actions/orders'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useSyncExternalStore, useTransition } from 'react'
import { toast } from 'sonner'

const cancelFailed = "We couldn't cancel your order. Please try again."

const subscribe = () => () => {}

/**
 * Cancel an order while Prodigi has it paused, after a confirmation. The
 * button goes when the window closes; the server checks the time again.
 */
const CancelOrderButton = ({
    orderId,
    total,
    cancellableUntil
}: {
    orderId: string
    /** The amount refunded, formatted */
    total: string
    cancellableUntil: Date
}) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [expired, setExpired] = useState(false)
    const [pending, startTransition] = useTransition()

    /**
     * The deadline in the visitor's own time zone, so only in the browser
     */
    const deadline = useSyncExternalStore(
        subscribe,
        () =>
            cancellableUntil.toLocaleTimeString('en-GB', {
                hour: 'numeric',
                minute: '2-digit'
            }),
        () => null
    )

    useEffect(() => {
        const timer = setTimeout(
            () => setExpired(true),
            cancellableUntil.getTime() - Date.now()
        )

        return () => clearTimeout(timer)
    }, [cancellableUntil])

    if (expired) return null

    const cancel = () =>
        startTransition(async () => {
            /**
             * The action returns a message for the customer. It only throws
             * when it can't run at all (offline, or a new deployment).
             */
            const result = await cancelOrderAction(orderId).catch(() => ({
                message: cancelFailed
            }))

            if ('message' in result) {
                toast.error(result.message)
            } else {
                toast.success('Order cancelled', {
                    description: `We've refunded ${total}. It usually shows on your statement within 5–10 days.`
                })
            }

            setOpen(false)
            router.refresh()
        })

    return (
        <div className='flex flex-col gap-1 sm:items-end'>
            <AlertDialog
                open={open}
                onOpenChange={(next) => !pending && setOpen(next)}>
                <AlertDialogTrigger
                    render={
                        <Button
                            variant='outline'
                            size='sm'
                        />
                    }>
                    Cancel order
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            We&apos;ll stop it before it&apos;s printed and
                            refund {total} in full. This can&apos;t be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={pending}>
                            Keep order
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className={buttonVariants({
                                variant: 'destructive'
                            })}
                            disabled={pending}
                            onClick={cancel}>
                            {pending ? 'Cancelling…' : 'Cancel order'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {deadline && (
                <p className='text-xs text-muted-foreground'>
                    You can cancel until{' '}
                    <time dateTime={cancellableUntil.toISOString()}>
                        {deadline}
                    </time>
                </p>
            )}
        </div>
    )
}

export default CancelOrderButton
