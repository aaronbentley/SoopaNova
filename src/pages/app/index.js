import { Router } from '@reach/router'
import React from 'react'
import Layout from '../../components/layout/layout'
import Login from '../../components/login/login'
import PrivateRoute from '../../components/private-route/private-route'
import Profile from '../../components/profile/profile'

const App = () => (
    <Layout>
        <Router>
            <PrivateRoute path="/app/profile" component={Profile} />
            <Login path="/app/login" />
        </Router>
    </Layout>
)
export default App
