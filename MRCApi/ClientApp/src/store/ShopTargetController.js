import {URL,getToken,getAccountId,getEmployeeId} from '../Utils/Helpler';
const initialState = {
    listTargets: [],
    getStoreName: [],
    getProvinceCode: [],
    insertListTarget: [],
    updateListTarget: [],
    deleteListTarget: [],
    exportListTarget: [],
    importListTarget: [],
    listTargetName: [],
}
export const ShopTargetAPI = {
    GetListTarget: (year = "",month = "",region = "",position = "",employee = "",check = "",targetName = "") => async (dispatch,getState) => {
        const url = URL + 'shoptarget/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "appliaction/json",
                "accountId": getAccountId(),
                "year": year,
                "month": month,
                "region": region,
                "position": position,
                "employee": employee,
                "check": check,
                "targetName": targetName,
            }
        };
        const response = await fetch(url,requestOptions);
        const listTargets = await response.json();
        dispatch({type: 'GET_LIST_TARGET',listTargets});
    },
    GetStoreName: () => async (dispatch,getState) => {
        const url = URL + 'shoptarget/GetStoreName';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            }
        };
        const response = await fetch(url,requestOptions);
        const getStoreName = await response.json();
        dispatch({type: 'GET_STORE_NAME',getStoreName});
    },
    GetProvinceCode: () => async (dispatch,getState) => {
        const url = URL + 'shoptarget/GetProvinceCode';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            }
        };
        const response = await fetch(url,requestOptions);
        const getProvinceCode = await response.json();
        dispatch({type: 'GET_PROVINCE_CODE',getProvinceCode});
    },
    InsertListTarget: (data = {}) => async (dispatch,getState) => {
        const url = URL + 'shoptarget/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url,requestOptions);
        const insertListTarget = await response.json();
        dispatch({type: 'INSERT_LIST_TARGET',insertListTarget});
    },
    UpdateListTarget: (data = {},idx) => async (dispatch,getState) => {
        const url = URL + 'shoptarget/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url,requestOptions);
        const updateListTarget = await response.json();
        const payload = await {updateListTarget,data,idx}
        dispatch({type: 'UPDATE_LIST_TARGET',payload});
    },
    DeleteListTarget: data => async (dispatch,getState) => {
        const url = URL + 'shoptarget/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url,requestOptions);
        const deleteListTarget = await response.json();
        const payload = await {deleteListTarget,id: data.id}
        dispatch({type: 'DELETE_LIST_TARGET',payload});
    },
    ExportListTarget: (year = "", month = "", region = "", position = "", employee = "", check = "", targetName = "") => async (dispatch,getState) => {
        const url = URL + 'shoptarget/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "appliaction/json",
                "accountId": getAccountId(),
                "year": year,
                "month": month,
                "region": region,
                "position": position,
                "employee": employee,
                "check": check,
                "targetName": targetName,
            }
        };
        const response = await fetch(url,requestOptions);
        const exportListTarget = await response.json();
        dispatch({type: 'EXPORT_LIST_TARGET',exportListTarget});
    },
    ImportListTarget: (file) => async (dispatch,getState) => {
        const url = await URL + 'shoptarget/Import';
        const formData = await new FormData();
        await formData.append('ifile',file)
        const requestOptions = await {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData
        };
        const response = await fetch(url,requestOptions);
        const importListTarget = await response.json();
        dispatch({type: 'IMPORT_LIST_TARGET',importListTarget});
    },
    GetTargetName: () => async (dispatch,getState) => {
        const url = await URL + 'shoptarget/GetTargetName';
        const requestOptions = await {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url,requestOptions);
        const listTargetName = await response.json();
        dispatch({type: 'GET_TARGET_NAME',listTargetName});
    },
};
export const reducer = (state,action) => {
    state = state || initialState;
    let listTargets = state.listTargets
    switch(action.type) {
        case 'GET_LIST_TARGET':
            {
                return {
                    ...state,
                    listTargets: action.listTargets
                }
            }
        case 'GET_STORE_NAME':
            {
                return {
                    ...state,
                    getStoreName: action.getStoreName
                }
            }
        case 'GET_PROVINCE_CODE':
            {
                return {
                    ...state,
                    getProvinceCode: action.getProvinceCode
                }
            }
        case 'INSERT_LIST_TARGET':
            {
                return {
                    ...state,
                    insertListTarget: action.insertListTarget
                }
            }
        case 'UPDATE_LIST_TARGET': {
            if(typeof action.payload.updateListTarget === "object" && action.payload.updateListTarget[0] && action.payload.updateListTarget[0].result === 1) {
                listTargets[action.payload.idx] = {
                    ...state.listTargets[action.payload.idx],
                    quanlity: action.payload.data.quantity,
                    visit: action.payload.data.visit,
                    amount: action.payload.data.amount,
                    targetName: action.payload.data.targetName,
                }
            }
            return {
                ...state,
                listTargets: listTargets,
                updateListTarget: action.payload.updateListTarget
            }
        }
        case 'DELETE_LIST_TARGET':
            {
                return {
                    ...state,
                    listTargets: state.listTargets.filter(e => e.id !== action.payload.id),
                    deleteListTarget: action.payload.deleteListTarget
                }
            }
        case 'EXPORT_LIST_TARGET':
            {
                return {
                    ...state,
                    exportListTarget: action.exportListTarget
                }
            }
        case 'IMPORT_LIST_TARGET':
            {
                return {
                    ...state,
                    importListTarget: action.importListTarget
                }
            }
        case 'GET_TARGET_NAME':
            {
                return {
                    ...state,
                    listTargetName: action.listTargetName
                }
            }
        default:
            return state;
    }
};