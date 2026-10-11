'use client'

import type { Catalogue } from '@/types'
import { createContext, use } from 'react'

const CatalogueContext = createContext<Catalogue | null>(null)

/**
 * Hands the catalogue (read on the server with getCatalogue) to the print
 * options sheet, which prices sizes in the browser. Wraps the upload UI on
 * the homepage and /create.
 */
const CatalogueProvider = ({
    catalogue,
    children
}: {
    catalogue: Catalogue
    children: React.ReactNode
}) => <CatalogueContext value={catalogue}>{children}</CatalogueContext>

export const useCatalogue = () => {
    const catalogue = use(CatalogueContext)

    if (!catalogue) {
        throw new Error('useCatalogue must be used inside a CatalogueProvider')
    }

    return catalogue
}

export default CatalogueProvider
