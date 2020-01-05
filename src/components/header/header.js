/** @jsx jsx */
import {
    Box,
    Container,
    Flex,
    Heading,
    Link as ThemeUILink
} from '@theme-ui/components'
import { Link } from 'gatsby'
import Headroom from 'react-headroom'
import { jsx } from 'theme-ui'
import BackButton from '../../components/back-button/back-button'
import { useSiteMetadata } from '../../hooks/use-site-metadata'
import ThemeToggleButton from '../theme-toggle-button/theme-toggle-button'

export const Header = () => {
    const { title } = useSiteMetadata()
    return (
        <Headroom
            sx={{
                m: 0,
                p: 0,
                '& div.headroom': {
                    backgroundColor: 'background'
                }
            }}>
            <Box as='header'>
                <Container>
                    <Flex
                        sx={{
                            py: 3,
                            px: 3,
                            justifyContent: 'space-between'
                        }}>
                        <Box
                            sx={{
                                alignSelf: 'center',
                                minWidth: 'header.button'
                            }}>
                            <BackButton sx={{ fontSize: 5 }} />
                        </Box>
                        <Box
                            sx={{
                                alignSelf: 'center'
                            }}>
                            <ThemeUILink
                                sx={{ variant: 'links.logo' }}
                                as={Link}
                                to='/'>
                                <Heading
                                    as='h1'
                                    sx={{
                                        fontSize: [6, 7, 8]
                                    }}>
                                    {title}
                                </Heading>
                            </ThemeUILink>
                        </Box>
                        <Box
                            sx={{
                                alignSelf: 'center',
                                minWidth: 'header.button'
                            }}>
                            <ThemeToggleButton sx={{ fontSize: 3 }} />
                        </Box>
                    </Flex>
                </Container>
            </Box>
        </Headroom>
    )
}
