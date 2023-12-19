import { Copyright, Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'
import { Threads } from './icons'

const Footer = () => (
    <footer className='py-6 md:px-8 md:pt-12 lg:pt-24 md:pb-4'>
        <div className='container flex flex-col items-center justify-between gap-4 py-4 md:flex-row text-neutral-400 dark:text-neutral-600 text-sm'>
            <div className='flex items-center gap-x-2'>
                <Copyright className='w-3 h-3' />
                <span>
                    {new Date().getFullYear()}{' '}
                    <a
                        href={process.env.APP_COMPANY_URL!}
                        target='_blank'
                        className='hover:text-pink-500'>
                        {process.env.APP_COMPANY!}
                    </a>
                    . All rights reserved.
                </span>
            </div>

            <div className='flex flex-col md:flex-row items-center gap-4'>
                <div className='flex items-center gap-x-2'>
                    <Link
                        href='/privacy/'
                        className='transition-all duration-200 hover:text-pink-500'>
                        Privacy
                    </Link>
                    <Link
                        href='/terms/'
                        className='transition-all duration-200 hover:text-pink-500'>
                        Terms
                    </Link>
                </div>
                <div className='flex items-center gap-x-2'>
                    <a
                        title='Twitter'
                        aria-label='Twitter'
                        href={process.env.APP_SOCIAL_TWITTER!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                        <Twitter className='size-4' />
                    </a>
                    <a
                        title='Instagram'
                        aria-label='Instagram'
                        href={process.env.APP_SOCIAL_INSTAGRAM!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                        <Instagram className='size-4' />
                    </a>
                    <a
                        title='Threads'
                        aria-label='Threads'
                        href={process.env.APP_SOCIAL_THREADS!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                        <Threads className='size-4' />
                    </a>
                    <a
                        title='Facebook'
                        aria-label='Facebook'
                        href={process.env.APP_SOCIAL_FACEBOOK!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-pink-500 cursor-pointer hover:scale-125'>
                        <Facebook className='size-4' />
                    </a>
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
