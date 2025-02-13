import { URL, getToken, getLogin } from '../Utils/Helpler';
const initialState = {
    filterAnnualLeave: [],
    updateAnnualLeave: []
}
export const actionCreatorsAnnualLeave = {
    FilterAnnualLeave: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeAnnualLeave/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterAnnualLeave = await response.json();
        dispatch({ type: 'FILTER_ANNUALLEAVE', filterAnnualLeave });
    },
    ExportAnnualLeave: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeAnnualLeave/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'Year': data.year || '',
                'accountName': getLogin().accountName
            }
        };
        const response = await fetch(url, requestOptions);
        const exportAnnualLeave = await response.json();
        dispatch({ type: 'EXPORT_ANNUALLEAVE', exportAnnualLeave });
    },
    InsertAnnualLeave: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeAnnualLeave/Save';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            },
        };
        const response = await fetch(url, requestOptions);
        const insertAnnualLeave = await response.json();
        dispatch({ type: 'INSERT_ANNUALLEAVE', insertAnnualLeave });
    },
    // UpdateSuppliers: (data, index) => async (dispatch, getState) => {
    //     const url = URL + 'Suppliers/Update';
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': getToken(),
    //             "Content-Type": "application/json"
    //         },
    //         body: "'" + JSON.stringify(data) + "'",
    //     };
    //     const response = await fetch(url, requestOptions);
    //     const updateSuppliers = await response.json();
    //     const payload = await { updateSuppliers, index }
    //     dispatch({ type: 'UPDATE_SUPPLIERS', payload });
    // },
    TemplateAnnualLeave: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeAnnualLeave/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'Year': data.year || '',
                'accountName': getLogin().accountName
            }
        };
        const response = await fetch(url, requestOptions);
        const templateAnnualLeave = await response.json();
        dispatch({ type: 'TEMPLATE_ANNUALLEAVE', templateAnnualLeave });
    },
    ImportAnnualLeave: (file) => async (dispatch, getState) => {
        const url = URL + 'EmployeeAnnualLeave/Import';
        const formData = await new FormData();
        await formData.append('fileUpload', file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "accountName": getLogin().accountName
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const importAnnualLeave = await response.json();
        dispatch({ type: 'IMPORT_ANNUALLEAVE', importAnnualLeave });
    },
    UpdateAnnualLeave: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeAnnualLeave/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                "JsonData": JSON.stringify(data)
            },
        };
        const response = await fetch(url, requestOptions);
        const updateAnnualLeave = await response.json();
        dispatch({ type: 'POST_UPDATE_ANNUALLEAVE', updateAnnualLeave });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    // let filterAnnualLeave = state.filterAnnualLeave
    switch (action.type) {
        case 'FILTER_ANNUALLEAVE': {
            return {
                ...state,
                filterAnnualLeave: action.filterAnnualLeave,
            }
        }
        case 'INSERT_ANNUALLEAVE': {
            // if (typeof action.insertSuppliers === "object" && action.insertSuppliers[0] && action.insertSuppliers[0].alert == "1") {
            //     filterSuppliers.unshift(action.insertSuppliers[0])
            // }
            return {
                ...state,
                insertAnnualLeave: action.insertAnnualLeave,
                // filterSuppliers: filterSuppliers,
            }
        }
        // case 'UPDATE_SUPPLIERS': {
        //     if (typeof action.payload.updateSuppliers === "object" && action.payload.updateSuppliers[0] && action.payload.updateSuppliers[0].alert == "1") {
        //         Object.assign(filterSuppliers[action.payload.index], action.payload.updateSuppliers[0])
        //     }
        //     return {
        //         ...state,
        //         updateSuppliers: action.payload.updateSuppliers,
        //         filterSuppliers: filterSuppliers,
        //     }
        // }
        case 'EXPORT_ANNUALLEAVE': {
            return {
                ...state,
                exportAnnualLeave: action.exportAnnualLeave,
            }
        }
        case 'IMPORT_ANNUALLEAVE': {
            return {
                ...state,
                importAnnualLeave: action.importAnnualLeave,
            }
        }
        case 'TEMPLATE_ANNUALLEAVE': {
            return {
                ...state,
                templateAnnualLeave: action.templateAnnualLeave,
            }
        }
        // case 'GET_LIST_SUPPLIERS': {
        //     return {
        //         ...state,
        //         getListSuppliers: action.getListSuppliers,
        //     }
        // }
        case 'POST_UPDATE_ANNUALLEAVE': {
            return {
                ...state,
                updateAnnualLeave: action.updateAnnualLeave,
            }
        }
        default:
            return state;
    }
};