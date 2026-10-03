'use client'

import {
    AccountRow,
    AccountSection
} from '@/components/account/account-section'
import {
    runAccountAction,
    useReverified
} from '@/components/account/reverification-provider'
import CodeInput from '@/components/code-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { clerkErrorMessage } from '@/lib/clerk'
import { useUser } from '@clerk/nextjs'
import type { EmailAddressResource } from '@clerk/nextjs/types'
import { isReverificationCancelledError } from '@clerk/nextjs/errors'
import { Loader2, MoreHorizontal, Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

/**
 * List, add (verified by code), make primary and remove email addresses
 */
const EmailAddresses = () => {
    const { user } = useUser()

    /**
     * The add/verify dialog: no address yet (add), or one waiting for a code
     */
    const [dialogOpen, setDialogOpen] = useState(false)
    const [address, setAddress] = useState('')
    const [verifying, setVerifying] = useState<EmailAddressResource | null>(
        null
    )
    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const createEmail = useReverified((email: string) =>
        user!.createEmailAddress({ email })
    )
    const makePrimary = useReverified((emailAddressId: string) =>
        user!.update({ primaryEmailAddressId: emailAddressId })
    )
    const removeEmail = useReverified((email: EmailAddressResource) =>
        email.destroy()
    )

    if (!user) return null

    const openDialog = async (unverified?: EmailAddressResource) => {
        setAddress('')
        setCode('')
        setError(null)
        setVerifying(null)
        setDialogOpen(true)

        /**
         * Resume verifying an address added earlier
         */
        if (unverified) {
            await sendCode(unverified)
        }
    }

    const sendCode = async (email: EmailAddressResource) => {
        setPending(true)
        setError(null)

        try {
            await email.prepareVerification({ strategy: 'email_code' })
            setVerifying(email)
        } catch (caught) {
            setError(clerkErrorMessage(caught))
        } finally {
            setPending(false)
        }
    }

    const addEmail = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setPending(true)
        setError(null)

        try {
            const email = await createEmail(address)
            await user.reload()
            await sendCode(email)
        } catch (caught) {
            if (!isReverificationCancelledError(caught)) {
                setError(clerkErrorMessage(caught))
            }
        } finally {
            setPending(false)
        }
    }

    const verifyCode = async (value: string) => {
        if (!verifying) return

        setPending(true)
        setError(null)

        try {
            const email = await verifying.attemptVerification({ code: value })

            if (email.verification.status !== 'verified') {
                throw new Error('That code didn’t work. Please try again.')
            }

            await user.reload()
            setDialogOpen(false)
            toast.success(`${email.emailAddress} added`)
        } catch (caught) {
            setError(clerkErrorMessage(caught))
            setCode('')
        } finally {
            setPending(false)
        }
    }

    return (
        <AccountSection
            title='Email addresses'
            description='Codes to sign in are sent to your primary address.'
            action={
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => openDialog()}>
                    <Plus />
                    Add email
                </Button>
            }>
            {[...user.emailAddresses]
                /**
                 * Primary first
                 */
                .sort(
                    (a, b) =>
                        Number(b.id === user.primaryEmailAddressId) -
                        Number(a.id === user.primaryEmailAddressId)
                )
                .map((email) => {
                    const isPrimary = email.id === user.primaryEmailAddressId
                    const isVerified = email.verification.status === 'verified'

                    return (
                        <AccountRow key={email.id}>
                            <span className='min-w-0 flex-1 truncate text-sm'>
                                {email.emailAddress}
                            </span>
                            {isPrimary && <Badge>Primary</Badge>}
                            {!isVerified && (
                                <Badge variant='outline'>Unverified</Badge>
                            )}
                            {!isPrimary && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                size='icon'
                                                variant='ghost'
                                                className='size-8'
                                            />
                                        }>
                                        <MoreHorizontal />
                                        <span className='sr-only'>
                                            Actions for {email.emailAddress}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        {isVerified ? (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    runAccountAction(
                                                        async () => {
                                                            await makePrimary(
                                                                email.id
                                                            )
                                                            await user.reload()
                                                        },
                                                        `${email.emailAddress} is now your primary email`
                                                    )
                                                }>
                                                Make primary
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    openDialog(email)
                                                }>
                                                Verify
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            variant='destructive'
                                            onClick={() =>
                                                runAccountAction(async () => {
                                                    await removeEmail(email)
                                                    await user.reload()
                                                }, `${email.emailAddress} removed`)
                                            }>
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </AccountRow>
                    )
                })}

            <Dialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}>
                <DialogContent className='sm:max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>
                            {verifying ? 'Verify email' : 'Add email'}
                        </DialogTitle>
                        <DialogDescription>
                            {verifying ? (
                                <>
                                    We sent a 6-digit code to{' '}
                                    <span className='text-foreground'>
                                        {verifying.emailAddress}
                                    </span>
                                    .
                                </>
                            ) : (
                                'We’ll send a code to confirm it’s yours.'
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {verifying ? (
                        <div className='flex flex-col items-center gap-4'>
                            <CodeInput
                                id='email-code'
                                value={code}
                                onChange={setCode}
                                onComplete={verifyCode}
                                disabled={pending}
                            />
                            {error && (
                                <p className='text-sm text-destructive text-center'>
                                    {error}
                                </p>
                            )}
                            {pending && (
                                <Loader2 className='size-5 animate-spin text-muted-foreground' />
                            )}
                            <Button
                                variant='link'
                                size='sm'
                                disabled={pending}
                                onClick={() => sendCode(verifying)}>
                                Resend code
                            </Button>
                        </div>
                    ) : (
                        <form
                            onSubmit={addEmail}
                            className='grid gap-3'>
                            <div className='grid gap-2'>
                                <Label htmlFor='new-email'>Email address</Label>
                                <Input
                                    id='new-email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    aria-invalid={error ? true : undefined}
                                />
                            </div>
                            {error && (
                                <p className='text-sm text-destructive'>
                                    {error}
                                </p>
                            )}
                            <DialogFooter>
                                <Button
                                    type='submit'
                                    disabled={pending}>
                                    {pending && (
                                        <Loader2 className='animate-spin' />
                                    )}
                                    Send code
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </AccountSection>
    )
}

export default EmailAddresses
