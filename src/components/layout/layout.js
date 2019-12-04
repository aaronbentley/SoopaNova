import { Box } from '@theme-ui/components'
import React from 'react'
import { Footer } from '../footer/footer'
import { Header } from '../header/header'

const Layout = ({ children }) => (
    <React.Fragment>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
            <Header />
            <Box
                sx={{
                    flex: '1 1 auto',
                    p: 3
                }}>
                {children}
            </Box>
            <Footer />
        </Box>
    </React.Fragment>
)
export default Layout
