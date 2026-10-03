import { platforms } from '@/assets/data/platforms'
import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { productPath } from '@/assets/data/products'
import { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap => {
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
        '/about/',
        '/privacy/',
        '/terms/'
    ]

    /**
     * Loop through paths and build sitemap objects
     */
    return paths.map((path) => {
        const url = new URL(path, process.env.APP_URL!)
        const lastModified = new Date()

        return {
            url: url.href,
            lastModified
        }
    })
}

export default sitemap
