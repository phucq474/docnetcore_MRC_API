import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    ec_filter: [],
    ec_template: [],
    ec_export: [],
    ec_import: [],
    ec_delete: [],
    ec_save: []
}
export const EmployeeCategoryCreateAction = {
    EC_Filter: (data, accId) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                accId: accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(`${URL}EmployeeCategory/Filter`, requestOptions);
        const result = await response.json();
        dispatch({ type: 'EC_Filter', result });
    },
    EC_Template: (data, accId) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                accId: accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(`${URL}EmployeeCategory/Template`, requestOptions);
        const result = await response.json();
        dispatch({ type: 'EC_Template', result });
    },
    EC_Export: (data, accId) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                accId: accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(`${URL}EmployeeCategory/Export`, requestOptions);
        const result = await response.json();
        dispatch({ type: 'EC_Export', result });
    },
    EC_Import: (fileUpload, accId) => async (dispatch, getState) => {
        const formData = new FormData();
        formData.append('ifile', fileUpload)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
            body: formData,
        };
        const response = await fetch(`${URL}EmployeeCategory/Import`, requestOptions);
        const result = await response.json();
        dispatch({ type: 'EC_Import', result });
    },
    EC_Delete: (id, accId) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                accId: accId || "",
                id: id || ""
            }
        };
        const response = await fetch(`${URL}EmployeeCategory/Delete`, requestOptions);
        const result = await response.json();
        await dispatch({ type: 'EC_Delete', result });
    },
    EC_Save: (data, accId) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                accId: accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(`${URL}EmployeeCategory/Save`, requestOptions);
        const result = await response.json();
        dispatch({ type: 'EC_Save', result });
    },
}
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'EC_Filter': {
            return {
                ...state,
                ec_filter: action.result,
            }
        }
        case 'EC_Template': {
            return {
                ...state,
                ec_template: action.result,
            }
        }
        case 'EC_Export': {
            return {
                ...state,
                ec_export: action.result,
            }
        }
        case 'EC_Import': {
            return {
                ...state,
                ec_import: action.result,
            }
        }
        case 'EC_Delete': {
            return {
                ...state,
                ec_delete: action.result,
            }
        }
        case 'EC_Save': {
            return {
                ...state,
                ec_save: action.result,
            }
        }
        default:
            return {
                ...state,
            }
    }
}