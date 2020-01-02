/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import PropTypes from 'prop-types'
import React from 'react'
import { AppProvider } from './src/data/app-context'

export const wrapRootElement = ({ element }) => (
    <AppProvider>
        <React.Fragment>{element}</React.Fragment>
    </AppProvider>
)

wrapRootElement.propTypes = {
    element: PropTypes.node.isRequired
}
