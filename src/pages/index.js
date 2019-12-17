/** @jsx jsx */
import { Box, Button, Card, Close, Flex, Heading, Input, Label, Radio, Spinner } from '@theme-ui/components'
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
    const [mediaTypeLocalStorage, setmediaTypeLocalStorage] = useLocalStorage(
        'mediaTypeLocalStorage',
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
    const mediaTypeInitialState = () => {
        // console.log('🖼', mediaTypeLocalStorage)
        return mediaTypeLocalStorage || 'screenshots'
    }
    const resultsInitialState = () => {
        // console.log('🍬', mediaLocalStorage)
        return mediaLocalStorage || []
    }

    const [gamertag, setGamertag] = useState(gamertagInitialState)
    const [mediaType, setMediaType] = useState(mediaTypeInitialState)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState(resultsInitialState)
    const [loading, setLoading] = useState(false)

    useFirebase(
        firebase => {
            async function fetchData() {
                console.log('🔥')
                setResults([])
                setLoading(true)

                if (mediaType === 'screenshots') {
                    const getScreenshots = firebase
                        .functions()
                        .httpsCallable('getScreenshots')
                    const { data } = await getScreenshots({
                        gamertag
                    })
                    console.log(data)
                    const { screenshots = [] } = data
                    console.log(screenshots)
                    setResults(screenshots)
                    setmediaLocalStorage(screenshots)
                } else if (mediaType === 'clips') {
                    const getClips = firebase
                        .functions()
                        .httpsCallable('getClips')
                    const { data } = await getClips({
                        gamertag
                    })
                    console.log(data)
                    const { gameClips: clips = [] } = data
                    console.log(clips)
                    setResults(clips)
                    setmediaLocalStorage(clips)
                }
                setGamertagLocalStorage(gamertag)
                setmediaTypeLocalStorage(mediaType)
                setLoading(false)
            }
            if (query !== '') {
                fetchData()
            }
        },
        [query, mediaType]
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
                            as='h2'
                            sx={{
                                mb: 3,
                                fontSize: 5,
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
                            <Box sx={{ mb: 3, position: 'relative' }}>
                                <Input
                                    name='gamertag'
                                    placeholder='Gamertag'
                                    value={gamertag}
                                    onChange={e => setGamertag(e.target.value)}/>
                                {gamertag !== '' && (
                                    <Close
                                        type='button'
                                        onClick={() => {
                                            setGamertag('')
                                            setQuery('')
                                            setResults([])
                                            setGamertagLocalStorage('')
                                            setmediaLocalStorage([])
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            color: 'primary',
                                            right: 2,
                                            top: '20%',
                                            borderRadius: 8
                                        }}/>
                                )}
                            </Box>
                            <Flex
                                sx={{
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Label>
                                    <Radio
                                        name='mediaType'
                                        onChange={() =>
                                            setMediaType('screenshots')
                                        }
                                        value={mediaType === 'screenshots'}
                                        // defaultChecked={true}
                                        defaultChecked={
                                            mediaType === 'screenshots'
                                        }/>
                                    Screenshots
                                </Label>
                                <Label>
                                    <Radio
                                        onChange={() => setMediaType('clips')}
                                        name='mediaType'
                                        value={mediaType === 'clips'}
                                        defaultChecked={mediaType === 'clips'}/>
                                    Clips
                                </Label>
                            </Flex>
                            <Flex
                                sx={{
                                    justifyContent: 'center'
                                }}>
                                <Button
                                    disabled={gamertag === ''}
                                    sx={{
                                        variant: 'buttons.outline.primary',
                                        mt: 3,
                                        mb: 2,
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
                                        onClick={() => {
                                            // console.log(item)
                                            if (mediaType === 'screenshots') {
                                                navigate(
                                                    `/app/screenshot/${item.screenshotId}`,
                                                    {
                                                        state: item
                                                    }
                                                )
                                            } else if (mediaType === 'clips') {
                                                navigate(
                                                    `/app/clip/${item.gameClipId}`,
                                                    {
                                                        state: item
                                                    }
                                                )
                                            }
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
                                                src={item.thumbnails[0].uri}
                                                sx={{
                                                    maxWidth: '100%',
                                                    mb: 2
                                                }}
                                                loader={<Spinner />}/>
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
