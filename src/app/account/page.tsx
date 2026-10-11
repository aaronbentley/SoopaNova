import ActiveDevices from '@/components/account/active-devices'
import ConnectedAccounts from '@/components/account/connected-accounts'
import DeleteAccount from '@/components/account/delete-account'
import EmailAddresses from '@/components/account/email-addresses'
import { ReverificationProvider } from '@/components/account/reverification-provider'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import { auth } from '@clerk/nextjs/server'
import { Metadata } from 'next'

/**
 * Signed-in content renders per request, but the header, footer and
 * loading state must stay static so the page appears at once
 */
export const ensureStatic = 'shell'

/**
 * instant = false: kept on purpose. auth.protect() must run before the page
 * renders (the Clerk ESLint rule requires it at the top), so navigating here
 * waits for the server and shows the loading spinner meanwhile
 */
export const instant = false

export const metadata: Metadata = {
    title: 'Account',
    description: 'Manage your SoopaNova account.',
    alternates: {
        canonical: '/account/'
    }
}

const Account = async () => {
    /**
     * Redirect signed-out visitors to sign-in
     */
    await auth.protect()

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>Account</PageHeaderHeading>
                <PageHeaderDescription>
                    How you sign in, where you’re signed in, and your data.
                </PageHeaderDescription>
            </PageHeader>

            <ReverificationProvider>
                <EmailAddresses />
                <ConnectedAccounts />
                <ActiveDevices />
                <DeleteAccount />
            </ReverificationProvider>
        </>
    )
}

export default Account
