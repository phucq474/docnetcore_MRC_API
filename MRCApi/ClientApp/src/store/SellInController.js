import { getToken } from './../Utils/Helpler';
const initialState = {
    filterSI: [],
    detailSI: [],
    exportSI: [],
    templateSI: [],
    importSI: [],

    //SellInByCustomer
    sellInByEmployee_Filter: [],
    sellInByEmployee_Insert: [],
    sellInByEmployee_Update: [],
    sellInByEmployee_Delete: [],
    sellInByEmployee_Export: [],
    sellInByEmployee_Template: [],
    sellInByEmployee_GetListDivision: [],
    sellInByEmployee_GetListShop: [],
    sellInByEmployee_Import: []

}
export const actionCreatorsSellIn = {
    FilterSI: (data, accId) => async (dispatch, getState) => {
        const url = '/SellIn/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                accId: accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const filterSI = await response.json();
        dispatch({ type: 'POST_FILTER_SELLIN', filterSI });
    },
    DetailSI: (id, accId) => async (dispatch, getState) => {
        const url = 'SellIn/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Id': id,
                accId: accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const detailSI = await response.json();
        dispatch({ type: 'GET_DETAIL_SELLIN', detailSI });
    },
    ExportSI: (data, accId) => async (dispatch, getState) => {
        const url = 'SellIn/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                accId: accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const exportSI = await response.json();
        dispatch({ type: 'POST_EXPORT_SELLIN', exportSI });
    },
    TemplateSI: (accId) => async (dispatch, getState) => {
        const url = 'SellIn/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const templateSI = await response.json();
        dispatch({ type: 'GET_TEMPLATE_SELLIN', templateSI });
    },
    ImportSI: (file, accId) => async (dispatch, getState) => {
        const url = 'SellIn/Import';
        const formData = await new FormData();
        await formData.append('ifile', file)
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const importSI = await response.json();
        dispatch({ type: 'POST_IMPORT_SELLIN', importSI });
    },

    //SellInByEmployee
    SellInByEmployee_Filter: (data, accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                accId: accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Filter = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Filter', sellInByEmployee_Filter });
    },
    SellInByEmployee_Insert: (data, accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                accId: accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Insert = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Insert', sellInByEmployee_Insert });
    },
    SellInByEmployee_Update: (data, accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                accId: accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Update = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Update', sellInByEmployee_Update });
    },
    SellInByEmployee_Delete: (id, accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'Id': id,
                accId: accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Delete = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Delete', sellInByEmployee_Delete });
    },
    SellInByEmployee_Export: (data, accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                accId: accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Export = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Export', sellInByEmployee_Export });
    },
    SellInByEmployee_Template: (accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Template = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Template', sellInByEmployee_Template });
    },
    SellInByEmployee_GetListDivision: (accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/GetListDivision';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_GetListDivision = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_GetListDivision', sellInByEmployee_GetListDivision });
    },
    SellInByEmployee_GetListShop: (accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/GetListShop';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_GetListShop = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_GetListShop', sellInByEmployee_GetListShop });
    },
    SellInByEmployee_Import: (file, accId) => async (dispatch, getState) => {
        const url = 'SellIn/SellInByEmployee/Import';
        const formData = await new FormData();
        await formData.append('ifile', file)
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                accId: accId || ""
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const sellInByEmployee_Import = await response.json();
        dispatch({ type: 'POST_sellInByEmployee_Import', sellInByEmployee_Import });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'POST_FILTER_SELLIN': {
            return {
                ...state,
                filterSI: action.filterSI,
            }
        }
        case 'GET_DETAIL_SELLIN': {
            return {
                ...state,
                detailSI: action.detailSI,
            }
        }
        case 'POST_EXPORT_SELLIN': {
            return {
                ...state,
                exportSI: action.exportSI,
            }
        }
        case 'GET_TEMPLATE_SELLIN': {
            return {
                ...state,
                templateSI: action.templateSI,
            }
        }
        case 'POST_IMPORT_SELLIN': {
            return {
                ...state,
                importSI: action.importSI,
            }
        }
        //SellInByCustomer
        case 'POST_sellInByEmployee_Filter': {
            return {
                ...state,
                sellInByEmployee_Filter: action.sellInByEmployee_Filter,
            }
        }
        case 'POST_sellInByEmployee_Insert': {
            return {
                ...state,
                sellInByEmployee_Insert: action.sellInByEmployee_Insert,
            }
        }
        case 'POST_sellInByEmployee_Update': {
            return {
                ...state,
                sellInByEmployee_Update: action.sellInByEmployee_Update,
            }
        }
        case 'POST_sellInByEmployee_Delete': {
            return {
                ...state,
                sellInByEmployee_Delete: action.sellInByEmployee_Delete,
            }
        }
        case 'POST_sellInByEmployee_Export': {
            return {
                ...state,
                sellInByEmployee_Export: action.sellInByEmployee_Export,
            }
        }
        case 'POST_sellInByEmployee_Template': {
            return {
                ...state,
                sellInByEmployee_Template: action.sellInByEmployee_Template,
            }
        }
        case 'POST_sellInByEmployee_GetListDivision': {
            return {
                ...state,
                sellInByEmployee_GetListDivision: action.sellInByEmployee_GetListDivision,
            }
        }
        case 'POST_sellInByEmployee_GetListShop': {
            return {
                ...state,
                sellInByEmployee_GetListShop: action.sellInByEmployee_GetListShop,
            }
        }
        case 'POST_sellInByEmployee_Import': {
            return {
                ...state,
                sellInByEmployee_Import: action.sellInByEmployee_Import,
            }
        }
        default:
            return state;
    }
}