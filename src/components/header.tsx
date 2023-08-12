import { cn } from '@/lib/utils'
import Link from 'next/link'
import MainNav from './main-nav'
import ModeToggle from './mode-toggle'

const Header = () => (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur'>
        <div className='container flex items-center'>
            <div className='flex justify-between w-full py-4'>
                <div className='flex items-center space-x-4'>
                    <Link
                        href='/'
                        className='mr-6 flex items-center space-x-2'>
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
                    </Link>
                    <MainNav />
                </div>
                <ModeToggle />
            </div>
        </div>
    </header>
)

export default Header
