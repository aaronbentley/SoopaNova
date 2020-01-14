/** @jsx jsx */
/**
 * Stacks.io Thumbnail
 *
 * @export Thumbnail
 */
import { Box, Card, Flex, Heading } from '@theme-ui/components'
import { navigate } from 'gatsby'
import { useRef } from 'react'
import Image from 'react-image'
import { jsx, useThemeUI } from 'theme-ui'
import LazyPlaceholderSVG from '../../assets/lazy-placeholder.svg'
import { useOnScreen } from '../../hooks/use-on-screen'
import { AspectRatioImageLoader } from '../aspect-ratio-image-loader/aspect-ratio-image-loader'

const Thumbnail = ({ item }) => {
    // Get space theme scale values
    const context = useThemeUI()
    const {
        theme: { space = [] }
    } = context

    // Flip spaces scale value to negative
    const ref = useRef()
    const onScreen = useOnScreen(ref, `${-Math.abs(space[2])}px`)

    // Get unique id depending on media type
    const id = item.screenshotId || item.gameClipId

    return (
        <Box
            ref={ref}
            sx={{
                width: ['100%', '50%', '33%', '25%']
            }}>
            <Card
                onClick={() => {
                    navigate(`/app/media/${id}`, {
                        state: item
                    })
                }}
                sx={{
                    cursor: 'pointer',
                    p: 1,
                    m: 2,
                    background: ({ colors }) =>
                        `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`,
                    borderRadius: 2
                }}>
                <Flex
                    sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Image
                        src={
                            onScreen
                                ? item.thumbnails[0].uri
                                : LazyPlaceholderSVG
                        }
                        sx={{
                            maxWidth: '100%',
                            mb: 2
                        }}
                        decode={false}
                        loader={<AspectRatioImageLoader />}
                    />
                    <Box
                        sx={{
                            px: 1
                        }}>
                        <Heading
                            as='h3'
                            sx={{
                                color: 'background',
                                mb: 2
                            }}>
                            {item.titleName}
                        </Heading>
                    </Box>
                </Flex>
            </Card>
        </Box>
    )
}

export default Thumbnail
