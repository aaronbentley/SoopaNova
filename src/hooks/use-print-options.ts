'use client'

import { countries } from '@/assets/data/countries'
import {
    productTypes,
    shipping,
    type ProductTypeId
} from '@/assets/data/pricing'
import { defaultOptions, defaultProductType } from '@/assets/data/print-options'
import { useDeliveryCountry } from '@/hooks/use-delivery-country'
import {
    getCatalogueItem,
    getPrice,
    getShippingPrice,
    type Price
} from '@/lib/pricing'
import {
    getPrintDpi,
    getPrintQuality,
    type PrintQuality
} from '@/lib/print-quality'
import type { ImageMeta, PrintSelection, Region } from '@/types'
import { useState } from 'react'

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

const productTypeIds = Object.keys(productTypes) as ProductTypeId[]

const cheapest = (prices: (Price | null)[]) =>
    prices
        .filter((price): price is Price => price !== null)
        .sort((a, b) => a.amount - b.amount)[0] ?? null

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
 * State for the print options sheet: delivery country, product type, size
 * and options. Choices that don't apply (a size not sold in the country, a
 * colour the product doesn't have) fall back to defaults as they're read,
 * so switching product keeps whatever still fits.
 */
export const usePrintOptions = (meta: ImageMeta) => {
    const [country, setCountry] = useDeliveryCountry()
    const [chosenType, setProductType] =
        useState<ProductTypeId>(defaultProductType)
    const [chosenSize, setSize] = useState<string | null>(null)
    const [chosenOptions, setOptions] = useState<Record<string, string>>({})
    const [confirmed, setConfirmed] = useState(false)

    const region =
        countries.find((entry) => entry.code === country)?.region ?? 'gb'

    /**
     * Product types, with the price of their cheapest orderable size
     */
    const productChoices: ProductChoice[] = productTypeIds.map((id) => ({
        id,
        name: productTypes[id].name,
        fromPrice: cheapest(
            getSizeChoices(id, region, meta)
                .filter((choice) => !choice.unavailable)
                .map((choice) => choice.price)
        )
    }))

    const productType =
        productChoices.find(
            (choice) => choice.id === chosenType && choice.fromPrice
        )?.id ??
        productChoices.find((choice) => choice.fromPrice)?.id ??
        chosenType

    /**
     * Sizes sold in the region, and the chosen (or first orderable) one
     */
    const sizeChoices = getSizeChoices(productType, region, meta).filter(
        (choice) => choice.unavailable !== 'region'
    )

    const size =
        sizeChoices.find(
            (choice) => choice.size === chosenSize && !choice.unavailable
        ) ??
        sizeChoices.find((choice) => !choice.unavailable) ??
        null

    const item = size ? getCatalogueItem(productType, size.size) : undefined

    /**
     * Options the product offers, each with the chosen or default value
     */
    const optionValues = item?.options ?? {}
    const options = Object.fromEntries(
        Object.entries(optionValues).map(([name, values]) => {
            const value = [chosenOptions[name], defaultOptions[name]].find(
                (candidate) => candidate && values.includes(candidate)
            )
            return [name, value ?? values[0]]
        })
    )

    const setOption = (name: string, value: string) =>
        setOptions((current) => ({ ...current, [name]: value }))

    const shippingFrom = size
        ? cheapest(
              shipping.methods.map((method) =>
                  getShippingPrice(productType, size.size, region, method)
              )
          )
        : null

    const selection: PrintSelection | null =
        size && item
            ? {
                  productType,
                  size: size.size,
                  sku: item.sku,
                  options,
                  country,
                  region
              }
            : null

    return {
        country,
        setCountry,
        region,
        productChoices,
        productType,
        setProductType,
        sizeChoices,
        size,
        setSize,
        optionValues,
        options,
        setOption,
        price: size?.price ?? null,
        shippingFrom,
        confirmed,
        setConfirmed,
        selection
    }
}
