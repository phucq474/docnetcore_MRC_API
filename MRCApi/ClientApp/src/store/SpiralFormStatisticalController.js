
import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    statisticalList: [],
    detail: [],
    questionData: [],
    result: []
}
export const CreateActionSpiralFormStatistical = {
    GetList: (data) => async (dispatch, getState) => {
        const url = URL + 'SpiralFormStatistical/GetList';
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
        const url = URL + 'SpiralFormStatistical/GetById';
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
    GetByQuestion: data => async (dispatch, getState) => {
        const url = URL + 'SpiralFormStatistical/GetByQuestion';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_GetByQuestion', results });
    }
}

export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LIST_FORM':
            {
                return {
                    ...state,
                    statisticalList: action.results,
                }
            }
        case 'GET_GetById':
            {
                return {
                    ...state,
                    detail: action.results,
                }
            }
        case 'GET_GetByQuestion':
            {
                return {
                    ...state,
                    questionData: action.results,
                }
            }
        default:
            return state;
    }
}