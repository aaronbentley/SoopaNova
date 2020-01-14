// const path = require('path')

module.exports = {
    pathPrefix: '/stacks',
    siteMetadata: {
        // title: '🦄👩🏻‍🎤 Lexi  👩🏻‍🎤🦄',
        // title: '🧚‍♀️👩🏻‍🎤 Maddi  👩🏻‍🎤🧚‍♀️',
        title: 'Nova',
        // title: 'Stacks.io',
        description: 'Do more with your Xbox media',
        author: '@aaronbentley'
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-firebase',
            options: {
                features: {
                    auth: false,
                    functions: true,
                    analytics: true,
                    performance: true,
                    database: false,
                    firestore: false,
                    storage: false,
                    messaging: false
                }
            }
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: `${__dirname}/src/images`
            }
        },
        {
            resolve: 'gatsby-plugin-create-client-paths',
            options: { prefixes: ['/app/*'] }
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        'gatsby-plugin-theme-ui',
        // {
        //     resolve: 'gatsby-plugin-react-svg',
        //     options: {
        //         rule: {
        //             // include: /assets/ // See below to configure properly
        //             include: path.resolve(__dirname, 'src/assets')
        //         }
        //     }
        // },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Stacks.io',
                short_name: 'Stacks',
                start_url: '/',
                background_color: '#ca50b7',
                theme_color: '#ca50b7',
                display: 'minimal-ui',
                icon: 'src/images/gatsby-icon.png' // This path is relative to the root of the site.
            }
        }
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ]
}
