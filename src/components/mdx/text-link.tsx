import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

/**
 * Social profiles, linked from MDX as `[Twitter](social:twitter)`
 */
const socialLinks: Record<string, string | undefined> = {
    twitter: process.env.APP_SOCIAL_TWITTER,
    instagram: process.env.APP_SOCIAL_INSTAGRAM,
    threads: process.env.APP_SOCIAL_THREADS
}

const linkClassName = [
    'font-medium',
    'text-primary',
    'underline',
    'underline-offset-4',
    'transition-colors',
    'duration-200',
    'hover:text-primary'
]

/**
 * Markdown links: site paths use next/link, social: links go to our
 * profiles, mailto: links open the email app, and anything else opens in a
 * new tab
 */
export const TextLink = ({
    href = '',
    className,
    ...props
}: ComponentPropsWithoutRef<'a'>) => {
    if (href.startsWith('mailto:')) {
        return (
            <a
                href={href}
                className={cn(linkClassName, className)}
                {...props}
            />
        )
    }

    if (href.startsWith('/') || href.startsWith('#')) {
        return (
            <Link
                href={href}
                className={cn(linkClassName, className)}
                {...props}
            />
        )
    }

    if (href.startsWith('social:')) {
        const network = href.slice('social:'.length)

        if (!(network in socialLinks)) {
            throw new Error(`Unknown social link in MDX: ${href}`)
        }

        href = socialLinks[network] ?? ''
    }

    return (
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(linkClassName, className)}
            {...props}
        />
    )
}
