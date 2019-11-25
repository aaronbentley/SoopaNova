/** @jsx jsx */
import { Heading, Text } from '@theme-ui/components'
// import XboxLiveAPI from '@xboxreplay/xboxlive-api'
import { Link } from 'gatsby'
import React from 'react'
import { jsx } from 'theme-ui'
import Layout from '../../components/layout/layout'
import { getUser, isLoggedIn } from '../../services/auth'

const Login = () => (
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

export default Login

// import { Button } from '@theme-ui/components'
// import React from 'react'
// // import { handleLogin } from '../../services/auth'

// export const Login = () => {
//     // const [user, setUser] = React.useState({
//     //     displayName: ''
//     // })

//     // const firebase = React.useContext(FirebaseContext)

//     // const loginGoogle = async () => {
//     // handleLogin()
//     // setUser(getUser().displayName)
//     // }

//     // const loginGoogle = async () => {
//     //     const provider = new firebase.auth.GoogleAuthProvider()
//     //     const result = await firebase.auth().signInWithPopup(provider)
//     //     console.log({ result })
//     //     setUser(result.user)
//     // }

//     // useFirebase(async firebase => {
//     //     const provider = new firebase.auth.GoogleAuthProvider()
//     //     const result = await firebase.auth().signInWithPopup(provider)
//     //     console.log({ result })
//     //     setUser(result.user)
//     // }, [])

//     // {
//     //     user.displayName !== '' ? (
//     //         navigate('/app/profile')
//     //     ) : (
//     //         <Heading>Hello {user.displayName || 'there'}</Heading>
//     //     )
//     // }

//     return (
//         <React.Fragment>
//             {/* <Heading>Hello {user.displayName || 'there'}</Heading> */}
//             <Button sx={{ color: 'white' }}>
//                 Login with Google
//             </Button>
//         </React.Fragment>
//     )
// }

//#region  NO WORKEY
// const [inputs, setInputs] = useState({
//     username: '',
//     password: ''
// })

// return <Button onPress={() => {}}>Log in</Button>

// const foo = firebase
// // console.log(foo)

// const { user, isInitialized, isLoggedIn } = useAuth()
// console.log(user)

// useFirebase(firebase => {
//     // const provider = firebase.auth.GoogleAuthProvider()
//     // firebase.auth().signInWithPopup(provider)

//     // const user = firebase.useAuth().isLoggedIn
//     // console.log(user)

//     // firebase.useAuth()
//     // console.log(firebase)
//     // const [setUser, setIsInitialized, isInitialized] = firebase.auth()

//     // var defaultAuth = firebase.auth()
//     // console.log(defaultAuth)

//     const foo = firebase
//     console.log(foo);

// })

// const handleUpdate = event => {
//     event.persist()
//     setInputs(() => ({
//         ...inputs,
//         [event.target.name]: event.target.value
//     }))
// }

// const handleSubmit = event => {
//     if (event) {
//         event.preventDefault()
//     }
//     console.log({ inputs })
// }

// return (
//     <React.Fragment>
//         <h1>Log in</h1>
//         <form
//             method="post"
//             onSubmit={event => {
//                 handleSubmit(event)
//                 navigate('/app/profile')
//             }}>
//             <label>
//                 Username
//                 <input
//                     type="text"
//                     name="username"
//                     value={inputs.username}
//                     onChange={event => {
//                         handleUpdate(event)
//                     }}/>
//             </label>
//             <label>
//                 Password
//                 <input
//                     type="password"
//                     name="password"
//                     value={inputs.password}
//                     onChange={event => {
//                         handleUpdate(event)
//                     }}/>
//             </label>
//             <input type="submit" value="Log In" />
//         </form>
//     </React.Fragment>
// )
//#endregion

//#region Class based example
// class Login extends React.Component {
//     state = {
//         username: '',
//         password: ''
//     }

//     handleUpdate = event => {
//         this.setState({
//             [event.target.name]: event.target.value
//         })
//     }

//     handleSubmit = event => {
//         event.preventDefault()
//         // handleLogin(this.state)
//         useFirebase(firebase => {
//             const provider = firebase.auth.GoogleAuthProvider()
//             firebase.auth().signInWithPopup(provider)
//         })
//     }

//     render() {
//         if (isLoggedIn()) {
//             navigate('/app/profile')
//         }

//         return (
//             <React.Fragment>
//                 <h1>Log in</h1>
//                 <form
//                     method="post"
//                     onSubmit={event => {
//                         this.handleSubmit(event)
//                         navigate('/app/profile')
//                     }}>
//                     <label>
//                         Username
//                         <input
//                             type="text"
//                             name="username"
//                             onChange={this.handleUpdate}/>
//                     </label>
//                     <label>
//                         Password
//                         <input
//                             type="password"
//                             name="password"
//                             onChange={this.handleUpdate}/>
//                     </label>
//                     <input type="submit" value="Log In" />
//                 </form>
//             </React.Fragment>
//         )
//     }
// }
//#endregion

// export default Login
