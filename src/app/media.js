/** @jsx jsx */
/**
 * Stacks.io Media Item
 *
 * @export Media
 */
import { jsx } from 'theme-ui'
import Clip from '../components/clip/clip'
import Screenshot from '../components/screenshot/screenshot'

const Media = ({ location: { state } }) => {
    // console.log(state)
    // Derive type of media by grabbing an id
    const { screenshotId = '', gameClipId = '' } = state
    if (screenshotId !== '') {
        return <Screenshot {...state} />
    } else if (gameClipId !== '') {
        return <Clip {...state} />
    }
}

export default Media
