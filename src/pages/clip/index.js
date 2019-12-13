/** @jsx jsx */
import { Heading } from '@theme-ui/components'
import { jsx } from 'theme-ui'
import Layout from '../../components/layout/layout'

// export const Clip = ({ location: { state } }) => {
const Clip = ({ location: { state } }) => {
    console.log(state)
    return (
        <Layout>
            <Heading>Clip</Heading>
        </Layout>
    )
}

export default Clip
