import { Global } from '@emotion/core'
import React from 'react'

const GlobalStyles = () => (
    <Global
        styles={theme => ({
            // '*': {
            'body,div,h1,h2,h3,h4,h5,h6': {
                transition: `color,background,background-color ${theme.durations[1]} .25s linear`
            }
        })}/>
)

export default GlobalStyles
