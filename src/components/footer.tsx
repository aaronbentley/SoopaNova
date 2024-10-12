import { Facebook, Instagram, Threads, Twitter } from '@/components/icons'
import { Copyright } from 'lucide-react'
import Link from 'next/link'

const Footer = () => (
    <footer className='py-6 md:px-8 md:pt-12 lg:pt-24 md:pb-4'>
        <div className='container flex flex-col items-center justify-between gap-4 py-4 md:flex-row text-muted-foreground text-sm'>
            <div className='flex items-center gap-x-2'>
                <Copyright className='w-3 h-3' />
                <span>
                    {new Date().getFullYear()}{' '}
                    <a
                        href={process.env.APP_COMPANY_URL!}
                        target='_blank'
                        className='hover:text-primary'>
                        {process.env.APP_COMPANY!}
                    </a>
                    . All rights reserved.
                </span>
            </div>

            <div className='flex flex-col md:flex-row items-center gap-4'>
                <div className='flex items-center gap-x-2'>
                    <Link
                        href='/privacy/'
                        className='transition-all duration-200 hover:text-primary'>
                        Privacy
                    </Link>
                    <Link
                        href='/terms/'
                        className='transition-all duration-200 hover:text-primary'>
                        Terms
                    </Link>
                </div>
                <div className='flex items-center gap-x-2'>
                    <a
                        title='Twitter'
                        aria-label='Twitter'
                        href={process.env.APP_SOCIAL_TWITTER!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-primary cursor-pointer hover:scale-125'>
                        <Twitter />
                    </a>
                    <a
                        title='Instagram'
                        aria-label='Instagram'
                        href={process.env.APP_SOCIAL_INSTAGRAM!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-primary cursor-pointer hover:scale-125'>
                        <Instagram />
                    </a>
                    <a
                        title='Threads'
                        aria-label='Threads'
                        href={process.env.APP_SOCIAL_THREADS!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-primary cursor-pointer hover:scale-125'>
                        <Threads />
                    </a>
                    <a
                        title='Facebook'
                        aria-label='Facebook'
                        href={process.env.APP_SOCIAL_FACEBOOK!}
                        target='_blank'
                        className='transition-all duration-200 hover:text-primary cursor-pointer hover:scale-125'>
                        <Facebook />
                    </a>
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
