/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import PropTypes from 'prop-types'
import React from 'react'
import Helmet from 'react-helmet'
import { useSiteMetadata } from '../../hooks/use-site-metadata'

const SEO = ({ title, description, lang, meta }) => {
    const {
        title: siteMetadataTitle,
        description: siteMetadataDescription,
        author: siteMetadataAuthor
    } = useSiteMetadata()

    const metaTitle = title || siteMetadataTitle
    const metaDescription = description || siteMetadataDescription

    return (
        <Helmet
            htmlAttributes={{
                lang
            }}
            defaultTitle={metaTitle}
            titleTemplate={`%s | ${metaTitle}`}
            meta={[
                {
                    name: 'description',
                    content: metaDescription
                },
                {
                    property: 'og:title',
                    content: metaTitle
                },
                {
                    property: 'og:description',
                    content: metaDescription
                },
                {
                    property: 'og:type',
                    content: 'website'
                },
                {
                    name: 'twitter:card',
                    content: 'summary'
                },
                {
                    name: 'twitter:creator',
                    content: siteMetadataAuthor
                },
                {
                    name: 'twitter:title',
                    content: metaTitle
                },
                {
                    name: 'twitter:description',
                    content: metaDescription
                }
            ].concat(meta)}
        />
    )
}

SEO.defaultProps = {
    lang: 'en',
    meta: [],
    description: ''
}

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string
}

export default SEO
