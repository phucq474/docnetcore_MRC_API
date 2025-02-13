import { URL, getToken } from '../Utils/Helpler';

const initialState = {
    pog_Filter: [],
    pog_Save: [],
    pog_Delete: [],
    pog_Export: [],
    pog_Template: [],
    pog_Import: []

}
export const actionCreatorsEmployeePOG = {
    POG_Filter: (data) => async (dispatch, getState) => {
        const url = URL + `EmployeePOG/Filter`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const pog_Filter = await response.json();
        dispatch({ type: 'POST_FILTER', pog_Filter });
    },
    POG_Save: (data) => async (dispatch, getState) => {
        const url = 'EmployeePOG/Save';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const pog_Save = await response.json();
        dispatch({ type: 'POST_SAVE', pog_Save });
    },
    POG_Delete: (listId) => async (dispatch, getState) => {
        const url = 'EmployeePOG/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'ListId': listId
            },
        };
        const response = await fetch(url, requestOptions);
        const pog_Delete = await response.json();
        dispatch({ type: 'POST_DELETE', pog_Delete });
    },
    POG_Export: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeePOG/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const pog_Export = await response.json();
        dispatch({ type: 'POST_EXPORT', pog_Export });
    },
    POG_Template: () => async (dispatch, getState) => {
        const url = URL + 'EmployeePOG/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, requestOptions);
        const pog_Template = await response.json();
        dispatch({ type: 'GET_TEMPLATE', pog_Template });
    },
    POG_Import: ifile => async (dispatch, getState) => {
        const url = 'EmployeePOG/Import';
        const formData = new FormData();
        formData.append('ifile', ifile)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const pog_Import = await response.json();
        dispatch({ type: 'POST_IMPORT', pog_Import });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'POST_FILTER':
            {
                return {
                    ...state,
                    pog_Filter: action.pog_Filter
                }
            }
        case 'POST_SAVE':
            {
                return {
                    ...state,
                    pog_Save: action.pog_Save
                }
            }
        case 'POST_DELETE':
            {
                return {
                    ...state,
                    pog_Delete: action.pog_Delete
                }
            }
        case 'POST_EXPORT':
            {
                return {
                    ...state,
                    pog_Export: action.pog_Export
                }
            }
        case 'GET_TEMPLATE':
        {
            return {
                ...state,
                pog_Template: action.pog_Template
            }
        }
        case 'POST_IMPORT':
        {
            return {
                ...state,
                pog_Import: action.pog_Import
            }
        }
        default:
            return state;
    }
};