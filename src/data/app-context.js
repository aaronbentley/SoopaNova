/**
 * Stacks.io App Context
 *
 * @export AppProvider
 */

import PropTypes from 'prop-types'
// import React, { createContext, useCallback, useContext, useState } from 'react'
import React, { createContext } from 'react'

const defaultAppContext = false

const AppContext = createContext(defaultAppContext)

export const AppProvider = ({ children }) => {
    // const [menuOpenState, setMenuOpenState] = useState(defaultAppContext)

    return (
        <AppContext.Provider
            value={{
                foo: 'bar'
                // menuOpenState,
                // setMenuOpenState,
                // stateChangeHandler: newState => setMenuOpenState(newState)
            }}>
            {children}
        </AppContext.Provider>
    )
}

// const useApp = () => {
//     const context = useContext(AppContext)

//     if (!context) {
//         throw new Error('useApp must be used within an AppProvider')
//     }

//     // const { menuOpenState, setMenuOpenState, stateChangeHandler } = context
//     const { foo } = context

//     // const toggleMenu = useCallback(() => {
//     //     setMenuOpenState(!menuOpenState)
//     // }, [menuOpenState, setMenuOpenState])

//     return {
//         // menuOpenState,
//         // toggleMenu,
//         // stateChangeHandler
//         foo
//     }
// }

// export { AppProvider, useApp }

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}
