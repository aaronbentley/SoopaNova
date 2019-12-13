/** @jsx jsx */
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Input,
    Label,
    Spinner
} from '@theme-ui/components'
import { navigate } from 'gatsby'
import { useFirebase } from 'gatsby-plugin-firebase'
import React, { useState } from 'react'
import Image from 'react-image'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'
import { useLocalStorage } from '../hooks/use-local-storage'

const IndexPage = () => {
    // Load saved data from local storage on page load
    const [gamertagLocalStorage, setGamertagLocalStorage] = useLocalStorage(
        'gamertagLocalStorage',
        ''
    )
    const [mediaLocalStorage, setmediaLocalStorage] = useLocalStorage(
        'mediaLocalStorage',
        []
    )

    const gamertagInitialState = () => {
        // console.log('👩🏻‍🎤', gamertagLocalStorage)
        return gamertagLocalStorage || ''
    }
    const resultsInitialState = () => {
        // console.log('🌠', mediaLocalStorage)
        return mediaLocalStorage || []
    }

    const [gamertag, setGamertag] = useState(gamertagInitialState)
    // const [mediaType, setMediaType] = useState('screenshots')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(resultsInitialState)
    const [loading, setLoading] = useState(false)

    useFirebase(
        firebase => {
            async function fetchData() {
                console.log('🔥')
                setResults([])
                setLoading(true)

                //#region getClips
                // const getClips = firebase.functions().httpsCallable('getClips')
                // const { data } = await getClips({
                //     gamertag
                // })
                // // console.log(data)
                // const { gameClips: clips = [] } = data
                // console.log(clips)
                // setResults(clips)
                //#endregion

                const getScreenshots = firebase
                    .functions()
                    .httpsCallable('getScreenshots')
                const { data } = await getScreenshots({
                    gamertag
                })
                const { screenshots = [] } = data
                console.log(screenshots)
                setLoading(false)
                setResults(screenshots)

                setmediaLocalStorage(screenshots)
                setGamertagLocalStorage(gamertag)
            }
            if (query !== '') {
                fetchData()
            }
        },
        [query]
    )

    return (
        <React.Fragment>
            <Layout>
                <Flex
                    sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Box
                        sx={{
                            p: 2,
                            width: ['100%', '55%']
                        }}>
                        <Heading
                            as='h1'
                            sx={{
                                mb: 3,
                                textAlign: 'center'
                            }}>
                            Find your Xbox media
                        </Heading>
                        <Box
                            as='form'
                            onSubmit={e => {
                                e.preventDefault()
                                setQuery(gamertag)
                            }}>
                            <Label
                                htmlFor='gamertag'
                                sx={{
                                    visibility: 'hidden',
                                    height: 0
                                }}>
                                Gamertag
                            </Label>
                            <Input
                                name='gamertag'
                                placeholder='Gamertag'
                                value={gamertag}
                                onChange={e => setGamertag(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <Flex
                                sx={{
                                    justifyContent: 'center'
                                }}>
                                <Button
                                    disabled={gamertag === ''}
                                    sx={{
                                        variant: 'buttons.outline.primary',
                                        mt: 3,
                                        mb: 4,
                                        fontSize: 3
                                    }}
                                    type='submit'>
                                    Get Media
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                </Flex>
                {loading && (
                    <Flex sx={{ justifyContent: 'center', p: 3 }}>
                        <Spinner />
                    </Flex>
                )}
                <Flex
                    sx={{
                        flexWrap: 'wrap'
                    }}>
                    {results !== [] &&
                        results.map(item => {
                            return (
                                <Box
                                    key={item.screenshotId || item.gameClipId}
                                    sx={{
                                        width: ['100%', '50%', '33%', '25%']
                                    }}>
                                    <Card
                                        onClick={() =>
                                            navigate('/app/screenshot/', {
                                                // navigate('/screenshot', {
                                                state: item
                                            })
                                        }
                                        sx={{
                                            // p: 0,
                                            // m: 3,
                                            // backgroundColor: 'primary',
                                            //borderRadius: 2,
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
                                                src={item.thumbnails[0].uri}
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
                        })}
                </Flex>
            </Layout>
        </React.Fragment>
    )
}

export default IndexPage

// Media type radio buttons
// <Flex
//     sx={
//         {
//             // justifyContent: 'center'
//             // flexDirection: 'row'
//         }
//     }>
//     <Box>
//         <Label>
//             <Radio
//                 name='screenshots'
//                 value={
//                     mediaType === 'screenshots'
//                         ? 'true'
//                         : 'false'
//                 }
//                 onChange={() =>
//                     setMediaType('screenshots')
//                 }/>
//             Screenshots
//         </Label>
//         <Label>
//             <Radio
//                 name='clips'
//                 value={
//                     mediaType === 'clips'
//                         ? 'true'
//                         : 'false'
//                 }
//                 onChange={() =>
//                     setMediaType('clips')
//                 }/>
//             Clips
//         </Label>
//     </Box>
// </Flex>
