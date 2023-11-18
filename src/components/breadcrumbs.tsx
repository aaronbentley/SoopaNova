'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from './ui/separator'

export const Breadcrumbs = ({
    items,
    className,
    ...props
}: {
    items: { url: string; title: string }[]
    className?: string
    props?: React.HTMLAttributes<HTMLOListElement>
}) => {
    const pathname = usePathname()
    return (
        <nav
            className='flex'
            aria-label='Breadcrumb'>
            <ol
                className={cn(
                    [
                        'inline-flex',
                        'items-center',
                        'space-x-1',
                        'md:space-x-2',
                        'mb-12'
                    ],
                    className
                )}
                {...props}>
                {items &&
                    items.map((item, index) => (
                        <li key={index}>
                            {pathname === item.url ? (
                                <span className='font-medium text-neutral-500 dark:text-neutral-500'>
                                    {item.title}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className='font-medium text-neutral-500 dark:text-neutral-500 transition-colors duration-200 hover:text-pink-500 dark:hover:text-pink-500'>
                                    {item.title}
                                </Link>
                            )}
                            {index < items.length - 1 && (
                                <Separator orientation='vertical' />
                            )}
                        </li>
                    ))}
            </ol>
        </nav>
    )
}
