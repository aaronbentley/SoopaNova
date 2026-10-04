import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

/**
 * Allow the Vercel Toolbar (feedback, comments) on preview deployments only
 */
const isPreview = process.env.VERCEL_ENV === 'preview'
const vercelToolbar = {
    script: isPreview ? ' https://vercel.live' : '',
    style: isPreview ? ' https://vercel.live' : '',
    img: isPreview ? ' https://vercel.live https://vercel.com' : '',
    font: isPreview ? ' https://vercel.live https://assets.vercel.com' : '',
    frame: isPreview ? ' https://vercel.live' : '',
    connect: isPreview ? ' https://vercel.live wss://ws-us3.pusher.com' : ''
}

/**
 * Set CSP headers
 */
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' *.soopanova.app https://challenges.cloudflare.com${vercelToolbar.script};
    style-src 'self' 'unsafe-inline'${vercelToolbar.style};
    img-src 'self' blob: data: *.clerk.com https://storage.googleapis.com${vercelToolbar.img};
    font-src 'self'${vercelToolbar.font};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://challenges.cloudflare.com${vercelToolbar.frame};
    frame-ancestors 'none';
    worker-src 'self' blob:;
    connect-src 'self' *.soopanova.app *.googleapis.com *.cloudfunctions.net${vercelToolbar.connect};
    block-all-mixed-content;
    upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
    trailingSlash: true,
    images: {
        formats: ['image/avif', 'image/webp']
    },
    logging: {
        fetches: {
            fullUrl: process.env.NODE_ENV === 'development'
        }
    },
    async headers() {
        if (process.env.NODE_ENV === 'production') {
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
                        {
                            key: 'Permissions-Policy',
                            value: 'accelerometer=(),autoplay=(),camera=(),display-capture=(),encrypted-media=(),fullscreen=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),midi=(),payment=(),picture-in-picture=(),publickey-credentials-get=(),screen-wake-lock=(),sync-xhr=(self),usb=(),xr-spatial-tracking=()'
                        },
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
                            key: 'Content-Security-Policy',
                            // key: 'Content-Security-Policy-Report-Only',
                            value: cspHeader.replace(/\n/g, '')
                        }
                    ]
                }
            ]
        }
        return []
    }
}

/**
 * Compile .mdx imports (long-form copy in src/content/). Components come
 * from src/mdx-components.tsx.
 */
const withMDX = createMDX()

export default withMDX(nextConfig)
