/** @jsx jsx */
import { Heading, Text } from '@theme-ui/components'
import { Link } from 'gatsby'
import React from 'react'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'
import { getUser, isLoggedIn } from '../services/auth'

const IndexPage = () => (
    <React.Fragment>
        <Layout>
            <Heading as="h1" sx={{ color: 'secondary' }}>
                Hello {isLoggedIn() ? getUser().name : 'there'}!
            </Heading>
            <Text>
                {isLoggedIn() ? (
                    <React.Fragment>
                        You are logged in, so check your{' '}
                        <Link to="/app/profile">profile</Link>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        You should <Link to="/app/login">log in</Link> to see
                        restricted content
                    </React.Fragment>
                )}
            </Text>
        </Layout>
    </React.Fragment>
)

export default IndexPage
