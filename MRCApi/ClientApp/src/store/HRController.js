import { getToken } from '../Utils/Helpler';
const initialState = {
    dataHR: [],
    loading: false,
    errors: {},
    forceReload: false
}
export const HRCreateAction = {
    GetList: data => async (dispatch, getState) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'FromDate': data.fromDate,
                'ToDate': data.toDate,
                'DocumentType': data.documentType,
            }
        };
        const response = await fetch('document/list', requestOptions);
        const listdoc = await response.json();
        dispatch({ type: 'GET_LIST_DOCUMENT', listdoc });
    },
    UploadFiles: (data) => async (dispatch, getState) => {
        const formData = new FormData();
        data.files.forEach(element => {
            formData.append('files', element);
        });
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'year': 2020,
            },
            body: formData
        };
        const response = await fetch('hr/import', requestOptions);
        const results = await response.text();
        dispatch({ type: 'POST_FILE_IMPORT', results });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_LIST_HR':
            {
                return {
                    ...state,
                    listdoc: action.listdoc,
                    loading: false,
                    errors: 'Success ' + action.listdoc.lenght,
                    forceReload: false
                }
            }
        case 'POST_FILE_IMPORT':
            {
                return {
                    ...state,
                    loading: false,
                    errors: action.results,
                    forceReload: false
                }
            }

        default:
            return state;
    }
};