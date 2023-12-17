import { cn } from '@/lib/utils'
import Balance from 'react-wrap-balancer'
import { Typography } from './typography'
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
        <Typography
            variant='h1'
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
            asChild
            variant='lead'>
            <Balance
                as='p'
                className={cn('max-w-[750px]', className)}
                {...props}
            />
        </Typography>
    )
}
