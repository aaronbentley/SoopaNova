/** @jsx jsx */
import { Box, Flex } from '@theme-ui/components'
import { jsx } from 'theme-ui'
import { useSiteMetadata } from '../../hooks/use-site-metadata'
import Link from '../link/link'

export const Footer = () => {
    const { author } = useSiteMetadata()
    return (
        <Flex
            sx={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Box
                sx={{
                    p: 3
                }}>
                <Link
                    target='_blank'
                    rel='noopener'
                    to={`https://twitter.com/${author}`}
                    sx={{ variant: 'links.footer', py: 1 }}>
                    &lt;{author}/&gt;
                </Link>
            </Box>
        </Flex>
    )
}
