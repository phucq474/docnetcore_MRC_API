import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    reportList: [],
    urlFileReport: '',
    loading: true,
    errors: {},
}
export const ReportCreateAction = {
    GetListReport: data => async (dispatch, getState) => {
        const url = URL + 'Report/GetReportList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const reportList = await response.json();
        dispatch({ type: 'GET_GetReportList', reportList });
    },
    GetFileReport: data => async (dispatch, getState) => {

        const url = URL + 'Report/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'ReportType': data.reportType,
                'JsonData': JSON.stringify(data),
            }
        };
        //const request = new Request(url,requestOptions);
        const response = await fetch(url, requestOptions);
        const urlFileReport = await response.json();
        dispatch({ type: 'GET_FILE_REPORT', urlFileReport });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_GetReportList':
            {
                return {
                    ...state,
                    reportList: action.reportList,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        case 'GET_FILE_REPORT':
            {
                return {
                    ...state,
                    urlFileReport: action.urlFileReport,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        default:
            return state;
    }
};