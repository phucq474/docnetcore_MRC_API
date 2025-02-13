import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    list: [],
}
export const AccountCreateAction = {
    GetList: () => async (dispatch, getState) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
        };
        const response = await fetch(`${URL}account/getlist`, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_LIST', result });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LIST': {
            return {
                list: action.result,
            }
        }
        default:
            return state;
    }
}