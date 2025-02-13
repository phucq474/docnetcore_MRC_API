import {URL,getToken,b64EncodeUnicode} from '../Utils/Helpler';
import moment from 'moment';

const initialState = {
    filterCompetitor: [],
    insertCompetitor: [],
    updateCompetitor: [],
    deleteCompetitor: [],
    exportCompetitor: [],
    importCompetitor: [],

    //Competitor/Result
    competitorResultFilter: [],
    competitorResultExport: [],
    competitorResultDetail: [],

    //Competitor/CompetitorDetails
    filterCompeDetail: [],
    insertCompDetail: [],
    deleteCompDetail: [],
    getListCate: []
}
export const CompetitorCreateAction = {
    FilterCompetitor: (id) => async (dispatch,getState) => {
        const url = URL + 'Competitor/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'id': id,
            },
        };
        const response = await fetch(url,requestOptions);
        const filterCompetitor = await response.json();
        dispatch({type: 'FILTER_COMPETITOR',filterCompetitor});
    },
    InsertCompetitor: (data) => async (dispatch,getState) => {
        const url = URL + 'Competitor/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url,requestOptions);
        const insertCompetitor = await response.json();
        dispatch({type: 'INSERT_COMPETITOR',insertCompetitor});
    },
    UpdateCompetitor: (data,rowIndex) => async (dispatch,getState) => {
        const url = URL + 'Competitor/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url,requestOptions);
        const updateCompetitor = await response.json();
        const payload = await {updateCompetitor,rowIndex}
        dispatch({type: 'UPDATE_COMPETITOR',payload});
    },
    DeleteCompetitor: (id,rowIndex) => async (dispatch,getState) => {
        const url = URL + 'Competitor/Delete_DisplayItems';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "id": id,
            },
        };
        const response = await fetch(url,requestOptions);
        const deleteCompetitor = await response.json();
        const payload = await {deleteCompetitor,rowIndex}
        dispatch({type: 'DELETE_COMPETITOR',payload});
    },
    ExportCompetitor: (data) => async (dispatch,getState) => {
        const url = URL + 'Competitor/Export_Competitor';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "fromDate": data.fromDate,
                "toDate": data.toDate,
                "displayId": data.displayId,
            },
        };
        const response = await fetch(url,requestOptions);
        const exportCompetitor = await response.json();
        dispatch({type: 'EXPORT_COMPETITOR',exportCompetitor});
    },
    ImportCompetitor: (file) => async (dispatch,getState) => {
        const url = URL + 'Competitor/Import_Competitor';
        const formData = await new FormData();
        await formData.append('fileUpload',file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData
        };
        const response = await fetch(url,requestOptions);
        const importCompetitor = await response.json();
        dispatch({type: 'IMPORT_COMPETITOR',importCompetitor});
    },
    /// Conpetitor/Result
    FilterResult: JsonData => async (dispatch, getState) => {
        const url = '/Competitor/Filter_CompetitorResult';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const competitorResultFilter = await response.json();
        dispatch({ type: 'GET_COMPETITOR_RESULT', competitorResultFilter });
    },
    ExportResult: JsonData => async (dispatch, getState) => {
        const url = '/Competitor/Export_CompetitorResult';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const competitorResultExport = await response.json();
        dispatch({ type: 'EXPORT_COMPETITOR_RESULT', competitorResultExport });
    },
    DetailResult: JsonData => async (dispatch, getState) => {
        const url = '/Competitor/Detail_CompetitorResult';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': JsonData.employeeId,
                'ShopId': JsonData.shopId,
                'WorkDate': +moment(JsonData.workDate).format('YYYYMMDD')
            }
        };
        const response = await fetch(url, requestOptions);
        const competitorResultDetail = await response.json();
        dispatch({ type: 'DETAIL_COMPETITOR_RESULT', competitorResultDetail });
    },
    FilterCompeDetail: (data) => async (dispatch,getState) => {
        const url = URL + 'Competitor/FilterCompeDetail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url,requestOptions);
        const filterCompeDetail = await response.json();
        dispatch({type: 'POST_FILTER_COMPETITOR_DETAIL',filterCompeDetail});
    },
    InsertCompDetail: (data) => async (dispatch,getState) => {
        const url = URL + 'Competitor/InsertCompDetail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data) 
        };
        const response = await fetch(url,requestOptions);
        const insertCompDetail = await response.json();
        dispatch({type: 'POST_INSERT_COMPETITOR_DETAIL',insertCompDetail});
    },
    DeleteCompDetail: (id) => async (dispatch,getState) => {
        const url = URL + 'Competitor/DeleteCompDetail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': id
            }
        };
        const response = await fetch(url,requestOptions);
        const deleteCompDetail = await response.json();
        dispatch({type: 'POST_DELETE_COMPETITOR_DETAIL',deleteCompDetail});
    },
    GetListCate: () => async (dispatch,getState) => {
        const url = URL + 'Competitor/GetListCategory';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            },
        };
        const response = await fetch(url,requestOptions);
        const getListCate = await response.json();
        dispatch({type: 'GET_LIST_CATEGORY',getListCate});
    },
};
export const reducer = (state,action) => {
    state = state || initialState;
    let filterCompetitor = state.filterCompetitor
    switch(action.type) {
        case 'FILTER_COMPETITOR': {
            return {
                ...state,
                filterCompetitor: action.filterCompetitor,
            }
        }
        case 'INSERT_COMPETITOR': {
            if(typeof action.insertCompetitor === "object" && action.insertCompetitor[0] && action.insertCompetitor[0].alert == "1") {
                filterCompetitor.unshift(action.insertCompetitor[0])
            }
            return {
                ...state,
                insertCompetitor: action.insertCompetitor,
                filterCompetitor: filterCompetitor,
            }
        }
        case 'UPDATE_COMPETITOR': {
            if(typeof action.payload.updateCompetitor === "object" && action.payload.updateCompetitor[0] && action.payload.updateCompetitor[0].alert == "1") {
                Object.assign(filterCompetitor[action.payload.rowIndex],action.payload.updateCompetitor[0])
            }
            return {
                ...state,
                updateCompetitor: action.payload.updateCompetitor,
                filterCompetitor: filterCompetitor,
            }
        }
        case 'DELETE_COMPETITOR': {
            if(typeof action.payload.deleteCompetitor === "object" && action.payload.deleteCompetitor[0] && action.payload.deleteCompetitor[0].alert == "1") {
                filterCompetitor.splice(action.payload.rowIndex,1)
            }
            return {
                ...state,
                deleteCompetitor: action.payload.deleteCompetitor,
                filterCompetitor: filterCompetitor,
            }
        }
        case 'EXPORT_COMPETITOR': {
            return {
                ...state,
                exportCompetitor: action.exportCompetitor,
            }
        }
        case 'IMPORT_COMPETITOR': {
            return {
                ...state,
                importCompetitor: action.importCompetitor,
            }
        }
        /// OOL-Resulut
        case 'GET_COMPETITOR_RESULT':
            {
                return {
                    ...state,
                    competitorResultFilter: action.competitorResultFilter
                }
            }
        case 'EXPORT_COMPETITOR_RESULT':
            {
                return {
                    ...state,
                    competitorResultExport: action.competitorResultExport
                }
            }
        case 'DETAIL_COMPETITOR_RESULT':
            {
                return {
                    ...state,
                    competitorResultDetail: action.competitorResultDetail
                }
            }
        case 'POST_FILTER_COMPETITOR_DETAIL':
            {
                return {
                    ...state,
                    filterCompeDetail: action.filterCompeDetail
                }
            } 
        case 'POST_INSERT_COMPETITOR_DETAIL':
            {
                return {
                    ...state,
                    insertCompDetail: action.insertCompDetail
                }
            }   
        case 'POST_DELETE_COMPETITOR_DETAIL':
            {
                return {
                    ...state,
                    deleteCompDetail: action.deleteCompDetail
                }
            }   
        case 'GET_LIST_CATEGORY':
            {
                return {
                    ...state,
                    getListCate: action.getListCate
                }
            } 
            
        default:
            return state;
    }
};