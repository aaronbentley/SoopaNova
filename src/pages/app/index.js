/** @jsx jsx */
import { Router } from '@reach/router'
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
import BackButton from '../../components/back-button/back-button'
import Layout from '../../components/layout/layout'
import { formatMegabytes } from '../../utils/data-utils'
import { formatDate } from '../../utils/date-utils'

const Screenshots = ({ location: { state } }) => {
    // console.log(state)

    const {
        // screenshotId = '',
        resolutionHeight = '',
        resolutionWidth = '',
        titleName = '',
        screenshotUris: [{ uri: imageSrc = '', fileSize = 0 }],
        // type = '',
        dateTaken = ''
    } = state

    return (
        <Container>
            <BackButton sx={{ background: 'red' }} />
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
                    }/>
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
                <Box>
                    <Button
                        sx={{
                            mr: 2,
                            mt: 2,
                            fontSize: 3,
                            variant: 'buttons.outline.primary'
                        }}
                        onClick={() => {
                            window.open(imageSrc, '_blank')
                        }}>
                        Export to...
                    </Button>
                    <Button
                        sx={{
                            fontSize: 3,
                            variant: 'buttons.outline.secondary'
                        }}>
                        Post to...
                    </Button>
                </Box>
            </Flex>
            <Text variant='body' sx={{ mb: 2, color: 'muted' }}>
                {resolutionWidth}px x {resolutionHeight}px
            </Text>
            <Text variant='body' sx={{ mb: 2 }}>
                {formatMegabytes(fileSize)}
            </Text>
            <Text variant='body' sx={{ mb: 2 }}>
                {formatDate(dateTaken)}
            </Text>
            <pre>{JSON.stringify(state, null, 2)}</pre>
        </Container>
    )
}
const Clips = () => <Heading>Clips</Heading>

const App = () => (
    <Layout>
        <Router>
            <Screenshots path='app/screenshot' />
            <Clips path='app/clip' />
        </Router>
    </Layout>
)
export default App
