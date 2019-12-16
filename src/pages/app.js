/** @jsx jsx */
import { Router } from '@reach/router'
import { jsx } from 'theme-ui'
import Layout from '../components/layout/layout'
import Clip from './app/clip'
import Screenshot from './app/screenshot'

const App = () => (
    <Layout>
        <Router>
            <Screenshot path='/app/screenshot/*' />
            <Clip path='/app/clip/*' />
        </Router>
    </Layout>
)
export default App
