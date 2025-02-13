import { getToken } from './../Utils/Helpler';
import moment from 'moment'
const initialState = {
    filterPromotion: [],
    detailPromotion: [],
    exportPromotion: [],
    loading: false,
    errors: {},
    forceReload: false,
    //promotion list
    filterPromotionList: [],
    exportPromotionList: [],
    importPromotionList: [],
    templatePromotionList: [],
    insertPromotionList: [],
    updatePromotionList: [],

    divisionList: [],
    promotionTypeList: []
}
export const actionCreatorsPromotion = {
    FilterPromotion: JsonData => async (dispatch, getState) => {
        const url = '/PromotionResults/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterPromotion = await response.json();
        dispatch({ type: 'FILTER_PROMOTION_RESULT', filterPromotion });
    },
    DetailPromotion: JsonData => async (dispatch, getState) => {
        const url = '/PromotionResults/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': JsonData.employeeId,
                'ShopId': JsonData.shopId,
                'WorkDate': +moment(new Date(JsonData.workDate)).format('YYYYMMDD'),
            }
        };
        const response = await fetch(url, requestOptions);
        const detailPromotion = await response.json();
        dispatch({ type: 'DETAIL_PROMOTION_RESULT', detailPromotion });
    },
    ExportPromotion: JSonData => async (dispatch, getState) => {
        const url = '/PromotionResults/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(JSonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const exportPromotion = await response.json();
        dispatch({ type: 'EXPORT_PROMOTION_RESULT', exportPromotion });
    },
    // Promotion List
    FilterPromotionList: JsonData => async (dispatch, getState) => {
        const url = '/PromotionList/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(JsonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const filterPromotionList = await response.json();
        dispatch({ type: 'FILTER_PROMOTION_LIST', filterPromotionList });
    },
    ExportPromotionList: JsonData => async (dispatch, getState) => {
        const url = '/PromotionList/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(JsonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const exportPromotionList = await response.json();
        dispatch({ type: 'EXPORT_PROMOTION_LIST', exportPromotionList });
    },
    ImportPromotionList: fileUpload => async (dispatch, getState) => {
        const url = '/PromotionList/Import';
        const formData = new FormData();
        formData.append('fileUpload', fileUpload)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const importPromotionList = await response.json();
        dispatch({ type: 'IMPORT_PROMOTION_LIST', importPromotionList });
    },
    TemplatePromotionList: () => async (dispatch, getState) => {
        const url = '/PromotionList/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
        };
        const response = await fetch(url, requestOptions);
        const templatePromotionList = await response.json();
        dispatch({ type: 'TEMPLATE_PROMOTION_LIST', templatePromotionList });
    },
    InsertPromotionList: (data, index) => async (dispatch, getState) => {
        const url = '/PromotionList/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        }
        const response = await fetch(url, requestOptions);
        const insertPromotionList = await response.json();
        dispatch({ type: 'INSERT_PROMOTION_LIST', insertPromotionList });
    },
    UpdatePromotionList: (data, index) => async (dispatch, getState) => {
        const url = '/PromotionList/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        }
        const response = await fetch(url, requestOptions);
        const updatePromotionList = await response.json();
        const payload = { updatePromotionList, index }
        dispatch({ type: 'UPDATE_PROMOTION_LIST', payload });
    },
    DeletePromotionList: (id, index) => async (dispatch, getState) => {
        const url = '/PromotionList/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "id": id,
            },
        };
        const response = await fetch(url, requestOptions);
        const deletePromotionList = await response.json();
        const payload = await { deletePromotionList, index }
        dispatch({ type: 'DELETE_PROMOTION_LIST', payload });
    },
    GetDivisionList: () => async (dispatch, getState) => {
        const url = '/PromotionList/GetDivisionList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        const response = await fetch(url, requestOptions);
        const divisionList = await response.json();
        dispatch({ type: 'GET_DIVISION_LIST', divisionList });
    },
    GetListPromotionType: () => async (dispatch, getState) => {
        const url = '/PromotionList/GetListPromotionType';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        const response = await fetch(url, requestOptions);
        const promotionTypeList = await response.json();
        dispatch({ type: 'GET_PROMOTION_TYPE_LIST', promotionTypeList });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    let filterPromotionList = state.filterPromotionList;
    switch (action.type) {
        case 'FILTER_PROMOTION_RESULT':
            {
                return {
                    ...state,
                    filterPromotion: action.filterPromotion,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'DETAIL_PROMOTION_RESULT':
            {
                return {
                    ...state,
                    detailPromotion: action.detailPromotion,
                    loading: false,
                    forceReload: false
                }
            }
        case 'EXPORT_PROMOTION_RESULT':
            {
                return {
                    ...state,
                    exportPromotion: action.exportPromotion,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        /// Promotion List
        case 'FILTER_PROMOTION_LIST':
            {
                return {
                    ...state,
                    filterPromotionList: action.filterPromotionList,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }
        case 'IMPORT_PROMOTION_LIST':
            {
                return {
                    ...state,
                    importPromotionList: action.importPromotionList,
                }
            }
        case 'EXPORT_PROMOTION_LIST':
            {
                return {
                    ...state,
                    exportPromotionList: action.exportPromotionList,
                }
            }
        case 'TEMPLATE_PROMOTION_LIST':
            {
                return {
                    ...state,
                    templatePromotionList: action.templatePromotionList,
                }
            }
        case 'INSERT_PROMOTION_LIST': {
            if (typeof action.insertPromotionList === "object" && action.insertPromotionList[0] && action.insertPromotionList[0].alert == "1") {
                filterPromotionList.unshift(action.insertPromotionList[0])
            }
            return {
                ...state,
                insertPromotionList: action.insertPromotionList,
                filterPromotionList: filterPromotionList,
            }
        }
        case 'UPDATE_PROMOTION_LIST':
            {
                // if (typeof action.payload.updatePromotionList === 'object' && action.payload.updatePromotionList[0] && action.payload.updatePromotionList[0].alert == "1") {
                //     let result = action.payload.updatePromotionList[0]
                //     Object.assign(filterPromotionList[action.payload.index], result)
                // }
                return {
                    ...state,
                    updatePromotionList: action.payload.updatePromotionList,
                    filterPromotionList: filterPromotionList
                }
            }
        case 'DELETE_PROMOTION_LIST': {
            // if (action.payload.deletePromotionList && action.payload.deletePromotionList.status === 0) {
            //     filterPromotionList.splice(action.payload.index, 1)
            // }
            return {
                ...state,
                deletePromotionList: action.payload.deletePromotionList,
                filterPromotionList: filterPromotionList,
            }
        }
        case 'GET_DIVISION_LIST':
            {
                return {
                    ...state,
                    divisionList: action.divisionList,
                }
            }
        case 'GET_PROMOTION_TYPE_LIST':
            {
                return {
                    ...state,
                    promotionTypeList: action.promotionTypeList,
                }
            }
        default:
            return state;
    }
};