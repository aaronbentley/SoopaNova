/** @jsx jsx */
/**
 * Stacks.io ThemeToggleButton
 *
 * @export ThemeToggleButton
 */
// import { faPencilPaintbrush } from '@fortawesome/pro-duotone-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Flex } from '@theme-ui/components'
import capitalize from 'capitalize'
import { jsx, useColorMode, useThemeUI } from 'theme-ui'

const ThemeToggleButton = props => {
    // Get default theme and spread color mode keys
    const context = useThemeUI()
    const {
        theme: {
            initialColorMode = '',
            colors: { modes = {} }
        }
    } = context
    const colorModeKeys = [initialColorMode, ...Object.keys(modes)]
    const [colorMode, setColorMode] = useColorMode()

    return (
        <Flex
            sx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                position: 'relative'
            }}>
            <Button
                onClick={() => {
                    const index = colorModeKeys.indexOf(colorMode)
                    const next =
                        colorModeKeys[(index + 1) % colorModeKeys.length]
                    setColorMode(next)
                }}
                sx={{
                    variant: 'buttons.naked',
                    color: 'primary',
                    fontSize: 0,
                    position: 'absolute'
                }}
                {...props}>
                {capitalize(colorMode)}
            </Button>
            {/* <FontAwesomeIcon
                onClick={() => {
                    const index = colorModeKeys.indexOf(colorMode)
                    const next =
                        colorModeKeys[(index + 1) % colorModeKeys.length]
                    setColorMode(next)
                }}
                sx={{
                    color: 'primary',
                    position: 'relative',
                    transition: ({ durations }) => `color ${durations[0]} ease`,
                    ':hover': {
                        color: 'secondary'
                    }
                }}
                icon={faPencilPaintbrush}
                {...props}
            /> */}
        </Flex>
    )
}

export default ThemeToggleButton
