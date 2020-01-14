/** @jsx jsx */
/**
 * Stacks.io Screenshot
 *
 * @export Screenshot
 */
import { Box, Flex, Heading, Text } from '@theme-ui/components'
import React from 'react'
import Image from 'react-image'
import { jsx } from 'theme-ui'
import { useApp } from '../../data/app-context'
import { formatMegabytes } from '../../utils/data-utils'
import { formatDate } from '../../utils/date-utils'
import { AspectRatioSpinnerLoader } from '../aspect-ratio-spinner-loader/aspect-ratio-spinner-loader'
// import { AspectRatioLoader } from '../aspect-ratio-loader/aspect-ratio-loader'
import DropdownButton from '../dropdown-button/dropdown-button'

const Screenshot = props => {
    const {
        resolutionHeight = '',
        resolutionWidth = '',
        titleName = '',
        screenshotUris: [{ uri: imageSrc = '', fileSize = 0 }],
        dateTaken = ''
    } = props

    const [state] = useApp()
    const { gamertag = '' } = state

    return (
        <React.Fragment>
            <Box
                sx={{
                    pt: 2,
                    px: 2,
                    pb: 1,
                    m: 0,
                    background: ({ colors }) =>
                        `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})`,
                    borderRadius: 3
                }}>
                <Image
                    src={imageSrc}
                    sx={{
                        m: 0,
                        width: '100%'
                    }}
                    loader={<AspectRatioSpinnerLoader />}
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
                    <DropdownButton downloadURL={imageSrc} />
                    {/* <Button
                        // eslint-disable-next-line quotes
                        onClick={() => alert("It's on my TODO list 📝")}
                        sx={{
                            fontSize: 4,
                            variant: 'buttons.outline.secondary'
                        }}>
                        Post...
                    </Button> */}
                </Flex>
            </Flex>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                Created by {gamertag}
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {resolutionWidth}px x {resolutionHeight}px
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatMegabytes(fileSize)}
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatDate(dateTaken)}
            </Text>
        </React.Fragment>
    )
}

export default Screenshot
