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
import { Box, Button, Flex, Link } from '@theme-ui/components'
import { useRef, useState } from 'react'
import { jsx } from 'theme-ui'
import { useOnClickOutside } from '../../hooks/use-on-click-outside'

const DropDownMenu = () => (
    <Flex
        sx={{
            flexDirection: 'column',
            position: 'absolute',
            zIndex: 9999,
            width: '100%'
        }}>
        <Box sx={{ p: 2, mr: 2, bg: 'primary', borderRadius: 2 }}>
            <Link
                // onClick={() => {
                //     // window.open(imageSrc, '_blank')

                // }}
                sx={{
                    variant: 'links.dropdown',
                    color: 'background',
                    py: 2
                }}>
                Device
            </Link>
            <Link
                disabled={'disabled'}
                sx={{
                    variant: 'links.dropdown',
                    color: 'background',
                    py: 2
                }}>
                OneDrive
            </Link>
            <Link
                sx={{
                    variant: 'links.dropdown',
                    color: 'background',
                    py: 2
                }}>
                iCloud
            </Link>
            <Link
                as='a'
                sx={{
                    variant: 'links.dropdown',
                    color: 'background',
                    py: 2
                }}>
                Google Drive
            </Link>
            <Link
                sx={{
                    variant: 'links.dropdown',
                    color: 'background',
                    py: 2
                }}>
                DropBox
            </Link>
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
