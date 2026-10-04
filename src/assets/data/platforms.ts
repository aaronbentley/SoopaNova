/**
 * Gaming platforms with a screenshot guide, for the homepage, /screenshots,
 * the guide pages (/screenshots/[platform]/) and the sitemap. Names as text,
 * not logos: logos suggest an endorsement we don't have.
 *
 * Each guide's copy is src/content/screenshots/{slug}.mdx, and each section's
 * `id` must match a `<Section id='…'>` there (the header's anchor tiles).
 * Don't import the MDX here: the header's nav imports this file.
 */
export const platforms = [
    {
        slug: 'xbox',
        name: 'Xbox',
        maker: 'Microsoft',
        sections: [
            { id: 'onedrive', name: 'OneDrive' },
            { id: 'xbox-app', name: 'Xbox app' },
            { id: 'usb-drive', name: 'USB drive' }
        ]
    },
    {
        slug: 'playstation',
        name: 'PlayStation',
        maker: 'Sony',
        sections: [
            { id: 'playstation-app', name: 'PlayStation App' },
            { id: 'usb-drive', name: 'USB drive' }
        ]
    },
    {
        slug: 'steam',
        name: 'Steam',
        maker: 'Valve',
        sections: [
            { id: 'steam-app', name: 'Steam app' },
            { id: 'file-system', name: 'File system' }
        ]
    }
].map((platform) => ({
    ...platform,
    href: `/screenshots/${platform.slug}/`,
    description: `How to download your ${platform.name} screenshots, ready to create awesome prints.`
}))
