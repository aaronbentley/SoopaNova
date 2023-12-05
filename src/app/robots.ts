import { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/orders/'
        },
        sitemap: `${process.env.APP_URL!}/sitemap.xml`
    }
}

export default robots
