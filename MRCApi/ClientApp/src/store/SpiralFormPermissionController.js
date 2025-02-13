
import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    list: [],
    permissions: [],
    updates: [],
    results: []
}
export const CreateActionSpiralFormPermission = {
    GetList: (data) => async (dispatch, getState) => {
        const url = URL + 'SpiralFormPermission/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_LIST_FORM', results });
    },
    GetById: data => async (dispatch, getState) => {
        const url = URL + 'SpiralFormPermission/GetById';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_GetById', results });
    },
    Update: data => async (dispatch, getState) => {
        const url = URL + 'SpiralFormPermission/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'POST_Update', results });
    },
}

export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LIST_FORM':
            {
                return {
                    ...state,
                    list: action.results,
                }
            }
        case 'GET_GetById':
            {
                return {
                    ...state,
                    permissions: action.results,
                }
            }
        case 'POST_Update':
            {
                return {
                    ...state,
                    updates: action.results,
                }
            }
        default:
            return state;
    }
}