import { cn } from '@/lib/utils'
import { Balancer } from 'react-wrap-balancer'

export const Hero = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <section
        className={cn(
            'container w-full flex flex-col items-center gap-8 py-24 md:py-48',
            className
        )}
        {...props}>
        {children}
    </section>
)

export const HeroHeading = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
        className={cn(
            'text-3xl font-extrabold tracking-tight sm:text-5xl text-center md:text-6xl lg:tracking-tighter lg:text-7xl xl:text-8xl',
            className
        )}
        {...props}
    />
)

export const HeroDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Balancer
        className={cn(
            'max-w-[400px] text-center text-lg text-neutral-500 dark:text-neutral-500 sm:text-2xl',
            className
        )}
        {...props}
    />
)
