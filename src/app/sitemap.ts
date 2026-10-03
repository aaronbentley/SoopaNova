import { platforms } from '@/assets/data/platforms'
import { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap => {
    /**
     * Create page paths
     */
    const paths = [
        '/',
        '/screenshots/',
        ...platforms.map((platform) => platform.href),
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
