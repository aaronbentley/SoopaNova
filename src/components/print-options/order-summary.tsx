'use client'

import { ctaButtonVariants } from '@/components/cta-button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { formatMoney, type Price } from '@/lib/pricing'
import type { PrintOptionsValues } from '@/lib/print-options-schema'
import { cn } from '@/lib/utils'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useWatch, type Control } from 'react-hook-form'

interface OrderSummaryProps {
    control: Control<PrintOptionsValues>
    title: string
    price: Price | null
    shippingFrom: Price | null
    countryName: string
    /** The screenshot passed moderation */
    approved: boolean
    /** Checkout is starting (redirecting to Stripe) */
    pending: boolean
    /** Why checkout couldn't start */
    error: string | null
}

/**
 * Price, shipping note, the personal-use confirmation and the submit button
 * (checkout), which stays disabled until the confirmation is ticked.
 */
const OrderSummary = ({
    control,
    title,
    price,
    shippingFrom,
    countryName,
    approved,
    pending,
    error
}: OrderSummaryProps) => {
    const confirmed = useWatch({ control, name: 'confirmed' })

    return (
        <section className='flex flex-col gap-5 border-t pt-6'>
            <div className='flex items-baseline justify-between gap-4'>
                <span className='text-sm text-muted-foreground'>{title}</span>
                <span className='text-3xl font-semibold tabular-nums'>
                    {price ? formatMoney(price) : '-'}
                </span>
            </div>
            {shippingFrom && (
                <p
                    title={`Exact shipping to ${countryName} is shown at checkout`}
                    className='-mt-4 text-right text-sm text-muted-foreground'>
                    + shipping from {formatMoney(shippingFrom)}
                </p>
            )}
            <FormField
                control={control}
                name='confirmed'
                render={({ field }) => (
                    <FormItem className='gap-3'>
                        <p className='eyebrow text-muted-foreground'>
                            Personal use
                        </p>
                        <div className='flex items-start gap-3'>
                            <FormControl>
                                <Checkbox
                                    ref={field.ref}
                                    checked={field.value}
                                    onCheckedChange={(checked) =>
                                        field.onChange(checked === true)
                                    }
                                    className='mt-0.5'
                                />
                            </FormControl>
                            <FormLabel className='block leading-snug font-normal text-pretty text-muted-foreground'>
                                This is my own screenshot and it&apos;s for my
                                personal, non-commercial display. See our{' '}
                                <Link
                                    href='/terms/'
                                    target='_blank'
                                    className='font-medium text-primary underline underline-offset-4'>
                                    Terms
                                </Link>
                                .
                            </FormLabel>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <button
                type='submit'
                disabled={!price || !approved || !confirmed || pending}
                className={cn(
                    ctaButtonVariants(),
                    'w-full disabled:pointer-events-none disabled:opacity-50'
                )}>
                {pending ? (
                    <>
                        <Loader2 className='animate-spin' />
                        Starting checkout
                    </>
                ) : (
                    <>
                        Continue to checkout
                        <ArrowRight />
                    </>
                )}
            </button>
            {error && (
                <p
                    role='alert'
                    className='-mt-2 text-sm text-pretty text-destructive'>
                    {error}
                </p>
            )}
        </section>
    )
}

export default OrderSummary
