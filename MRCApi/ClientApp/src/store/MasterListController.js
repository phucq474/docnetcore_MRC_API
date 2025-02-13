import {getToken} from '../Utils/Helpler';
const initialState = {
    list: [],
    getListCodeMasterlist: [],
    getNameMasterlist: [],
    filterMasterList: [],
    insertMasterList: [],
    updateMasterList: [],
    deleteMasterList: [],
}
export const MasterListAPI = {
    GetData: (listCode = "",name = "") => async (dispatch,getState) => {
        const url = "/masterlistdata/getfiltermaster";
        const configs = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                "listCode": listCode,
                "name": name
            }
        };
        const response = await fetch(url,configs);
        const list = await response.json();
        dispatch({type: 'GET_DATA_MASTERLIST',list});
    },
    GetListCode: () => async (dispatch,getState) => {
        const url = "/masterlistdata/GetListCode";
        const configs = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(url,configs);
        const getListCodeMasterlist = await response.json();
        dispatch({type: 'GET_LIST_CODE_MASTERLIST',getListCodeMasterlist});
    },
    GetName: () => async (dispatch,getState) => {
        const url = "/masterlistdata/GetName";
        const configs = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(url,configs);
        const getNameMasterlist = await response.json();
        dispatch({type: 'GET_NAME_MASTERLIST',getNameMasterlist});
    },
    FilterMasterList: (data) => async (dispatch,getState) => {
        const url = "/masterlistdata/Filter";
        const configs = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Jsondata': JSON.stringify(data),
            }
        };
        const response = await fetch(url,configs);
        const filterMasterList = await response.json();
        dispatch({type: 'FILTER_MASTERLIST',filterMasterList});
    },
    InsertMasterList: (data) => async (dispatch,getState) => {
        const url = 'masterlistdata/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url,requestOptions);
        const insertMasterList = await response.json();
        dispatch({type: 'INSERT_MASTERLIST',insertMasterList});
    },
    UpdateMasterList: (data,rowIndex) => async (dispatch,getState) => {
        const url = 'masterlistdata/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url,requestOptions);
        const updateMasterList = await response.json();
        const payload = await {updateMasterList,rowIndex}
        dispatch({type: 'UPDATE_MASTERLIST',payload});
    },
    DeleteMasterList: (data,rowIndex) => async (dispatch,getState) => {
        const url = 'masterlistdata/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url,requestOptions);
        const deleteMasterList = await response.json();
        const payload = await {deleteMasterList,rowIndex}
        dispatch({type: 'DELETE_MASTERLIST',payload});
    },
};

export const reducer = (state = initialState,action) => {
    let filterMasterList = state.filterMasterList
    switch(action.type) {
        case 'GET_DATA_MASTERLIST': {
            return {
                ...state,
                list: action.list,
            }
        }
        case 'GET_LIST_CODE_MASTERLIST': {
            return {
                ...state,
                getListCodeMasterlist: action.getListCodeMasterlist,
            }
        }
        case 'GET_NAME_MASTERLIST': {
            return {
                ...state,
                getNameMasterlist: action.getNameMasterlist,
            }
        }
        case 'FILTER_MASTERLIST': {
            return {
                ...state,
                filterMasterList: action.filterMasterList,
            }
        }
        case 'INSERT_MASTERLIST': {
            if(typeof action.insertMasterList === "object" && action.insertMasterList[0] && action.insertMasterList[0].alert == "1") {
                filterMasterList.unshift(action.insertMasterList[0])
            }
            return {
                ...state,
                insertMasterList: action.insertMasterList,
                filterMasterList: filterMasterList,
            }
        }
        case 'UPDATE_MASTERLIST': {
            if(typeof action.payload.updateMasterList === "object" && action.payload.updateMasterList[0] && action.payload.updateMasterList[0].alert == "1") {
                Object.assign(filterMasterList[action.payload.rowIndex],action.payload.updateMasterList[0])
            }
            return {
                ...state,
                updateMasterList: action.payload.updateMasterList,
                filterMasterList: filterMasterList,
            }
        }
        case 'DELETE_MASTERLIST': {
            if(typeof action.payload.deleteMasterList === "object" && action.payload.deleteMasterList[0] && action.payload.deleteMasterList[0].alert == "1") {
                filterMasterList.splice(action.payload.rowIndex,1)
            }
            return {
                ...state,
                deleteMasterList: action.payload.deleteMasterList,
                filterMasterList: filterMasterList,
            }
        }
        default:
            return state;
    }
};
