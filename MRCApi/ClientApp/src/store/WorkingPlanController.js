import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    workingPlans: [],
    details: [],
    shiftLists: [],
    urlFile: '',
    result: [],
    wpConfirm: [],
    wpChangeShift: [],
    filterWorkingDefault: [],
    updateWorkingDefault: [],
    getShopWorking: [],
    insertWorkingDefault: [],
    /// shiftlist
    filterShiftLists: [],
    exportShiftLists: [],
    insertShiftLists: [],
    updateShiftLists: [],
    templateShiftLists: [],
    importShiftList: [],

    wpRemoveChangeShift: [],
    importLLV: [],
    templateFile: []
}
export const WorkingPlanCreateAction = {
    GetList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const workingPlans = await response.json();
        dispatch({ type: 'GET_List_WorkingPlan', workingPlans });
    },
    Export: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const urlFile = await response.json();
        dispatch({ type: 'GET_File_WorkingPlan', urlFile });
    },
    ExportLLV: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/Export_LichLamViec';
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
        const urlFile = await response.json();
        dispatch({ type: 'POST_File_WorkingPlanLLV', urlFile });
    },
    GetDetail: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/GetDetail';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        };
        //const request = new Request(url,requestOptions);
        const response = await fetch(url, requestOptions);
        const details = await response.json();
        dispatch({ type: 'GET_List_Detail', details });
    },
    GetShifts: (accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/GetShiftList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        }
        const response = await fetch(url, requestOptions);
        const shiftLists = await response.json();
        dispatch({ type: 'GET_WP_ShiftList', shiftLists });
    },
    TemplateLLV: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/Template_LLV_PGM';
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
        const templateFile = await response.json();
        dispatch({ type: 'GET_TEMP_WorkingPlanLLV', templateFile });
    },
    ImportLLV: (ifile, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/Import_LLV_PGM';
        const formData = new FormData();
        formData.append('ifile', ifile)
        const resquestOption = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: formData
        }
        const response = await fetch(url, resquestOption);
        const importLLV = await response.json();
        dispatch({ type: 'IMPORT_WorkingPlanLLV', importLLV });
    },
    /// Shift List
    GetShiftList: (accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/GetShiftGroup';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        }
        const response = await fetch(url, requestOptions);
        const shiftLists = await response.json();
        dispatch({ type: 'GET_LIST_SHIFTLIST', shiftLists });
    },
    FilterShiftList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/Filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        }
        const response = await fetch(url, requestOptions);
        const filterShiftLists = await response.json();
        dispatch({ type: 'FILTER_SHIFTLIST', filterShiftLists });
    },
    ExportShiftList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/Export';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        }
        const response = await fetch(url, requestOptions);
        const exportShiftLists = await response.json();
        dispatch({ type: 'EXPORT_SHIFTLIST', exportShiftLists });
    },
    InsertShiftList: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/Insert';
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
        const insertShiftLists = await response.json();
        dispatch({ type: 'INSERT_SHIFTLIST', insertShiftLists });
    },
    UpdateShiftList: (data, index, accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/Update';
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
        const updateShiftLists = await response.json();
        const payload = { updateShiftLists, index }
        dispatch({ type: 'UPDATE_SHIFTLIST', payload });
    },
    TemplateShiftList: (accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
        }
        const response = await fetch(url, requestOptions);
        const templateShiftLists = await response.json();
        dispatch({ type: 'TEMPLATE_SHIFTLIST', templateShiftLists });
    },
    ImportShiftList: (file, accId) => async (dispatch, getState) => {
        const url = URL + 'ShiftList/Import';
        const formData = await new FormData();
        await formData.append('ifile', file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const importShiftList = await response.json();
        dispatch({ type: 'IMPORT_SHIFTLIST', importShiftList });
    },

    /// WorkingPlan-Default
    FilterWorkingPlanDefault: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Filter';
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
        const filterWorkingDefault = await response.json();
        dispatch({ type: 'FILTER_WORKINGPLAN_DEFAULT', filterWorkingDefault });
    },
    GetShopWorkingDefault: (employeeId, fromDate, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/GetShop';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'EmployeeId': employeeId,
                'FromDate': fromDate,
                'accId': accId || ""
            },
        }
        const response = await fetch(url, requestOptions);
        const getShopWorking = await response.json();
        dispatch({ type: 'GETSHOP_WORKINGPLAN_DEFAULT', getShopWorking });
    },
    InsertWorkingPlanDefault: (data, index, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Insert';
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
        const insertWorkingDefault = await response.json();
        dispatch({ type: 'INSERT_WORKINGPLAN_DEFAULT', insertWorkingDefault });
    },
    UpdateWorkingPlanDefault: (data, index, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Update';
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
        const updateWorkingDefault = await response.json();
        const payload = { updateWorkingDefault, index }
        dispatch({ type: 'UPDATE_WORKINGPLAN_DEFAULT', payload });
    },
    DeleteWorkingDefault: (id, index, isTableDialog, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'listId': `${id}`,
                'accId': accId || ""
            },
        }
        const response = await fetch(url, requestOptions);
        const deleteWorkingDefault = await response.json();
        const payload = { deleteWorkingDefault, index, isTableDialog }
        dispatch({ type: 'DELETE_WORKINGPLAN_DEFAULT', payload });
    },
    ExportWorkingPlanDefault: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Export';
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
        const exportWorkingDefault = await response.json();
        dispatch({ type: 'EXPORT_WORKINGPLAN_DEFAULT', exportWorkingDefault });
    },
    TemplateWorkingPlanDefault: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Template';
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
        const templateWorkingDefault = await response.json();
        dispatch({ type: 'TEMPLATE_WORKINGPLAN_DEFAULT', templateWorkingDefault });
    },
    ImportWorkingPlanDefault: (file, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlanDefault/Import';
        const formData = new FormData();
        formData.append('ifile', file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            },
            body: formData
        }
        const response = await fetch(url, requestOptions);
        const importWorkingDefault = await response.json();
        dispatch({ type: 'IMPORT_WORKINGPLAN_DEFAULT', importWorkingDefault });
    },
    ///
    SaveWorkingPlanDaily: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/SaveWorkingPlanDaily';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, requestOptions);
        const saveWorkingPlanDaily = await response.json();
        dispatch({ type: 'Save_WorkingPlanDaily', saveWorkingPlanDaily });
    },
    FilterDefault: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, requestOptions);
        const resultFilter = await response.json();
        dispatch({ type: 'FilterDefault', resultFilter });
    },
    WP_ChangeShift: (data, accId) => async (dispatch, getState) => {
        // console.log(data)
        const url = URL + 'WorkingPlan/ChangeShift';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(JSON.stringify(data))
        }
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'WP_ChangeShift', result });
    },
    RemoveChangeShift: (data, accId) => async (dispatch, getState) => {
        const url = URL + 'WorkingPlan/RemoveChangeShift';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonData': JSON.stringify(data),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const result = await response.json();
        dispatch({ type: 'GET_RemoveChangeShift', result });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    let filterTimeShift = state.filterTimeShift
    let filterWorkingDefault = state.filterWorkingDefault
    let filterShiftLists = state.filterShiftLists
    switch (action.type) {
        case 'GET_List_WorkingPlan':
            {
                return {
                    ...state,
                    workingPlans: action.workingPlans
                }
            }
        case 'GET_File_WorkingPlan':
            {
                return {
                    ...state,
                    urlFile: action.urlFile
                }
            }
        case 'POST_File_WorkingPlanLLV':
            {
                return {
                    ...state,
                    urlFile: action.urlFile
                }
            }
        case 'GET_List_Detail':
            {
                return {
                    ...state,
                    details: action.details
                }
            }
        case 'GET_List_ShiftList':
            {
                return {
                    ...state,
                    shiftLists: action.shiftLists
                }
            }
        case 'GET_WP_ShiftList':
            {
                return {
                    ...state,
                    shiftLists: action.shiftLists
                }
            }
        case 'WP_ChangeShift':
            {
                return {
                    ...state,
                    wpChangeShift: action.result
                }
            }
        case 'Save_WorkingPlanDaily':
            {
                return {
                    ...state,
                    saveWorkingPlanDaily: action.saveWorkingPlanDaily
                }
            }
        case 'FilterDefault':
            {
                return {
                    ...state,
                    resultFilter: action.resultFilter
                }
            }
        case 'GET_TEMP_WorkingPlanLLV':
            {
                return {
                    ...state,
                    templateFile: action.templateFile
                }
            }
        case 'IMPORT_WorkingPlanLLV':
            {
                return {
                    ...state,
                    importLLV: action.importLLV
                }
            }
        /// WorkingPlan-Default
        case 'FILTER_WORKINGPLAN_DEFAULT':
            {
                return {
                    ...state,
                    filterWorkingDefault: action.filterWorkingDefault
                }
            }
        case 'UPDATE_WORKINGPLAN_DEFAULT':
            {
                if (typeof action.payload.updateWorkingDefault === 'object' && (action.payload.updateWorkingDefault.status === 1 || action.payload.updateWorkingDefault.status === 0)) {
                    let result = JSON.parse(action.payload.updateWorkingDefault.fileUrl)
                    Object.assign(filterWorkingDefault[action.payload.index], result)
                }
                return {
                    ...state,
                    updateWorkingDefault: action.payload.updateWorkingDefault,
                    filterWorkingDefault: filterWorkingDefault
                }
            }
        case 'GETSHOP_WORKINGPLAN_DEFAULT':
            {
                return {
                    ...state,
                    getShopWorking: action.getShopWorking
                }
            }
        case 'INSERT_WORKINGPLAN_DEFAULT':
            {
                return {
                    ...state,
                    insertWorkingDefault: action.insertWorkingDefault
                }
            }
        case 'DELETE_WORKINGPLAN_DEFAULT':
            {
                if (typeof action.payload.deleteWorkingDefault === "object" && action.payload.deleteWorkingDefault.status === 1 && !action.payload.isTableDialog) {
                    filterWorkingDefault.splice(action.payload.index, 1)
                }
                return {
                    ...state,
                    deleteWorkingDefault: action.payload.deleteWorkingDefault,
                    filterWorkingDefault: filterWorkingDefault
                }
            }
        case 'EXPORT_WORKINGPLAN_DEFAULT':
            {
                return {
                    ...state,
                    exportWorkingDefault: action.exportWorkingDefault
                }
            }
        case 'TEMPLATE_WORKINGPLAN_DEFAULT':
            {
                return {
                    ...state,
                    templateWorkingDefault: action.templateWorkingDefault
                }
            }
        case 'IMPORT_WORKINGPLAN_DEFAULT':
            {
                return {
                    ...state,
                    importWorkingDefault: action.importWorkingDefault
                }
            }
        /// Shift List
        case 'GET_LIST_SHIFTLIST':
            {
                return {
                    ...state,
                    shiftLists: action.shiftLists
                }
            }
        case 'FILTER_SHIFTLIST':
            {
                return {
                    ...state,
                    filterShiftLists: action.filterShiftLists
                }
            }
        case 'EXPORT_SHIFTLIST':
            {
                return {
                    ...state,
                    exportShiftLists: action.exportShiftLists
                }
            }
        case 'INSERT_SHIFTLIST':
            {
                if (typeof action.insertShiftLists === "object" && action.insertShiftLists[0] && action.insertShiftLists[0].alert == "1") {
                    filterShiftLists.unshift(action.insertShiftLists[0])
                }
                return {
                    ...state,
                    insertShiftLists: action.insertShiftLists,
                    filterShiftLists: filterShiftLists,
                }
            }
        case 'UPDATE_SHIFTLIST':
            {
                if (typeof action.payload.updateShiftLists === "object" && action.payload.updateShiftLists[0] && action.payload.updateShiftLists[0].alert == "1") {
                    Object.assign(filterShiftLists[action.payload.index], action.payload.updateShiftLists[0])
                }
                return {
                    ...state,
                    updateShiftLists: action.payload.updateShiftLists,
                    filterShiftLists: filterShiftLists,
                }
            }
        case 'TEMPLATE_SHIFTLIST':
            {
                return {
                    ...state,
                    templateShiftLists: action.templateShiftLists
                }
            }
        case 'IMPORT_SHIFTLIST':
            {
                return {
                    ...state,
                    importShiftList: action.importShiftList
                }
            }
        case 'Save_WorkingPlanDaily':
            {
                return {
                    ...state,
                    saveWorkingPlanDaily: action.saveWorkingPlanDaily
                }
            }
        case 'FilterDefault':
            {
                return {
                    ...state,
                    resultFilter: action.resultFilter
                }
            }
        case 'GET_RemoveChangeShift':
            {
                return {
                    ...state,
                    wpRemoveChangeShift: action.result
                }
            }
        default:
            return state;
    }
};