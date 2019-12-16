/** @jsx jsx */
/**
 * Stacks.io Link
 *
 * @export Link
 */
import { Link as ThemeUILink } from '@theme-ui/components'
import { Link as GatsbyLink } from 'gatsby'
import PropTypes from 'prop-types'
import { jsx } from 'theme-ui'

// Since DOM elements <a> cannot receive activeClassName
// and partiallyActive, destructure the prop here and
// pass it only to GatsbyLink
const Link = ({ children, to, activeClassName, partiallyActive, ...other }) => {
    // Tailor the following test to your environment.
    // This example assumes that any internal link (intended for Gatsby)
    // will start with exactly one slash, and that anything else is external.
    const internal = /^\/(?!\/)/.test(to)

    // console.log('TCL: Link -> to', to)
    // console.log('TCL: Link -> internal', internal)

    // Use Theme UI Link as Gatsby Link for internal links, and <a> for others
    if (internal) {
        return (
            <ThemeUILink
                as={GatsbyLink}
                to={to}
                activeClassName={activeClassName}
                partiallyActive={partiallyActive}
                {...other}>
                {children}
            </ThemeUILink>
        )
    }
    return (
        <a href={to} {...other}>
            {children}
        </a>
    )
}

Link.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    activeClassName: PropTypes.string,
    partiallyActive: PropTypes.bool
}

Link.defaultProps = {
    activeClassName: '',
    partiallyActive: false
}

export default Link
