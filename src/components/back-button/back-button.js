/** @jsx jsx */
import { faChevronLeft } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { navigate } from '@reach/router'
import { jsx } from 'theme-ui'

const BackButton = () => (
    <FontAwesomeIcon
        onClick={() => navigate('/')}
        icon={faChevronLeft}
        sx={{ color: 'primary', fontSize: 6, mb: 3 }}/>
)

export default BackButton
