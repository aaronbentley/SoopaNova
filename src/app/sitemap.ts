import { platforms } from '@/assets/data/platforms'
import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { productPath } from '@/assets/data/products'
import { getLastModified } from '@/lib/cached-dates'
import { MetadataRoute } from 'next'

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const lastModified = await getLastModified()

    /**
     * Create page paths
     */
    const paths = [
        '/',
        '/screenshots/',
        ...platforms.map((platform) => platform.href),
        '/prints/',
        '/prints/sustainability/',
        ...(Object.keys(productTypes) as ProductTypeId[]).map(productPath),
        '/faq/',
        '/support/',
        '/about/',
        '/privacy/',
        '/terms/'
    ]

    /**
     * Loop through paths and build sitemap objects
     */
    return paths.map((path) => {
        const url = new URL(path, process.env.APP_URL!)

        return {
            url: url.href,
            lastModified
        }
    })
}

export default sitemap
