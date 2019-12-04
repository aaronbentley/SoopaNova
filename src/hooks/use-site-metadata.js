/**
 * Stacks.io Metadata Hook
 *
 * @export useSiteMetadata
 */
import { graphql, useStaticQuery } from 'gatsby'

export const useSiteMetadata = () => {
    const { site = {} } = useStaticQuery(
        graphql`
            query SITE_METADATA {
                site {
                    siteMetadata {
                        title
                        description
                        author
                    }
                }
            }
        `
    )

    return site.siteMetadata
}
