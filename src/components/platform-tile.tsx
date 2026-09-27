import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PlatformTileProps {
    href: string
    name: string
    detail?: string
    Icon: React.ComponentType<{ className?: string }>
    className?: string
}

/**
 * Link tile with an icon, name and optional mono detail line. Muted until
 * hovered. Tiles sit in a PlatformStrip: stacked on small screens, one row
 * from `lg`.
 */
const PlatformTile = ({
    href,
    name,
    detail,
    Icon,
    className
}: PlatformTileProps) => (
    <Link
        href={href}
        className={cn(
            [
                'group',
                'flex',
                'items-center',
                'justify-between',
                'gap-4',
                'py-6',
                'lg:px-6',
                'lg:py-7',
                'text-muted-foreground',
                'transition-colors',
                'duration-200',
                'hover:bg-card',
                'hover:text-foreground',
                'focus-visible:outline-none',
                'focus-visible:bg-card'
            ],
            className
        )}>
        <span className='flex items-center gap-3.5'>
            <Icon className='size-6.5 fill-current' />
            <span className='flex flex-col gap-0.5'>
                <span className='text-base font-semibold text-foreground'>
                    {name}
                </span>
                {detail && <span className='font-mono text-xs'>{detail}</span>}
            </span>
        </span>
        <span
            aria-hidden='true'
            className='font-mono text-sm transition-transform duration-200 group-hover:translate-x-0.5'>
            →
        </span>
    </Link>
)

/**
 * A row of tiles divided by hairlines, with an optional intro cell first
 */
export const PlatformStrip = ({
    intro,
    className,
    children
}: {
    intro?: React.ReactNode
    className?: string
    children: React.ReactNode
}) => (
    <div
        className={cn(
            [
                'grid',
                'lg:grid-flow-col',
                'lg:auto-cols-fr',
                '*:border-t',
                'lg:*:border-t-0',
                'lg:*:border-l',
                '[&>*:first-child]:border-0'
            ],
            className
        )}>
        {intro && (
            <div className='flex flex-col justify-center gap-1 py-7'>
                {intro}
            </div>
        )}
        {children}
    </div>
)

export default PlatformTile
