import MainNav from '@/components/main-nav'
import MobileNav from '@/components/mobile-nav'
import ModeToggle from '@/components/mode-toggle'
import { buttonVariants } from '@/components/ui/button'
import UserButton from '@/components/user-button'
import Wordmark from '@/components/wordmark'
import { cn } from '@/lib/utils'
import { ClerkLoaded, ClerkLoading, Show } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const Header = () => (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm'>
        <div className='wrapper flex h-16 items-center justify-between gap-6'>
            <div className='flex items-center gap-2 md:gap-8'>
                <MobileNav />
                <Link
                    href='/'
                    aria-label='Home'
                    className='transition-opacity duration-200 hover:opacity-80'>
                    <Wordmark />
                </Link>
                <MainNav />
            </div>
            <div className='flex items-center gap-2'>
                <ModeToggle />
                <Suspense>
                    <ClerkLoading>
                        <Loader2 className='size-6 animate-spin text-primary' />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <Show when='signed-out'>
                            <Link
                                href='/create/'
                                className={cn(buttonVariants({ size: 'sm' }), [
                                    'shadow-none',
                                    'hover:bg-primary',
                                    'hover:brightness-110',
                                    'duration-200'
                                ])}>
                                Get Started
                            </Link>
                        </Show>
                        <Show when='signed-in'>
                            <UserButton />
                        </Show>
                    </ClerkLoaded>
                </Suspense>
            </div>
        </div>
    </header>
)

export default Header
