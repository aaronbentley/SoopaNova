export const reducer = (state, action) => {
    switch (action.type) {
        case 'reset': {
            return {
                ...state,
                results: [],
                query: ''
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
                results: action.payload
            }
        }
        default: {
            return state
        }
    }
}
