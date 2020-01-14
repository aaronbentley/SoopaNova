/** @jsx jsx */
/**
 * Stacks.io Screenshot
 *
 * @export Screenshot
 */
import { Box, Flex, Heading, Text } from '@theme-ui/components'
import React from 'react'
import FilePlayer from 'react-player/lib/players/FilePlayer'
import { jsx } from 'theme-ui'
import { useApp } from '../../data/app-context'
import { formatMegabytes } from '../../utils/data-utils'
import { formatDate } from '../../utils/date-utils'
import DropdownButton from '../dropdown-button/dropdown-button'

const Clip = props => {
    const {
        titleName = '',
        gameClipUris: [{ uri: movieSrc = '', fileSize = 0 }],
        // thumbnails: [{ fileSize: movieFileSize = 0, uri: movieThumbSrc = '' }],
        dateRecorded = '',
        durationInSeconds = 0
    } = props

    const [state] = useApp()
    const { gamertag = '' } = state

    return (
        <React.Fragment>
            <Box
                sx={{
                    pt: 1,
                    px: 1,
                    pb: 0,
                    m: 0,
                    background: ({ colors }) =>
                        `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`,
                    borderRadius: 2
                }}>
                <FilePlayer
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
                    {/* <Button
                        // eslint-disable-next-line quotes
                        onClick={() => alert("It's on my TODO list 📝")}
                        sx={{
                            fontSize: 4,
                            variant: 'buttons.outline.secondary'
                        }}>
                        Post...
                    </Button>
                    */}
                </Flex>
            </Flex>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                Created by {gamertag}
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {durationInSeconds}s
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatMegabytes(fileSize)}
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatDate(dateRecorded)}
            </Text>
        </React.Fragment>
    )
}

export default Clip
