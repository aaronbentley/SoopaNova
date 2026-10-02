'use client'

import { ctaButtonVariants } from '@/components/cta-button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { formatMoney, type Price } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface OrderSummaryProps {
    title: string
    price: Price | null
    shippingFrom: Price | null
    countryName: string
    confirmed: boolean
    /** The screenshot passed moderation */
    approved: boolean
    onConfirmedChange: (confirmed: boolean) => void
    onCheckout: () => void
}

/**
 * Price, shipping note, the personal-use confirmation and checkout button
 */
const OrderSummary = ({
    title,
    price,
    shippingFrom,
    countryName,
    confirmed,
    approved,
    onConfirmedChange,
    onCheckout
}: OrderSummaryProps) => (
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
        <div
            role='group'
            aria-labelledby='personal-use-label'
            className='flex flex-col gap-3'>
            <h3
                id='personal-use-label'
                className='eyebrow text-muted-foreground'>
                Personal use
            </h3>
            <div className='flex items-start gap-3'>
                <Checkbox
                    id='personal-use'
                    checked={confirmed}
                    onCheckedChange={(checked) =>
                        onConfirmedChange(checked === true)
                    }
                    className='mt-0.5'
                />
                <Label
                    htmlFor='personal-use'
                    className='block leading-snug font-normal text-pretty text-muted-foreground'>
                    This is my own screenshot and it&apos;s for my personal,
                    non-commercial display. See our{' '}
                    <Link
                        href='/terms/'
                        target='_blank'
                        className='font-medium text-primary underline underline-offset-4'>
                        Terms
                    </Link>
                    .
                </Label>
            </div>
        </div>
        <button
            type='button'
            disabled={!price || !confirmed || !approved}
            onClick={onCheckout}
            className={cn(
                ctaButtonVariants(),
                'w-full disabled:pointer-events-none disabled:opacity-50'
            )}>
            Continue to checkout
            <ArrowRight />
        </button>
    </section>
)

export default OrderSummary
