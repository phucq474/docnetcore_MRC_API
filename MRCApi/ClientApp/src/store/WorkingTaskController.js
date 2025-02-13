import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    wkt_filter: [],
    wkt_getTask: [],
    wkt_save: [],
    wkt_export: [],
    wkt_GetDetailByEmployee: [],
    coaching_Filter: [],
    coaching_Detail: [],
    coaching_Export: [],

    coaching_ByEmployee_Filter: [],
    coaching_ByEmployee_Detail: [],
    coaching_GetList: []
}
export const WorkingTaskCreateAction = {
    WorkingTask_Filter: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Filter';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'WorkingTask_Filter', result });
    },
    WorkingTask_GetTask: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/GetTask';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'json': JSON.stringify(data)
            },
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'WorkingTask_GetTask', result });
    },
    WorkingTask_Save: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Save';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'WorkingTask_Save', result });
    },
    WorkingTask_Export: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Export';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'WorkingTask_Export', result });
    },
    WorkingTask_GetDetailByEmployee: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/GetDetailByEmployee';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'json': JSON.stringify(data)
            },
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'WorkingTask_GetDetailByEmployee', result });
    },
    Coaching_Filter: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Coaching/Filter';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'Coaching_Filter', result });
    },
    Coaching_Detail: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Coaching/Detail';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'Coaching_Detail', result });
    },
    Coaching_Export: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Coaching/Export';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'Coaching_Export', result });
    },
    Coaching_ByEmployee_Filter: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Coaching/ByEmployee/Filter';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'Coaching_ByEmployee_Filter', result });
    },
    Coaching_ByEmployee_Detail: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Coaching/ByEmployee/Detail';
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'Coaching_ByEmployee_Detail', result });
    },
    Coaching_GetList: (data) => async (dispatch, getState) => {
        const url = await URL + 'WorkingTask/Coaching/GetList';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            },
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'Coaching_GetList', result });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'WorkingTask_Filter':
            {
                return {
                    ...state,
                    wkt_filter: action.result,
                }
            }
        case 'WorkingTask_GetTask':
            {
                return {
                    ...state,
                    wkt_getTask: action.result,
                }
            }
        case 'WorkingTask_Save':
            {
                return {
                    ...state,
                    wkt_save: action.result,
                }
            }
        case 'WorkingTask_Export':
            {
                return {
                    ...state,
                    wkt_export: action.result,
                }
            }
        case 'WorkingTask_GetDetailByEmployee':
            {
                return {
                    ...state,
                    wkt_GetDetailByEmployee: action.result,
                }
            }
        case 'Coaching_Filter':
            {
                return {
                    ...state,
                    coaching_Filter: action.result,
                }
            }
        case 'Coaching_Export':
            {
                return {
                    ...state,
                    coaching_Export: action.result,
                }
            }
        case 'Coaching_Detail':
            {
                return {
                    ...state,
                    coaching_Detail: action.result,
                }
            }
        case 'Coaching_ByEmployee_Filter':
            {
                return {
                    ...state,
                    coaching_ByEmployee_Filter: action.result,
                }
            }
        case 'Coaching_ByEmployee_Detail':
            {
                return {
                    ...state,
                    coaching_ByEmployee_Detail: action.result,
                }
            }
        case 'Coaching_GetList':
            {
                return {
                    ...state,
                    coaching_GetList: action.result,
                }
            }
        default:
            return state;
    }
};