/** @jsx jsx */
import {
    Box,
    Button,
    Close,
    Flex,
    Heading,
    Input,
    Label,
    Radio,
    Spinner
} from '@theme-ui/components'
import { useFirebase } from 'gatsby-plugin-firebase'
import React from 'react'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'
import Thumbnail from '../components/thumbnail/thumbnail'
import { useApp } from '../data/app-context'

const IndexPage = () => {
    //TODO: load/save query from localstorage too!!!!!!!!!
    // Load saved data from local storage on page load
    // const [gamertagLocalStorage, setGamertagLocalStorage] = useLocalStorage(
    //     'gamertagLocalStorage',
    //     ''
    // )
    // const [mediaTypeLocalStorage, setmediaTypeLocalStorage] = useLocalStorage(
    //     'mediaTypeLocalStorage',
    //     ''
    // )
    // const [mediaLocalStorage, setmediaLocalStorage] = useLocalStorage(
    //     'mediaLocalStorage',
    //     []
    // )

    // const gamertagInitialState = () => {
    //     // console.log('👩🏻‍🎤', gamertagLocalStorage)
    //     return gamertagLocalStorage || ''
    // }
    // const mediaTypeInitialState = () => {
    //     // console.log('🖼', mediaTypeLocalStorage)
    //     return mediaTypeLocalStorage || 'screenshots'
    // }
    // const resultsInitialState = () => {
    //     // console.log('🍬', mediaLocalStorage)
    //     return mediaLocalStorage || []
    // }

    // const [gamertag, setGamertag] = useState(gamertagInitialState)
    // const [mediaType, setMediaType] = useState(mediaTypeInitialState)
    // const [query, setQuery] = useState('')
    // const [results, setResults] = useState(resultsInitialState)
    // const [loading, setLoading] = useState(false)

    const [state, dispatch] = useApp()
    const { gamertag, mediaType, query, results, loading } = state
    // console.log('TCL: IndexPage -> state', state)
    // console.log('TCL: IndexPage -> dispatch', dispatch)

    useFirebase(
        firebase => {
            async function fetchData() {
                console.log('🔥')
                // setResults([])
                // setLoading(true)
                dispatch({
                    type: 'reset'
                })
                dispatch({
                    type: 'toggleLoading'
                })

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
                    // setResults(screenshots)

                    dispatch({ type: 'setResults', payload: screenshots })

                    // setmediaLocalStorage(screenshots)
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
                    // setResults(clips)

                    dispatch({ type: 'setResults', payload: clips })

                    // setmediaLocalStorage(clips)
                }
                // setGamertagLocalStorage(gamertag)
                // setmediaTypeLocalStorage(mediaType)
                // setLoading(false)
                dispatch({
                    type: 'toggleLoading'
                })
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
                                dispatch({
                                    type: 'setQuery',
                                    payload: gamertag
                                })
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
                                    onChange={e =>
                                        dispatch({
                                            type: 'setGamertag',
                                            payload: e.target.value
                                        })
                                    }
                                />
                                {gamertag !== '' && (
                                    <Close
                                        type='button'
                                        onClick={() => {
                                            dispatch({
                                                type: 'reset'
                                            })
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            color: 'primary',
                                            right: 2,
                                            top: '20%',
                                            borderRadius: 8
                                        }}
                                    />
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
                                            dispatch({
                                                type: 'setMediaType',
                                                payload: 'screenshots'
                                            })
                                        }
                                        value={mediaType === 'screenshots'}
                                        defaultChecked={
                                            mediaType === 'screenshots'
                                        }
                                    />
                                    Screenshots
                                </Label>
                                <Label>
                                    <Radio
                                        onChange={() =>
                                            dispatch({
                                                type: 'setMediaType',
                                                payload: 'clips'
                                            })
                                        }
                                        name='mediaType'
                                        value={mediaType === 'clips'}
                                        defaultChecked={mediaType === 'clips'}
                                    />
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
                                <Thumbnail
                                    item={item}
                                    key={item.screenshotId || item.gameClipId}
                                />
                            )
                        })}
                </Flex>
            </Layout>
        </React.Fragment>
    )
}

export default IndexPage
