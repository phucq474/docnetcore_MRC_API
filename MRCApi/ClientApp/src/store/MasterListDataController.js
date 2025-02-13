import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    masterlist: [],
    listWorkingStatus: [],
    banklist: [],
    competitor: [],
    loading: true,
    errors: {},
    forceReload: false
};
export const MasterListActionCreate = {
    GetMasterListData: (accId) => async (dispatch, getState) => {
        const url = URL + 'MasterListData/list';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const masterListDatas = await response.json();
        dispatch({ type: 'GET_MasterListData', masterListDatas });
    }, GetListWorkingStatus: () => async (dispatch, getState) => {
        const url = URL + 'masterlistdata/ListWorkingStatus';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        const response = await fetch(url, requestOptions);
        const listWorkingStatus = await response.json();
        dispatch({ type: 'GET_ListWorkingStatus', listWorkingStatus })
    }, GetBankList: () => async (dispatch, getState) => {
        const url = URL + 'masterlistdata/banks';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        const response = await fetch(url, requestOptions);
        const banks = await response.json();
        dispatch({ type: 'GET_BANK', banks })
    }, GetCompetitor: () => async (dispatch, getState) => {
        const url = URL + 'masterlistdata/competitor';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        const response = await fetch(url, requestOptions);
        const results = await response.json();
        dispatch({ type: 'GET_LIST_COMPETITOR', results })
    },
};

export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_BANK':
            {
                return {
                    ...state,
                    banklist: action.banks,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        case 'GET_LIST_COMPETITOR':
            {
                return {
                    ...state,
                    competitor: action.results,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }

        case 'GET_MasterListData':
            {
                return {
                    ...state,
                    masterlist: action.masterListDatas,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        case 'GET_ListWorkingStatus':
            {
                return {
                    ...state,
                    listWorkingStatus: action.listWorkingStatus
                }
            }
        default:
            return state;
    }
};