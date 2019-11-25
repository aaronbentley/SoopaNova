/** @jsx jsx */
import { Box, Button, Flex, Heading, Input, Label } from '@theme-ui/components'
// import axios from 'axios'
// import Qs from 'qs'
// import { getUser } from '../data/api'
// import { getUser, isLoggedIn } from '../services/auth'
// import xla from 'async-xbox-live-api'
import React, { useState } from 'react'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'

// const fetchPreAuthData = async () => {
//     const response = await axios.get(
//         'https://login.live.com/oauth20_authorize.srf',
//         {
//             headers: {
//                 // host: 'login.live.com'
//             },
//             params: {
//                 client_id: '0000000048093EE3',
//                 redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
//                 response_type: 'token',
//                 display: 'touch',
//                 scope: 'service::user.auth.xboxlive.com::MBI_SSL',
//                 locale: 'en'
//             },
//             responseType: 'text',
//             paramsSerializer: params => {
//                 return unescape(Qs.stringify(params))
//             }
//         }
//     )
//     console.log(response)
// }

const IndexPage = () => {
    const [user, setUser] = useState('Cheeky Squeezes')

    // getUser('Cheeky Squeezes')

    const handleSubmit = async e => {
        console.log(user)
        // const foo = await getUser(user)
        // xla.username = process.env.GATSBY_MICROSOFT_ACCOUNT_USER
        // xla.password = process.env.GATSBY_MICROSOFT_ACCOUNT_PASSWORD

        // const xuid = await xla.getXuid('Cheeky Squeezes')
        // console.log(xuid)
    }

    const handleChange = e => {
        e.persist()
        const {
            target: { value = '' }
        } = e
        console.log(value)
        setUser(value)
    }

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
                                handleSubmit()
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
                                defaultValue={user}
                                onChange={handleChange}
                                sx={{ mb: 3 }}/>
                            <Flex
                                sx={{
                                    justifyContent: 'center'
                                }}>
                                <Button>Look me up</Button>
                            </Flex>
                            <Flex
                                sx={{
                                    justifyContent: 'center'
                                }}></Flex>
                        </Box>
                        {/* <Button sx={{ mt: 4 }} onClick={fetchPreAuthData}>
                            Fire Request
                            </Button> */}
                    </Box>
                </Flex>
            </Layout>
        </React.Fragment>
    )
}

export default IndexPage
