/**
 * Typography component
 * Compliments Shad UI by providing a set of typographic components
 * @link https://github.com/shadcn-ui/ui/pull/363
 */

import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const headingBaseClasses = ['text-foreground', 'text-balance']

const typographyVariants = cva(['text-base'], {
    variants: {
        variant: {
            h1: [
                ...headingBaseClasses,
                'text-[clamp(40px,6vw,72px)]',
                'leading-none',
                'font-bold',
                'tracking-[-0.05em]'
            ],
            h2: [
                ...headingBaseClasses,
                'text-2xl',
                'md:text-[28px]',
                'leading-tight',
                'font-semibold',
                'tracking-[-0.03em]'
            ],
            h3: [
                ...headingBaseClasses,
                'text-xl',
                'md:text-[22px]',
                'leading-snug',
                'font-semibold',
                'tracking-[-0.025em]'
            ],
            h4: [
                ...headingBaseClasses,
                'text-lg',
                'md:text-xl',
                'font-semibold',
                'tracking-[-0.02em]'
            ],
            h5: [
                ...headingBaseClasses,
                'text-base',
                'md:text-lg',
                'font-semibold',
                'tracking-[-0.015em]'
            ],
            h6: [
                ...headingBaseClasses,
                'text-sm',
                'md:text-base',
                'font-semibold'
            ],
            p: 'max-w-[750px] md:w-2/3 text-base leading-[1.65]',
            lead: 'text-lg md:text-xl leading-normal text-muted-foreground dark:text-muted-foreground',
            blockquote: 'mt-6 border-l-2 border-primary pl-6 italic',
            ul: 'list-disc list-outside ps-5 space-y-2 mt-2 leading-[1.65] marker:text-muted-foreground',
            ol: 'list-decimal list-outside ps-5 space-y-8 leading-[1.65] marker:font-mono marker:text-sm marker:text-primary',
            li: 'ps-1',
            em: 'italic inline',
            strong: 'font-semibold inline text-foreground'
        },
        muted: {
            true: 'text-muted-foreground dark:text-muted-foreground'
        }
    },
    defaultVariants: {
        variant: 'p',
        muted: false
    }
})

type VariantPropType = VariantProps<typeof typographyVariants>

const variantElementMap: Record<
    NonNullable<VariantPropType['variant']>,
    string
> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    lead: 'p',
    blockquote: 'blockquote',
    ul: 'ul',
    ol: 'ol',
    li: 'li',
    em: 'em',
    strong: 'strong'
}

export interface TypographyProps
    extends
        React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof typographyVariants> {
    as?: string
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, as, muted, ...props }, ref) => {
        const Comp = (as ??
            (variant ? variantElementMap[variant] : undefined) ??
            'div') as React.ElementType
        return (
            <Comp
                className={cn(
                    typographyVariants({ variant, muted, className })
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants }
