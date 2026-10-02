'use client'
import { links } from '@/assets/data/links'
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
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-ring/50'
        ],
        active && [
            'bg-primary',
            'text-primary-foreground',
            'hover:bg-primary',
            'hover:text-primary-foreground'
        ]
    )

const MainNav = () => {
    // Get the current pathname
    const pathname = usePathname()

    return (
        <nav className='hidden md:flex items-center gap-1'>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    className={navLinkClassName(
                        isNavLinkActive(pathname, link.href)
                    )}>
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav
