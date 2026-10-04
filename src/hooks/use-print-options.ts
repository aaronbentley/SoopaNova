'use client'

import { countries } from '@/assets/data/countries'
import {
    productTypes,
    shipping,
    type ProductTypeId
} from '@/assets/data/pricing'
import { defaultOptions, defaultProductType } from '@/assets/data/print-options'
import { trackEvent } from '@/lib/analytics'
import {
    detectDeliveryCountry,
    getRegion,
    rememberDeliveryCountry
} from '@/lib/delivery-country'
import {
    cheapest,
    getCatalogueItem,
    getPrice,
    getShippingPrice,
    type Price
} from '@/lib/pricing'
import { describeOptions, formatPrintSize } from '@/lib/print-labels'
import {
    printOptionsSchema,
    type PrintOptionsValues
} from '@/lib/print-options-schema'
import {
    getPrintDpi,
    getPrintQuality,
    type PrintQuality
} from '@/lib/print-quality'
import type { ImageMeta, Region } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

export type SizeChoice = {
    size: string
    price: Price | null
    dpi: number
    quality: PrintQuality
    /** Why it can't be ordered: not sold in the region, or too low-res */
    unavailable: 'region' | 'resolution' | null
}

export type ProductChoice = {
    id: ProductTypeId
    name: string
    /** Cheapest orderable size, or null when no size can be ordered */
    fromPrice: Price | null
}

type Selection = Omit<PrintOptionsValues, 'confirmed'>

const productTypeIds = Object.keys(productTypes) as ProductTypeId[]

/**
 * Sizes for a product type in a region, priced and graded for the screenshot
 */
const getSizeChoices = (
    productType: ProductTypeId,
    region: Region,
    meta: ImageMeta
): SizeChoice[] =>
    productTypes[productType].sizes.map(({ size }) => {
        const price = getPrice(productType, size, region)
        const dpi = getPrintDpi(meta, size)
        const quality = getPrintQuality(dpi)

        return {
            size,
            price,
            dpi,
            quality,
            unavailable: !price
                ? 'region'
                : quality === 'low'
                  ? 'resolution'
                  : null
        }
    })

/**
 * Product types, with the price of their cheapest orderable size
 */
const getProductChoices = (region: Region, meta: ImageMeta) =>
    productTypeIds.map((id) => ({
        id,
        name: productTypes[id].name,
        fromPrice: cheapest(
            getSizeChoices(id, region, meta)
                .filter((choice) => !choice.unavailable)
                .map((choice) => choice.price)
        )
    }))

/**
 * Make a selection valid for the screenshot and country: keep each choice
 * that still applies, otherwise fall back to the first orderable product,
 * the first orderable size, and each option's default (or first) value
 */
const resolveSelection = (selection: Selection, meta: ImageMeta): Selection => {
    const region = getRegion(selection.country)
    const productChoices = getProductChoices(region, meta)

    const productType =
        productChoices.find(
            (choice) => choice.id === selection.productType && choice.fromPrice
        )?.id ??
        productChoices.find((choice) => choice.fromPrice)?.id ??
        selection.productType

    const sizeChoices = getSizeChoices(productType, region, meta)
    const size =
        sizeChoices.find(
            (choice) => choice.size === selection.size && !choice.unavailable
        )?.size ??
        sizeChoices.find((choice) => !choice.unavailable)?.size ??
        ''

    const item = size ? getCatalogueItem(productType, size) : undefined
    const options = Object.fromEntries(
        Object.entries(item?.options ?? {}).map(([name, values]) => {
            const value = [selection.options[name], defaultOptions[name]].find(
                (candidate) => candidate && values.includes(candidate)
            )
            return [name, value ?? values[0]]
        })
    )

    return { country: selection.country, productType, size, options }
}

/**
 * The print options form (react-hook-form + zod). Product, size and options
 * depend on each other and on the country, so each change resolves the
 * whole selection again and every field always holds a valid value; zod
 * checks it (and the personal-use confirmation) on submit, as the server
 * does at checkout.
 */
export const usePrintOptionsForm = (meta: ImageMeta) => {
    const [defaultValues] = useState<PrintOptionsValues>(() => ({
        ...resolveSelection(
            {
                country: detectDeliveryCountry(),
                productType: defaultProductType,
                size: '',
                options: {}
            },
            meta
        ),
        confirmed: false
    }))

    const form = useForm<PrintOptionsValues>({
        resolver: zodResolver(printOptionsSchema),
        defaultValues
    })

    const values = useWatch({ control: form.control }) as PrintOptionsValues

    /**
     * Apply a change and resolve the rest of the selection around it.
     * `choice` describes the change for analytics, e.g. 'Size: 24 × 16″'.
     */
    const update = (change: Partial<Selection>, choice: string) => {
        const next = resolveSelection({ ...form.getValues(), ...change }, meta)

        form.setValue('country', next.country, { shouldDirty: true })
        form.setValue('productType', next.productType, { shouldDirty: true })
        form.setValue('size', next.size, { shouldDirty: true })
        form.setValue('options', next.options, { shouldDirty: true })

        trackEvent('Print option chosen', {
            choice,
            product: productTypes[next.productType].name
        })
    }

    const region = getRegion(values.country)
    const sizeChoices = getSizeChoices(values.productType, region, meta).filter(
        (choice) => choice.unavailable !== 'region'
    )
    const size = sizeChoices.find((choice) => choice.size === values.size)
    const item = size
        ? getCatalogueItem(values.productType, size.size)
        : undefined

    return {
        form,
        values,
        region,
        productChoices: getProductChoices(region, meta),
        sizeChoices,
        size: size ?? null,
        optionValues: item?.options ?? {},
        price: size?.price ?? null,
        shippingFrom: size
            ? cheapest(
                  shipping.methods.map((method) =>
                      getShippingPrice(
                          values.productType,
                          size.size,
                          region,
                          method
                      )
                  )
              )
            : null,
        setCountry: (country: string) => {
            rememberDeliveryCountry(country)
            update(
                { country },
                `Delivery country: ${countries.find((entry) => entry.code === country)?.name ?? country}`
            )
        },
        setProductType: (productType: ProductTypeId) =>
            update(
                { productType },
                `Product: ${productTypes[productType].name}`
            ),
        setSize: (newSize: string) =>
            update({ size: newSize }, `Size: ${formatPrintSize(newSize)}`),
        setOption: (name: string, value: string) =>
            update(
                { options: { ...form.getValues('options'), [name]: value } },
                describeOptions({ [name]: value })
            )
    }
}
