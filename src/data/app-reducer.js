/* eslint-disable indent */
/**
 * Stacks.io App Reducer
 *
 * @export AppReducer
 */
import { initialState } from './app-initial-state'

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return {
                ...state,
                ...initialState
            }
        }
        case 'toggleLoading': {
            return { ...state, loading: !state.loading }
        }
        case 'setGamertag': {
            return {
                ...state,
                gamertag: action.payload,
                error: false,
                errorMessage: ''
            }
        }
        case 'setMediaType': {
            return {
                ...state,
                mediaType: action.payload,
                error: false,
                errorMessage: ''
            }
        }
        case 'setQuery': {
            return {
                ...state,
                query: action.payload
            }
        }
        case 'setResults': {
            return {
                ...state,
                results: action.payload,
                // Reset to avoid void api calss on <- goinng back from media
                query: ''
                // error: false,
                // errorMessage: ''
            }
        }
        case 'setError': {
            return {
                ...state,
                error: action.payload.error,
                errorMessage: action.payload.errorMessage
            }
        }
        default: {
            return state
        }
    }
}
