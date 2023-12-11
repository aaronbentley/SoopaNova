/**
 * Typography component
 * Compliments Shad UI by providing a set of typographic components
 * @link https://github.com/shadcn-ui/ui/pull/363
 */

import { Slot } from '@radix-ui/react-slot'
import { VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const headingBaseClasses = [
    'text-neutral-900',
    'dark:text-neutral-100',
    'font-extrabold',
    'tracking-tight',
    'lg:tracking-[-0.035em]'
]

const typographyVariants = cva(
    [
        // Default classes go here
        // 'text-neutral-500',
        // 'dark:text-neutral-500',
    ],
    {
        variants: {
            variant: {
                h1: [
                    ...headingBaseClasses,
                    'text-3xl',
                    'md:text-5xl',
                    'lg:text-6xl',
                    'xl:text-7xl'
                ],
                h2: [
                    ...headingBaseClasses,
                    'text-2xl',
                    'md:text-3xl',
                    'lg:text-4xl',
                    'xl:text-5xl'
                ],
                h3: [
                    ...headingBaseClasses,
                    'text-xl',
                    'md:text-2xl',
                    'lg:text-3xl',
                    'xl:text-4xl'
                ],
                h4: [
                    ...headingBaseClasses,
                    'text-lg',
                    'md:text-xl',
                    'lg:text-2xl',
                    'xl:text-3xl'
                ],
                h5: [
                    ...headingBaseClasses,
                    'text-base',
                    'md:text-lg',
                    'lg:text-xl',
                    'xl:text-2xl'
                ],
                h6: [
                    ...headingBaseClasses,
                    'text-sm',
                    'md:text-base',
                    'lg:text-lg',
                    'xl:text-xl'
                ],
                p: 'max-w-[750px] w-2/3 text-lg flex flex-col gap-y-6',
                lead: 'text-lg text-neutral-500 dark:text-neutral-500 sm:text-xl md:text-2xl',
                blockquote: 'mt-6 border-l-2 pl-6 italic',
                // ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
                ul: 'list-disc list-inside ps-4 space-y-2 mt-2 ',
                ol: 'list-decimal list-inside space-y-8',
                li: '',
                em: 'italic'
            }
        },
        defaultVariants: {
            variant: 'p'
        }
    }
)

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
    em: 'em'
}

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof typographyVariants> {
    asChild?: boolean
    as?: string
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, as, asChild, ...props }, ref) => {
        const Comp = asChild
            ? Slot
            : as ?? (variant ? variantElementMap[variant] : undefined) ?? 'div'
        return (
            <Comp
                className={cn(typographyVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)

Typography.displayName = 'Typography'

export { Typography, typographyVariants }
