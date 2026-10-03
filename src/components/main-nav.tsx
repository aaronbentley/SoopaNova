'use client'
import { links, type NavLink } from '@/assets/data/links'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { cn, isNavLinkActive } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Nav link styles, shared with the mobile nav
 */
export const navLinkClassName = (active: boolean) =>
    cn(
        [
            'rounded-md',
            'px-3',
            'py-1.5',
            'text-sm',
            'text-muted-foreground',
            'transition-colors',
            'duration-200',
            'hover:bg-card',
            'hover:text-foreground',
            'focus:bg-card',
            'focus:text-foreground',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring/50'
        ],
        active && [
            'bg-primary',
            'text-primary-foreground',
            'hover:bg-primary',
            'hover:text-primary-foreground',
            'focus:bg-primary',
            'focus:text-primary-foreground'
        ]
    )

/**
 * A menu trigger (Prints, Screenshots): a nav link that also stays
 * highlighted while its panel is open. The ui component styles these states
 * with prefixed classes (data-popup-open:bg-muted…), which tailwind-merge
 * only replaces with classes under the same prefix, so each is set here.
 */
const navTriggerClassName = (active: boolean) =>
    cn(
        navLinkClassName(active),
        ['h-auto', 'font-normal'],
        active
            ? [
                  'data-popup-open:bg-primary',
                  'data-popup-open:text-primary-foreground',
                  'data-popup-open:hover:bg-primary',
                  'data-open:bg-primary',
                  'data-open:hover:bg-primary',
                  'data-open:focus:bg-primary'
              ]
            : [
                  'data-popup-open:bg-card',
                  'data-popup-open:text-foreground',
                  'data-popup-open:hover:bg-card',
                  'data-open:bg-card',
                  'data-open:hover:bg-card',
                  'data-open:focus:bg-card'
              ]
    )

/**
 * A link in a menu's panel: label with a short line under it
 */
const PanelLink = ({
    item,
    label,
    pathname
}: {
    item: NavLink
    label: string
    pathname: string
}) => (
    <li>
        <NavigationMenuLink
            render={<Link href={item.href} />}
            active={pathname === item.href}
            className='flex-col items-start gap-0.5 px-3 py-2'>
            <span className='font-medium text-foreground'>{label}</span>
            {item.description && (
                <span className='text-xs text-muted-foreground'>
                    {item.description}
                </span>
            )}
        </NavigationMenuLink>
    </li>
)

const MainNav = () => {
    // Get the current pathname
    const pathname = usePathname()

    return (
        <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList className='gap-1'>
                {links.map((link) =>
                    link.children ? (
                        <NavigationMenuItem key={link.href}>
                            <NavigationMenuTrigger
                                className={navTriggerClassName(
                                    isNavLinkActive(pathname, link.href)
                                )}>
                                {link.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className='grid w-120 grid-cols-2 gap-1'>
                                    <PanelLink
                                        item={link}
                                        label={link.overview ?? link.label}
                                        pathname={pathname}
                                    />
                                    {link.children.map((child) => (
                                        <PanelLink
                                            key={child.href}
                                            item={child}
                                            label={child.label}
                                            pathname={pathname}
                                        />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem key={link.href}>
                            <NavigationMenuLink
                                render={<Link href={link.href} />}
                                aria-current={
                                    pathname === link.href ? 'page' : undefined
                                }
                                className={navLinkClassName(
                                    isNavLinkActive(pathname, link.href)
                                )}>
                                {link.label}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                )}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default MainNav
