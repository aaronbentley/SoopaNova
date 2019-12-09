/** @jsx jsx */
/**
 * Stacks.io Dropdown Button
 *
 * @export DropdownButton
 */
import {
    faChevronDown,
    faChevronRight
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Flex, Text } from '@theme-ui/components'
import { useRef, useState } from 'react'
import { jsx } from 'theme-ui'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

const DropDownMenu = () => (
    <Flex
        sx={{
            flexDirection: 'column',
            position: 'absolute',
            zIndex: 9999,
            width: '100%',
            mt: 0
        }}>
        <Box sx={{ p: 2, bg: 'primary', borderRadius: 2 }}>
            <Text
                // onClick={() => {
                //     // window.open(imageSrc, '_blank')

                // }}
                sx={{
                    variant: 'text.body',
                    color: 'background',
                    py: 2,
                    opacity: 0.4
                }}>
                Device
            </Text>
            <Text
                sx={{
                    variant: 'text.body',
                    color: 'background',
                    py: 2,
                    opacity: 0.4
                }}>
                OneDrive
            </Text>
            <Text
                sx={{
                    variant: 'text.body',
                    color: 'background',
                    py: 2,
                    opacity: 0.4
                }}>
                iCloud
            </Text>
            <Text
                sx={{
                    variant: 'text.body',
                    color: 'background',
                    py: 2,
                    opacity: 0.4
                }}>
                Google Drive
            </Text>
            <Text
                sx={{
                    variant: 'text.body',
                    color: 'background',
                    py: 2,
                    opacity: 0.4
                }}>
                DropBox
            </Text>
        </Box>
    </Flex>
)

const DropdownButton = props => {
    const ref = useRef()
    const [menuOpen, setMenuOpen] = useState(false)
    useOnClickOutside(ref, () => setMenuOpen(false))

    return (
        <Box css={{ position: 'relative' }}>
            <Button
                ref={ref}
                onClick={() => {
                    setMenuOpen(!menuOpen)
                }}
                sx={{
                    backgroundColor: menuOpen ? 'primary' : 'transparent',
                    color: menuOpen ? 'background' : 'inherit'
                }}
                {...props}>
                Export to
                <FontAwesomeIcon
                    sx={{
                        fontSize: 2
                    }}
                    fixedWidth
                    icon={menuOpen ? faChevronDown : faChevronRight}/>
            </Button>
            {menuOpen && <DropDownMenu />}
        </Box>
    )
}

export default DropdownButton
