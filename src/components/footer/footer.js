/** @jsx jsx */
import { Box, Text } from '@theme-ui/components'
import React from 'react'
import { jsx } from 'theme-ui'

const Footer = () => (
    <React.Fragment>
        <Box
            sx={{
                p: 3,
            }}>
            <Text sx={{ color: 'highlight' }}>Footer</Text>
        </Box>
    </React.Fragment>
)

export default Footer
