import { Copyright } from 'lucide-react'

const Footer = () => (
    <footer className='py-6 md:px-8 md:py-0'>
        <div className='container flex flex-col items-center justify-between gap-4 py-4 md:flex-row text-neutral-400 dark:text-neutral-600 text-sm'>
            <div className='flex items-center gap-x-2'>
                <Copyright className='w-4 h-4' />
                <span>
                    {new Date().getFullYear()}{' '}
                    {process.env.NEXT_PUBLIC_APP_TITLE!}. All rights reserved.
                </span>
            </div>
            <span className='text-center md:text-left'>
                Built by SlinkyPixels
            </span>
        </div>
    </footer>
)

export default Footer
