'use client'

import { links } from '@/assets/data/links'
import { navLinkClassName } from '@/components/main-nav'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import Wordmark from '@/components/wordmark'
import { cn, isNavLinkActive } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'

const MobileNav = () => {
    // Handle menu state
    const [open, setOpen] = useState(false)

    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button
                        size='icon'
                        variant='ghost'
                        className='size-8 md:hidden'
                    />
                }>
                <Menu className='size-[1.1rem]' />
                <span className='sr-only'>Toggle Menu</span>
            </SheetTrigger>
            <SheetContent
                side='left'
                className='pr-0 pl-6 pt-5'>
                <SheetTitle className='sr-only'>Navigation menu</SheetTitle>
                <Link
                    href='/'
                    aria-label='Home'
                    onClick={() => setOpen(false)}
                    className='flex h-6 items-center'>
                    <Wordmark />
                </Link>
                <ScrollArea className='mt-8 mb-4 h-[calc(100vh-8rem)] pb-10'>
                    <div className='flex flex-col items-start gap-1 pr-6'>
                        {links.map((link) => (
                            <Fragment key={link.href}>
                                <MobileLink
                                    href={link.href}
                                    onOpenChange={setOpen}>
                                    {link.label}
                                </MobileLink>
                                {link.children?.map((child) => (
                                    <MobileLink
                                        key={child.href}
                                        href={child.href}
                                        onOpenChange={setOpen}
                                        className='ml-4 text-sm'>
                                        {child.label}
                                    </MobileLink>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

const MobileLink = ({
    href,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const active = isNavLinkActive(pathname, href.toString())

    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn(navLinkClassName(active), 'text-base', className)}
            {...props}>
            {children}
        </Link>
    )
}
