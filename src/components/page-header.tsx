import { cn } from '@/lib/utils'
import Balance from 'react-wrap-balancer'
import { Separator } from './ui/separator'

export const PageHeader = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <section
            className={cn(
                'flex max-w-[980px] flex-col items-start gap-2 px-4 py-8 md:py-24 mx-auto',
                className
            )}
            {...props}>
            {children}
            <Separator className='mt-6 md:mt-12' />
        </section>
    )
}

export const PageHeaderHeading = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <h1
            className={cn(
                'text-3xl font-extrabold tracking-tight md:text-5xl lg:tracking-[-0.035em] lg:text-6xl xl:text-7xl',
                className
            )}
            {...props}
        />
    )
}

export const PageHeaderDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
    return (
        <Balance
            className={cn(
                'max-w-[750px] text-lg text-neutral-500 dark:text-neutral-500 sm:text-2xl',
                className
            )}
            {...props}
        />
    )
}
