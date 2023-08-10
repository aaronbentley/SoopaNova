import { cn } from '@/lib/utils'
import { Gamepad2, Image as LucideImage } from 'lucide-react'
import { Balancer } from 'react-wrap-balancer'

export const Hero = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <section
        className={cn(['w-full', 'relative', 'overflow-hidden'], className)}
        {...props}>
        <Gamepad2 className='absolute inset-y-0 left-0 translate-y-full md:translate-y-3/4 lg:translate-y-1/2 -translate-x-1/4 -z-10 h-32 w-32 sm:h-40 sm:w-40 md:h-64 md:w-64 lg:w-80 lg:h-80 text-pink-300 dark:text-pink-800 stroke-1 md:stroke-[1.5]' />
        <LucideImage className='absolute inset-y-0 right-0 translate-y-full md:translate-y-3/4 lg:translate-y-1/2 translate-x-1/4 -z-10 h-32 w-32 sm:h-40 sm:w-40 md:h-64 md:w-64 lg:w-80 lg:h-80 text-pink-300 dark:text-pink-800 stroke-1 md:stroke-[1.5]' />
        <div className='container w-full flex flex-col items-center gap-8 py-24 md:py-48'>
            {children}
        </div>
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
