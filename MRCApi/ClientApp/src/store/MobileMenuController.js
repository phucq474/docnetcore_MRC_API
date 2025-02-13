import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    getMMList: [],
    mm_GetListMenu: [],
    mm_Filter: [],
    mm_Insert: [],
    mm_Update: [],
    mm_Delete: [],
}
export const MobileMenuCreateAction = {
    GetMMList: () => async (dispatch, getState) => {
        const url = URL + 'MobileMenu/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        const response = await fetch(url, requestOptions);
        const getMMList = await response.json();
        dispatch({ type: 'GET_MM_LIST', getMMList });
    },
    MM_GetListMenu: position => async (dispatch, getState) => {
        const url = URL + 'MobileMenu/GetListMenu';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'position': position || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const rs = await response.json();
        dispatch({ type: 'MM_GetListMenu', rs });
    },
    MM_Filter: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'MobileMenu/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const rs = await response.json();
        dispatch({ type: 'MM_Filter', rs });
    },
    MM_Insert: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'MobileMenu/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const rs = await response.json();
        dispatch({ type: 'MM_Insert', rs });
    },
    MM_Update: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'MobileMenu/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        };
        const response = await fetch(url, requestOptions);
        const rs = await response.json();
        dispatch({ type: 'MM_Update', rs });
    },

    MM_Delete: (id, accId) => async (dispatch, getState) => {
        const url = URL + 'MobileMenu/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'id': id || "",
                'accId': accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const rs = await response.json();
        dispatch({ type: 'MM_Delete', rs });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_MM_LIST': {
            return {
                ...state,
                getMMList: action.getMMList,
            }
        }
        case 'MM_GetListMenu':
            {
                return {
                    ...state,
                    mm_GetListMenu: action.rs,
                }
            }
        case 'MM_Filter':
            {
                return {
                    ...state,
                    mm_Filter: action.rs,
                }
            }
        case 'MM_Insert':
            {
                return {
                    ...state,
                    mm_Insert: action.rs,
                }
            }
        case 'MM_Update':
            {
                return {
                    ...state,
                    mm_Update: action.rs,
                }
            }
        case 'MM_Delete':
            {
                return {
                    ...state,
                    mm_Delete: action.rs,
                }
            }
        default:
            return state;
    }
}