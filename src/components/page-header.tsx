import { Typography } from '@/components/typography'
import { cn } from '@/lib/utils'

/**
 * Full-width page intro with a faint grid backdrop. Extra children (cards,
 * the upload dropzone) sit below the heading and description.
 */
export const PageHeader = ({
    eyebrow,
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement> & { eyebrow?: string }) => {
    return (
        <section
            className='relative overflow-hidden border-b last:border-b-0'
            {...props}>
            <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-grid mask-fade-top'
            />
            <div
                className={cn(
                    'wrapper relative flex flex-col items-start gap-5 pt-16 pb-14 md:pt-24 md:pb-20',
                    className
                )}>
                {eyebrow && <p className='eyebrow text-primary'>{eyebrow}</p>}
                {children}
            </div>
        </section>
    )
}

export const PageHeaderHeading = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <Typography
            variant='h1'
            className={className}
            {...props}
        />
    )
}

export const PageHeaderDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <Typography
            variant='lead'
            className={cn(['max-w-[640px]', 'text-pretty'], className)}
            as='p'
            {...props}
        />
    )
}
