'use client'

import { countries } from '@/assets/data/countries'
import { regions, type ProductTypeId } from '@/assets/data/pricing'
import {
    frameSwatches,
    optionNames,
    optionValueLabels,
    productCopy,
    wrapDescriptions
} from '@/assets/data/print-options'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import type { ProductChoice, SizeChoice } from '@/hooks/use-print-options'
import { formatMoney } from '@/lib/pricing'
import {
    formatSize,
    qualityLabels,
    qualityThresholds,
    type PrintQuality
} from '@/lib/print-quality'
import { cn } from '@/lib/utils'
import type { ImageMeta, Region } from '@/types'

/**
 * A selectable card: hairline border that turns pink when chosen, like the
 * homepage product cards
 */
const choiceCard = (disabled = false) =>
    cn(
        [
            'flex',
            'cursor-pointer',
            'items-start',
            'gap-3',
            'rounded-xl',
            'border',
            'p-4',
            'leading-normal',
            'transition-colors',
            'duration-200',
            'hover:border-primary/60',
            'has-[[data-state=checked]]:border-primary',
            'has-[[data-state=checked]]:bg-primary/5'
        ],
        disabled && ['cursor-not-allowed', 'opacity-50', 'hover:border-border']
    )

/**
 * Small mono tag, as on the homepage product cards
 */
const tagClasses = [
    'rounded-sm',
    'border',
    'px-2',
    'py-0.5',
    'font-mono',
    'text-[11px]',
    'font-normal',
    'text-muted-foreground'
]

/**
 * Option values in the order of optionValueLabels; unknown ones go last
 */
const sortOptionValues = (name: string, values: string[]) => {
    const order = Object.keys(optionValueLabels[name] ?? {})
    const rank = (value: string) =>
        order.includes(value) ? order.indexOf(value) : order.length

    return [...values].sort((a, b) => rank(a) - rank(b))
}

const optionLabel = (name: string, value: string) =>
    optionValueLabels[name]?.[value] ??
    value.charAt(0).toUpperCase() + value.slice(1)

/**
 * Eyebrow heading above each field, with an optional value on the right
 */
const FieldHeading = ({
    id,
    children,
    aside
}: {
    id: string
    children: React.ReactNode
    aside?: React.ReactNode
}) => (
    <div className='flex items-baseline justify-between gap-4'>
        <h3
            id={id}
            className='eyebrow text-muted-foreground'>
            {children}
        </h3>
        {aside && <span className='text-sm text-foreground'>{aside}</span>}
    </div>
)

/**
 * Delivery country: sets the currency, prices and which sizes are offered
 */
export const CountryField = ({
    value,
    onChange
}: {
    value: string
    onChange: (code: string) => void
}) => (
    <section className='flex flex-col gap-3'>
        <FieldHeading id='delivery-country-label'>Deliver to</FieldHeading>
        <Select
            value={value}
            onValueChange={onChange}>
            <SelectTrigger
                aria-labelledby='delivery-country-label'
                className='w-full'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {(Object.keys(regions) as Region[]).map((region) => (
                    <SelectGroup key={region}>
                        <SelectLabel>{regions[region].name}</SelectLabel>
                        {countries
                            .filter((country) => country.region === region)
                            .map((country) => (
                                <SelectItem
                                    key={country.code}
                                    value={country.code}>
                                    {country.name}
                                </SelectItem>
                            ))}
                    </SelectGroup>
                ))}
            </SelectContent>
        </Select>
    </section>
)

/**
 * Product type cards with their starting price
 */
export const ProductTypeField = ({
    choices,
    value,
    onChange
}: {
    choices: ProductChoice[]
    value: ProductTypeId
    onChange: (id: ProductTypeId) => void
}) => (
    <section className='flex flex-col gap-3'>
        <FieldHeading id='product-type-label'>Product</FieldHeading>
        <RadioGroup
            aria-labelledby='product-type-label'
            value={value}
            onValueChange={(id) => onChange(id as ProductTypeId)}>
            {choices.map((choice) => (
                <Label
                    key={choice.id}
                    htmlFor={`product-${choice.id}`}
                    className={choiceCard(!choice.fromPrice)}>
                    <RadioGroupItem
                        id={`product-${choice.id}`}
                        value={choice.id}
                        disabled={!choice.fromPrice}
                        className='mt-0.5'
                    />
                    <span className='flex flex-1 flex-col gap-2'>
                        <span className='flex items-baseline justify-between gap-2'>
                            <span className='font-medium'>{choice.name}</span>
                            <span className='text-sm font-normal text-muted-foreground'>
                                {choice.fromPrice
                                    ? `from ${formatMoney(choice.fromPrice)}`
                                    : 'Screenshot too small'}
                            </span>
                        </span>
                        <span className='text-sm font-normal text-pretty text-muted-foreground'>
                            {productCopy[choice.id].description}
                        </span>
                        <span className='flex flex-wrap gap-1.5'>
                            {productCopy[choice.id].tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={cn(tagClasses)}>
                                    {tag}
                                </span>
                            ))}
                        </span>
                    </span>
                </Label>
            ))}
        </RadioGroup>
    </section>
)

