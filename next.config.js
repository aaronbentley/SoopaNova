/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        formats: ['image/avif', 'image/webp']
    },
    experimental: {
        ppr: false
    }
}

module.exports = nextConfig
