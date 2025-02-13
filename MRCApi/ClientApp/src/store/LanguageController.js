import { getLangue, URL, getToken, DefaultTheme } from '../Utils/Helpler';
const initialState = {
    language: [],
    languagelist: [],
    responseUpdate: [],
    responseInsert: [],
    responseDelete: [],
    languagelistexport: [],
    languagelistimport: [],
    themeName: DefaultTheme,
}
export const LanguageAPI = {
    SetTheme: (newTheme) => async (dispatch, getState) => {
        localStorage.setItem("THEME", newTheme);
        dispatch({ type: 'SET_THEME', newTheme });
    },
    GetLanguage: () => async (dispatch, getState) => {
        const language = getLangue()
        dispatch({ type: 'GET_LANGUAGE_STORAGE', language });
    },
    Getdatalanguage: (resourceName, accId) => async (dispatch, getState) => {
        const url = URL + 'language/filter';
        const resquestOption = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'resourceName': resourceName,
                'accId': accId || ""
            }
        }
        const response = await fetch(url, resquestOption);
        const languagelist = await response.json();
        dispatch({ type: 'Get-languagedata', languagelist });
    },
    Updatedata: (resourceName, vietNam, english, accountId, idVN, languageId_VN, idEn, languageId_En, index) => async (dispatch, getState) => {
        const url = URL + 'language/update';
        const data = { resourceName, vietNam, english, accountId, idVN, languageId_VN, idEn, languageId_En }
        const resquestOption = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, resquestOption);
        const responseUpdate = await response.json();
        const payload = { responseUpdate, index }
        dispatch({ type: 'Update-languagedata', payload });
    },
    Insertdata: (resourceName, vietNam, english, accountId) => async (dispatch, getState) => {
        const url = URL + 'language/insert';
        const data = { resourceName, vietNam, english, accountId }
        const resquestOption = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, resquestOption);
        const responseInsert = await response.json();
        dispatch({ type: 'Insert-languagedata', responseInsert });
    },
    Deletedata: (resourceName, vietNam, english, accountId, idVN, languageId_VN, idEn, languageId_En, index) => async (dispatch, getState) => {
        const url = URL + 'language/delete';
        const data = { resourceName, vietNam, english, accountId, idVN, languageId_VN, idEn, languageId_En }
        const resquestOption = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, resquestOption);
        const responseDelete = await response.json();
        const payload = { responseDelete, index }
        dispatch({ type: 'Delete-languagedata', payload });
    },
    Getlink: (accId) => async (dispatch, getState) => {
        const url = URL + 'language/export';
        // const file = {ifile}
        const resquestOption = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        }
        const response = await fetch(url, resquestOption);
        const languagelistexport = await response.json();
        dispatch({ type: 'Getlink-languagedata', languagelistexport });
    },
    Importfile: (ifile, accId) => async (dispatch, getState) => {
        const url = URL + 'language/import';
        const formData = new FormData();
        formData.append('fileUpload', ifile)
        const resquestOption = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: formData
        }
        const response = await fetch(url, resquestOption);
        const languagelistimport = await response.json();
        dispatch({ type: 'Importfile-languagedata', languagelistimport });
    },
};

export const reducer = (state = initialState, action) => {
    let languagelist = state.languagelist
    switch (action.type) {
        case 'SET_THEME':
            return {
                ...state,
                themeName: action.newTheme,
            }
        case 'GET_LANGUAGE_STORAGE':
            return {
                ...state,
                language: action.language,
            }
        case 'Get-languagedata':
            {
                return {
                    ...state,
                    languagelist: action.languagelist,
                    errors: {},
                }
            }
        case 'Update-languagedata':
            {
                if (typeof action.payload.responseUpdate === "object" && action.payload.responseUpdate[0] && action.payload.responseUpdate[0].alert === '1') {
                    Object.assign(languagelist[action.payload.index], action.payload.responseUpdate[0])
                }
                return {
                    ...state,
                    responseUpdate: action.payload.responseUpdate,
                    languagelist: languagelist,
                }
            }
        case 'Insert-languagedata':
            {
                if (typeof action.responseInsert === "object" && action.responseInsert[0] && action.responseInsert[0].alert === "1") {
                    languagelist = action.responseInsert
                }
                return {
                    ...state,
                    responseInsert: action.responseInsert,
                    languagelist: languagelist
                }
            }
        case 'Delete-languagedata':
            {
                if (typeof action.payload.responseDelete === "object" && action.payload.responseDelete[0] && action.payload.responseDelete[0].result === 1) {
                    languagelist.splice(action.payload.index, 1)
                }
                return {
                    ...state,
                    responseDelete: action.payload.responseDelete,
                    languagelist: languagelist
                }
            }
        case 'Getlink-languagedata':
            {
                return {
                    ...state,
                    languagelistexport: action.languagelistexport,
                }
            }
        case 'Importfile-languagedata':
            {
                return {
                    ...state,
                    languagelistimport: action.languagelistimport,
                }
            }
        default:
            return state;
    }
};
