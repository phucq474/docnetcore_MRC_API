import { getToken } from '../Utils/Helpler';
const initialState = {
    listdoc: [],
    filterDocumentUser: [],
    loading: false,
    errors: {},
    forceReload: false
}
function b64EncodeUnicode(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
export const DocumentCreateAction = {
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
        let SItem = {
            'FromDate': data.fromDate,
            'ToDate': data.toDate,
            'DocumentType': data.documentType,
            'Title': data.title,
            'Description': data.description,
        }
        const item = b64EncodeUnicode(JSON.stringify(SItem));
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'IsConvert': data.IsConvert,
                'StringData': item.toString()
            },
            body: formData
        };
        const response = await fetch('document/upload', requestOptions);
        const results = await response.text();
        dispatch({ type: 'POST_FILE_UPLOAD', results });
    },
    RemoveItem: (id, index) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'docId': id,
            },
        };
        const response = await fetch('document/remove', requestOptions);
        const removeItem = await response.json();
        const payload = { removeItem, index }
        dispatch({ type: 'GET_REMOVE_DOC', payload });
    },
    DeleteItem: (id, listIndex) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Id': id,
                'listIndex': listIndex,
            },
        };
        const response = await fetch('document/Delete', requestOptions);
        const deleteItem = await response.json();
        dispatch({ type: 'DELETE_ITEM_DOC', deleteItem });
    },
    DetailItem: (data) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'GEt',
            headers: {
                'Authorization': getToken(),
                'Id': data.id,
            },
        };
        const response = await fetch('document/Detail', requestOptions);
        const detailItem = await response.json();
        dispatch({ type: 'DETAIL_ITEM_DOC', detailItem });
    },
    ///Document User
    FilterDocumentUser: JsonData => async (dispatch, getState) => {
        const url = '/DocumentUser/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const filterDocumentUser = await response.json();
        dispatch({ type: 'FILTER_DOCUMENT_USER', filterDocumentUser });
    },
    DetailDocumentUser: JsonData => async (dispatch, getState) => {
        const url = '/DocumentUser/Detail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const detailDocumentUser = await response.json();
        dispatch({ type: 'DETAIL_DOCUMENT_USER', detailDocumentUser });
    },
    GetDocument: JsonData => async (dispatch, getState) => {
        const url = '/DocumentUser/GetDocument';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(JsonData)
            }
        };
        const response = await fetch(url, requestOptions);
        const getDocument = await response.json();
        dispatch({ type: 'GET_DOCUMENT_LIST', getDocument });
    },
    InsertDocumentUser: JsonData => async (dispatch, getState) => {
        const url = '/DocumentUser/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(JsonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const insertDocumentUser = await response.json();
        dispatch({ type: 'INSERT_DOCUMENT_USER', insertDocumentUser });
    },
    UpdateDocumentUser: JsonData => async (dispatch, getState) => {
        const url = '/DocumentUser/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: "'" + JSON.stringify(JsonData) + "'"
        };
        const response = await fetch(url, requestOptions);
        const updateDocumentUser = await response.json();
        dispatch({ type: 'UPDATE_DOCUMENT_USER', updateDocumentUser });
    },
    DeleteDocumentUser: (employeeId, listId, index) => async (dispatch, getState) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': employeeId,
                'listId': listId || '',
            },
        };
        const response = await fetch('DocumentUser/Delete', requestOptions);
        const deleteDocumentUser = await response.json();
        const payload = { deleteDocumentUser, listId, index }
        dispatch({ type: 'DELETE_DOCUMENT_USER', payload });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    let listdoc = state.listdoc;
    let filterDocumentUser = state.filterDocumentUser;
    switch (action.type) {
        case 'GET_LIST_DOCUMENT':
            {
                return {
                    ...state,
                    listdoc: action.listdoc,
                    loading: false,
                    forceReload: false
                }
            }
        case 'POST_FILE_UPLOAD':
            {
                return {
                    ...state,
                    loading: false,
                    postfile: action.results,
                    forceReload: false
                }
            }
        case 'GET_REMOVE_DOC':
            {
                if (action.payload.removeItem) {
                    listdoc.splice(action.payload.index, 1)
                }
                return {
                    ...state,
                    loading: false,
                    listdoc: listdoc,
                    removeItem: action.payload.removeItem,
                }
            }
        case 'DELETE_ITEM_DOC':
            {
                return {
                    ...state,
                    deleteItem: action.deleteItem,
                }
            }
        case 'DETAIL_ITEM_DOC':
            {
                return {
                    ...state,
                    detailItem: action.detailItem,
                }
            }
        /// Document User
        case 'FILTER_DOCUMENT_USER':
            {
                return {
                    ...state,
                    filterDocumentUser: action.filterDocumentUser,
                }
            }
        case 'DETAIL_DOCUMENT_USER':
            {
                return {
                    ...state,
                    detailDocumentUser: action.detailDocumentUser,
                }
            }
        case 'GET_DOCUMENT_LIST':
            {
                return {
                    ...state,
                    getDocument: action.getDocument,
                }
            }
        case 'INSERT_DOCUMENT_USER': {
            return {
                ...state,
                insertDocumentUser: action.insertDocumentUser,
            }
        }
        case 'UPDATE_DOCUMENT_USER': {
            return {
                ...state,
                updateDocumentUser: action.updateDocumentUser,
            }
        }
        case 'DELETE_DOCUMENT_USER': {
            if (action.payload.deleteDocumentUser && action.payload.deleteDocumentUser.status === 1 && !action.payload.listId) {
                filterDocumentUser.splice(action.payload.index, 1)
            }
            return {
                ...state,
                deleteDocumentUser: action.payload.deleteDocumentUser,
                filterDocumentUser: filterDocumentUser
            }
        }
        default:
            return state;
    }
};