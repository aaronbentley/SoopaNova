/** @jsx jsx */
import { faChevronLeft } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Location, navigate } from '@reach/router'
import { jsx } from 'theme-ui'

const BackButton = props => (
    <Location>
        {({ location }) => {
            if (location.pathname === '/') {
                return null
            }
            return (
                <FontAwesomeIcon
                    onClick={() => navigate('/')}
                    icon={faChevronLeft}
                    sx={{
                        color: 'primary',
                        transition: ({ durations }) =>
                            `color ${durations[0]} ease`,
                        ':hover': {
                            color: 'secondary'
                        }
                    }}
                    {...props}/>
            )
        }}
    </Location>
)

export default BackButton
