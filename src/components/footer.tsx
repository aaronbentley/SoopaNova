import { Facebook, Instagram, Threads, Twitter } from '@/components/icons'
import Wordmark from '@/components/wordmark'
import Link from 'next/link'

/**
 * Social links, in display order
 */
const socials = [
    { title: 'Twitter', href: process.env.APP_SOCIAL_TWITTER!, Icon: Twitter },
    {
        title: 'Instagram',
        href: process.env.APP_SOCIAL_INSTAGRAM!,
        Icon: Instagram
    },
    { title: 'Threads', href: process.env.APP_SOCIAL_THREADS!, Icon: Threads },
    {
        title: 'Facebook',
        href: process.env.APP_SOCIAL_FACEBOOK!,
        Icon: Facebook
    }
]

const Footer = () => (
    <footer className='border-t'>
        <div className='wrapper flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-muted-foreground'>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                <Wordmark size='sm' />
                <span>
                    &copy; {new Date().getFullYear()}{' '}
                    <a
                        href={process.env.APP_COMPANY_URL!}
                        target='_blank'
                        className='transition-colors duration-200 hover:text-primary'>
                        {process.env.APP_COMPANY!}
                    </a>
                    . All rights reserved.
                </span>
            </div>

            <div className='flex items-center gap-5'>
                <Link
                    href='/privacy/'
                    className='transition-colors duration-200 hover:text-foreground'>
                    Privacy
                </Link>
                <Link
                    href='/terms/'
                    className='transition-colors duration-200 hover:text-foreground'>
                    Terms
                </Link>
                <div className='flex items-center gap-3'>
                    {socials.map(({ title, href, Icon }) => (
                        <a
                            key={title}
                            title={title}
                            aria-label={title}
                            href={href}
                            target='_blank'
                            className='flex transition-colors duration-200 hover:text-primary'>
                            <Icon />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
)

export default Footer
