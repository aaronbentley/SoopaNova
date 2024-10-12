import { Typography } from '@/components/typography'
import { cn } from '@/lib/utils'

export const Hero = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <section
        className={cn(['w-full', 'relative', 'overflow-hidden'], className)}
        {...props}>
        <div className='container w-full flex flex-col items-center gap-8 xl:gap-16 py-24 md:py-48'>
            {children}
        </div>
    </section>
)

export const HeroHeading = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <Typography
        variant='h1'
        className={cn(
            [
                'text-center',
                'text-3xl',
                'sm:text-5xl',
                'md:text-6xl',
                'lg:text-7xl',
                'xl:text-8x',
                '2xl:text-9xl'
            ],
            className
        )}
        {...props}
    />
)

export const HeroDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <Typography
        variant='lead'
        className={cn(
            [
                'max-w-[400px]',
                'lg:max-w-[600px]',
                'text-center',
                'text-lg',
                'text-muted-foreground',
                'md:text-2xl',
                'lg:text-3xl'
            ],
            className
        )}
        {...props}
    />
)
