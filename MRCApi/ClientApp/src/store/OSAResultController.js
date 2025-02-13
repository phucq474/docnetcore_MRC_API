import { getToken } from './../Utils/Helpler';
const initialState = {
    osaResults: [],
    osaDetail: [],
    fileExport: [],
    result: []
}
export const OSAResultActionCreators = {
    /// OSA-Result
    GetList: (JsonData, accId) => async (dispatch, getState) => {
        const url = '/OSAResults/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_GetList', result });
    },
    GetDetail: JsonData => async (dispatch, getState) => {
        const url = '/OSAResults/GetDetail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_GetDetail', result });
    },
    Export: (JsonData, accId) => async (dispatch, getState) => {
        const url = '/OSAResults/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_Export', result });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_GetList':
            {
                return {
                    ...state,
                    osaResults: action.result,
                }
            }
        case 'GET_GetDetail':
            {
                return {
                    ...state,
                    osaDetail: action.result,
                }
            }
        case 'GET_Export':
            {
                return {
                    ...state,
                    fileExport: action.result,
                }
            }
        default:
            return state;
    }
};