const qualityTagClasses: Record<PrintQuality, string[]> = {
    great: ['border-primary/40', 'bg-primary/10', 'text-primary'],
    good: [],
    ok: [],
    low: ['border-destructive/40', 'text-destructive']
}

/**
 * Sizes with a print quality grade for the screenshot. Sizes the screenshot
 * is too small for are shown but can't be chosen.
 */
export const SizeField = ({
    choices,
    value,
    meta,
    onChange
}: {
    choices: SizeChoice[]
    value: string | null
    meta: ImageMeta
    onChange: (size: string) => void
}) => {
    const hasTooSmall = choices.some(
        (choice) => choice.unavailable === 'resolution'
    )

    return (
        <section className='flex flex-col gap-3'>
            <FieldHeading id='print-size-label'>Size</FieldHeading>
            <RadioGroup
                aria-labelledby='print-size-label'
                value={value ?? ''}
                onValueChange={onChange}
                className='gap-2'>
                {choices.map((choice) => {
                    const { inches, cm } = formatSize(choice.size, meta)
                    const disabled = choice.unavailable !== null

                    return (
                        <Label
                            key={choice.size}
                            htmlFor={`size-${choice.size}`}
                            className={cn(
                                choiceCard(disabled),
                                'items-center rounded-lg px-4 py-3'
                            )}>
                            <RadioGroupItem
                                id={`size-${choice.size}`}
                                value={choice.size}
                                disabled={disabled}
                            />
                            <span className='flex flex-1 flex-col gap-0.5'>
                                <span className='font-medium'>{inches}</span>
                                <span className='text-xs font-normal text-muted-foreground'>
                                    {cm}
                                </span>
                            </span>
                            <span
                                title={`About ${Math.round(choice.dpi)} pixels per inch`}
                                className={cn(
                                    tagClasses,
                                    qualityTagClasses[choice.quality]
                                )}>
                                {qualityLabels[choice.quality]}
                            </span>
                            <span className='w-16 text-right font-medium tabular-nums'>
                                {choice.price ? formatMoney(choice.price) : '-'}
                            </span>
                        </Label>
                    )
                })}
            </RadioGroup>
            {hasTooSmall && (
                <p className='text-xs text-pretty text-muted-foreground'>
                    Greyed-out sizes need a higher-resolution screenshot to
                    print sharply (at least {qualityThresholds.ok} pixels per
                    inch).
                </p>
            )}
        </section>
    )
}

/**
 * One product option: frame colours as swatches, anything else (canvas
 * edges) as cards
 */
export const OptionField = ({
    name,
    values,
    value,
    onChange
}: {
    name: string
    values: string[]
    value: string
    onChange: (value: string) => void
}) => {
    const headingId = `option-${name}-label`
    const sortedValues = sortOptionValues(name, values)

    return (
        <section className='flex flex-col gap-3'>
            <FieldHeading
                id={headingId}
                aside={optionLabel(name, value)}>
                {optionNames[name] ?? name}
            </FieldHeading>
            {name === 'color' ? (
                <RadioGroup
                    aria-labelledby={headingId}
                    value={value}
                    onValueChange={onChange}
                    className='flex flex-wrap gap-3'>
                    {sortedValues.map((color) => (
                        <Label
                            key={color}
                            htmlFor={`${name}-${color}`}
                            title={optionLabel(name, color)}
                            style={{
                                backgroundColor:
                                    frameSwatches[color] ?? 'transparent'
                            }}
                            className={cn([
                                'size-9',
                                'cursor-pointer',
                                'rounded-full',
                                'border',
                                'transition-shadow',
                                'duration-200',
                                'has-[[data-state=checked]]:ring-2',
                                'has-[[data-state=checked]]:ring-primary',
                                'has-[[data-state=checked]]:ring-offset-2',
                                'has-[[data-state=checked]]:ring-offset-background',
                                'has-[:focus-visible]:ring-2',
                                'has-[:focus-visible]:ring-ring/50',
                                'has-[:focus-visible]:ring-offset-2',
                                'has-[:focus-visible]:ring-offset-background'
                            ])}>
                            <RadioGroupItem
                                id={`${name}-${color}`}
                                value={color}
                                className='sr-only'
                            />
                            <span className='sr-only'>
                                {optionLabel(name, color)}
                            </span>
                        </Label>
                    ))}
                </RadioGroup>
            ) : (
                <RadioGroup
                    aria-labelledby={headingId}
                    value={value}
                    onValueChange={onChange}
                    className='grid gap-2 sm:grid-cols-2'>
                    {sortedValues.map((option) => (
                        <Label
                            key={option}
                            htmlFor={`${name}-${option}`}
                            className={cn(choiceCard(), 'rounded-lg p-3')}>
                            <RadioGroupItem
                                id={`${name}-${option}`}
                                value={option}
                                className='mt-0.5'
                            />
                            <span className='flex flex-col gap-1'>
                                <span className='font-medium'>
                                    {optionLabel(name, option)}
                                </span>
                                {wrapDescriptions[option] && (
                                    <span className='text-xs font-normal text-pretty text-muted-foreground'>
                                        {wrapDescriptions[option]}
                                    </span>
                                )}
                            </span>
                        </Label>
                    ))}
                </RadioGroup>
            )}
        </section>
    )
}
