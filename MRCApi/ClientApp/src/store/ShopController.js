import { URL, getToken, b64EncodeUnicode } from '../Utils/Helpler';

const initialState = {
    shoplists: [],
    employeeShops: [],
    loading: false,
    errors: null,
    forceReload: false,
    insertStore: [],
    updateStore: [],
    updateImage: [],
    shopFormat: [],
    getListRawByReport: [],
    exportRawByReport: [],
    updateShopByReport: []
}

export const actionCreatorsShop = {
    GetList: (data, accId) => async (dispatch, getState) => {
        const url = URL + `shops/Filter`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const shoplists = await response.json();
        dispatch({ type: 'GET_LIST', shoplists });
    },
    GetShopByEmployees: (data, accId) => async (dispatch, getState) => {
        const url = URL + `Shops/GetShops`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'json': JSON.stringify(data),
                'accId': accId || ""
            },
        };
        const response = await fetch(url, requestOptions);
        const employeeShops = await response.json();
        dispatch({ type: 'GET_GetByEmployees', employeeShops });
    },
    Create: (shop) => async (dispatch, getState) => {
        const url = URL + `shops/create`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shop)
        };
        try {
            const response = await fetch(url, requestOptions);
            const shopcreated = await response.json();
            shopcreated.httpStatus = response.status;
            dispatch({ type: 'CREATE', shopcreated });
        }
        catch (err) {
            dispatch({ type: 'CREATE', shopcreated: { httpStatus: 500 } });
        }
    },
    Update: (shop) => async (dispatch, getState) => {
        const url = URL + `shops/update`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shop)
        };
        try {
            const response = await fetch(url, requestOptions);
            const shopUpdated = await response.json();
            shopUpdated.httpStatus = response.status;
            dispatch({ type: 'UPDATE', shopUpdated });
        }
        catch (err) {
            dispatch({ type: 'UPDATE', shopUpdated: { httpStatus: 500 } });
        }
    },
    Delete: (shopId) => async (dispatch, getState) => {
        const token = getToken();
        const url = URL + `shops/${shopId}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
        }
        try {
            const response = await fetch(url, requestOptions);
            const shopDeleted = await response.json();
            shopDeleted.httpStatus = response.status;
            dispatch({ type: 'DELETE', shopDeleted });
        }
        catch (err) {
            dispatch({ type: 'DELETE', shopDeleted: { httpStatus: 500, message: err } });
        }
    },
    CreateTemplate: () => async (dispatch, getState) => {
        const token = getToken();
        const url = URL + `shops/template`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        }
        try {
            const response = await fetch(url, requestOptions);
            const link = await response.json();
        }
        catch (err) {

        }
    },
    shopAvailable: () => async (dispatch, getState) => {
        const url = URL + `employeestore/4328/available`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(url, requestOptions);
        const shoplists = await response.json();
        dispatch({ type: 'GET_LIST', shoplists });
    },
    InsertStoreList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Shops/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        }
        const response = await fetch(url, requestOptions);
        const insertStore = await response.json();
        dispatch({ type: 'Insert_Store_LIST', insertStore });
    },
    UpdateStoreList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'Shops/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: "'" + JSON.stringify(data) + "'"
        }
        const response = await fetch(url, requestOptions);
        const updateStore = await response.json();
        dispatch({ type: 'Update_Store_LIST', updateStore });
    },
    UpdateImage: (ifile, shopId, isDelete) => async (dispatch, getState) => {
        const url = URL + 'Shops/UpdateImage';
        const formData = await new FormData();
        await formData.append('ifile', ifile)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'ShopId': shopId,
                'isDelete': isDelete,
            },
            body: formData

        }
        const response = await fetch(url, requestOptions);
        const updateImage = await response.json();
        dispatch({ type: 'Update_Image', updateImage });
    },
    ShopFormat: () => async (dispatch, getState) => {
        const url = URL + 'Shops/ShopFormat';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            },
        }
        const response = await fetch(url, requestOptions);
        const shopFormat = await response.json();
        dispatch({ type: 'Shop_Format', shopFormat });
    },
    ShopMerge: (data) => async (dispatch, getState) => {
        const url = URL + `shops/Shop_MergeData`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'fromShopId': data.fromShopId,
                'toShopId': data.toShopId
            },
        };
        const response = await fetch(url, requestOptions);
        const shopMerge = await response.json();
        dispatch({ type: 'UPDATE_SHOP_MERGE', shopMerge });
    },

    //Shop-Info
    GetListRawByReport: (data) => async (dispatch, getState) => {
        const url = URL + `Mobile/GetListRawByReport`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            },
        };
        const response = await fetch(url, requestOptions);
        const getListRawByReport = await response.json();
        dispatch({ type: 'GET_LIST_RAW_SHOP_BY_REPORT', getListRawByReport });
    },
    ExportRawByReport: (data) => async (dispatch, getState) => {
        const url = URL + `Mobile/ExportRawByReport`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data)
            },
        };
        const response = await fetch(url, requestOptions);
        const exportRawByReport = await response.json();
        dispatch({ type: 'EXPORT_LIST_RAW_SHOP_BY_REPORT', exportRawByReport });
    },
    UpdateShopByReport: (Id) => async (dispatch, getState) => {
        const url = URL + `Mobile/UpdateShopByReport`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'Id': Id
            },
        }
        const response = await fetch(url, requestOptions);
        const updateShopByReport = await response.json();
        dispatch({ type: 'POST_UPDATE_SHOP_BY_REPORT', updateShopByReport });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    let shoplists = state.shoplists;
    switch (action.type) {
        case 'GET_LIST':
            {
                return {
                    ...state,
                    shoplists: action.shoplists,
                    loading: false,
                    errors: null,
                    forceReload: false
                }
            }
        case 'GET_GetByEmployees':
            {
                return {
                    ...state,
                    employeeShops: action.employeeShops,
                    loading: false,
                    errors: null,
                    forceReload: false
                }
            }
        case 'UPDATE':
            {
                const statusCode = action.shopUpdated.httpStatus || 200;
                if (statusCode === 200) {
                    var foundIndex = state.shoplists.findIndex(x => x.shopId === action.shopUpdated.shopId);
                    state.shoplists[foundIndex] = action.shopUpdated;
                }
                return {
                    ...state,
                    results: { statusCode },
                    shoplists: state.shoplists,
                    loading: false,
                    errors: (statusCode === 200 ? "Đã cập nhật " : "Chưa cập nhật được") + ' Code ' + action.shopUpdated.shopCode,
                    forceReload: false
                }
            }
        case 'CREATE':
            {
                const statusCode = action.shopcreated.httpStatus || 201;
                if (statusCode === 200 || statusCode == 201) {
                    state.shoplists.push(action.shopcreated)
                }
                return {
                    ...state,
                    shoplists: state.shoplists,
                    loading: false,
                    errors: ((statusCode === 200 || statusCode === 201) ? "Đã lưu" : "Chưa lưu được") + ' Code ' + action.shopcreated.shopCode,
                    forceReload: false
                }
            }
        case 'DELETE':
            {
                const statusCode = action.shopDeleted.httpStatus || 200;
                if (statusCode === 200) {
                    var foundIndex = state.shoplists.findIndex(x => x.shopId === action.shopDeleted.shopId);
                    state.shoplists.splice(foundIndex, 1);
                }
                return {
                    ...state,
                    results: { statusCode },
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        case 'Insert_Store_LIST':
            {
                if (typeof action.insertStore === "object" && action.insertStore[0] && action.insertStore[0].alert === '1') {
                    shoplists = action.insertStore
                }
                return {
                    ...state,
                    insertStore: action.insertStore,
                    shoplists: shoplists
                }
            }
        case 'Update_Store_LIST':
            {
                if (typeof action.updateStore === "object" && action.updateStore[0] && action.updateStore[0].alert === '1') {
                    let index = shoplists.findIndex(e => e.shopId === action.updateStore[0].shopId)
                    Object.assign(shoplists[index], action.updateStore[0])
                }
                return {
                    ...state,
                    updateStore: action.updateStore,
                    shoplists: shoplists
                }
            }
        case 'Update_Image':
            {
                if (typeof action.updateImage === "object" && action.updateImage[0] && action.updateImage[0].alert === '1') {
                    let index = shoplists.findIndex(e => e.shopId === action.updateImage[0].shopId)
                    Object.assign(shoplists[index], action.updateImage[0])
                }
                return {
                    ...state,
                    updateImage: action.updateImage,
                    shoplists: shoplists
                }
            }
        case 'Shop_Format':
            {
                return {
                    ...state,
                    shopFormat: action.shopFormat,
                }
            }
        case 'UPDATE_SHOP_MERGE':
            {
                return {
                    ...state,
                    shopMerge: action.shopMerge,
                }
            }
        //Shop-Info
        case 'GET_LIST_RAW_SHOP_BY_REPORT':
            {
                return {
                    ...state,
                    getListRawByReport: action.getListRawByReport,
                }
            }
        case 'EXPORT_LIST_RAW_SHOP_BY_REPORT':
            {
                return {
                    ...state,
                    exportRawByReport: action.exportRawByReport,
                }
            }
        case 'POST_UPDATE_SHOP_BY_REPORT':
            {
                return {
                    ...state,
                    updateShopByReport: action.updateShopByReport,
                }
            }
        default:
            return state;
    }
};