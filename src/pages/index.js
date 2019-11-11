/** @jsx jsx */
import { Box } from '@theme-ui/components'
import React from 'react'
import { jsx } from 'theme-ui'

// <Layout>
//     <SEO title="Home" />
//     <h1>Hi people</h1>
//     <p>Welcome to your new Gatsby site.</p>
//     <p>Now go build something great.</p>
//     <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
//         <Image />
//     </div>
//     <Link to="/page-2/">Go to page 2</Link>
// </Layout>

const IndexPage = () => (
    <React.Fragment>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}>
            <Box
                sx={{
                    p: 3,
                }}>
                Header
            </Box>
            <Box
                sx={{
                    flex: '1 1 auto',
                    p: 3,
                }}>
                Content
            </Box>
            <Box
                sx={{
                    p: 3,
                }}>
                Footer
            </Box>
        </Box>
    </React.Fragment>
)

export default IndexPage
