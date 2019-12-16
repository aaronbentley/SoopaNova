/** @jsx jsx */
import { Router } from '@reach/router'
import { jsx } from 'theme-ui'
import Clip from '../components/app/clip'
import Screenshot from '../components/app/screenshot'
import Layout from '../components/layout/layout'

const App = () => (
    <Layout>
        <Router>
            <Screenshot path='/app/screenshot/*' />
            <Clip path='/app/clip/*' />
        </Router>
    </Layout>
)
export default App
