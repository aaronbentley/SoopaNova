import { Heading, Text } from '@theme-ui/components'
import React from 'react'
import { getUser } from '../../services/auth'

const Profile = () => (
    <React.Fragment>
        <Heading>Your profile</Heading>
        <Text>Name: {getUser().name}</Text>
        <Text>E-mail: {getUser().email}</Text>
    </React.Fragment>
)
export default Profile
