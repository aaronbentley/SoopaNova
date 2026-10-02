'use client'

import {
    AccountRow,
    AccountSection
} from '@/components/account/account-section'
import {
    runAccountAction,
    useReverified
} from '@/components/account/reverification-provider'
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
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

/**
 * Delete the Clerk user (which signs them out everywhere)
 */
const DeleteAccount = () => {
    const router = useRouter()
    const { user } = useUser()

    const deleteUser = useReverified(() => user!.delete())

    if (!user) return null

    const confirmDelete = async () => {
        const deleted = await runAccountAction(
            deleteUser,
            'Your account has been deleted'
        )

        if (deleted) router.push('/')
    }

    return (
        <AccountSection title='Delete account'>
            <AccountRow>
                <p className='min-w-0 flex-1 text-sm text-muted-foreground text-pretty'>
                    Permanently delete your SoopaNova account. Prints you’ve
                    already ordered from CanvasPop aren’t affected.
                </p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='destructive'
                            size='sm'>
                            Delete account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete your account?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This can’t be undone. You’ll be signed out
                                everywhere and won’t be able to see your print
                                orders here any more.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className={buttonVariants({
                                    variant: 'destructive'
                                })}
                                onClick={confirmDelete}>
                                Delete account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </AccountRow>
        </AccountSection>
    )
}

export default DeleteAccount
