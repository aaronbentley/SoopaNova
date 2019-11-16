// import { FirebaseContext } from 'gatsby-plugin-firebase'
// import React from 'react'
// / const firebase = React.useContext(FirebaseContext)

export const isBrowser = () => typeof window !== 'undefined'

export const getUser = () =>
    isBrowser() && window.localStorage.getItem('stacks.io.user')
        ? JSON.parse(window.localStorage.getItem('stacks.io.user'))
        : {}

const setUser = user =>
    window.localStorage.setItem('stacks.io.user', JSON.stringify(user))

// export const handleLogin = async () => {
//     const provider = new firebase.auth.GoogleAuthProvider()
//     const result = await firebase.auth().signInWithPopup(provider)
//     console.log({ result })
//     return setUser(result.user)

//     // return false
// }

export const handleLogin = ({ username, password }) => {
    if (username === 'john' && password === 'pass') {
        return setUser({
            username: 'john',
            name: 'Johnny',
            email: 'johnny@example.org'
        })
    }

    return false
}

export const isLoggedIn = () => {
    const user = getUser()

    return !!user.username
}

export const logout = callback => {
    setUser({})
    callback()
}
