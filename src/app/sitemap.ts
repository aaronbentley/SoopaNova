import { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap => {
    /**
     * Create page paths
     */
    const paths = [
        '/',
        '/create/',
        '/screenshots/',
        '/screenshots/xbox',
        '/screenshots/playstation',
        '/screenshots/steam',
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
