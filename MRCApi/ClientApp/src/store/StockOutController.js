import { getToken } from './../Utils/Helpler';
import moment from 'moment'
const initialState = {
    filterStockOut: [],
    detailStockOut: [],
    exportStockOut: [],
    loading: false,
    errors: {},
    forceReload: false,
    updateDetailStockOut: [],
    importStockOut: [],
    templateStockOut: [],
}
export const actionCreatorStockOut = {
    FilterStockOut: (JsonData, accId) => async (dispatch, getState) => {
        const url = '/StockOut/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const filterStockOut = await response.json();
        dispatch({ type: 'FILTER_STOCK_OUT', filterStockOut });
    },
    DetailStockOut: (JsonData, accId) => async (dispatch, getState) => {
        const data = {
            shopId: JsonData.shopId,
            employeeId: JsonData.employeeId,
            workDate: JsonData.workDate,
        }
        const url = '/StockOut/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const detailStockOut = await response.json();
        dispatch({ type: 'DETAIL_STOCK_OUT', detailStockOut });
    },
    ExportStockOut: (JSonData, accId) => async (dispatch, getState) => {
        const url = '/StockOut/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(JSonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const exportStockOut = await response.json();
        dispatch({ type: 'EXPORT_STOCK_OUT', exportStockOut });
    },
    UpdateDetailStockOut: (JSonData, accId) => async (dispatch, getState) => {
        const url = '/StockOut/UpdateDetail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(JSonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const updateDetailStockOut = await response.json();
        dispatch({ type: 'POST_UPDATE_DETAIL_STOCKOUT', updateDetailStockOut });
    },
    TemplateStockOut: (JSonData, accId) => async (dispatch, getState) => {
        const url = '/StockOut/Template';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(JSonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const templateStockOut = await response.json();
        dispatch({ type: 'TEMPLATE_StockOut', templateStockOut });
    },
    ImportStockOut: (fileUpload, accId) => async (dispatch, getState) => {
        const url = '/StockOut/Import';
        const formData = new FormData();
        formData.append('ifile', fileUpload)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const importStockOut = await response.json();
        dispatch({ type: 'IMPORT_StockOut', importStockOut });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'FILTER_STOCK_OUT':
            {
                return {
                    ...state,
                    filterStockOut: action.filterStockOut,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'DETAIL_STOCK_OUT':
            {
                return {
                    ...state,
                    detailStockOut: action.detailStockOut,
                    loading: false,
                    forceReload: false
                }
            }
        case 'EXPORT_STOCK_OUT':
            {
                return {
                    ...state,
                    exportStockOut: action.exportStockOut,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        case 'POST_UPDATE_DETAIL_STOCKOUT':
            {
                return {
                    ...state,
                    updateDetailStockOut: action.updateDetailStockOut
                }
            }
        case 'IMPORT_StockOut':
            {
                return {
                    ...state,
                    importStockOut: action.importStockOut,
                }
            }
        case 'TEMPLATE_StockOut':
            {
                return {
                    ...state,
                    templateStockOut: action.templateStockOut,
                }
            }
        default:
            return state;
    }
};