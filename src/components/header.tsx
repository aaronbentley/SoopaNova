import { cn } from '@/lib/utils'
import Link from 'next/link'
import ModeToggle from './mode-toggle'

const Header = () => (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800'>
        <div className='container flex items-center'>
            <div className='flex justify-between w-full py-4'>
                <Link
                    href='/'
                    className='mr-6 flex items-center space-x-2'>
                    <span
                        className={cn([
                            'font-extrabold',
                            'text-2xl',
                            'tracking-tight'
                        ])}>
                        {process.env.NEXT_PUBLIC_APP_TITLE!}
                    </span>
                </Link>
                <ModeToggle />
            </div>
        </div>
    </header>
)

export default Header
