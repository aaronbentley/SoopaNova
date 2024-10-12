import MainNav from '@/components/main-nav'
import MobileNav from '@/components/mobile-nav'
import ModeToggle from '@/components/mode-toggle'
import { Button, buttonVariants } from '@/components/ui/button'
import UserButton from '@/components/user-button'
import { cn } from '@/lib/utils'
import {
    ClerkLoaded,
    ClerkLoading,
    SignInButton,
    SignedIn,
    SignedOut
} from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const Header = () => (
    <header className='sticky top-0 z-50 w-full border-b border-muted bg-background/80 dark:bg-background/80 backdrop-blur'>
        <div className='container px-4 flex items-center'>
            <div className='flex justify-between w-full py-4'>
                <div className='flex flex-row-reverse md:flex-row items-center md:space-x-4'>
                    <Link
                        href='/'
                        className={cn(
                            buttonVariants({
                                variant: 'ghost',
                                className: [
                                    'md:mr-6',
                                    'font-sans',
                                    'font-extrabold',
                                    'text-xl',
                                    'tracking-tight',
                                    'transition-all',
                                    'duration-200',
                                    'hover:bg-transparent',
                                    'hover:dark:bg-transparent',
                                    'hover:text-primary',
                                    'hover:dark:text-primary'
                                ]
                            })
                        )}>
                        {process.env.APP_TITLE!}
                    </Link>
                    <MainNav />
                    <MobileNav />
                </div>
                <div className='flex items-center md:space-x-4'>
                    <ModeToggle />
                    <Suspense>
                        <ClerkLoading>
                            <Loader2 className='size-7 animate-spin text-primary' />
                        </ClerkLoading>
                        <ClerkLoaded>
                            <SignedOut>
                                <SignInButton>
                                    <Button>Sign In</Button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </ClerkLoaded>
                    </Suspense>
                </div>
            </div>
        </div>
    </header>
)

export default Header
