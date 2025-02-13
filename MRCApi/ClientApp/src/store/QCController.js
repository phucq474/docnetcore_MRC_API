import { getToken } from './../Utils/Helpler';
const initialState = {
    loading: false,
    errors: {},
    forceReload: false,
    results: [],
    qcLists: [],
    qcDetails: [],
    qcKPI: [],
    kpiStatus: null,
    qcRawdata: []

}
export const actionCreatorsQC = {
    GetDynamic: JsonData => async (dispatch, getState) => {
        const url = '/QC/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_DYNAMIC', results });
    },
    GetDetail: JsonData => async (dispatch, getState) => {
        const url = '/QC/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_DETAIL', results });
    },
    GetByKPI: JsonData => async (dispatch, getState) => {
        const url = '/QC/GetByKPI';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_GetByKPI', results });
    },
    QCDetailUpdate: JsonData => async (dispatch, getState) => {
        const url = '/QC/QCDetail/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(JsonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'POST_QCDetailUpdate', results });
    },
    ExportRawdata: JSonData => async (dispatch, getState) => {
        const url = '/QC/Rawdata';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JSonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'EXPORT_RAWDATA', results });
    }

}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        /// Display Result
        case 'GET_DYNAMIC':
            {
                return {
                    ...state,
                    qcLists: action.results
                }
            }
        case 'GET_DETAIL':
            {
                return {
                    ...state,
                    qcDetails: action.results
                }
            }
        case 'GET_GetByKPI':
            {
                return {
                    ...state,
                    qcKPI: action.results
                }
            }
        case 'POST_QCDetailUpdate':
            {
                return {
                    ...state,
                    kpiStatus: action.results
                }
            }
        case 'EXPORT_RAWDATA':
            {
                return {
                    ...state,
                    qcRawdata: action.results
                }
            }
        default:
            return state;
    }
};