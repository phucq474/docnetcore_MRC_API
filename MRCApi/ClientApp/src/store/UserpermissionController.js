import { URL,getToken } from '../Utils/Helpler';
const initialState = {
    
}
export const UserPermission = {
    Getposition: () => async (dispatch, getState) => {
        const url = URL + 'menu/getposition';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const positionlists = await response.json();
        dispatch({ type: 'GET_LIST_POSITION', positionlists });
    }
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LIST_POSITION':
            {
                return {
                    ...state,
                    positionlists: action.positionlists,
                    loading: false,
                    forceReload: false
                }
            }
        default:
                return state;
    }
}