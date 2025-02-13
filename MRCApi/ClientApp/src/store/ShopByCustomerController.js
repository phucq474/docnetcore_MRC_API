import { URL, getToken, b64EncodeUnicode, getLogin } from '../Utils/Helpler';

const initialState = {
    shopByCus_filter: [],
    shopByCus_save: [],
    shopByCus_delete: [],
    shopByCus_export: [],
    shopByCus_template: [],
    shopByCus_import: []

}
export const actionCreatorsShopByCustomer = {
    ShopByCus_Filter: (data) => async (dispatch, getState) => {
        const url = URL + `ShopByCustomer/Filter`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const shopByCus_filter = await response.json();
        dispatch({ type: 'POST_FILTER', shopByCus_filter });
    },
    ShopByCus_Save: (data) => async (dispatch, getState) => {
        const url = 'ShopByCustomer/Save';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const shopByCus_save = await response.json();
        dispatch({ type: 'POST_SAVE', shopByCus_save });
    },
    ShopByCus_Delete: (listId) => async (dispatch, getState) => {
        const url = 'ShopByCustomer/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'ListId': listId
            },
        };
        const response = await fetch(url, requestOptions);
        const shopByCus_delete = await response.json();
        dispatch({ type: 'POST_DELETE', shopByCus_delete });
    },
    ShopByCus_Export: (data) => async (dispatch, getState) => {
        const url = URL + 'ShopByCustomer/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const shopByCus_export = await response.json();
        dispatch({ type: 'POST_EXPORT', shopByCus_export });
    },
    ShopByCus_Template: () => async (dispatch, getState) => {
        const url = URL + 'ShopByCustomer/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, requestOptions);
        const shopByCus_template = await response.json();
        dispatch({ type: 'GET_TEMPLATE', shopByCus_template });
    },
    ShopByCus_Import: ifile => async (dispatch, getState) => {
        const url = 'ShopByCustomer/Import';
        const formData = new FormData();
        formData.append('ifile', ifile)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData,
        };
        const response = await fetch(url, requestOptions);
        const shopByCus_import = await response.json();
        dispatch({ type: 'POST_IMPORT', shopByCus_import });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'POST_FILTER':
            {
                return {
                    ...state,
                    shopByCus_filter: action.shopByCus_filter
                }
            }
        case 'POST_SAVE':
            {
                return {
                    ...state,
                    shopByCus_save: action.shopByCus_save
                }
            }
        case 'POST_DELETE':
            {
                return {
                    ...state,
                    shopByCus_delete: action.shopByCus_delete
                }
            }
        case 'POST_EXPORT':
            {
                return {
                    ...state,
                    shopByCus_export: action.shopByCus_export
                }
            }
        case 'GET_TEMPLATE':
        {
            return {
                ...state,
                shopByCus_template: action.shopByCus_template
            }
        }
        case 'POST_IMPORT':
        {
            return {
                ...state,
                shopByCus_import: action.shopByCus_import
            }
        }
        default:
            return state;
    }
};