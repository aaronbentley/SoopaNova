/** @jsx jsx */
import { Box, Flex, Heading, Link as ThemeUILink } from '@theme-ui/components'
import { Link } from 'gatsby'
import Headroom from 'react-headroom'
import { jsx } from 'theme-ui'
import { useSiteMetadata } from '../../hooks/use-site-metadata'

export const Header = () => {
    const { title } = useSiteMetadata()
    return (
        <Headroom sx={{ m: 0, p: 0 }}>
            <Flex
                sx={{
                    pt: 2,
                    pb: 3,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background'
                }}>
                <Box
                    sx={{
                        pt: 2,
                        pb: 3
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
            </Flex>
        </Headroom>
    )
}
