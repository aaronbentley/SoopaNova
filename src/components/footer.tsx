import { links } from '@/assets/data/links'
import { regions } from '@/assets/data/pricing'
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

/**
 * Link columns: each nav menu (Prints, Screenshots) led by its overview
 * page, then the other nav links with the legal pages
 */
const columns = [
    ...links
        .filter((link) => link.children)
        .map((link) => ({
            title: link.label,
            links: [
                { href: link.href, label: link.overview ?? link.label },
                ...(link.children ?? [])
            ]
        })),
    {
        title: process.env.APP_TITLE!,
        links: [
            ...links.filter((link) => !link.children),
            { href: '/privacy/', label: 'Privacy' },
            { href: '/terms/', label: 'Terms' }
        ]
    }
]

/**
 * Where we deliver, from the pricing regions ('United Kingdom, European
 * Union and United States')
 */
const regionNames = Object.values(regions).map((region) => region.name)
const deliveryAreas = `${regionNames.slice(0, -1).join(', ')} and ${regionNames.at(-1)}`

const Footer = () => (
    <footer className='border-t'>
        <div className='wrapper grid gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]'>
            <div className='flex flex-col items-start gap-5'>
                <Link
                    href='/'
                    aria-label='Home'>
                    <Wordmark />
                </Link>
                <p className='max-w-xs text-sm text-pretty text-muted-foreground'>
                    {process.env.APP_DESCRIPTION!}
                </p>
                <div className='flex items-center gap-2'>
                    {socials.map(({ title, href, Icon }) => (
                        <a
                            key={title}
                            title={title}
                            aria-label={title}
                            href={href}
                            target='_blank'
                            className='flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary'>
                            <Icon />
                        </a>
                    ))}
                </div>
            </div>

            <nav
                aria-label='Footer'
                className='grid grid-cols-2 gap-10 sm:grid-cols-3'>
                {columns.map((column) => (
                    <div
                        key={column.title}
                        className='flex flex-col gap-4'>
                        <p className='eyebrow text-muted-foreground'>
                            {column.title}
                        </p>
                        <ul className='flex flex-col gap-2.5 text-sm'>
                            {column.links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-muted-foreground transition-colors duration-200 hover:text-foreground'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </div>

        <div className='border-t'>
            <div className='wrapper flex flex-col gap-3 py-6 text-xs text-muted-foreground'>
                <div className='flex flex-wrap items-center justify-between gap-x-6 gap-y-2'>
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
                    <span className='font-mono uppercase tracking-[0.06em]'>
                        Made to order · Delivered to the {deliveryAreas}
                    </span>
                </div>
                <p className='text-pretty'>
                    SoopaNova is not affiliated with or endorsed by Microsoft,
                    Sony, Valve, or any game publisher. All game content and
                    trademarks are the property of their respective owners.
                </p>
            </div>
        </div>
    </footer>
)

export default Footer
