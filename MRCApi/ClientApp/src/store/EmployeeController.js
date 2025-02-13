import { getToken, URL } from "../Utils/Helpler";

const initialState = {
  lists: [],
  employeeTypes: [],
  employeeDDL: [],
  employeeDetail: [],
  updateEmployee: null,
  menus: [],
  loading: false,
  errors: {},
  forceReload: true,
  updateStatus: [],
  employeeIMEISave: [],
  getListCity: [],
  getShopByEmployee: [],
  positionSave: null,
};
export const EmployeeActionCreate = {
  GetList: (data) => async (dispatch, getState) => {
    const url = URL + "employee/Filter";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        accId: data.accId || "",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const lists = await response.json();
    dispatch({ type: "GET_LIST_EMPLOYEE", lists });
  },
  GetEmployeeType: (accId) => async (dispatch, getState) => {
    const url = URL + "employee/ListEmployeeType";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const employeeTypes = await response.json();
    dispatch({ type: "GET_EmployeeType", employeeTypes });
  },
  GetEmployeeDDL: (accId, employeeId) => async (dispatch, getState) => {
    const url = URL + "employee/ListEmployeeDDL";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
        employeeId: employeeId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const employeeDDL = await response.json();
    dispatch({ type: "GET_EmployeeDDL", employeeDDL });
  },
  getEmployeeById: (EmployeeId, accId) => async (dispatch, getState) => {
    const url = URL + "employee/GetInfoById";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        EmployeeId: EmployeeId,
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const employeeDetail = await response.json();
    dispatch({ type: "GET_EmployeeById", employeeDetail });
  },
  EmployeeWorkingSave: (data) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeWorkingSave";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let datajson = await response.json();
    dispatch({ type: "POST_SAVE_EMPLOYEEWORKING", datajson });
  },
  EmployeeWorkingUpdate: (data, index) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeWorkingUpdate";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        Id: data.id,
        FromDate: data.fromDate,
        ToDate: data.toDate,
        ActualDate: data.actualDate,
        Comment: data.comment,
        MaternityStatus: data.maternityStatus,
      },
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let employeeUpdate = await response.json();
    const payload = { employeeUpdate, index };
    dispatch({ type: "POST_UPDATE_EMPLOYEEWORKING", payload });
  },
  EmployeeCatUpdate: (data, index) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeCatUpdate";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        EmployeeCategoryId: data.employeeCategoryId,
        FromDate: data.fromDate,
        ToDate: data.toDate,
      },
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let cateUpdate = await response.json();
    const payload = { cateUpdate, index };
    dispatch({ type: "POST_UPDATE_EMPLOYEECAT", payload });
  },
  EmployeeCatDelete: (data) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeCatDelete";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let datajson = response.json();
    dispatch({ type: "POST_DELETE_EMPLOYEECAT", datajson });
  },
  EmployeeCateSave: (data) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeCateSave";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let datajson = response.json();
    dispatch({ type: "POST_SAVE_EMPLOYEECAT", datajson });
  },
  EmployeeWorkingDelete: (id, index) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeWorkingDelete";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        Id: id,
      },
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let employeeWorkingDelete = await response.json();
    dispatch({ type: "GET_DELETE_EMPLOYEEWORKING", employeeWorkingDelete });
  },
  updateEmployee: (data, accId) => async (dispatch, getState) => {
    const url = URL + "employee/EmployeeSave";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
      body: data,
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let datajson = await response.json();
    dispatch({ type: "POST_SAVE_EMPLOYEE", datajson });
    return datajson;
  },
  UserSave: (data) => async (dispatch) => {
    const url = URL + "api/users/UserSave";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let datajson = await response.json();
    dispatch({ type: "POST_SAVE_USER", datajson });
  },
  UpdateStatus: (EmployeeId, Status) => async (dispatch) => {
    const url = URL + "employee/updatestatus";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        EmployeeId: EmployeeId,
        Status: Status,
      },
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let updateStatus = await response.json();
    dispatch({ type: "UPDATE_STATUS", updateStatus });
  },
  ResetPassword: (EmployeeId) => async (dispatch) => {
    const url = URL + "employee/ResetPass";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        EmployeeId: EmployeeId,
      },
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let resetPassword = await response.json();
    dispatch({ type: "RESET_PASSWORD", resetPassword });
  },
  EmployeeIMEISave: (data) => async (dispatch, getState) => {
    const url = URL + "employee/imei/save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.stringify(data)),
    };
    const response = await fetch(url, requestOptions);
    const employeeIMEISave = await response.json();
    dispatch({ type: "EMPLOYEE_IMEI_SAVE", employeeIMEISave });
  },
  ParentSave: (data) => async (dispatch) => {
    const url = URL + "employee/EmployeeParent/Save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(JSON.stringify(data)),
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let parentSave = await response.json();
    dispatch({ type: "PARENT_SAVE", parentSave });
  },
  PositionSave: (data) => async (dispatch) => {
    const url = URL + "employee/EmployeePosition/Save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(JSON.stringify(data)),
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let result = await response.json();
    dispatch({ type: "Position_SAVE", result });
    return result;
  },
  GetListCity: (accId) => async (dispatch, getState) => {
    const url = URL + "employee/GetListCity";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const getListCity = await response.json();
    dispatch({ type: "GET_LIST_CITY", getListCity });
  },
  GetShopByEmployee: (employeeId, workDate) => async (dispatch, getState) => {
    const url = URL + "Employee/GetShopByEmployee";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        employeeId: employeeId || "",
        workDate: workDate || "",
      },
    };
    const request = new Request(url, requestOptions);
    const response = await fetch(request);
    let rs = await response.json();
    dispatch({ type: "GetShopByEmployee", rs });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "GET_LIST_EMPLOYEE": {
      return {
        ...state,
        lists: action.lists,
        loading: false,
        errors: "Success",
        forceReload: false,
      };
    }
    case "GET_EmployeeType": {
      return {
        ...state,
        employeeTypes: action.employeeTypes,
        loading: false,
        errors: {},
        forceReload: false,
      };
    }
    case "GET_EmployeeDDL": {
      return {
        ...state,
        employeeDDL: action.employeeDDL,
        loading: false,
        errors: {},
        forceReload: false,
      };
    }
    case "GET_EmployeeById": {
      return {
        ...state,
        employeeDetail: action.employeeDetail,
        loading: false,
        errors: {},
        forceReload: false,
      };
    }
    case "GET_Menus": {
      return {
        ...state,
        menus: action.menus,
        loading: false,
        errors: {},
        forceReload: false,
      };
    }
    case "GET_DELETE_EMPLOYEEWORKING": {
      return {
        ...state,
        employeeWorkingDelete: action.employeeWorkingDelete,
      };
    }
    case "POST_SAVE_EMPLOYEE": {
      return {
        ...state,
        updateEmployee: action.datajson,
      };
    }
    case "POST_UPDATE_EMPLOYEEWORKING": {
      return {
        ...state,
        employeeWorkingUpdate: action.payload.employeeUpdate,
      };
    }
    case "POST_UPDATE_EMPLOYEECAT": {
      return {
        ...state,
        cateUpdate: action.payload.cateUpdate,
      };
    }
    case "UPDATE_STATUS": {
      return {
        ...state,
        updateStatus: action.updateStatus,
      };
    }
    case "RESET_PASSWORD": {
      return {
        ...state,
        resetPassword: action.resetPassword,
      };
    }
    case "EMPLOYEE_IMEI_SAVE": {
      return {
        ...state,
        employeeIMEISave: action.employeeIMEISave,
      };
    }
    case "PARENT_SAVE": {
      return {
        ...state,
        parentSave: action.parentSave,
      };
    }
    case "Position_SAVE": {
      return {
        ...state,
        positionSave: action.result,
      };
    }
    case "GET_LIST_CITY": {
      return {
        ...state,
        getListCity: action.getListCity,
      };
    }
    case "GetShopByEmployee": {
      return {
        ...state,
        getShopByEmployee: action.rs,
      };
    }

    default:
      return state;
  }
};
