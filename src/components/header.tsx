import { cn } from '@/lib/utils'
import Link from 'next/link'
import MainNav from './main-nav'
import MobileNav from './mobile-nav'
import ModeToggle from './mode-toggle'
import { buttonVariants } from './ui/button'

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
                <ModeToggle />
            </div>
        </div>
    </header>
)

export default Header
