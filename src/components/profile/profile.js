import { Heading, Text } from '@theme-ui/components'
import { useFirebase } from 'gatsby-plugin-firebase'
import React from 'react'
// import { getUser } from '../../services/auth'

const Profile = () => {
    const [user, setUser] = React.useState()

    useFirebase(firebase => {
        console.log(firebase)
        // firebase
        //     .database()
        //     .ref("/user")
        //     .once("value")
        //     .then(snapshot => {
        //         setUser(snapshot.val())
        //     })
    }, [])

    return (
        <React.Fragment>
            <Heading as="h1" sx={{ color: 'primary' }}>
                Profile
            </Heading>
            <Text>Hello {user ? user.name : 'there'}</Text>
        </React.Fragment>
    )
}

export default Profile
