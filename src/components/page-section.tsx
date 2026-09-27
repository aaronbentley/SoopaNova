import { Typography } from '@/components/typography'
import { cn } from '@/lib/utils'

export const PageSection = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement>) => {
    return (
        <section
            className={cn(
                'wrapper flex flex-col items-start gap-5 py-10 md:py-14',
                className
            )}
            {...props}>
            {children}
        </section>
    )
}

export const PageSectionHeading = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <Typography
            variant='h2'
            className={cn(className)}
            {...props}
        />
    )
}

export const PageSectionDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <Typography
            as='p'
            className={cn(
                [
                    'text-muted-foreground',
                    'dark:text-muted-foreground',
                    'text-pretty'
                ],
                className
            )}
            {...props}
        />
    )
}
