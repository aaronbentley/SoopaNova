/**
 * Stacks.io App Context
 *
 * @export AppProvider
 */
import PropTypes from 'prop-types'
// import React, { createContext, useContext, useReducer } from 'react'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useLocalStorage } from '../hooks/use-local-storage'
import { initialState } from './app-initial-state'
import { AppReducer } from './app-reducer'

// Create contexts
const AppStateContext = createContext()
const AppDispatchContext = createContext()

const AppProvider = ({ children }) => {
    // Load data from localStorage
    // const [localState, setLocalState] = useLocalStorage('app-data', null)
    const [localState, setLocalState] = useLocalStorage(
        'app-data',
        initialState
    )

    // Set up state
    const [state, dispatch] = useReducer(AppReducer, localState)
    // const [state, dispatch] = useReducer(AppReducer, initialState)

    // Sync data to localStorage
    useEffect(() => {
        setLocalState(state)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    )
}

const useAppState = () => {
    const context = useContext(AppStateContext)
    if (!context) {
        throw new Error('useAppState must be used within an AppProvider')
    }
    return context
}

const useAppDispatch = () => {
    const context = useContext(AppDispatchContext)
    if (!context) {
        throw new Error('useAppDispatch must be used within an AppProvider')
    }
    return context
}

const useApp = () => {
    return [useAppState(), useAppDispatch()]
}

export { AppProvider, useApp }

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}
