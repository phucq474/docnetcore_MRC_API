import { URL, getToken, searchIndex } from '../Utils/Helpler';
import moment from 'moment'
const initialState = {
    attendants: [],
    attendantDetails: [],
    urlFileAttendant: '',
    reportAttendant: [],
    loading: true,
    errors: '',
    forceReload: false,
    filterDataUpdate: [],
    insertAttendant: [],
    insertItem: [],
    updateAttendant: [],
    deleteItem: [],
    deleteAttendant: [],
    filterAttendantResult: [],
    insertAttendantResult: [],
    updateAttendantResult: [],
    getlistKPI: [],
}
export const AttendantCreateAction = {
    GetAttendants: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'attendant/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const attendants = await response.json();
        dispatch({ type: 'GET_List_Attendant', attendants });
    },
    ReportAttendant: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'attendant/Report_Attendant_RawData';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"

        };
        const response = await fetch(url, requestOptions);
        const reportAttendant = await response.json();
        dispatch({ type: 'REPORT_Attendant', reportAttendant });
    },
    AquaSyncData: data => async (dispatch, getState) => {
        const url = URL + 'attendant/aquasync';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'data': JSON.stringify(data),
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'AQUA_SYNC_DATA', results });
    },
    FilterDataUpdate: (shopId, employeeId, PhotoDate, ShiftCode) => async (dispatch, getState) => {
        const url = URL + 'attendant/FilterUpdate';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "shopId": shopId,
                "employeeId": employeeId,
                "PhotoDate": PhotoDate,
                'ShiftCode': ShiftCode,
            }
        };
        const response = await fetch(url, requestOptions);
        const filterDataUpdate = await response.json();
        dispatch({ type: 'FILTER_DATA_UPDATE', filterDataUpdate });
    },
    InsertAttendant: (file, data) => async (dispatch, getState) => {
        const url = await URL + 'attendant/Insert';
        const formData = await new FormData();
        await formData.append("ifile", file)
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "employeeId": data.employeeId,
                "shopId": data.shopId,
                "photoTime": data.photoTime,
                "photoType": data.photoType,
                "latitude": data.latitude,
                "longitude": data.longitude,
                'ShiftCode': data.shiftCode
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const insertAttendant = await response.json();
        dispatch({ type: 'INSERT_ATTENDANT', insertAttendant });
    },
    InsertItem: (file, data, indexRow) => async (dispatch, getState) => {
        const url = await URL + 'attendant/InsertItem';
        const formData = await new FormData();
        await formData.append("ifile", file)
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "employeeId": data.employeeId,
                "shopId": data.shopId,
                "photoDate": data.photoDate,
                "photoTime": data.photoTime,
                "photoType": data.photoType,
                "photo": data.photo,
                'ShiftCode': data.shiftCode
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const insertItem = await response.json();
        const payload = await { insertItem, indexRow }
        dispatch({ type: 'INSERT_ITEM', payload });
    },
    UpdateAttendant: (file = "", data, indexRow, startIndex = -1) => async (dispatch, getState) => {
        const url = await URL + 'attendant/Update';
        const formData = await new FormData()
        if (file) {
            formData.append("ifile", file)
        }
        await console.log(data)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "PhotoID": data.photoID,
                "employeeId": data.employeeId,
                "shopId": data.shopId,
                "PhotoType": data.photoType,
                "PhotoTime": data.photoTime,
                "PhotoDate": data.photoDate,
                "Photo": data.photo,
                "photoName": data.photoName || '',
                'ShiftCode': data.shiftCode || 'HC'
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const updateAttendant = await response.json();
        const payload = await { updateAttendant, indexRow, startIndex }
        dispatch({ type: 'UPDATE_ATTENDANT', payload });
    },
    DeleteItem: (data, indexRow, idType) => async (dispatch, getState) => {
        const url = await URL + 'attendant/DeleteItem';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'photoId': data.photoID,
            },
        };
        const response = await fetch(url, requestOptions);
        const deleteItem = await response.json();
        const payload = await { deleteItem, indexRow, idType: idType }
        dispatch({ type: 'DELETE_ITEM', payload });
    },
    DeleteAttendant: (shiftCode, shopId, employeeId, photoDate, rowIndex) => async (dispatch, getState) => {
        const url = await URL + 'attendant/DeleteAll';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "shopId": shopId,
                "employeeId": employeeId,
                "photoDate": photoDate,
                'shiftCode': shiftCode || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const deleteAttendant = await response.json();
        const payload = await { deleteAttendant, rowIndex }
        dispatch({ type: 'DELETE_ATTENDANT', payload });
    },
    GetShiftListAttendant: (shopId, employeeId, workDate, accId) => async (dispatch, getState) => {
        const url = await URL + 'attendant/GetShift';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "ShopId": shopId,
                "EmployeeId": employeeId,
                'WorkDate': workDate,
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const getListShift = await response.json();
        dispatch({ type: 'GET_SHIFT_LIST', getListShift });
    },
    ////// Attendant Result
    FilterAttendantResult: (data) => async (dispatch, getState) => {
        const url = await URL + 'AttendantResult/Filter';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterAttendantResult = await response.json();
        dispatch({ type: 'FILTER_ATTENDANT_RESULT', filterAttendantResult });
    },
    InsertAttendantResult: (data) => async (dispatch, getState) => {
        const url = await URL + 'AttendantResult/Insert';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const insertAttendantResult = await response.json();
        dispatch({ type: 'INSERT_ATTENDANT_RESULT', insertAttendantResult });
    },
    UpdateAttendantResult: (data, index) => async (dispatch, getState) => {
        const url = await URL + 'AttendantResult/Update';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const updateAttendantResult = await response.json();
        const payload = { updateAttendantResult, index }
        dispatch({ type: 'UPDATE_ATTENDANT_RESULT', payload });
    },
    ResetTimeAttendantResult: (id, index) => async (dispatch, getState) => {
        const url = await URL + 'AttendantResult/ResetEndTime';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'id': id
            }
        };
        const response = await fetch(url, requestOptions);
        const resetTimeAttendantResult = await response.json();
        const payload = { resetTimeAttendantResult, index }
        dispatch({ type: 'RESET_TIME_ATTENDANT_RESULT', payload });
    },
    DeleteAttendantResult: (id, index) => async (dispatch, getState) => {
        const url = await URL + 'AttendantResult/Delele';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'id': id
            }
        };
        const response = await fetch(url, requestOptions);
        const deleteAttendantResult = await response.json();
        const payload = { deleteAttendantResult, index }
        dispatch({ type: 'DELETE_ATTENDANT_RESULT', payload });
    },
    /// Check KPI Attendant
    GetListAttendantKPI: (data) => async (dispatch, getState) => {
        const url = await URL + 'Attendant/GetEmployeeKPI';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': data.employeeId,
                'ShopId': data.shopId,
                'WorkDate': parseInt(moment(new Date(data.attendantDate)).format('YYYYMMDD')),
            }
        };
        const response = await fetch(url, requestOptions);
        const getlistKPI = await response.json();
        dispatch({ type: 'GET_LIST_CHECK_KPI', getlistKPI });
    },
    UpdateAttendantKPI: (data) => async (dispatch, getState) => {
        const url = await URL + 'Attendant/EmployeeKPI_Update';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        const updateListKPI = await response.json();
        dispatch({ type: 'UPDATE_LIST_CHECK_KPI', updateListKPI });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    let attendants = state.attendants.slice(0)
    let filterAttendantResult = state.filterAttendantResult
    switch (action.type) {
        case 'GET_List_Attendant':
            {
                return {
                    ...state,
                    attendants: action.attendants,
                    loading: false,
                    urlFileAttendant: [],
                    errors: 'Success ' + action.attendants.length,
                    forceReload: false
                }
            }
        case 'AQUA_SYNC_DATA':
            {
                return {
                    ...state,
                    loading: false,
                    errors: action.results.message,
                    urlFileAttendant: action.results,
                    forceReload: false
                }
            }
        case 'REPORT_Attendant':
            {
                return {
                    ...state,
                    reportAttendant: action.reportAttendant,
                }
            }
        case 'FILTER_DATA_UPDATE':
            {
                return {
                    ...state,
                    filterDataUpdate: action.filterDataUpdate,
                }
            }
        case 'GET_SHIFT_LIST':
            {
                return {
                    ...state,
                    getListShift: action.getListShift,
                }
            }
        case 'INSERT_ATTENDANT': {
            if (typeof action.insertAttendant === 'object' && action.insertAttendant[0] && action.insertAttendant[0].alert == "1") {
                attendants = action.insertAttendant
            }
            return {
                ...state,
                insertAttendant: action.insertAttendant,
                attendants: attendants
            }
        }
        case 'INSERT_ITEM': {
            if (typeof action.payload.insertItem === 'object' && action.payload.insertItem[0] && action.payload.insertItem[0].alert === "1") {
                let { photoDate, photoType, photoTime, photo } = action.payload.insertItem[0]
                attendants[action.payload.indexRow] = {
                    ...attendants[action.payload.indexRow],
                    [`image${photoType}`]: photo,
                    [`date${photoType}`]: photoTime
                }
            }
            return {
                ...state,
                insertItem: action.payload.insertItem,
                attendants: attendants
            }
        }
        case 'UPDATE_ATTENDANT': {
            if (typeof action.payload.updateAttendant === 'object' && action.payload.updateAttendant[0] && action.payload.updateAttendant[0].alert == "1") {
                let { photoDate, photoType, photoTime, photo } = action.payload.updateAttendant[0]
                attendants[action.payload.indexRow] = {
                    ...attendants[action.payload.indexRow],
                    [`image${photoType}`]: photo,
                    [`date${photoType}`]: photoTime
                }
                // /**
                //  * * If startIndex !== -1 
                //  * * which means drag image from Available to Unavailable.
                //  */
                if (action.payload.startIndex !== -1) {
                    attendants[action.payload.indexRow] = {
                        ...attendants[action.payload.indexRow],
                        [`image${action.payload.startIndex}`]: null,
                        [`date${action.payload.startIndex}`]: null
                    }
                }
            }
            return {
                ...state,
                updateAttendant: action.payload.updateAttendant,
                attendants: attendants
            }
        }
        case 'DELETE_ITEM': {
            if (action.payload.deleteItem[0] && action.payload.deleteItem[0].result === 1) {
                attendants[action.payload.indexRow] = {
                    ...attendants[action.payload.indexRow],
                    [`image${action.payload.idType}`]: null,
                    [`date${action.payload.idType}`]: null
                }
            }
            return {
                ...state,
                deleteItem: action.payload.deleteItem,
                attendants: attendants
            }
        }
        case 'DELETE_ATTENDANT': {
            if (action.payload.deleteAttendant.result === 1) {
                attendants.splice(action.payload.rowIndex, 1)
            }
            return {
                ...state,
                deleteAttendant: action.payload.deleteAttendant,
                attendants: attendants
            }
        }
        ////// Attendant Result
        case 'FILTER_ATTENDANT_RESULT':
            {
                return {
                    ...state,
                    filterAttendantResult: action.filterAttendantResult,
                }
            }
        case 'INSERT_ATTENDANT_RESULT': {
            if (typeof action.insertAttendantResult === "object" && action.insertAttendantResult[0] && action.insertAttendantResult[0].alert == "1") {
                filterAttendantResult.unshift(action.insertAttendantResult[0])
            }
            return {
                ...state,
                insertAttendantResult: action.insertAttendantResult,
                filterAttendantResult: filterAttendantResult,
            }
        }
        case 'UPDATE_ATTENDANT_RESULT': {
            if (typeof action.payload.updateAttendantResult === "object" && action.payload.updateAttendantResult[0] && action.payload.updateAttendantResult[0].alert == "1") {
                Object.assign(filterAttendantResult[action.payload.index], action.payload.updateAttendantResult[0])
            }
            return {
                ...state,
                updateAttendantResult: action.payload.updateAttendantResult,
                filterAttendantResult: filterAttendantResult,
            }
        }
        case 'RESET_TIME_ATTENDANT_RESULT': {
            if (typeof action.payload.resetTimeAttendantResult === "object" && action.payload.resetTimeAttendantResult[0] && action.payload.resetTimeAttendantResult[0].alert == "1") {
                Object.assign(filterAttendantResult[action.payload.index], action.payload.resetTimeAttendantResult[0])
            }
            return {
                ...state,
                resetTimeAttendantResult: action.payload.resetTimeAttendantResult,
                filterAttendantResult: filterAttendantResult,
            }
        }
        case 'DELETE_ATTENDANT_RESULT': {
            if (typeof action.payload.deleteAttendantResult[0] === "object" && action.payload.deleteAttendantResult[0].alert === '1') {
                filterAttendantResult.splice(action.payload.index, 1)
            }
            return {
                ...state,
                deleteAttendantResult: action.payload.deleteAttendantResult,
                filterAttendantResult: filterAttendantResult,
            }
        }
        /// Check KPI Attendant
        case 'GET_LIST_CHECK_KPI':
            {
                return {
                    ...state,
                    getlistKPI: action.getlistKPI,
                }
            }
        case 'UPDATE_LIST_CHECK_KPI':
            {
                return {
                    ...state,
                    updateListKPI: action.updateListKPI,
                }
            }
        default:
            return state;
    }
};