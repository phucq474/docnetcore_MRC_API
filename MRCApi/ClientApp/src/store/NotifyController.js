import { getToken } from './../Utils/Helpler';
const initialState = {
    notifylist: [],
    notifygroup: [],
    notifyTitle: [],
    loading: false,
    errors: {},
    forceReload: false
}
export const actionCreatorsNotify = {
    GetGroup: () => async (dispatch, getState) => {
        const url = '/notify/notifygroup';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const notifygroup = await response.json();
        dispatch({ type: 'GET_GROUP_NOTIFY', notifygroup });
    },
    GetTitle: () => async (dispatch, getState) => {
        const url = '/notify/notifyTitle';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const notifyTitle = await response.json();
        dispatch({ type: 'GET_TITLE_NOTIFY', notifyTitle });
    },
    GetNotify: data => async (dispatch, getState) => {
        const url = '/notify/list';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
                // 'Month': data.Month,
                // 'Year': data.Year,
                // 'Status': data.Status,
                // 'EmployeeId': data.EmployeeId,
                // 'notifyType': data.notifyType,
                // 'Position': data.position,
                
            },body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        const notifylist = await response.json();
        dispatch({ type: 'GET_LIST_NOTIFY', notifylist });
    },
    Export: data => async (dispatch, getState) => {
        const url = '/notify/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
                // 'Month': data.Month,
                // 'Year': data.Year,
                // 'Status': data.Status,
                // 'EmployeeId': data.EmployeeId,
                // 'notifyType': data.notifyType,
                // 'Position': data.position
            },body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        await console.log(response)
        const ExportNotifyList = await response.json();
        dispatch({ type: 'EXPORT_LIST_NOTIFY', ExportNotifyList });
    },
    RemoveNotify: (data) => async (dispatch, getState) => {
        const url = '/notify/remove';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'IdList': data.toString()
            }
        };
        const response = await fetch(url, requestOptions);
        let results = await response.json();
        if (results > 0)
            results = data;
        dispatch({ type: 'REMOVE_NOTIFY', results });
    },
    SendNotify: data => async (dispatch, getState) => {
        const url = '/notify/sendall';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        let results = await response.text();
        dispatch({ type: 'SEND_NOTIFY', results });
    },
    SendByContent: (data) => async (dispatch, getState) => {
        const url = '/notify/sendbycontent';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        let results = await response.text();
        dispatch({ type: 'SEND_BY_CONTENT', results });
    },
    PostFile: data => async (dispatch, getState) => {
        const formData = new FormData();
        formData.append('file', data.file);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Year': data.Year,
                'Month': data.Month,
            },
            body: formData
        };
        let uploaded;
        fetch('notify/import', requestOptions).then(response => {
            if (response.ok) {
                response.json().then((result) => {
                    uploaded = result.message;
                    dispatch({ type: 'POST_FILE_UPLOAD', uploaded });
                });
            } else {
                uploaded = "Lỗi file upload";
                dispatch({ type: 'POST_FILE_UPLOAD', uploaded });
            }
        });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LIST_NOTIFY':
            {
                return {
                    ...state,
                    notifylist: action.notifylist,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'GET_GROUP_NOTIFY':
            {
                return {
                    ...state,
                    notifygroup: action.notifygroup,
                    loading: false,
                    forceReload: false
                }
            }
        case 'GET_TITLE_NOTIFY':
            {
                return {
                    ...state,
                    notifyTitle: action.notifyTitle,
                    loading: false,
                    forceReload: false
                }
            }
        case 'SEND_NOTIFY':
            {
                return {
                    ...state,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        case 'SEND_BY_CONTENT':
            {
                return {
                    ...state,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        case 'REMOVE_NOTIFY':
            {
                let removelist = state.notifylist;
                var index = removelist.map(x => { return x.id; }).indexOf(action.results);
                if (index > -1)
                    removelist.splice(index, 1);
                return {
                    ...state,
                    loading: false,
                    errors: 'Đã xóa id ' + action.results,
                    notifylist: removelist,
                    forceReload: false
                }
            }
        case 'POST_FILE_UPLOAD':
            {
                return {
                    ...state,
                    loading: false,
                    errors: action.uploaded,
                    forceReload: false
                }
            }
        case 'EXPORT_LIST_NOTIFY':
            {
                return {
                    ...state,
                    ExportNotifyList: action.ExportNotifyList,
                }
            }
        default:
            return state;
    }
};