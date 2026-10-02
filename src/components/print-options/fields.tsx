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
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    useFormField
} from '@/components/ui/form'
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
import type { PrintOptionsValues } from '@/lib/print-options-schema'
import { formatMoney } from '@/lib/pricing'
import {
    formatSize,
    qualityLabels,
    qualityThresholds,
    type PrintQuality
} from '@/lib/print-quality'
import { cn } from '@/lib/utils'
import type { ImageMeta, Region } from '@/types'
import type { Control } from 'react-hook-form'

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
 * Eyebrow label above each field (labels the field's control, and turns red
 * when it has an error), with an optional value on the right
 */
const FieldLabel = ({
    children,
    aside
}: {
    children: React.ReactNode
    aside?: React.ReactNode
}) => {
    const { formItemId } = useFormField()

    return (
        <div className='flex items-baseline justify-between gap-4'>
            <FormLabel
                id={`${formItemId}-label`}
                className='eyebrow text-xs leading-4 font-normal text-muted-foreground'>
                {children}
            </FormLabel>
            {aside && <span className='text-sm text-foreground'>{aside}</span>}
        </div>
    )
}

/**
 * A radio group named by its field's label (a label element can't name a
 * radio group on its own)
 */
const FieldRadioGroup = (props: React.ComponentProps<typeof RadioGroup>) => {
    const { formItemId } = useFormField()

    return (
        <RadioGroup
            aria-labelledby={`${formItemId}-label`}
            {...props}
        />
    )
}

type FieldProps = { control: Control<PrintOptionsValues> }

/**
 * Delivery country: sets the currency, prices and which sizes are offered
 */
export const CountryField = ({
    control,
    onChange
}: FieldProps & { onChange: (code: string) => void }) => (
    <FormField
        control={control}
        name='country'
        render={({ field }) => (
            <FormItem className='gap-3'>
                <FieldLabel>Deliver to</FieldLabel>
                <Select
                    value={field.value}
                    onValueChange={onChange}>
                    <FormControl>
                        <SelectTrigger className='w-full'>
                            <SelectValue />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {(Object.keys(regions) as Region[]).map((region) => (
                            <SelectGroup key={region}>
                                <SelectLabel>
                                    {regions[region].name}
                                </SelectLabel>
                                {countries
                                    .filter(
                                        (country) => country.region === region
                                    )
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
                <FormMessage />
            </FormItem>
        )}
    />
)

/**
 * Product type cards with their starting price
 */
export const ProductTypeField = ({
    control,
    choices,
    onChange
}: FieldProps & {
    choices: ProductChoice[]
    onChange: (id: ProductTypeId) => void
}) => (
    <FormField
        control={control}
        name='productType'
        render={({ field }) => (
            <FormItem className='gap-3'>
                <FieldLabel>Product</FieldLabel>
                <FormControl>
                    <FieldRadioGroup
                        value={field.value}
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
                                        <span className='font-medium'>
                                            {choice.name}
                                        </span>
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
                                        {productCopy[choice.id].tags.map(
                                            (tag) => (
                                                <span
                                                    key={tag}
                                                    className={cn(tagClasses)}>
                                                    {tag}
                                                </span>
                                            )
                                        )}
                                    </span>
                                </span>
                            </Label>
                        ))}
                    </FieldRadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
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
    control,
    choices,
    meta,
    onChange
}: FieldProps & {
    choices: SizeChoice[]
    meta: ImageMeta
    onChange: (size: string) => void
}) => {
    const hasTooSmall = choices.some(
        (choice) => choice.unavailable === 'resolution'
    )

    return (
        <FormField
            control={control}
            name='size'
            render={({ field }) => (
                <FormItem className='gap-3'>
                    <FieldLabel>Size</FieldLabel>
                    <FormControl>
                        <FieldRadioGroup
                            value={field.value}
                            onValueChange={onChange}
                            className='gap-2'>
                            {choices.map((choice) => {
                                const { inches, cm } = formatSize(
                                    choice.size,
                                    meta
                                )
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
                                            <span className='font-medium'>
                                                {inches}
                                            </span>
                                            <span className='text-xs font-normal text-muted-foreground'>
                                                {cm}
                                            </span>
                                        </span>
                                        <span
                                            title={`About ${Math.round(choice.dpi)} pixels per inch`}
                                            className={cn(
                                                tagClasses,
                                                qualityTagClasses[
                                                    choice.quality
                                                ]
                                            )}>
                                            {qualityLabels[choice.quality]}
                                        </span>
                                        <span className='w-16 text-right font-medium tabular-nums'>
                                            {choice.price
                                                ? formatMoney(choice.price)
                                                : '-'}
                                        </span>
                                    </Label>
                                )
                            })}
                        </FieldRadioGroup>
                    </FormControl>
                    {hasTooSmall && (
                        <p className='text-xs text-pretty text-muted-foreground'>
                            Greyed-out sizes need a higher-resolution screenshot
                            to print sharply (at least {qualityThresholds.ok}{' '}
                            pixels per inch).
                        </p>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

/**
 * One product option: frame colours as swatches, anything else (canvas
 * edges) as cards
 */
export const OptionField = ({
    control,
    name,
    values,
    onChange
}: FieldProps & {
    name: string
    values: string[]
    onChange: (value: string) => void
}) => {
    const sortedValues = sortOptionValues(name, values)

    return (
        <FormField
            control={control}
            name={`options.${name}`}
            render={({ field }) => (
                <FormItem className='gap-3'>
                    <FieldLabel aside={optionLabel(name, field.value)}>
                        {optionNames[name] ?? name}
                    </FieldLabel>
                    <FormControl>
                        {name === 'color' ? (
                            <FieldRadioGroup
                                value={field.value}
                                onValueChange={onChange}
                                className='flex flex-wrap gap-3'>
                                {sortedValues.map((color) => (
                                    <Label
                                        key={color}
                                        htmlFor={`${name}-${color}`}
                                        title={optionLabel(name, color)}
                                        style={{
                                            backgroundColor:
                                                frameSwatches[color] ??
                                                'transparent'
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
                            </FieldRadioGroup>
                        ) : (
                            <FieldRadioGroup
                                value={field.value}
                                onValueChange={onChange}
                                className='grid gap-2 sm:grid-cols-2'>
                                {sortedValues.map((option) => (
                                    <Label
                                        key={option}
                                        htmlFor={`${name}-${option}`}
                                        className={cn(
                                            choiceCard(),
                                            'rounded-lg p-3'
                                        )}>
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
                            </FieldRadioGroup>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
