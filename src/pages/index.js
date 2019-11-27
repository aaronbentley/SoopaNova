/** @jsx jsx */
import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Image,
    Input,
    Label,
    Text
} from '@theme-ui/components'
import { useFirebase } from 'gatsby-plugin-firebase'
import React, { useState } from 'react'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'

const IndexPage = () => {
    const [gamertag, setGamertag] = useState('')
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])

    useFirebase(
        firebase => {
            async function fetchData() {
                console.log('🔥')
                const getClips = firebase.functions().httpsCallable('getClips')
                const { data } = await getClips({
                    gamertag
                })
                // console.log(data)
                const { gameClips: clips = [] } = data
                console.log(clips)
                setResults(clips)

                // const getScreenshots = firebase
                //     .functions()
                //     .httpsCallable('getScreenshots')
                // const { data } = await getScreenshots({
                //     gamertag
                // })
                // // console.log(data)
                // const { screenshots = [] } = data
                // console.log(screenshots)
                // setResults(screenshots)
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
                            as="h1"
                            sx={{
                                mb: 3,
                                textAlign: 'center'
                            }}>
                            Find your Xbox media
                        </Heading>
                        <Box
                            as="form"
                            onSubmit={e => {
                                e.preventDefault()
                                // handleSubmit()
                                setQuery(gamertag)
                            }}>
                            <Label
                                htmlFor="gamertag"
                                sx={{
                                    visibility: 'hidden',
                                    height: 0
                                }}>
                                Gamertag
                            </Label>
                            <Input
                                name="gamertag"
                                value={gamertag}
                                onChange={e => setGamertag(e.target.value)}
                                sx={{ mb: 3 }}/>
                            <Flex
                                sx={{
                                    justifyContent: 'center'
                                }}>
                                <Button type="submit">Look me up</Button>
                            </Flex>
                        </Box>
                    </Box>
                </Flex>
                <Flex
                    sx={{
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                        // alignItems: 'center',
                        // justifyContent: 'center'
                    }}>
                    {results !== [] &&
                        results.map(item => {
                            return (
                                <Box
                                    key={item.screenshotId || item.gameClipId}
                                    sx={{
                                        width: ['100%', '33%', '25%']
                                    }}>
                                    <Card
                                        sx={{
                                            backgroundColor: 'secondary',
                                            p: 3,
                                            m: 3,
                                            borderRadius: 3
                                        }}>
                                        <Image src={item.thumbnails[0].uri} />
                                        <Text>{item.titleName}</Text>
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
