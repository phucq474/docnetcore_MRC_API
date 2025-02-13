import { getToken } from '../Utils/Helpler';
import moment from 'moment'
const initialState = {
    filterSellOutAlpha: [],
    detailSellOutAlpha: [],
    exportSellOutAlpha: [],
    loading: false,
    errors: {},
    forceReload: false
}
export const actionCreatorsSellOutAlpha = {
    FilterSellOutAlpha: JsonData => async (dispatch, getState) => {
        const url = '/SellOut/SellOutAlphaFilter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Json': JSON.stringify(JsonData),
            },
        };
        const response = await fetch(url, requestOptions);
        const filterSellOutAlpha = await response.json();
        dispatch({ type: 'FILTER_SELLOUT_ALPHA', filterSellOutAlpha });
    },
    DetailSellOutAlpha: JsonData => async (dispatch, getState) => {
        const url = '/SellOut/SellOutAlphaDetail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': JsonData.employeeId,
                'Month': JsonData.month,
                'Year': JsonData.year,
            }
        };
        const response = await fetch(url, requestOptions);
        const detailSellOutAlpha = await response.json();
        dispatch({ type: 'DETAIL_SELLOUT_ALPHA', detailSellOutAlpha });
    },
    ExportSellOutAlpha: (JSonData, month, year) => async (dispatch, getState) => {
        const url = '/SellOut/SellOutAlphaExport';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Json': JSON.stringify(JSonData),
                'Month': month,
                'Year': year
            },
        };
        const response = await fetch(url, requestOptions);
        const exportSellOutAlpha = await response.json();
        await console.log(response, exportSellOutAlpha)
        dispatch({ type: 'EXPORT_SELLOUT_ALPHA', exportSellOutAlpha });
    },
    TemplateSellOutAlpha: (JSonData, Month, Year) => async (dispatch, getState) => {
        const url = '/SellOut/SellOutAlphaTemplate';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Json': JSON.stringify(JSonData),
                'Month': Month,
                'Year': Year
            },
        };
        const response = await fetch(url, requestOptions);
        const templateSellOutAlpha = await response.json();
        dispatch({ type: 'TEMPLATE_SELLOUT_ALPHA', templateSellOutAlpha });
    },
    ImportSellOutAlpha: (fileUpload, Month, Year, UpToDate) => async (dispatch, getState) => {
        const url = '/SellOut/SellOutAlphaImport';
        const formData = new FormData();
        formData.append('fileUpload', fileUpload)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Month': Month,
                'Year': Year,
                'UpToDate': UpToDate
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const importSellOutAlpha = await response.json();
        await console.log(response, importSellOutAlpha)
        dispatch({ type: 'IMPORT_SELLOUT_ALPHA', importSellOutAlpha });
    },
}
export const actionCreatorsSellOutMT = {
    FilterSellOutMT: JsonData => async (dispatch, getState) => {
        const url = '/SellOut/SellOutMTFilter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Json': JSON.stringify(JsonData),
            },
        };
        const response = await fetch(url, requestOptions);
        const filterSellOutMT = await response.json();
        dispatch({ type: 'FILTER_SELLOUT_MT', filterSellOutMT });
    },
    DetailSellOutMT: JsonData => async (dispatch, getState) => {
        const url = '/SellOut/SellOutMTDetail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': JsonData.employeeId,
                'Month': JsonData.month,
                'Year': JsonData.year,
            }
        };
        const response = await fetch(url, requestOptions);
        const detailSellOutMT = await response.json();
        dispatch({ type: 'DETAIL_SELLOUT_MT', detailSellOutMT });
    },
    ExportSellOutMT: (JSonData, month, year) => async (dispatch, getState) => {
        const url = '/SellOut/SellOutMTExport';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Json': JSON.stringify(JSonData),
                'Month': month,
                'Year': year
            },
        };
        const response = await fetch(url, requestOptions);
        const exportSellOutMT = await response.json();
        dispatch({ type: 'EXPORT_SELLOUT_MT', exportSellOutMT });
    },
    TemplateSellOutMT: (JSonData, Month, Year) => async (dispatch, getState) => {
        const url = '/SellOut/SellOutMTTemplate';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Json': JSON.stringify(JSonData),
                'Month': Month,
                'Year': Year
            },
        };
        const response = await fetch(url, requestOptions);
        const templateSellOutMT = await response.json();
        dispatch({ type: 'TEMPLATE_SELLOUT_MT', templateSellOutMT });
    },
    ImportSellOutMT: (fileUpload, Month, Year, UpToDate) => async (dispatch, getState) => {
        const url = '/SellOut/SellOutMTImport';
        const formData = new FormData();
        formData.append('fileUpload', fileUpload)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Month': Month,
                'Year': Year,
                'UpToDate': UpToDate
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const importSellOutMT = await response.json();
        dispatch({ type: 'IMPORT_SELLOUT_MT', importSellOutMT });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'FILTER_SELLOUT_ALPHA':
            {
                return {
                    ...state,
                    filterSellOutAlpha: action.filterSellOutAlpha,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'DETAIL_SELLOUT_ALPHA':
            {
                return {
                    ...state,
                    detailSellOutAlpha: action.detailSellOutAlpha,
                    loading: false,
                    forceReload: false
                }
            }
        case 'EXPORT_SELLOUT_ALPHA':
            {
                return {
                    ...state,
                    exportSellOutAlpha: action.exportSellOutAlpha,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        case 'TEMPLATE_SELLOUT_ALPHA':
            {
                return {
                    ...state,
                    templateSellOutAlpha: action.templateSellOutAlpha,
                }
            }
        case 'IMPORT_SELLOUT_ALPHA':
            {
                return {
                    ...state,
                    importSellOutAlpha: action.importSellOutAlpha,
                }
            }
        case 'FILTER_SELLOUT_MT':
            {
                return {
                    ...state,
                    filterSellOutMT: action.filterSellOutMT,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'DETAIL_SELLOUT_MT':
            {
                return {
                    ...state,
                    detailSellOutMT: action.detailSellOutMT,
                    loading: false,
                    forceReload: false
                }
            }
        case 'EXPORT_SELLOUT_MT':
            {
                return {
                    ...state,
                    exportSellOutMT: action.exportSellOutMT,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        case 'TEMPLATE_SELLOUT_MT':
            {
                return {
                    ...state,
                    templateSellOutMT: action.templateSellOutMT,
                }
            }
        case 'IMPORT_SELLOUT_MT':
            {
                return {
                    ...state,
                    importSellOutMT: action.importSellOutMT,
                }
            }
        default:
            return state;
    }
};