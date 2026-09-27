import { cn } from '@/lib/utils'

/**
 * Hero section: grid backdrop and pink glow behind centred content
 */
export const Hero = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLElement>) => (
    <section
        className={cn(['relative', 'overflow-hidden', 'border-b'], className)}
        {...props}>
        <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 bg-grid mask-fade-top'
        />
        <div
            aria-hidden='true'
            className='pointer-events-none absolute left-1/2 -top-80 h-160 w-275 -translate-x-1/2 bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_28%,transparent),transparent)]'
        />
        <div className='wrapper relative flex flex-col items-center pt-20 pb-16 md:pt-28 md:pb-24 text-center'>
            {children}
        </div>
    </section>
)

/**
 * Rounded label above the heading, with a glowing pink dot
 */
export const HeroPill = ({ children }: { children: React.ReactNode }) => (
    <div className='inline-flex items-center gap-2.5 rounded-full border bg-background py-1.5 pr-3.5 pl-2.5 font-mono text-xs leading-none font-medium tracking-[0.04em] text-muted-foreground uppercase'>
        <span
            aria-hidden='true'
            className='size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]'
        />
        <span className='flex flex-wrap justify-center gap-2'>{children}</span>
    </div>
)

export const HeroHeading = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
        className={cn(
            [
                'mt-7',
                'text-[clamp(48px,8vw,104px)]',
                'leading-[.95]',
                'font-bold',
                'tracking-[-0.055em]',
                'text-balance'
            ],
            className
        )}
        {...props}>
        {children}
        <span className='text-primary'>.</span>
    </h1>
)

export const HeroDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
        className={cn(
            [
                'mt-6',
                'max-w-[520px]',
                'text-xl',
                'leading-normal',
                'text-muted-foreground',
                'text-pretty'
            ],
            className
        )}
        {...props}
    />
)

export const HeroActions = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            ['mt-9', 'flex', 'flex-wrap', 'justify-center', 'gap-3'],
            className
        )}
        {...props}
    />
)

/**
 * Framed 16:9 image below the hero actions
 */
export const HeroFrame = ({ children }: { children: React.ReactNode }) => (
    <div className='mt-18 w-full max-w-[1080px] rounded-[14px] border bg-card/60 p-1.5 shadow-[0_40px_120px_-40px_color-mix(in_oklch,var(--primary)_45%,transparent)]'>
        <div className='relative aspect-video overflow-hidden rounded-[9px] bg-black'>
            {children}
        </div>
    </div>
)
