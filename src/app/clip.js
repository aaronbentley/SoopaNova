/** @jsx jsx */
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Text
} from '@theme-ui/components'
import ReactPlayer from 'react-player'
import { jsx } from 'theme-ui'
import DropdownButton from '../components/dropdown-button/dropdown-button'
import { formatMegabytes } from '../utils/data-utils'
import { formatDate } from '../utils/date-utils'

const Clip = ({ location: { state } }) => {
    // console.log(state)
    const {
        titleName = '',
        gameClipUris: [{ uri: movieSrc = '', fileSize = 0 }],
        // thumbnails: [{ fileSize: movieFileSize = 0, uri: movieThumbSrc = '' }],
        dateRecorded = '',
        durationInSeconds = 0
    } = state

    return (
        <Container>
            <Box
                sx={{
                    p: 3,
                    m: 0,
                    background: ({ colors }) =>
                        `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`,
                    borderRadius: 3
                }}>
                <ReactPlayer
                    playing
                    muted
                    controls
                    pip
                    sx={{
                        maxWidth: '100%'
                    }}
                    width='100%'
                    height='100%'
                    url={movieSrc}
                />
            </Box>
            <Flex
                sx={{
                    alignItems: 'center',
                    my: 3,
                    justifyContent: 'space-between',
                    flexWrap: 'wrap'
                }}>
                <Heading
                    as='h2'
                    sx={{
                        fontSize: 6
                    }}>
                    {titleName}
                </Heading>
                <Flex
                    sx={{
                        my: [2, 0]
                    }}>
                    <DropdownButton downloadURL={movieSrc} />
                    <Button
                        onClick={() => alert("It's on my TODO list 📝")}
                        sx={{
                            fontSize: 4,
                            variant: 'buttons.outline.secondary'
                        }}>
                        Post...
                    </Button>
                </Flex>
            </Flex>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {durationInSeconds}s
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatMegabytes(fileSize)}
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatDate(dateRecorded)}
            </Text>
        </Container>
    )
}

export default Clip
