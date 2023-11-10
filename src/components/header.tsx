import { cn } from '@/lib/utils'
import { SignUpButton, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import MainNav from './main-nav'
import MobileNav from './mobile-nav'
import ModeToggle from './mode-toggle'
import { Button, buttonVariants } from './ui/button'

const Header = () => (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur'>
        <div className='container px-4 flex items-center'>
            <div className='flex justify-between w-full py-4'>
                <div className='flex items-center md:space-x-4'>
                    <Link
                        href='/'
                        className={cn(buttonVariants({ variant: 'ghost' }), [
                            'hidden',
                            'md:flex',
                            'md:mr-6',
                            'font-sans',
                            'font-extrabold',
                            'text-xl',
                            'tracking-tight',
                            'transition-all',
                            'duration-200',
                            'hover:bg-pink-500',
                            'hover:dark:bg-pink-500',
                            'hover:text-neutral-100',
                            'hover:dark:text-neutral-900'
                        ])}>
                        {process.env.APP_TITLE!}
                    </Link>
                    <MainNav />
                    <MobileNav />
                </div>
                <div className='flex items-center md:space-x-4'>
                    <ModeToggle />

                    <SignedOut>
                        <SignUpButton>
                            <Button className='bg-pink-500 dark:bg-pink-500 hover:bg-pink-500/90 dark:hover:bg-pink-500/90'>
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>

                    <UserButton
                        appearance={{
                            elements: {
                                userButtonPopoverCard:
                                    'bg-white text-neutral-950 dark:text-neutral-50 dark:bg-neutral-950',
                                userButtonPopoverActionButtonText:
                                    'text-neutral-900 dark:text-neutral-100',
                                userButtonPopoverActionButtonIcon:
                                    'text-pink-500 dark:text-pink-500',
                                userButtonPopoverFooter:
                                    'text-pink-500 dark:text-pink-500'
                            }
                        }}
                        afterSignOutUrl='/'
                    />
                </div>
            </div>
        </div>
    </header>
)

export default Header
