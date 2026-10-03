import { platforms } from '@/assets/data/platforms'
import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { productCopy, productPath } from '@/assets/data/products'

export type NavLink = {
    href: string
    label: string
    /** A short line under the label in the desktop menu's panel */
    description?: string
    /** Shown as a menu under this link: a panel on desktop, indented links
     * on mobile, led by a link to this page labelled `overview` */
    children?: NavLink[]
    overview?: string
}

/**
 * The main nav, in the header and the mobile sheet
 */
export const links: NavLink[] = [
    {
        href: '/create/',
        label: 'Create'
    },
    {
        href: '/prints/',
        label: 'Prints',
        overview: 'Compare all prints',
        description: 'All four side by side, and which suits you',
        children: [
            ...(Object.keys(productTypes) as ProductTypeId[]).map(
                (productType) => ({
                    href: productPath(productType),
                    label: productTypes[productType].name,
                    description: productCopy[productType].tags.join(' · ')
                })
            ),
            {
                href: '/prints/sustainability/',
                label: 'Sustainability',
                description: 'Made to order, printed near you'
            }
        ]
    },
    {
        href: '/screenshots/',
        label: 'Screenshots',
        overview: 'Screenshot tips',
        description: 'Which sizes your screenshot can print, and more',
        children: platforms.map((platform) => ({
            href: platform.href,
            label: platform.name,
            description: `How to download your ${platform.name} screenshots`
        }))
    },
    {
        href: '/about/',
        label: 'About'
    },
    {
        href: '/faq/',
        label: 'FAQ'
    }
]
