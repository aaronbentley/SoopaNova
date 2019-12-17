/** @jsx jsx */
/**
 * Stacks.io Dropdown Button
 *
 * @export DropdownButton
 */
import {
    faApple,
    faDropbox,
    faGoogleDrive,
    faMicrosoft
} from '@fortawesome/free-brands-svg-icons'
import {
    faChevronDown,
    faChevronRight,
    faFileDownload
} from '@fortawesome/pro-duotone-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, Flex } from '@theme-ui/components'
import { useRef, useState } from 'react'
import { jsx } from 'theme-ui'
import { useOnClickOutside } from '../../hooks/use-on-click-outside'

const DropdownButton = props => {
    const { downloadURL = '' } = props
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
                    mr: 2,
                    fontSize: 4,
                    variant: 'buttons.outline.primary',
                    backgroundColor: menuOpen ? 'primary' : 'transparent',
                    color: menuOpen ? 'background' : 'primary'
                }}
                {...props}>
                Export to
                <FontAwesomeIcon
                    sx={{
                        fontSize: 2
                    }}
                    fixedWidth
                    icon={menuOpen ? faChevronDown : faChevronRight}
                />
            </Button>
            {menuOpen && (
                <Flex
                    ref={ref}
                    sx={{
                        flexDirection: 'column',
                        position: 'absolute',
                        zIndex: 9999,
                        width: '100%'
                    }}>
                    <Box sx={{ p: 1, mr: 2, bg: 'primary', borderRadius: 3 }}>
                        <Button
                            onClick={() => {
                                console.log(downloadURL)
                                window.open(downloadURL, '_blank')
                            }}
                            sx={{
                                variant: 'buttons.dropdown',
                                color: 'background'
                            }}>
                            <FontAwesomeIcon
                                sx={{ mr: 2 }}
                                icon={faFileDownload}
                                fixedWidth
                            />
                            Device
                        </Button>
                        <Button
                            disabled={true}
                            sx={{
                                variant: 'buttons.dropdown',
                                color: 'background'
                            }}>
                            <FontAwesomeIcon
                                sx={{ mr: 2 }}
                                icon={faMicrosoft}
                                fixedWidth
                            />
                            OneDrive
                        </Button>
                        <Button
                            disabled={true}
                            sx={{
                                variant: 'buttons.dropdown',
                                color: 'background'
                            }}>
                            <FontAwesomeIcon
                                sx={{ mr: 2 }}
                                icon={faApple}
                                fixedWidth
                            />
                            iCloud
                        </Button>
                        <Button
                            disabled={true}
                            sx={{
                                variant: 'buttons.dropdown',
                                color: 'background'
                            }}>
                            <FontAwesomeIcon
                                sx={{ mr: 2 }}
                                icon={faGoogleDrive}
                                fixedWidth
                            />
                            Google Drive
                        </Button>
                        <Button
                            disabled={true}
                            sx={{
                                variant: 'buttons.dropdown',
                                color: 'background'
                            }}>
                            <FontAwesomeIcon
                                sx={{ mr: 2 }}
                                icon={faDropbox}
                                fixedWidth
                            />
                            DropBox
                        </Button>
                    </Box>
                </Flex>
            )}
        </Box>
    )
}

export default DropdownButton
