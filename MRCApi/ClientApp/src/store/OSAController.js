import { getToken } from './../Utils/Helpler';
import moment from 'moment'
const initialState = {
    loading: false,
    errors: {},
    forceReload: false,
    /// OSA Result
    filterOSAResult: [],
    detailOSAResult: [],
    exportOSAResult: [],
    /// OSA Target
    filterOSATarget: [],
    insertOSATarget: [],
    updateOSATarget: [],
    exportOSATarget: [],
    templateOSATarget: [],
    importOSATarget: [],
    /// OSA SPTT
    filterOSATargetSPTT: [],
    detailOSATargetSPTT: [],
    deleteOSATargetSPTT: [],
    updateOSATargetSPTT: [],
    insertOSATargetSPTT: [],

}
export const actionCreatorsOSA = {
    /// OSA-Result
    FilterOSAResult: JsonData => async (dispatch, getState) => {
        const url = '/OSAResults/Filter_OSAResult';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterOSAResult = await response.json();
        dispatch({ type: 'FILTER_OSA_RESULT', filterOSAResult });
    },
    DetailOSAResult: JsonData => async (dispatch, getState) => {
        const url = '/OSAResults/Detail_OSAResult';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': JsonData.employeeId,
                'ShopId': JsonData.shopId,
                'WorkDate': +moment(new Date(JsonData.workDate)).format('YYYYMMDD'),
                "CustomerId": JsonData.customerId
            }
        };
        const response = await fetch(url, requestOptions);
        const detailOSAResult = await response.json();
        dispatch({ type: 'DETAIL_OSA_RESULT', detailOSAResult });
    },
    ExportOSAResult: JSonData => async (dispatch, getState) => {
        const url = '/OSAResults/Export_OSAResult';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JSonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const exportOSAResult = await response.json();
        dispatch({ type: 'EXPORT_OSA_RESULT', exportOSAResult });
    },
    /// OSA-Target
    FilterOSATarget: JsonData => async (dispatch, getState) => {
        const url = '/OSATarget/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterOSATarget = await response.json();
        dispatch({ type: 'FILTER_OSA_TARGET', filterOSATarget });
    },
    ExportOSATarget: JsonData => async (dispatch, getState) => {
        const url = '/OSATarget/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const exportOSATarget = await response.json();
        dispatch({ type: 'EXPORT_OSA_TARGET', exportOSATarget });
    },
    TemplateOSATarget: () => async (dispatch, getState) => {
        const url = '/OSATarget/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const templateOSATarget = await response.json();
        dispatch({ type: 'TEMPLATE_OSA_TARGET', templateOSATarget });
    },
    ImportOSATarget: ifile => async (dispatch, getState) => {
        const url = '/OSATarget/Import';
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
        const importOSATarget = await response.json();
        dispatch({ type: 'IMPORT_OSA_TARGET', importOSATarget });
    },
    DetailOSATarget: JsonData => async (dispatch, getState) => {
        const data = {
            customerId: JsonData.customerId,
            shopId: JsonData.shopId || null,
            fromDate: JsonData.fromDate || null,
            toDate: JsonData.toDate || null,
        }
        const url = '/OSATarget/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const detailOSATarget = await response.json();
        dispatch({ type: 'DETAIL_OSA_TARGET', detailOSATarget });
    },
    DeleteOSATarget: (id) => async (dispatch, getState) => {
        const url = '/OSATarget/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': id
            }
        };
        const response = await fetch(url, requestOptions);
        const deleteDetailOSATarget = await response.json();
        dispatch({ type: 'DELETE_OSA_TARGET', deleteDetailOSATarget });
    },
    /// OSA-Target-SPTT
    FilterOSATargetSPTT: JsonData => async (dispatch, getState) => {
        const url = '/OSATargetSPTT/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterOSATargetSPTT = await response.json();
        dispatch({ type: 'FILTER_OSA_TARGET_SPTT', filterOSATargetSPTT });
    },
    DetailOSATargetSPTT: JsonData => async (dispatch, getState) => {
        const data = {
            customerId: JsonData.customerId,
            shopId: JsonData.shopId || null,
            fromDate: JsonData.fromDate || null,
            toDate: JsonData.toDate || null,
        }
        const url = '/OSATargetSPTT/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const detailOSATargetSPTT = await response.json();
        dispatch({ type: 'DETAIL_OSA_TARGET_SPTT', detailOSATargetSPTT });
    },
    DeleteOSATargetSPTT: (id) => async (dispatch, getState) => {
        const url = '/OSATargetSPTT/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': id
            }
        };
        const response = await fetch(url, requestOptions);
        const deleteOSATargetSPTT = await response.json();
        dispatch({ type: 'DELETE_OSA_TARGET_SPTT', deleteOSATargetSPTT });
    },
    InsertDetailOSATarget: (data) => async (dispatch, getState) => {
        const url = '/OSATargetSPTT/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const insertOSATargetSPTT = await response.json();
        dispatch({ type: 'INSERT_OSA_TARGET_SPTT', insertOSATargetSPTT });
    },
    UpdateDetailOSATarget: (data) => async (dispatch, getState) => {
        const url = '/OSATargetSPTT/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const updateOSATargetSPTT = await response.json();
        dispatch({ type: 'UPDATE_OSA_TARGET_SPTT', updateOSATargetSPTT });
    }
}
export const reducer = (state, action) => {
    state = state || initialState;
    let filterOSATarget = state.filterOSATarget
    let filterOSATargetSPTT = state.filterOSATargetSPTT
    switch (action.type) {
        /// OSA Result
        case 'FILTER_OSA_RESULT':
            {
                return {
                    ...state,
                    filterOSAResult: action.filterOSAResult,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'DETAIL_OSA_RESULT':
            {
                return {
                    ...state,
                    detailOSAResult: action.detailOSAResult,
                    loading: false,
                    forceReload: false
                }
            }
        case 'EXPORT_OSA_RESULT':
            {
                return {
                    ...state,
                    exportOSAResult: action.exportOSAResult,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        /// OSA Target
        case 'FILTER_OSA_TARGET':
            {
                return {
                    ...state,
                    filterOSATarget: action.filterOSATarget,
                }
            }
        case 'EXPORT_OSA_TARGET':
            {
                return {
                    ...state,
                    exportOSATarget: action.exportOSATarget,
                }
            }
        case 'TEMPLATE_OSA_TARGET':
            {
                return {
                    ...state,
                    templateOSATarget: action.templateOSATarget,
                }
            }
        case 'IMPORT_OSA_TARGET':
            {
                return {
                    ...state,
                    importOSATarget: action.importOSATarget,
                }
            }
        case 'DETAIL_OSA_TARGET':
            {
                return {
                    ...state,
                    detailOSATarget: action.detailOSATarget,
                }
            }
        case 'DELETE_OSA_TARGET':
            {
                return {
                    ...state,
                    deleteDetailOSATarget: action.deleteDetailOSATarget,
                }
            }
        /// OSA Target--SPTT
        case 'FILTER_OSA_TARGET_SPTT':
            {
                return {
                    ...state,
                    filterOSATargetSPTT: action.filterOSATargetSPTT,
                }
            }
        case 'DETAIL_OSA_TARGET_SPTT':
            {
                return {
                    ...state,
                    detailOSATargetSPTT: action.detailOSATargetSPTT,
                }
            }
        case 'DELETE_OSA_TARGET_SPTT':
            {
                return {
                    ...state,
                    deleteOSATargetSPTT: action.deleteOSATargetSPTT,
                }
            }
        case 'INSERT_OSA_TARGET_SPTT':
            {
                if (typeof action.insertOSATargetSPTT === "object" && action.insertOSATargetSPTT[0] && action.insertOSATargetSPTT[0].alert == "1") {
                    filterOSATargetSPTT.unshift(action.insertOSATargetSPTT[0])
                }
                return {
                    ...state,
                    insertOSATargetSPTT: action.insertOSATargetSPTT,
                    filterOSATargetSPTT: filterOSATargetSPTT,
                }
            }
        case 'UPDATE_OSA_TARGET_SPTT':
            {
                if (typeof action.payload.updateOSATargetSPTT === 'object' && action.payload.updateOSATargetSPTT[0] && action.payload.updateOSATargetSPTT[0].alert == "1") {
                    let result = action.payload.updateOSATargetSPTT[0]
                    Object.assign(filterOSATargetSPTT[action.payload.index], result)
                }
                return {
                    ...state,
                    updateOSATargetSPTT: action.payload.updateOSATargetSPTT,
                    filterOSATargetSPTT: filterOSATargetSPTT
                }
            }
        default:
            return state;
    }
};