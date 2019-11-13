import { navigate } from 'gatsby'
import React, { useState } from 'react'
// import { isLoggedIn } from '../../services/auth'

const Login = () => {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    })

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

    const handleUpdate = event => {
        event.persist()
        setInputs(() => ({
            ...inputs,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = event => {
        if (event) {
            event.preventDefault()
        }
        console.log({ inputs })
    }

    return (
        <React.Fragment>
            <h1>Log in</h1>
            <form
                method="post"
                onSubmit={event => {
                    handleSubmit(event)
                    navigate('/app/profile')
                }}>
                <label>
                    Username
                    <input
                        type="text"
                        name="username"
                        value={inputs.username}
                        onChange={event => {
                            handleUpdate(event)
                        }}/>
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={inputs.password}
                        onChange={event => {
                            handleUpdate(event)
                        }}/>
                </label>
                <input type="submit" value="Log In" />
            </form>
        </React.Fragment>
    )
}

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

export default Login
