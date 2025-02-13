const initialState = {
    FullName: '',
    Token: '',
    loading: false,
    errors: {},
    forceReload: false
}
export const actionCreators = {
    GetLogin:loginjson => async(dispatch, getState) => {
        dispatch({ type: 'GET_LOGIN', loginjson });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LOGIN':
            {
                return {
                    ...state,
                    FullName: action.FullName,
                    Token:action.Token,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        default:
            return state;
    }
};