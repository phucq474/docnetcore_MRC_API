import { URL, getToken, getAccountId } from '../Utils/Helpler';
const initialState = {
    employeePermission: [],
    updatePermission: [],
    getParentAccountMenus: [],
    getListMenus: [],
    filterAccountMenu: [],
    updateMenu: [],
    deleteMenu: [],
    getTopMenus: [],
    insertMenu: [],
};
export const PermissionAPI = {
    GetParentAccountMenus: () => async (dispatch, getState) => {
        const url = URL + 'menu/getparentaccountmenu';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "accountId": getAccountId()
            }
        };
        const response = await fetch(url, requestOptions);
        const getParentAccountMenus = await response.json();
        dispatch({ type: 'GET_PARENT_ACCOUNT_MENU', getParentAccountMenus });
    },
    GetListMenus: () => async (dispatch, getState) => {
        const url = URL + 'menu/getlistmenus';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const getListMenus = await response.json();
        dispatch({ type: 'GET_LIST_MENU', getListMenus });
    },
    GetTopMenus: () => async (dispatch, getState) => {
        const url = URL + 'menu/GetListTopMenus';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        let getTopMenus = await response.json();
        getTopMenus = await JSON.parse(getTopMenus[0].menu)
        dispatch({ type: 'GET_TOP_MENU', getTopMenus });
    },
    FilterAccountMenu: (menuId) => async (dispatch, getState) => {
        const url = URL + 'menu/filteraccountmenu';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "accountId": getAccountId(),
                "menuId": menuId
            }
        };
        const response = await fetch(url, requestOptions);
        const filterAccountMenu = await response.json();
        dispatch({ type: 'FILTER_ACCOUNT_MENU', filterAccountMenu });
    },
    GetEmployeePermission: (employeeId = 0, position = 0) => async (dispatch, getState) => {
        const url = URL + 'menu/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'employeeId': employeeId,
                'position': position,
            }
        };
        const response = await fetch(url, requestOptions);
        const employeePermission = await response.json();
        dispatch({ type: 'GET_EMPLOYEE_PERMISSION', employeePermission });
    },
    UpdateEmployeePermission: (employeeId, position, data) => async (dispatch, getState) => {
        const url = URL + 'menu/permission';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                'EmployeeId': employeeId || 0,
                'Position': position || 0,
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        const updatePermission = await response.json();
        dispatch({ type: 'UPDATE_EMPLOYEE_PERMISSION', updatePermission });
    },
    InsertMenu: (data) => async (dispatch, getState) => {
        const url = URL + 'menu/insertmenu';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const insertMenu = await response.json();
        dispatch({ type: 'INSERT_MENU', insertMenu });
    },
    DeleteMenu: (menuID) => async (dispatch, getState) => {
        const url = URL + 'menu/DisableMenu';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
                "id": menuID
            },
        };
        const response = await fetch(url, requestOptions);
        const deleteMenu = await response.json();
        dispatch({ type: 'DELETE_MENU', deleteMenu });
    },
    UpdateMenu: (data) => async (dispatch, getState) => {
        const url = URL + 'menu/UpdateMenu';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const updateMenu = await response.json();
        dispatch({ type: 'UPDATE_MENU', updateMenu });
    },
    getPermissionUser: () => async (dispatch, getState) => {
        const url = URL + 'menu/GetPermission';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            }
        };
        const response = await fetch(url, requestOptions);
        const menuDatas = await response.json();
        let objMenuDatas = {}
        for (let i = 0, lenDatas = menuDatas.length; i < lenDatas; i++) {
            objMenuDatas[menuDatas[i].pageId] = menuDatas[i]
        }
        await sessionStorage.setItem("permission", JSON.stringify(objMenuDatas))
        dispatch({ type: 'GET_LIST_FILTER_PAGEID' });
    },
    GetAccountMenu: (menuID) => async (dispatch, getState) => {
        const url = URL + 'menu/FilterAccountMenu';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "id": menuID
            },
        };
        const response = await fetch(url, requestOptions);
        const getAccountMenu = await response.json();
        dispatch({ type: 'GET_ACCOUNT_MENU', getAccountMenu });
    },
};

export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_EMPLOYEE_PERMISSION':
            {
                return {
                    ...state,
                    employeePermission: action.employeePermission
                }
            }
        case 'UPDATE_EMPLOYEE_PERMISSION':
            {
                return {
                    ...state,
                    updatePermission: action.updatePermission
                }
            }
        case 'GET_PARENT_ACCOUNT_MENU':
            {
                return {
                    ...state,
                    getParentAccountMenus: action.getParentAccountMenus
                }
            }
        case 'GET_LIST_MENU':
            {
                return {
                    ...state,
                    getListMenus: action.getListMenus
                }
            }

        case 'FILTER_ACCOUNT_MENU':
            {
                return {
                    ...state,
                    filterAccountMenu: action.filterAccountMenu
                }
            }
        case 'GET_TOP_MENU':
            {
                return {
                    ...state,
                    getTopMenus: action.getTopMenus
                }
            }
        case 'INSERT_MENU':
            {
                return {
                    ...state,
                    insertMenu: action.insertMenu
                }
            }
        case 'DELETE_MENU':
            {
                return {
                    ...state,
                    deleteMenu: action.deleteMenu
                }
            }
        case 'UPDATE_MENU':
            {
                return {
                    ...state,
                    updateMenu: action.updateMenu
                }
            }
        case 'GET_LIST_FILTER_PAGEID':
            {
                return {
                    ...state,
                }
            }
        case 'GET_ACCOUNT_MENU':
            {
                return {
                    ...state,
                    getAccountMenu: action.getAccountMenu
                }
            }
        default:
            return state;
    }
};