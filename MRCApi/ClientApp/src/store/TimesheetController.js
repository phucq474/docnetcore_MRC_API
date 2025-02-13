import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    timesheetResult: [],
    timesheetFinal: [],
    finalDetail: [],
    details: null,
    result: [],
    loading: true,
    errors: {},
    forceReload: false,
    exportTimeSheet: [],
    unLock: [],
    getShiftList: []
}
export const actionCreatorsTimesheet = {
    GetList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/getList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const timesheetResult = await response.json();
        dispatch({ type: 'GET_List_Timesheet', timesheetResult });
    },
    GetDetail: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/GetDetail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const details = await response.json();
        dispatch({ type: 'GET_Details', details });
    },
    GetList_Final: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/Final_GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const timesheetFinal = await response.json();
        dispatch({ type: 'GET_List_Final', timesheetFinal });
    },
    GetList_Final_Detail: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/Final_Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const finalDetail = await response.json();
        dispatch({ type: 'GET_List_Final_Detail', finalDetail });
    },

    SendNotify: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/sendNotify';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': data.employeeId,
                'WorkDate': data.workDate,
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_SendNotify', result });
    },
    UploadFiles: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/UploadFiles';
        const formData = new FormData();
        for (let index = 0; index < data.files.length; index++) {
            let element = data.files[index];
            formData.append('files', element);
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'ShopId': data.shopId,
                'EmployeeId': data.employeeId,
                'WorkDate': data.workDate,
                accId: accId || ""
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'POST_UploadFiles', result });
    },
    ExportTimeSheet: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const exportTimeSheet = await response.json();
        dispatch({ type: 'GET_Export_TimeSheet', exportTimeSheet });
    },
    UnLock: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/UnLock';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'workDate': data.workDate,
                'employeeId': data.employeeId,
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_UnLock', result });
    },
    GetShiftList: (employeeId, accId) => async (dispatch, getState) => {
        const url = URL + 'timesheet/GetShiftList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'employeeId': employeeId || "",
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GetShiftList', result });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_List_Timesheet':
            {
                return {
                    ...state,
                    timesheetResult: action.timesheetResult,
                }
            }
        case 'GET_List_Final':
            {
                return {
                    ...state,
                    timesheetFinal: action.timesheetFinal,
                }
            }
        case 'GET_List_Final_Detail':
            {
                return {
                    ...state,
                    finalDetail: action.finalDetail,
                }
            }
        case 'GET_Details':
            {
                return {
                    ...state,
                    details: action.details
                }
            }
        case 'GET_SendNotify':
            {
                return {
                    ...state,
                    result: action.result,
                }
            }
        case 'POST_UploadFiles':
            {
                return {
                    ...state,
                    result: action.result,
                }
            }
        case 'GET_Export_TimeSheet':
            {
                return {
                    ...state,
                    exportTimeSheet: action.exportTimeSheet,
                }
            }
        case 'GET_UnLock':
            {
                return {
                    ...state,
                    unLock: action.result,
                }
            }
        case 'GetShiftList':
            {
                return {
                    ...state,
                    getShiftList: action.result,
                }
            }
        default:
            return state;
    }
};