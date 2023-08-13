import { Copyright, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => (
    <footer className='py-6 md:px-8 md:pt-12 md:pb-4'>
        <div className='container flex flex-col items-center justify-between gap-4 py-4 md:flex-row text-neutral-400 dark:text-neutral-600 text-sm'>
            <div className='flex items-center gap-x-2'>
                <Copyright className='w-4 h-4' />
                <span>
                    {new Date().getFullYear()} {process.env.APP_COMPANY!}. All
                    rights reserved.
                </span>
            </div>
            <div className='flex items-center gap-x-2'>
                <a
                    href={process.env.APP_SOCIAL_TWITTER!}
                    target='_blank'
                    className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                    <Twitter className='w-4 h-4' />
                </a>
                <a
                    href={process.env.APP_SOCIAL_INSTAGRAM!}
                    target='_blank'
                    className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                    <Instagram className='w-4 h-4' />
                </a>
                <a
                    href={process.env.APP_SOCIAL_FACEBOOK!}
                    target='_blank'
                    className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                    <Facebook className='w-4 h-4' />
                </a>
            </div>
        </div>
    </footer>
)

export default Footer
