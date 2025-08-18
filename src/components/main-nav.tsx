'use client'
import { links } from '@/assets/data/links'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { SignedIn, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

const MainNav = () => {
    // Get the auth state
    const { userId } = useAuth()

    // Get the current pathname
    const pathname = usePathname()

    return (
        <div className='hidden md:flex'>
            <NavigationMenu>
                <NavigationMenuList>
                    {links.map((link, index) => (
                        <NavigationMenuItem key={index}>
                            <NavigationMenuLink
                                asChild
                                active={pathname === link.href}
                                className={cn(navigationMenuTriggerStyle(), [
                                    'data-active:text-background',
                                    'data-active:bg-primary',
                                    'dark:data-active:bg-primary'
                                ])}>
                                <Link
                                    href={link.href}
                                    passHref>
                                    {link.label}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                    <Suspense>
                        <SignedIn>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    active={pathname === `/orders/${userId}/`}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        [
                                            'data-active:text-background',
                                            'data-active:bg-primary',
                                            'dark:data-active:bg-primary'
                                        ]
                                    )}>
                                    <Link
                                        href={`/orders/${userId}/`}
                                        passHref>
                                        Orders
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </SignedIn>
                    </Suspense>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default MainNav
