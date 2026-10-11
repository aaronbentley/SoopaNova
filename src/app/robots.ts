import { env } from '@/config/env'
import { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/sign-in/',
                '/sign-up/',
                '/sso-callback/',
                '/create/',
                '/orders/',
                '/account/',
                '/admin/'
            ]
        },
        sitemap: `${env.APP_URL}/sitemap.xml`
    }
}

export default robots
