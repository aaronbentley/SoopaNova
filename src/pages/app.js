/** @jsx jsx */
import { Router } from '@reach/router'
import { jsx } from 'theme-ui'
// import Clip from '../app/clip'
import Media from '../app/media'
// import Screenshot from '../app/screenshot'
import Layout from '../components/layout/layout'

const App = () => (
    <Layout>
        <Router>
            {/* <Screenshot path='/app/screenshot/*' /> */}
            {/* <Clip path='/app/clip/*' /> */}
            <Media path='/app/media/*' />
        </Router>
    </Layout>
)
export default App
