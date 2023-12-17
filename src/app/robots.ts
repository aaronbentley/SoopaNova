import { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/sign-in/',
                '/sign-up/',
                '/orders/'
                // '/icon/',
                // '/opengraph-image',
                // '/favicon.ico'
            ]
        },
        sitemap: `${process.env.APP_URL!}/sitemap.xml`
    }
}

export default robots
