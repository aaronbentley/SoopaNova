/* eslint-disable indent */
/**
 * Stacks.io App Reducer
 *
 * @export AppReducer
 */

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return {
                ...state,
                results: [],
                query: '',
                gamertag: ''
            }
        }
        case 'toggleLoading': {
            return { ...state, loading: !state.loading }
        }
        case 'setGamertag': {
            return {
                ...state,
                gamertag: action.payload
            }
        }
        case 'setMediaType': {
            return {
                ...state,
                mediaType: action.payload
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
                query: ''
            }
        }
        default: {
            return state
        }
    }
}
