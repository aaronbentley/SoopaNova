'use client'

import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { navigationMenuTriggerStyle } from './ui/navigation-menu'
import { ScrollArea } from './ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const MobileNav = () => {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet
            open={open}
            onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    size='icon'
                    variant='ghost'
                    className='md:hidden'>
                    <Menu className='h-[1.2rem] w-[1.2rem]' />
                    <span className='sr-only'>Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side='left'
                className='pr-0 pl-8'>
                <MobileLink
                    href='/'
                    className='flex items-center'
                    onOpenChange={setOpen}>
                    <span
                        className={cn([
                            'font-sans',
                            'font-extrabold',
                            'text-xl',
                            'tracking-tight',
                            'transition-colors',
                            'duration-200',
                            'hover:text-pink-500'
                        ])}>
                        {process.env.NEXT_PUBLIC_APP_TITLE!}
                    </span>
                </MobileLink>
                <ScrollArea className='mt-8 mb-4 h-[calc(100vh-8rem)] pb-10'>
                    <div className='flex flex-col space-y-2'>
                        <MobileLink
                            href='/prints/'
                            onOpenChange={setOpen}>
                            Prints
                        </MobileLink>
                        <MobileLink
                            href='/screenshots/'
                            onOpenChange={setOpen}>
                            Screenshots
                        </MobileLink>
                        <MobileLink
                            href='/faq/'
                            onOpenChange={setOpen}>
                            FAQ
                        </MobileLink>
                        <MobileLink
                            href='/about/'
                            onOpenChange={setOpen}>
                            About
                        </MobileLink>
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
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn(navigationMenuTriggerStyle(), className)}
            {...props}>
            {children}
        </Link>
    )
}
