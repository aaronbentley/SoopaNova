import { Service, WithContext } from 'schema-dts'

export const jsonLd: WithContext<Service> = {
    '@id': `${process.env.APP_URL!}/#onlinebusiness`,
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: process.env.APP_TITLE!,
    description: process.env.APP_DESCRIPTION!,
    url: process.env.APP_URL!,
    provider: {
        '@type': 'Organization',
        name: 'SoopaNova',
        url: process.env.APP_URL!
    },
    sameAs: [
        process.env.APP_SOCIAL_TWITTER!,
        process.env.APP_SOCIAL_INSTAGRAM!,
        process.env.APP_SOCIAL_THREADS!,
        process.env.APP_SOCIAL_FACEBOOK!
    ],
    serviceType: 'Gaming Screenshot Prints'
    // offers: [
    //     {
    //         '@type': 'Offer',
    //         availability: 'https://schema.org/InStock',
    //         category: 'Printing',
    //         itemOffered: {
    //             '@type': 'Product',
    //             name: 'Poster Prints',
    //             description: 'Premium poster prints',
    //             brand: process.env.APP_TITLE!
    //         }
    //     },
    //     {
    //         '@type': 'Offer',
    //         availability: 'https://schema.org/InStock',
    //         category: 'Printing',
    //         itemOffered: {
    //             '@type': 'Product',
    //             name: 'Canvas Prints',
    //             description: 'Premium Canvas Prints',
    //             brand: process.env.APP_TITLE!
    //         }
    //     },
    //     {
    //         '@type': 'Offer',
    //         availability: 'https://schema.org/InStock',
    //         category: 'Printing',
    //         itemOffered: {
    //             '@type': 'Product',
    //             name: 'Framed Prints',
    //             description: 'Premium Framed Prints',
    //             brand: process.env.APP_TITLE!
    //         }
    //     }
    // ]
}
