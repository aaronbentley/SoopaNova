/** @jsx jsx */
/**
 * Stacks.io Screenshot
 *
 * @export Screenshot
 */
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Spinner,
    Text
} from '@theme-ui/components'
import Image from 'react-image'
import { jsx } from 'theme-ui'
import { formatMegabytes } from '../../utils/data-utils'
import { formatDate } from '../../utils/date-utils'
import DropdownButton from '../dropdown-button/dropdown-button'

const Screenshot = props => {
    const {
        resolutionHeight = '',
        resolutionWidth = '',
        titleName = '',
        screenshotUris: [{ uri: imageSrc = '', fileSize = 0 }],
        dateTaken = ''
    } = props

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
                <Image
                    src={imageSrc}
                    sx={{
                        maxWidth: '100%'
                    }}
                    loader={
                        <Flex sx={{ justifyContent: 'center', p: 3 }}>
                            <Spinner />
                        </Flex>
                    }
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
                    <Button
                        // eslint-disable-next-line quotes
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
                {resolutionWidth}px x {resolutionHeight}px
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatMegabytes(fileSize)}
            </Text>
            <Text sx={{ variant: 'text.body', mb: 2 }}>
                {formatDate(dateTaken)}
            </Text>
        </Container>
    )
}

export default Screenshot
