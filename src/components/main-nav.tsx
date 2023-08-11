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
    <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
                <Link
                    href='/products/'
                    legacyBehavior
                    passHref>
                    <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}>
                        Products
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
)

export default MainNav
