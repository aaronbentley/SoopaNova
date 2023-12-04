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
                            <Link
                                href={link.href}
                                legacyBehavior
                                passHref>
                                <NavigationMenuLink
                                    active={pathname === link.href}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        [
                                            'data-[active]:text-neutral-50',
                                            'dark:data-[active]:text-neutral-950',
                                            'data-[active]:bg-pink-500',
                                            'dark:data-[active]:bg-pink-500'
                                        ]
                                    )}>
                                    {link.label}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    ))}
                    <SignedIn>
                        <NavigationMenuItem>
                            <Link
                                href={`/orders/${userId}/`}
                                legacyBehavior
                                passHref>
                                <NavigationMenuLink
                                    active={pathname === `/orders/${userId}/`}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        [
                                            'data-[active]:text-neutral-50',
                                            'dark:data-[active]:text-neutral-950',
                                            'data-[active]:bg-pink-500',
                                            'dark:data-[active]:bg-pink-500'
                                        ]
                                    )}>
                                    Orders
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </SignedIn>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default MainNav
