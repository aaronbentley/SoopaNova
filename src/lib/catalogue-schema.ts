import type { StoredCatalogue } from '@/types'
import { z } from 'zod'

/**
 * The catalogue as kept in Global Config. It's read at runtime rather than
 * compiled in, so it's checked on the way in (catalogue-store.ts).
 */

const region = z.enum(['gb', 'eu', 'us'])

const shippingMethod = z.enum([
    'Budget',
    'Standard',
    'StandardPlus',
    'Express',
    'Overnight'
])

const cost = z.object({
    itemCost: z.number().nonnegative(),
    shipping: z.partialRecord(shippingMethod, z.number().nonnegative()),
    madeIn: z.string()
})

const item = z.object({
    sku: z.string().min(1),
    size: z.string().min(1),
    description: z.string(),
    printArea: z.object({
        width: z.number().int().positive(),
        height: z.number().int().positive()
    }),
    options: z.record(z.string(), z.array(z.string())),
    optionRegions: z
        .record(z.string(), z.record(z.string(), z.array(region)))
        .optional(),
    costs: z.partialRecord(region, cost)
})

export const storedCatalogueSchema = z.object({
    generatedAt: z.string(),
    appliedAt: z.string(),
    appliedBy: z.enum(['cron', 'script', 'admin']),
    products: z.record(z.string(), z.array(item))
}) satisfies z.ZodType<StoredCatalogue>
