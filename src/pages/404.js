/** @jsx jsx */
import { Flex, Heading, Text } from '@theme-ui/components'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'
import Link from '../components/link/link'
import SEO from '../components/seo/seo'

const NotFoundPage = () => (
    <Layout>
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <SEO title='404: Not found' />
            <Heading
                as='h2'
                sx={{
                    fontSize: 6
                }}>
                Nothing to see here buddy
            </Heading>
            <Text sx={{ variant: 'text.body', fontSize: 4, py: 4 }}>
                You just hit a route that doesn&#39;t exist... the sadness.
            </Text>
            <Link sx={{ variant: 'links.footer', fontSize: 4, py: 1 }} to='/'>
                Take me home, Country Roads
            </Link>
        </Flex>
    </Layout>
)

export default NotFoundPage
