/** @jsx jsx */
/**
 * Stacks.io ThemeToggleButton
 *
 * @export ThemeToggleButton
 */
import { faAdjust } from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flex } from '@theme-ui/components'
import { jsx, useColorMode } from 'theme-ui'

const ThemeToggleButton = props => {
    const [colorMode, setColorMode] = useColorMode()

    return (
        <Flex
            sx={{
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
            <FontAwesomeIcon
                onClick={() =>
                    setColorMode(colorMode === 'dark' ? 'light' : 'dark')
                }
                swapOpacity={colorMode === 'dark' ? true : false}
                sx={{
                    color: 'primary',
                    transition: ({ durations }) => `color ${durations[0]} ease`,
                    ':hover': {
                        color: 'secondary'
                    }
                }}
                icon={faAdjust}
                {...props}/>
        </Flex>
    )
}

export default ThemeToggleButton
