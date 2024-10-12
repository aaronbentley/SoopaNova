'use client'
import { UserButton as ClerkUserButton, useAuth } from '@clerk/nextjs'
import { Box } from 'lucide-react'

const UserButton = () => {
    // Get the auth state
    const { userId } = useAuth()

    return (
        <ClerkUserButton>
            <ClerkUserButton.MenuItems>
                <ClerkUserButton.Link
                    label='Orders'
                    labelIcon={<Box className='size-4' />}
                    href={`/orders/${userId}`}
                />
            </ClerkUserButton.MenuItems>
        </ClerkUserButton>
    )
}

export default UserButton
