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
