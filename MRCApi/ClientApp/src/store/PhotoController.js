import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    photo: [],
    result: [],
    loading: false,
    errors: {},
    getPhotoType: [],
    deletePhoto: [],
    savePhoto: []
}
export const PhotoCreateAction = {
    GetPhotoByShop: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPhoto/ByShop';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_PHOTO_SHOP', result });
    },
    GetPhotoType: (reportId, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPhoto/GetPhotoType';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'reportId': reportId || "",
                accId: accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GetPhotoType', result });
    },
    DeletePhoto: (photoId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPhoto/DeletePhoto';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'photoId': photoId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'DeletePhoto', result });
    },
    SavePhoto: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPhoto/Save';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: data
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'SavePhoto', result });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_PHOTO_SHOP':
            {
                return {
                    ...state,
                    loading: action.loading,
                    errors: action.errors,
                    photo: action.result
                }
            }
        case 'GetPhotoType':
            {
                return {
                    ...state,
                    getPhotoType: action.result
                }
            }
        case 'DeletePhoto':
            {
                return {
                    ...state,
                    deletePhoto: action.result
                }
            }
        case 'SavePhoto':
            {
                return {
                    ...state,
                    savePhoto: action.result
                }
            }
        default:
            return state;
    }
};