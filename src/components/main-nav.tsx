'use client'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import Link from 'next/link'

const MainNav = () => (
    <div className='hidden md:flex'>
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link
                        href='/prints/'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            Prints
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href='/screenshots/'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            Screenshots
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href='/faq/'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            FAQ
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href='/about/'
                        legacyBehavior
                        passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}>
                            About
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </div>
)

export default MainNav
