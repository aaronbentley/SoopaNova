import { cn } from '@/lib/utils'
import { Balancer } from 'react-wrap-balancer'

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
        <h2
            className={cn(
                'text-2xl font-extrabold tracking-tight md:text-3xl lg:tracking-tighter lg:text-4xl xl:text-5xl',
                className
            )}
            {...props}
        />
    )
}

export const PageSectionDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <Balancer
            className={cn(
                'max-w-[750px] w-2/3 text-lg text-neutral-500 dark:text-neutral-500 flex flex-col gap-y-6',
                className
            )}
            {...props}
        />
    )
}
