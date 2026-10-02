'use client'

import { oauthProviders } from '@/assets/data/oauth-providers'
import {
    AccountRow,
    AccountSection
} from '@/components/account/account-section'
import {
    runAccountAction,
    useReverified
} from '@/components/account/reverification-provider'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import type {
    ExternalAccountResource,
    OAuthStrategy
} from '@clerk/nextjs/types'
import Image from 'next/image'

/**
 * Connect and disconnect the OAuth providers in oauth-providers.ts
 */
const ConnectedAccounts = () => {
    const { user } = useUser()

    const connectAccount = useReverified((strategy: OAuthStrategy) =>
        user!.createExternalAccount({
            strategy,
            redirectUrl: `${window.location.origin}/account/`
        })
    )
    const disconnectAccount = useReverified(
        (account: ExternalAccountResource) => account.destroy()
    )

    if (!user) return null

    /**
     * Clerk returns the provider's consent page; it redirects back here
     */
    const connect = (strategy: OAuthStrategy) =>
        runAccountAction(async () => {
            const account = await connectAccount(strategy)
            const url = account.verification?.externalVerificationRedirectURL

            if (url) window.location.href = url.href
        })

    return (
        <AccountSection
            title='Connected accounts'
            description='Sign in with any of these instead of an email code.'>
            {oauthProviders.map((provider) => {
                const account = user.externalAccounts.find(
                    (external) => external.provider === provider.provider
                )

                return (
                    <AccountRow key={provider.strategy}>
                        <Image
                            src={provider.iconUrl}
                            alt=''
                            width={20}
                            height={20}
                            unoptimized
                        />
                        <div className='flex min-w-0 flex-1 flex-col'>
                            <span className='text-sm font-medium'>
                                {provider.label}
                            </span>
                            <span className='truncate text-xs text-muted-foreground'>
                                {account
                                    ? account.emailAddress ||
                                      account.username ||
                                      'Connected'
                                    : 'Not connected'}
                            </span>
                        </div>
                        {account ? (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                    runAccountAction(async () => {
                                        await disconnectAccount(account)
                                        await user.reload()
                                    }, `${provider.label} disconnected`)
                                }>
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => connect(provider.strategy)}>
                                Connect
                            </Button>
                        )}
                    </AccountRow>
                )
            })}
        </AccountSection>
    )
}

export default ConnectedAccounts
