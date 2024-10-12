import { cn } from '@/lib/utils'
import { Typography } from './typography'

export const PageSection = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <section
            className={cn(
                'flex max-w-[980px] flex-col justify-around items-start gap-8 px-4 py-10 md:py-20 mx-auto',
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
