/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' *.soopanova.app;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: *.clerk.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' *.canvaspop.com;
    frame-ancestors 'none';
    worker-src 'self' blob:;
    connect-src 'self' *.soopanova.app *.googleapis.com *.cloudfunctions.net;
    block-all-mixed-content;
    upgrade-insecure-requests;
`

const nextConfig = {
    trailingSlash: true,
    images: {
        formats: ['image/avif', 'image/webp']
    },
    experimental: {
        ppr: false
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload'
                    },
                    // {
                    //     key: 'Permissions-Policy',
                    //     value: 'accelerometer=(),autoplay=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),midi=(),payment=(),picture-in-picture=(),publickey-credentials-get=(),screen-wake-lock=(),sync-xhr=(self),usb=(),web-share=(),xr-spatial-tracking=()'
                    // },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'same-origin'
                    },
                    {
                        // key: 'Content-Security-Policy-Report-Only',
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, '')
                    }
                ]
            }
        ]
    }
}

module.exports = nextConfig
