import { Global } from '@emotion/core'
import React from 'react'

const GlobalStyles = () => (
    <Global
        styles={theme => ({
            '*': {
                transition: `color,background,background-color ${theme.durations[1]} .25s linear`
            }
        })}/>
)

export default GlobalStyles
