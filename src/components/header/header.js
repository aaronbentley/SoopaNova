/** @jsx jsx */
import { Box, Text } from '@theme-ui/components'
import { Link, navigate } from 'gatsby'
import React from 'react'
import { jsx } from 'theme-ui'
import { getUser, isLoggedIn, logout } from '../../services/auth'

const Header = () => {
    const content = { message: '', login: true }
    if (isLoggedIn()) {
        content.message = `Hello, ${getUser().name}`
    } else {
        content.message = 'You are not logged in'
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    p: 3,
                }}>
                <Text>{content.message}</Text>
                <Link to="/">Home</Link>
                <Link to="/app/profile">Profile</Link>
                {isLoggedIn() ? (
                    <a
                        href="/"
                        onClick={event => {
                            event.preventDefault()
                            logout(() => navigate('/app/login'))
                        }}>
                        Logout
                    </a>
                ) : null}
                {/* <Link to="/">Logout</Link> */}
            </Box>
        </React.Fragment>
    )
}
export default Header
