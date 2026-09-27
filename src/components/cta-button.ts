import { cva } from 'class-variance-authority'

/**
 * Large call-to-action button styles (hero, closing CTA, 404).
 * Apply to a Link, anchor or button.
 */
export const ctaButtonVariants = cva(
    [
        'inline-flex',
        'h-11',
        'items-center',
        'justify-center',
        'gap-2',
        'whitespace-nowrap',
        'rounded-lg',
        'px-5',
        'text-[15px]',
        'font-medium',
        'transition-[background-color,filter]',
        'duration-200',
        'outline-none',
        'focus-visible:ring-[3px]',
        'focus-visible:ring-ring/50',
        '[&_svg]:size-[18px]',
        '[&_svg]:shrink-0'
    ],
    {
        variants: {
            variant: {
                primary: [
                    'bg-primary',
                    'text-primary-foreground',
                    'shadow-[0_8px_32px_-8px_var(--primary)]',
                    'hover:brightness-110'
                ],
                secondary: ['border', 'bg-background', 'hover:bg-card']
            }
        },
        defaultVariants: {
            variant: 'primary'
        }
    }
)
