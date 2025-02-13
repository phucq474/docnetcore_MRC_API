import { URL, getToken, getAccountId, getEmployeeId } from '../Utils/Helpler';
const initialState = {
    customerList: [],
    filterCustomer: [],
    accountList: [],
    //NewCustomer
    newCustomer_Filter: [],
    newCustomer_Detail: [],
    newCustomer_Export: [],

    //CustomerTarget
    customerTarget_Filter: [],
    customerTarget_Insert: [],
    customerTarget_Update: [],
    customerTarget_Export: [],
    customerTarget_Template: [],
    customerTarget_Import: [],
    customerTarget_Delete: []
}
export const CustomerCreateAction = {
    GetCustomerList: (accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const customerList = await response.json();
        dispatch({ type: 'GET_CUSTOMER_LIST', customerList });
    },
    FilterCustomer: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const filterCustomer = await response.json();
        dispatch({ type: 'FILTER_CUSTOMER', filterCustomer });
    },
    InsertCustomer: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const insertCustomer = await response.json();
        dispatch({ type: 'INSERT_CUSTOMER', insertCustomer });
    },
    UpdateCustomer: (data, index, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const updateCustomer = await response.json();
        const payload = { updateCustomer, index }
        dispatch({ type: 'UPDATE_CUSTOMER', payload });
    },
    ExportCustomer: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const exportCustomer = await response.json();
        dispatch({ type: 'EXPORT_CUSTOMER', exportCustomer });
    },
    TemplateCustomer: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const templateCustomer = await response.json();
        dispatch({ type: 'TEMPLATE_CUSTOMER', templateCustomer });
    },
    ImportCustomer: (ifile, accId) => async (dispatch, getState) => {
        const url = 'Customers/Import';
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
        const importCustomer = await response.json();
        dispatch({ type: 'IMPORT_CUSTOMER', importCustomer });
    },

    GetAccountList: (accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/GetAccountList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const accountList = await response.json();
        dispatch({ type: 'GET_ACCOUNT_LIST', accountList });
    },

    //New Customer
    NewCustomer_Filter: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/NewCustomer/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const newCustomer_Filter = await response.json();
        dispatch({ type: 'FILTER_NEW_CUSTOMER', newCustomer_Filter });
    },
    NewCustomer_Detail: (id, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/NewCustomer/Filter/Detail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'Id': id,
                'accId': accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const newCustomer_Detail = await response.json();
        dispatch({ type: 'FILTER_NEW_CUSTOMER_DETAIL', newCustomer_Detail });
    },
    NewCustomer_Export: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Customers/NewCustomer/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const newCustomer_Export = await response.json();
        dispatch({ type: 'EXPORT_NEW_CUSTOMER', newCustomer_Export });
    },

    //CustomerTarget
    CustomerTarget_Filter: (data, accId) => async (dispatch, getState) => {
        const url = 'CustomerTarget/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const customerTarget_Filter = await response.json();
        dispatch({ type: 'FILTER_CUSTOMER_Target', customerTarget_Filter });
    },
    CustomerTarget_Insert: (data, accId) => async (dispatch, getState) => {
        const url = 'CustomerTarget/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const customerTarget_Insert = await response.json();
        dispatch({ type: 'INSERT_CUSTOMER_Target', customerTarget_Insert });
    },
    CustomerTarget_Update: (data, accId) => async (dispatch, getState) => {
        const url = 'CustomerTarget/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const customerTarget_Update = await response.json();
        dispatch({ type: 'UPDATE_CUSTOMER_Target', customerTarget_Update });
    },
    CustomerTarget_Export: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'CustomerTarget/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const customerTarget_Export = await response.json();
        dispatch({ type: 'EXPORT_CUSTOMER_Target', customerTarget_Export });
    },
    CustomerTarget_Template: (accId) => async (dispatch, getState) => {
        const url = URL + 'CustomerTarget/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const customerTarget_Template = await response.json();
        dispatch({ type: 'TEMPLATE_CUSTOMER_Target', customerTarget_Template });
    },
    CustomerTarget_Import: (ifile, accId) => async (dispatch, getState) => {
        const url = 'CustomerTarget/Import';
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
        const customerTarget_Import = await response.json();
        dispatch({ type: 'IMPORT_CUSTOMER_Target', customerTarget_Import });
    },
    CustomerTarget_Delete: (id, accId) => async (dispatch, getState) => {
        const url = 'CustomerTarget/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': id,
                'accId': accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const customerTarget_Delete = await response.json();
        dispatch({ type: 'DELETE_CUSTOMER_Target', customerTarget_Delete });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    let filterCustomer = state.filterCustomer
    let customerTarget_Filter = state.customerTarget_Filter
    switch (action.type) {
        case 'GET_CUSTOMER_LIST': {
            return {
                ...state,
                customerList: action.customerList,
            }
        }
        case 'FILTER_CUSTOMER': {
            return {
                ...state,
                filterCustomer: action.filterCustomer,
            }
        }
        case 'INSERT_CUSTOMER': {
            if (typeof action.insertCustomer === "object" && action.insertCustomer[0] && action.insertCustomer[0].alert == "1") {
                filterCustomer.unshift(action.insertCustomer[0])
            }
            return {
                ...state,
                insertCustomer: action.insertCustomer,
                filterCustomer: filterCustomer
            }
        }
        case 'UPDATE_CUSTOMER': {
            if (typeof action.payload.updateCustomer === 'object' && action.payload.updateCustomer[0] && action.payload.updateCustomer[0].alert == "1") {
                let result = action.payload.updateCustomer[0]
                Object.assign(filterCustomer[action.payload.index], result)
            }
            return {
                ...state,
                updateCustomer: action.payload.updateCustomer,
                filterCustomer: filterCustomer
            }
        }
        case 'EXPORT_CUSTOMER': {
            return {
                ...state,
                exportCustomer: action.exportCustomer,
            }
        }
        case 'TEMPLATE_CUSTOMER': {
            return {
                ...state,
                templateCustomer: action.templateCustomer,
            }
        }
        case 'IMPORT_CUSTOMER': {
            return {
                ...state,
                importCustomer: action.importCustomer,
            }
        }
        case 'GET_ACCOUNT_LIST': {
            return {
                ...state,
                accountList: action.accountList,
            }
        }
        //NewCustomer
        case 'FILTER_NEW_CUSTOMER': {
            return {
                ...state,
                newCustomer_Filter: action.newCustomer_Filter,
            }
        }
        case 'FILTER_NEW_CUSTOMER_DETAIL': {
            return {
                ...state,
                newCustomer_Detail: action.newCustomer_Detail,
            }
        }
        case 'EXPORT_NEW_CUSTOMER': {
            return {
                ...state,
                newCustomer_Export: action.newCustomer_Export,
            }
        }
        //CustomerTarget
        case 'FILTER_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Filter: action.customerTarget_Filter,
            }
        }
        case 'INSERT_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Insert: action.customerTarget_Insert,
            }
        }
        case 'UPDATE_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Update: action.customerTarget_Update,
            }
        }
        case 'EXPORT_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Export: action.customerTarget_Export,
            }
        }
        case 'TEMPLATE_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Template: action.customerTarget_Template,
            }
        }
        case 'IMPORT_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Import: action.customerTarget_Import,
            }
        }
        case 'DELETE_CUSTOMER_Target': {
            return {
                ...state,
                customerTarget_Delete: action.customerTarget_Delete,
            }
        }

        default:
            return state;
    }
};