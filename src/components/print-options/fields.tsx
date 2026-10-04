'use client'

import { countries } from '@/assets/data/countries'
import { regions, type ProductTypeId } from '@/assets/data/pricing'
import {
    frameSwatches,
    optionNames,
    wrapDescriptions
} from '@/assets/data/print-options'
import { productCopy } from '@/assets/data/products'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
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
import type { PrintOptionsValues } from '@/lib/print-options-schema'
import {
    formatSize,
    qualityLabels,
    qualityThresholds,
    type PrintQuality
} from '@/lib/print-quality'
import { optionLabel, sortOptionValues } from '@/lib/print-labels'
import { cn } from '@/lib/utils'
import type { ImageMeta, Region } from '@/types'
import { Controller, type Control } from 'react-hook-form'

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
            'has-data-checked:border-primary',
            'has-data-checked:bg-primary/5'
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
 * A tag saying why something can't be ordered. Its card is faded, so the
 * tag isn't (it needs to stay readable).
 */
const unavailableTagClasses = ['border-destructive/40', 'text-destructive']

/**
 * Id of a field's label, which also names its radio group (a label element
 * can't name a radio group on its own)
 */
const labelId = (name: string) => `${name}-label`

/**
 * Eyebrow label above each field (turns red when the field has an error),
 * with an optional value on the right
 */
const FieldEyebrow = ({
    name,
    htmlFor,
    children,
    aside
}: {
    name: string
    htmlFor?: string
    children: React.ReactNode
    aside?: React.ReactNode
}) => (
    <div className='flex items-baseline justify-between gap-4'>
        <FieldLabel
            id={labelId(name)}
            htmlFor={htmlFor}
            className='eyebrow text-xs leading-4 font-normal text-muted-foreground group-data-[invalid=true]/field:text-destructive'>
            {children}
        </FieldLabel>
        {aside && <span className='text-sm text-foreground'>{aside}</span>}
    </div>
)

/**
 * A radio group named by its field's label
 */
const FieldRadioGroup = (
    props: React.ComponentProps<typeof RadioGroup> & { name: string }
) => (
    <RadioGroup
        aria-labelledby={labelId(props.name)}
        {...props}
    />
)

type FieldProps = {
    control: Control<PrintOptionsValues>
    /** Locked, e.g. when the screenshot was flagged. Base UI radios aren't
     * buttons, so a disabled fieldset doesn't reach them */
    disabled?: boolean
}

const countryItems = countries.map((country) => ({
    label: country.name,
    value: country.code
}))

/**
 * Delivery country: sets the currency, prices and which sizes are offered
 */
export const CountryField = ({
    control,
    disabled,
    onChange
}: FieldProps & { onChange: (code: string) => void }) => (
    <Controller
        control={control}
        name='country'
        render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
                <FieldEyebrow
                    name={field.name}
                    htmlFor={field.name}>
                    Deliver to
                </FieldEyebrow>
                <Select
                    items={countryItems}
                    value={field.value}
                    onValueChange={(code) => code && onChange(code)}
                    disabled={disabled}>
                    <SelectTrigger
                        id={field.name}
                        ref={field.ref}
                        aria-invalid={fieldState.invalid}
                        className='w-full'>
                        <SelectValue />
                    </SelectTrigger>
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
                <FieldError errors={[fieldState.error]} />
            </Field>
        )}
    />
)

/**
 * Product type cards with their starting price
 */
export const ProductTypeField = ({
    control,
    disabled,
    choices,
    onChange
}: FieldProps & {
    choices: ProductChoice[]
    onChange: (id: ProductTypeId) => void
}) => (
    <Controller
        control={control}
        name='productType'
        render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
                <FieldEyebrow name={field.name}>Product</FieldEyebrow>
                <FieldRadioGroup
                    name={field.name}
                    ref={field.ref}
                    value={field.value}
                    onValueChange={(id) => onChange(id as ProductTypeId)}
                    disabled={disabled}
                    aria-invalid={fieldState.invalid}>
                    {choices.map((choice) => {
                        const disabled = !choice.fromPrice
                        const faded = disabled && 'opacity-50'

                        return (
                            <Label
                                key={choice.id}
                                htmlFor={`product-${choice.id}`}
                                className={cn(
                                    choiceCard(disabled),
                                    disabled && 'opacity-100'
                                )}>
                                <RadioGroupItem
                                    id={`product-${choice.id}`}
                                    value={choice.id}
                                    disabled={disabled}
                                    className={cn('mt-0.5', faded)}
                                />
                                <span className='flex flex-1 flex-col gap-2'>
                                    <span className='flex items-baseline justify-between gap-2'>
                                        <span
                                            className={cn(
                                                'font-medium',
                                                faded
                                            )}>
                                            {choice.name}
                                        </span>
                                        {choice.fromPrice ? (
                                            <span className='text-sm font-normal text-muted-foreground'>
                                                from{' '}
                                                {formatMoney(choice.fromPrice)}
                                            </span>
                                        ) : (
                                            <span
                                                className={cn(
                                                    tagClasses,
                                                    unavailableTagClasses
                                                )}>
                                                Screenshot too small
                                            </span>
                                        )}
                                    </span>
                                    <span
                                        className={cn(
                                            'text-sm font-normal text-pretty text-muted-foreground',
                                            faded
                                        )}>
                                        {productCopy[choice.id].description}
                                    </span>
                                    <span
                                        className={cn(
                                            'flex flex-wrap gap-1.5',
                                            faded
                                        )}>
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
                        )
                    })}
                </FieldRadioGroup>
                <FieldError errors={[fieldState.error]} />
            </Field>
        )}
    />
)

