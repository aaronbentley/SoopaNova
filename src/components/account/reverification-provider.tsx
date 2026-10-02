'use client'

import CodeInput from '@/components/code-input'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { clerkErrorMessage } from '@/lib/clerk'
import { useReverification, useSession } from '@clerk/nextjs'
import { isReverificationCancelledError } from '@clerk/nextjs/errors'
import type {
    EmailCodeFactor,
    SessionVerificationLevel
} from '@clerk/nextjs/types'
import { Loader2 } from 'lucide-react'
import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { toast } from 'sonner'

type Request = {
    level: SessionVerificationLevel | undefined
    complete: () => void
    cancel: () => void
}

const ReverificationContext = createContext<
    ((request: Request) => void) | null
>(null)

/**
 * Wrap a sensitive Clerk call (e.g. user.delete()). If Clerk asks the user to
 * confirm it's them, the provider's dialog sends a code to their primary
 * email, then the call is retried. Throws if they close the dialog.
 */
export const useReverified = <
    Fetcher extends Parameters<typeof useReverification>[0]
>(
    fetcher: Fetcher
) => {
    const onNeedsReverification = useContext(ReverificationContext)

    if (!onNeedsReverification) {
        throw new Error(
            'useReverified must be used in a ReverificationProvider'
        )
    }

    return useReverification(fetcher, { onNeedsReverification })
}

/**
 * Run an account action, toasting the outcome. Closing the reverification
 * dialog isn't an error.
 */
export const runAccountAction = async (
    action: () => Promise<unknown>,
    success?: string
) => {
    try {
        await action()
        if (success) toast.success(success)
        return true
    } catch (error) {
        if (!isReverificationCancelledError(error)) {
            toast.error(clerkErrorMessage(error))
        }
        return false
    }
}

/**
 * Custom UI for Clerk's reverification (instead of Clerk's modal): an email
 * code to the user's primary address
 */
export const ReverificationProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const { session } = useSession()
    const request = useRef<Request | null>(null)
    const [open, setOpen] = useState(false)
    const [factor, setFactor] = useState<EmailCodeFactor | null>(null)
    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    /**
     * Start a session verification and send the code
     */
    const sendCode = async () => {
        if (!session) return

        setPending(true)
        setError(null)

        try {
            const verification = await session.startVerification({
                level: request.current?.level ?? 'first_factor'
            })
            const emailFactor = verification.supportedFirstFactors?.find(
                (supported): supported is EmailCodeFactor =>
                    supported.strategy === 'email_code'
            )

            if (!emailFactor) {
                throw new Error(
                    "We can't confirm it's you by email. Please sign out and back in, then try again."
                )
            }

            await session.prepareFirstFactorVerification({
                strategy: 'email_code',
                emailAddressId: emailFactor.emailAddressId
            })
            setFactor(emailFactor)
        } catch (caught) {
            setError(clerkErrorMessage(caught))
        } finally {
            setPending(false)
        }
    }

    const onNeedsReverification = (next: Request) => {
        request.current = next
        setFactor(null)
        setCode('')
        setOpen(true)
        void sendCode()
    }

    const verifyCode = async (value: string) => {
        if (!session) return

        setPending(true)
        setError(null)

        try {
            const verification = await session.attemptFirstFactorVerification({
                strategy: 'email_code',
                code: value
            })

            if (verification.status !== 'complete') {
                throw new Error(
                    "That didn't finish verifying you. Please try again."
                )
            }

            /**
             * Retry the original call, and close without cancelling it
             */
            request.current?.complete()
            request.current = null
            setOpen(false)
        } catch (caught) {
            setError(clerkErrorMessage(caught))
            setCode('')
        } finally {
            setPending(false)
        }
    }

    const onOpenChange = (next: boolean) => {
        if (next) return

        request.current?.cancel()
        request.current = null
        setOpen(false)
    }

    return (
        <ReverificationContext.Provider value={onNeedsReverification}>
            {children}
            <Dialog
                open={open}
                onOpenChange={onOpenChange}>
                <DialogContent className='sm:max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>Confirm it&apos;s you</DialogTitle>
                        <DialogDescription>
                            {factor ? (
                                <>
                                    We sent a 6-digit code to{' '}
                                    <span className='text-foreground'>
                                        {factor.safeIdentifier}
                                    </span>
                                    .
                                </>
                            ) : (
                                'Sending a code to your email…'
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col items-center gap-4'>
                        {factor && (
                            <CodeInput
                                id='reverification-code'
                                value={code}
                                onChange={setCode}
                                onComplete={verifyCode}
                                disabled={pending}
                            />
                        )}
                        {error && (
                            <p className='text-sm text-destructive text-center'>
                                {error}
                            </p>
                        )}
                        {pending && (
                            <Loader2 className='size-5 animate-spin text-muted-foreground' />
                        )}
                        {factor && (
                            <Button
                                variant='link'
                                size='sm'
                                disabled={pending}
                                onClick={sendCode}>
                                Resend code
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </ReverificationContext.Provider>
    )
}
