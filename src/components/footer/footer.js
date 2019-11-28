/** @jsx jsx */
import { Box, Flex, Text } from '@theme-ui/components'
import { jsx } from 'theme-ui'

const Footer = () => (
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
            <Text variant='body' sx={{ color: 'highlight', py: 1 }}>
                &lt;@aaronbentley/&gt;
            </Text>
        </Box>
    </Flex>
)

export default Footer
