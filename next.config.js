/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        formats: ['image/avif', 'image/webp']
    }
}

module.exports = nextConfig
