/** @jsx jsx */
import { Box, Heading, Link as ThemeUILink } from '@theme-ui/components'
import { Link } from 'gatsby'
import React from 'react'
import { jsx } from 'theme-ui'
import { useSiteMetadata } from '../../hooks/use-site-metadata'

const Header = () => {
    const { title } = useSiteMetadata()
    return (
        <React.Fragment>
            <Box
                sx={{
                    pt: 2,
                    pb: 3,
                    alignSelf: 'center'
                }}>
                <ThemeUILink variant='logo' as={Link} to='/'>
                    <Heading
                        as='h1'
                        sx={{
                            fontSize: [6, 7, 8]
                        }}>
                        {title}
                    </Heading>
                </ThemeUILink>
            </Box>
        </React.Fragment>
    )
}
export default Header
