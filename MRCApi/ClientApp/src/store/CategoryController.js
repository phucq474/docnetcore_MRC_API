import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    loading: true,
    errors: {},
    forceReload: false,
    filterCategory: [],
    insertCategory: [],
    updateCategory: [],
    deleteCategory: [],
    //////////////// * Category Target
    filterCateTarget: [],
    getTypeCateTarget: [],
    insertCateTarget: [],
    updateCateTarget: [],
    deleteCateTarget: [],
    exportCateTarget: [],
    importCateTarget: [],
    templateCateTarget: [],
    filterCateEmployee: [],
}
export const actionCreatorsCategory = {
    FilterCategory: (data) => async (dispatch, getState) => {
        const url = URL + 'Category/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const filterCategory = await response.json();
        dispatch({ type: 'FILTER_CATEGORY', filterCategory });
    },
    InsertCategory: (data) => async (dispatch, getState) => {
        const url = URL + 'Category/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const insertCategory = await response.json();
        dispatch({ type: 'INSERT_CATEGORY', insertCategory });
    },
    UpdateCategory: (data, rowIndex) => async (dispatch, getState) => {
        const url = URL + 'Category/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const updateCategory = await response.json();
        const payload = await { updateCategory, rowIndex }
        dispatch({ type: 'UPDATE_CATEGORY', payload });
    },
    DeleteCategory: (id, rowIndex) => async (dispatch, getState) => {
        const url = URL + 'Category/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "id": id
            },
        };
        const response = await fetch(url, requestOptions);
        const deleteCategory = await response.json();
        const payload = await { deleteCategory, rowIndex }
        dispatch({ type: 'DELETE_CATEGORY', payload });
    },
    //////////////// * Category Target
    FilterCateTarget: (data) => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const filterCateTarget = await response.json();
        dispatch({ type: 'FILTER_CATEGORY_TARGET', filterCateTarget });
    },
    GetTypeCateTarget: () => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/GetType';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
        };
        const response = await fetch(url, requestOptions);
        const getTypeCateTarget = await response.json();
        dispatch({ type: 'GET_TYPE_CATEGORY_TARGET', getTypeCateTarget });
    },
    InsertCateTarget: (data) => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const insertCateTarget = await response.json();
        dispatch({ type: 'INSERT_CATEGORY_TARGET', insertCateTarget });
    },
    UpdateCateTarget: (data, rowIndex) => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const updateCateTarget = await response.json();
        const payload = await { updateCateTarget, rowIndex }
        dispatch({ type: 'UPDATE_CATEGORY_TARGET', payload });
    },
    DeleteCateTarget: (id, rowIndex) => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                "id": id,
            },
        };
        const response = await fetch(url, requestOptions);
        const deleteCateTarget = await response.json();
        const payload = await { deleteCateTarget, rowIndex }
        dispatch({ type: 'DELETE_CATEGORY_TARGET', payload });
    },
    ExportCateTarget: (data) => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const exportCateTarget = await response.json();
        dispatch({ type: 'EXPORT_CATEGORY_TARGET', exportCateTarget });
    },
    ImportCateTarget: (file) => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Import';
        const formData = await new FormData();
        await formData.append('fileUpload', file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const importCateTarget = await response.json();
        dispatch({ type: 'IMPORT_CATEGORY_TARGET', importCateTarget });
    },
    GetTemplateCateTarget: () => async (dispatch, getState) => {
        const url = URL + 'CategoryTarget/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, requestOptions);
        const templateCateTarget = await response.text();
        dispatch({ type: 'TEMPLATE_CATEGORY_TARGET', templateCateTarget });
    },
    ////////////// * Category Employee
    FilterCateEmployee: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const filterCateEmployee = await response.json();
        dispatch({ type: 'FILTER_CATEGORY_EMPLOYEE', filterCateEmployee });
    },
    InsertCateEmployee: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const insertCateEmployee = await response.json();
        dispatch({ type: 'INSERT_CATEGORY_EMPLOYEE', insertCateEmployee });
    },
    UpdateCateEmployee: (data, index) => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Update';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const updateCateEmployee = await response.json();
        const payload = { updateCateEmployee, index }
        dispatch({ type: 'UPDATE_CATEGORY_EMPLOYEE', payload });
    },
    DeleteCateEmployee: (id, index) => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Delete';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'id': id,
            },
        };
        const response = await fetch(url, requestOptions);
        const deleteCateEmployee = await response.json();
        const payload = { deleteCateEmployee, index }
        dispatch({ type: 'DELETE_CATEGORY_EMPLOYEE', payload });
    },
    ExportCateEmployee: (data) => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Export';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                "Content-Type": "application/json"
            },
            body: "'" + JSON.stringify(data) + "'",
        };
        const response = await fetch(url, requestOptions);
        const exportCateEmployee = await response.json();
        dispatch({ type: 'EXPORT_CATEGORY_EMPLOYEE', exportCateEmployee });
    },
    ImportCateEmployee: (file) => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Import';
        const formData = await new FormData();
        await formData.append('fileUpload', file)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
            },
            body: formData
        };
        const response = await fetch(url, requestOptions);
        const importCateEmployee = await response.json();
        dispatch({ type: 'IMPORT_CATEGORY_EMPLOYEE', importCateEmployee });
    },
    ExportTempCateEmployee: () => async (dispatch, getState) => {
        const url = URL + 'EmployeeCategory/Template';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
            },
        };
        const response = await fetch(url, requestOptions);
        const templateCateEmployee = await response.text();
        dispatch({ type: 'IMPORT_TEMPLATE_CATEGORY_EMPLOYEE', templateCateEmployee });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    let filterCategory = state.filterCategory
    let filterCateTarget = state.filterCateTarget
    let filterCateEmployee = state.filterCateEmployee
    switch (action.type) {
        case 'FILTER_CATEGORY': {
            return {
                ...state,
                filterCategory: action.filterCategory,
            }
        }
        case 'INSERT_CATEGORY': {
            if (typeof action.insertCategory === "object" && action.insertCategory[0] && action.insertCategory[0].alert == "1") {
                filterCategory.unshift(action.insertCategory[0])
            }
            return {
                ...state,
                insertCategory: action.insertCategory,
                filterCategory: filterCategory
            }
        }
        case 'UPDATE_CATEGORY': {
            if (typeof action.payload.updateCategory === "object" && action.payload.updateCategory[0] && action.payload.updateCategory[0].alert == "1") {
                Object.assign(filterCategory[action.payload.rowIndex], action.payload.updateCategory[0])
            }
            return {
                ...state,
                updateCategory: action.payload.updateCategory,
                filterCategory: filterCategory
            }
        }
        case 'DELETE_CATEGORY': {
            if (action.payload.deleteCategory.result === 1) {
                filterCategory.splice(action.payload.rowIndex, 1)
            }
            return {
                ...state,
                deleteCategory: action.payload.deleteCategory,
                filterCategory: filterCategory
            }
        }
        case 'FILTER_CATEGORY_TARGET': {
            return {
                ...state,
                filterCateTarget: action.filterCateTarget,
            }
        }
        case 'GET_TYPE_CATEGORY_TARGET': {
            return {
                ...state,
                getTypeCateTarget: action.getTypeCateTarget,
            }
        }
        case 'INSERT_CATEGORY_TARGET': {
            if (typeof action.insertCateTarget === "object" && action.insertCateTarget[0] && action.insertCateTarget[0].alert == "1") {
                filterCateTarget.unshift(action.insertCateTarget[0])
            }
            return {
                ...state,
                insertCateTarget: action.insertCateTarget,
                filterCateTarget: filterCateTarget,
            }
        }
        case 'UPDATE_CATEGORY_TARGET': {
            if (typeof action.payload.updateCateTarget === "object" && action.payload.updateCateTarget[0] && action.payload.updateCateTarget[0].alert == "1") {
                Object.assign(filterCateTarget[action.payload.rowIndex], action.payload.updateCateTarget[0])
            }
            return {
                ...state,
                updateCateTarget: action.payload.updateCateTarget,
                filterCateTarget: filterCateTarget,
            }
        }
        case 'DELETE_CATEGORY_TARGET': {
            if (typeof action.payload.deleteCateTarget === "object" && action.payload.deleteCateTarget[0] && action.payload.deleteCateTarget[0].alert == "1") {
                filterCateTarget.splice(action.payload.rowIndex, 1)
            }
            return {
                ...state,
                deleteCateTarget: action.payload.deleteCateTarget,
                filterCateTarget: filterCateTarget,
            }
        }
        case 'EXPORT_CATEGORY_TARGET': {
            return {
                ...state,
                exportCateTarget: action.exportCateTarget,
            }
        }
        case 'IMPORT_CATEGORY_TARGET': {
            return {
                ...state,
                importCateTarget: action.importCateTarget,
            }
        }
        case 'TEMPLATE_CATEGORY_TARGET': {
            return {
                ...state,
                templateCateTarget: action.templateCateTarget,
            }
        }
        case 'FILTER_CATEGORY_EMPLOYEE': {
            return {
                ...state,
                filterCateEmployee: action.filterCateEmployee,
            }
        }
        case 'INSERT_CATEGORY_EMPLOYEE': {
            if (typeof action.insertCateEmployee === "object" && action.insertCateEmployee[0] && action.insertCateEmployee[0].alert == "1") {
                filterCateEmployee.unshift(action.insertCateEmployee[0])
            }
            return {
                ...state,
                insertCateEmployee: action.insertCateEmployee,
                filterCateEmployee: filterCateEmployee,
            }
        }
        case 'UPDATE_CATEGORY_EMPLOYEE': {
            if (typeof action.payload.updateCateEmployee === "object" && action.payload.updateCateEmployee[0] && action.payload.updateCateEmployee[0].alert == "1") {
                Object.assign(filterCateEmployee[action.payload.index], action.payload.updateCateEmployee[0])
            }
            return {
                ...state,
                updateCateEmployee: action.payload.updateCateEmployee,
                filterCateEmployee: filterCateEmployee,
            }
        }
        case 'DELETE_CATEGORY_EMPLOYEE': {
            if (typeof action.payload.deleteCateEmployee === "object" && action.payload.deleteCateEmployee.result === 1) {
                filterCateEmployee.splice(action.payload.index, 1)
            }
            return {
                ...state,
                deleteCateEmployee: action.payload.deleteCateEmployee,
                filterCateEmployee: filterCateEmployee,
            }
        }
        case 'EXPORT_CATEGORY_EMPLOYEE': {
            return {
                ...state,
                exportCateEmployee: action.exportCateEmployee,
            }
        }
        case 'IMPORT_CATEGORY_EMPLOYEE': {
            return {
                ...state,
                importCateEmployee: action.importCateEmployee,
            }
        }
        case 'IMPORT_TEMPLATE_CATEGORY_EMPLOYEE': {
            return {
                ...state,
                templateCateEmployee: action.templateCateEmployee,
            }
        }
        default:
            return state;
    }
};