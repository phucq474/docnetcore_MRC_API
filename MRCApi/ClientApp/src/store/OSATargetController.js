import { getToken } from './../Utils/Helpler';
const initialState = {
    osaTargets: [],
    osaTargetDetail: [],
    fileTemplate: [],
    fileExport: [],
    result: [],
    osaTargetDelete: []
}
export const OSATargetActionCreators = {
    /// OSA-Result
    GetList: (JsonData, accId) => async (dispatch, getState) => {
        const url = '/OSATarget/GetList';
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
    GetDetail: (JsonData, accId) => async (dispatch, getState) => {
        const url = '/OSATarget/GetDetail';
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
        dispatch({ type: 'GET_GetDetail', result });
    },
    Template: (accId) => async (dispatch, getState) => {
        const url = '/OSATarget/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_Template', result });
    },
    Import: (ifile, accId) => async (dispatch, getState) => {
        const url = '/OSATarget/Import';
        const formData = new FormData();
        formData.append('ifile', ifile)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'IMPORT_OSA_TARGET', result });
    },
    Export: (JsonData, accId) => async (dispatch, getState) => {
        const url = '/OSATarget/Export';
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
    Delete: (listId) => async (dispatch, getState) => {
        const url = '/OSATarget/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'ListId': listId
            },
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'POST_DELETE', result });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_GetList':
            {
                return {
                    ...state,
                    osaTargets: action.result,
                }
            }
        case 'GET_GetDetail':
            {
                return {
                    ...state,
                    osaTargetDetail: action.result,
                }
            }
        case 'GET_Export':
            {
                return {
                    ...state,
                    fileExport: action.result,
                }
            }
        case 'GET_Template':
            {
                return {
                    ...state,
                    fileTemplate: action.result,
                }
            }
        case 'IMPORT_OSA_TARGET':
            {
                return {
                    ...state,
                    result: action.result,
                }
            }
        case 'POST_DELETE':
            {
                return {
                    ...state,
                    osaTargetDelete: action.result,
                }
            }   
        default:
            return state;
    }
};