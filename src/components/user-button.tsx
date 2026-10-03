'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useClerk, useUser } from '@clerk/nextjs'
import { Box, LogOut, UserCog } from 'lucide-react'
import Link from 'next/link'

/**
 * Signed-in user menu: avatar trigger with Orders, Account and Sign out
 */
const UserButton = () => {
    const { signOut } = useClerk()
    const { isLoaded, user } = useUser()

    // In case the user signs out while on the page.
    if (!isLoaded || !user) return null

    const email = user.primaryEmailAddress?.emailAddress ?? ''
    const name = user.fullName || email
    const initials = (user.fullName || email).charAt(0).toUpperCase()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        size='icon'
                        variant='ghost'
                        className='size-8 rounded-full'
                    />
                }>
                <Avatar className='size-8'>
                    <AvatarImage
                        src={user.imageUrl}
                        alt=''
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className='sr-only'>Open user menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='w-56'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel className='flex flex-col gap-0.5 font-normal'>
                        <span className='truncate font-medium'>{name}</span>
                        {name !== email && (
                            <span className='truncate text-xs text-muted-foreground'>
                                {email}
                            </span>
                        )}
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href='/orders/' />}>
                    <Box />
                    Orders
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href='/account/' />}>
                    <UserCog />
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
                    <LogOut />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton
