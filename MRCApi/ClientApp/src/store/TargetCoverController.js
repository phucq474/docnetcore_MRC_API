import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    targetCover_Filter:[],
    targetCover_Export:[],
    targetCover_Import:[],
    targetCover_Delete:[],
    targetCover_Update: []
}
export const TargetCoverCreateAction = {
    TargetCover_Filter: (data) => async (dispatch, getState) => {
        const url = URL + 'TargetCover/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const targetCover_Filter = await response.json();
        dispatch({ type: 'POST_FILTER_TARGET_COVER', targetCover_Filter });
    },
    TargetCover_Update: (data) => async (dispatch, getState) => {
        const url = URL + 'TargetCover/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const targetCover_Update = await response.json();
        dispatch({ type: 'POST_UPDATE_TARGET_COVER', targetCover_Update });
    },
    TargetCover_Export: (data) => async (dispatch, getState) => {
        const url = URL + 'TargetCover/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'"
        };
        const response = await fetch(url, requestOptions);
        const targetCover_Export = await response.json();
        dispatch({ type: 'POST_EXPORT_TARGET_COVER', targetCover_Export });
    },
    TargetCover_Import: ifile => async (dispatch, getState) => {
        const url =URL +  'TargetCover/Import';
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
        const targetCover_Import = await response.json();
        dispatch({ type: 'POST_IMPORT_TARGET_COVER', targetCover_Import });
    },
    TargetCover_Delete: (Id) => async (dispatch, getState) => {
        const url = URL + 'TargetCover/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': Id,
            },
        };
        const response = await fetch(url, requestOptions);
        const targetCover_Delete = await response.json();
        dispatch({ type: 'POST_DELETE_TARGET_COVER', targetCover_Delete });
    },
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'POST_FILTER_TARGET_COVER': {
            return {
                ...state,
                targetCover_Filter: action.targetCover_Filter,
            }
        }
        case 'POST_UPDATE_TARGET_COVER': {
            return {
                ...state,
                targetCover_Update: action.targetCover_Update,
            }
        }
        case 'POST_EXPORT_TARGET_COVER': {
            return {
                ...state,
                targetCover_Export: action.targetCover_Export,
            }
        }
        case 'POST_IMPORT_TARGET_COVER': {
            return {
                ...state,
                targetCover_Import: action.targetCover_Import,
            }
        }
        case 'POST_DELETE_TARGET_COVER': {
            return {
                ...state,
                targetCover_Delete: action.targetCover_Delete,
            }
        }
        default:
            return state;
    }
};