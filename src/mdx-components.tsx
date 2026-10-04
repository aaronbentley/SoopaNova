import { Callout } from '@/components/mdx/callout'
import { Section } from '@/components/mdx/section'
import { TextLink } from '@/components/mdx/text-link'
import {
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import { Typography } from '@/components/typography'
import type { MDXComponents } from 'mdx/types'

/**
 * How Markdown in src/content/*.mdx renders: the inner-page components, so
 * content files stay plain Markdown. `<Section>` wraps each `##` heading and
 * its paragraphs. Lists are muted like paragraphs; a numbered step's title
 * is bold (`1. **Install the app:**`), with its details as a nested list.
 */
const components: MDXComponents = {
    Section,
    Callout,
    h2: PageSectionHeading,
    h3: (props) => (
        <Typography
            variant='h3'
            {...props}
        />
    ),
    p: PageSectionDescription,
    ul: (props) => (
        <Typography
            variant='ul'
            muted
            {...props}
        />
    ),
    ol: (props) => (
        <Typography
            variant='ol'
            muted
            className='marker:font-semibold'
            {...props}
        />
    ),
    li: (props) => (
        <Typography
            variant='li'
            {...props}
        />
    ),
    em: (props) => (
        <Typography
            variant='em'
            {...props}
        />
    ),
    strong: (props) => (
        <Typography
            variant='strong'
            {...props}
        />
    ),
    a: TextLink
}

export const useMDXComponents = (): MDXComponents => components
