/**
 * Stacks.io App Context
 *
 * @export AppProvider
 */

import PropTypes from 'prop-types'
import React, { createContext, useContext, useReducer } from 'react'
import { initialState } from './initial-state'
import { reducer } from './reducer'

// Create contexts
const AppStateContext = createContext()
const AppDispatchContext = createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

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

// export { AppProvider, useAppState, useAppDispatch, useApp }
export { AppProvider, useApp }

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
}
