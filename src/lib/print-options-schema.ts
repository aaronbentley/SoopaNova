import { countries } from '@/assets/data/countries'
import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { getCatalogueItem } from '@/lib/pricing'
import type { ProductTypeConfig } from '@/types'
import { z } from 'zod'

/**
 * Validation for the print options sheet (react-hook-form) and the
 * POST /api/checkout request, so the browser and server check the same
 * rules against the catalogue.
 */

const config: Record<string, ProductTypeConfig> = productTypes

const productTypeIds = Object.keys(productTypes) as [
    ProductTypeId,
    ...ProductTypeId[]
]
const countryCodes = countries.map((country) => country.code) as [
    string,
    ...string[]
]

/**
 * The fields chosen in the print options sheet
 */
const printOptionsShape = z.object({
    country: z.enum(countryCodes, {
        message: 'Please choose a delivery country.'
    }),
    productType: z.enum(productTypeIds, {
        message: 'Please choose a product.'
    }),
    size: z.string().min(1, 'Please choose a size.'),
    options: z.record(z.string(), z.string()),
    confirmed: z
        .boolean()
        .refine(
            (confirmed) => confirmed,
            'Please confirm this is your own screenshot.'
        )
})

/**
 * Catalogue rules: the size is sold in the country's region, and every
 * option the product has is set to one of its values
 */
const checkCatalogue = (
    values: z.infer<typeof printOptionsShape>,
    context: z.RefinementCtx
) => {
    const country = countries.find((entry) => entry.code === values.country)
    if (!country) return

    const sizeEntry = config[values.productType]?.sizes.find(
        (entry) => entry.size === values.size
    )
    const item = getCatalogueItem(values.productType, values.size)

    if (
        !sizeEntry ||
        !item ||
        !item.costs[country.region] ||
        (sizeEntry.regions && !sizeEntry.regions.includes(country.region))
    ) {
        context.addIssue({
            code: 'custom',
            path: ['size'],
            message: `That size isn't available to ${country.name}.`
        })
        return
    }

    const names = Object.keys(item.options)
    const validOptions =
        Object.keys(values.options).length === names.length &&
        names.every((name) => item.options[name].includes(values.options[name]))

    if (!validOptions) {
        context.addIssue({
            code: 'custom',
            path: ['options'],
            message: 'Please choose valid product options.'
        })
    }
}

export const printOptionsSchema = printOptionsShape.superRefine(checkCatalogue)

export const checkoutRequestSchema = printOptionsShape
    .extend({ fileName: z.string().min(1, 'Missing screenshot.') })
    .superRefine(checkCatalogue)

export type PrintOptionsValues = z.infer<typeof printOptionsSchema>
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
