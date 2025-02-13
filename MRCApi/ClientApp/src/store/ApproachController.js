import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    filter: [],
    getDetail: [],
    fileExport: []
}
export const actionCreatorsApproach = {
    Filter: (data) => async (dispatch, getState) => {
        const url = URL + 'Approach/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const filter = await response.json();
        dispatch({ type: 'POST_FILTER_Approach', filter });
    },
    GetDetail: (id) => async (dispatch, getState) => {
        const url = URL + 'Approach/GetDetail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': id
            },
        };
        const response = await fetch(url, requestOptions);
        const getDetail = await response.json();
        dispatch({ type: 'POST_Detail_Approach', getDetail });
    },
    Exports: (data) => async (dispatch, getState) => {
        const url = URL + 'Approach/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const fileExport = await response.json();
        dispatch({ type: 'POST_EXPORT_Approach', fileExport });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'POST_FILTER_Approach': {
            return {
                ...state,
                filter: action.filter,
            }
        }
        case 'POST_Detail_Approach': {
            return {
                ...state,
                getDetail: action.getDetail,
            }
        }
        case 'POST_EXPORT_Approach': {
            return {
                ...state,
                fileExport: action.fileExport,
            }
        }
        default:
            return state;
    }
}