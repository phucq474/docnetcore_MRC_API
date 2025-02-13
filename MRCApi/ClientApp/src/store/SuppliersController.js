import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    filterSuppliers: [],
    exportSuppliers: [],
    insertSuppliers: [],
    updateSuppliers: [],
    templateSuppliers: [],
    importSuppliers: [],
    getListSuppliers: [],
}
export const actionCreatorsSuppliers = {
    FilterSuppliers: (data) => async (dispatch, getState) => {
        const url = URL + 'Suppliers/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        let filterSuppliers = await null
        if (response.status === 200) {
            filterSuppliers = await response.json();
        } else filterSuppliers = await response.status
        dispatch({ type: 'FILTER_SUPPLIERS', filterSuppliers });
    },
    ExportSuppliers: (data) => async (dispatch, getState) => {
        const url = URL + 'Suppliers/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const exportSuppliers = await response.json();
        dispatch({ type: 'EXPORT_SUPPLIERS', exportSuppliers });
    },
    InsertSuppliers: (data) => async (dispatch, getState) => {
        const url = URL + 'Suppliers/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const insertSuppliers = await response.json();
        dispatch({ type: 'INSERT_SUPPLIERS', insertSuppliers });
    },
    UpdateSuppliers: (data, index) => async (dispatch, getState) => {
        const url = URL + 'Suppliers/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const updateSuppliers = await response.json();
        const payload = await { updateSuppliers, index }
        dispatch({ type: 'UPDATE_SUPPLIERS', payload });
    },
    TemplateSuppliers: () => async (dispatch, getState) => {
        const url = URL + 'Suppliers/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            },
        };
        const response = await fetch(url, requestOptions);
        const templateSuppliers = await response.json();
        dispatch({ type: 'TEMPLATE_SUPPLIERS', templateSuppliers });
    },
    ImportSuppliers: (file) => async (dispatch, getState) => {
        const url = URL + 'Suppliers/Import';
        const formData = await new FormData();
        await formData.append('ifile', file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const importSuppliers = await response.json();
        dispatch({ type: 'IMPORT_SUPPLIERS', importSuppliers });
    },
    GetListSuppliers: () => async (dispatch, getState) => {
        const url = URL + 'Suppliers/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            },
        };
        const response = await fetch(url, requestOptions);
        const getListSuppliers = await response.json();
        dispatch({ type: 'GET_LIST_SUPPLIERS', getListSuppliers });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    let filterSuppliers = state.filterSuppliers
    switch (action.type) {
        case 'FILTER_SUPPLIERS': {
            return {
                ...state,
                filterSuppliers: action.filterSuppliers,
            }
        }
        case 'INSERT_SUPPLIERS': {
            if (typeof action.insertSuppliers === "object" && action.insertSuppliers[0] && action.insertSuppliers[0].alert == "1") {
                filterSuppliers.unshift(action.insertSuppliers[0])
            }
            return {
                ...state,
                insertSuppliers: action.insertSuppliers,
                filterSuppliers: filterSuppliers,
            }
        }
        case 'UPDATE_SUPPLIERS': {
            if (typeof action.payload.updateSuppliers === "object" && action.payload.updateSuppliers[0] && action.payload.updateSuppliers[0].alert == "1") {
                Object.assign(filterSuppliers[action.payload.index], action.payload.updateSuppliers[0])
            }
            return {
                ...state,
                updateSuppliers: action.payload.updateSuppliers,
                filterSuppliers: filterSuppliers,
            }
        }
        case 'EXPORT_SUPPLIERS': {
            return {
                ...state,
                exportSuppliers: action.exportSuppliers,
            }
        }
        case 'IMPORT_SUPPLIERS': {
            return {
                ...state,
                importSuppliers: action.importSuppliers,
            }
        }
        case 'TEMPLATE_SUPPLIERS': {
            return {
                ...state,
                templateSuppliers: action.templateSuppliers,
            }
        }
        case 'GET_LIST_SUPPLIERS': {
            return {
                ...state,
                getListSuppliers: action.getListSuppliers,
            }
        }
        default:
            return state;
    }
};