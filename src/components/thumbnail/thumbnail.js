/** @jsx jsx */
/**
 * Stacks.io Thumbnail
 *
 * @export Thumbnail
 */
import { Box, Card, Flex, Heading, Spinner } from '@theme-ui/components'
import { navigate } from 'gatsby'
import { useRef } from 'react'
import Image from 'react-image'
import { jsx } from 'theme-ui'
import LazyPlaceholderSVG from '../../assets/lazy-placeholder.svg'
import { useOnScreen } from '../../hooks/use-on-screen'

const Thumbnail = ({ item }) => {
    // console.log('TCL: item', item)
    const ref = useRef()
    const onScreen = useOnScreen(ref, '-50px')

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
                    // console.log(item)
                    navigate(`/app/media/${id}`, {
                        state: item
                    })
                }}
                sx={{
                    cursor: 'pointer',
                    p: 1,
                    m: 3,
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
                        loader={<Spinner />}
                    />
                    <Box
                        sx={{
                            px: 3
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
