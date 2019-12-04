/** @jsx jsx */
import { Box, Flex, Text } from '@theme-ui/components'
import { jsx } from 'theme-ui'
import { useSiteMetadata } from '../../hooks/use-site-metadata'

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
                <Text variant='body' sx={{ color: 'secondary', py: 1 }}>
                    &lt;{author}/&gt;
                </Text>
            </Box>
        </Flex>
    )
}
