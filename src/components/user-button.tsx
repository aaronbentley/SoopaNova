'use client'
import { UserButton as ClerkUserButton, useAuth } from '@clerk/nextjs'
import { Box } from 'lucide-react'

const UserButton = () => {
    // Get the auth state
    const { isLoaded, userId } = useAuth()

    // In case the user signs out while on the page.
    if (!isLoaded || !userId) return null

    return (
        <ClerkUserButton>
            <ClerkUserButton.MenuItems>
                <ClerkUserButton.Link
                    label='Orders'
                    labelIcon={<Box className='size-4' />}
                    href={`/orders/${userId}`}
                />
                <ClerkUserButton.Action label='manageAccount' />
                <ClerkUserButton.Action label='signOut' />
            </ClerkUserButton.MenuItems>
        </ClerkUserButton>
    )
}

export default UserButton