const qualityTagClasses: Record<PrintQuality, string[]> = {
    great: ['border-primary/40', 'bg-primary/10', 'text-primary'],
    good: [],
    ok: [],
    low: unavailableTagClasses
}

/**
 * Sizes with a print quality grade for the screenshot. Sizes the screenshot
 * is too small for are shown but can't be chosen.
 */
export const SizeField = ({
    control,
    disabled,
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
        <Controller
            control={control}
            name='size'
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldEyebrow name={field.name}>Size</FieldEyebrow>
                    <FieldRadioGroup
                        name={field.name}
                        ref={field.ref}
                        value={field.value}
                        onValueChange={onChange}
                        disabled={disabled}
                        aria-invalid={fieldState.invalid}
                        className='gap-2'>
                        {choices.map((choice) => {
                            const { inches, cm } = formatSize(choice.size, meta)
                            const disabled = choice.unavailable !== null

                            const faded = disabled && 'opacity-50'

                            return (
                                <Label
                                    key={choice.size}
                                    htmlFor={`size-${choice.size}`}
                                    className={cn(
                                        choiceCard(disabled),
                                        'items-center rounded-lg px-4 py-3',
                                        disabled && 'opacity-100'
                                    )}>
                                    <RadioGroupItem
                                        id={`size-${choice.size}`}
                                        value={choice.size}
                                        disabled={disabled}
                                        className={cn(faded)}
                                    />
                                    <span
                                        className={cn(
                                            'flex flex-1 flex-col gap-0.5',
                                            faded
                                        )}>
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
                                            qualityTagClasses[choice.quality]
                                        )}>
                                        {qualityLabels[choice.quality]}
                                    </span>
                                    <span
                                        className={cn(
                                            'w-16 text-right font-medium tabular-nums',
                                            faded
                                        )}>
                                        {choice.price
                                            ? formatMoney(choice.price)
                                            : '-'}
                                    </span>
                                </Label>
                            )
                        })}
                    </FieldRadioGroup>
                    {hasTooSmall && (
                        <p className='text-xs text-pretty text-muted-foreground'>
                            Greyed-out sizes need a higher-resolution screenshot
                            to print sharply (at least {qualityThresholds.ok}{' '}
                            pixels per inch).
                        </p>
                    )}
                    <FieldError errors={[fieldState.error]} />
                </Field>
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
    disabled,
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
        <Controller
            control={control}
            name={`options.${name}`}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldEyebrow
                        name={field.name}
                        aside={optionLabel(name, field.value)}>
                        {optionNames[name] ?? name}
                    </FieldEyebrow>
                    {name === 'color' ? (
                        <FieldRadioGroup
                            name={field.name}
                            ref={field.ref}
                            value={field.value}
                            onValueChange={onChange}
                            disabled={disabled}
                            aria-invalid={fieldState.invalid}
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
                                        'has-data-checked:ring-2',
                                        'has-data-checked:ring-primary',
                                        'has-data-checked:ring-offset-2',
                                        'has-data-checked:ring-offset-background',
                                        'has-focus-visible:ring-2',
                                        'has-focus-visible:ring-ring/50',
                                        'has-focus-visible:ring-offset-2',
                                        'has-focus-visible:ring-offset-background'
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
                            name={field.name}
                            ref={field.ref}
                            value={field.value}
                            onValueChange={onChange}
                            disabled={disabled}
                            aria-invalid={fieldState.invalid}
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
                    <FieldError errors={[fieldState.error]} />
                </Field>
            )}
        />
    )
}
