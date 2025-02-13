import { URL, getToken } from "../Utils/Helpler";
const initialState = {
  list: [],
  spiralForm: "",
  images: [],
  loading: false,
  results: [],
  resultTotals: [],
  formResult: null,
  shops: [],
  errors: "",
  forceReload: false,
  inActiveForm: [],
  deleteFormResult: [],
  exportImages: [],
  sendEmail: null,
  sendNotification: null,
  employees: [],
  resultAddressSurvey: [],
};
export const CreateActionSpiralForm = {
  CreateForm: (data) => async (dispatch, getState) => {
    const url = URL + `spiralform/create`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "POST_CREATE_FORM", results });
  },
  GetList: (data) => async (dispatch, getState) => {
    const url = URL + `spiralform/list`;
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        fromDate: data.fromDate,
        title: data.title,
      },
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "GET_LIST_FORM", results });
  },
  GetById: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/GetById";
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(url + data, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetById", result });
  },
  GetShops: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/GetShops";
    const requestOptions = {
      method: "GET",
      headers: {
        AccountId: data.accountId,
        EmployeeId: data.employeeId,
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetShops", result });
  },
  GetByKey: (accesskey) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/accesskey";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accesskey: accesskey,
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetByaccesskey", result });
  },
  GetResultTotal: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/GetResultTotal";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(data),
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetResultTotal", result });
  },
  InsertResult: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/InsertResult";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.formData),
    };
    const response = await fetch(url + data.dataByDomain, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_InsertResult", result });
  },
  GetResultById: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/GetResultById";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        Id: data,
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetResultById", result });
  },
  UpdateResult: (data) => async (dispatch, getState) => {
    const url = URL + `spiralform/UpdateResult`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_UpdateResult", result });
  },
  UploadAudio: (data) => async (dispatch, getState) => {
    const url = URL + "spiralform/uploadAudio";
    const formData = new FormData();
    for (let index = 0; index < data.length; index++) {
      let element = data[index];
      formData.append("files", element);
    }
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_UploadAudio", result });
  },
  UploadImages: (data) => async (dispatch, getState) => {
    const url = URL + "spiralform/uploadImages";
    const formData = new FormData();
    for (let index = 0; index < data.length; index++) {
      let element = data[index];
      formData.append("files", element);
    }
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_UploadImages", result });
  },
  TabTableDetail:
    (workDate, formId, supervisorId, listEm) => async (dispatch, getState) => {
      const url = URL + "spiralform/TabDetail";
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: getToken(),
          workDate: workDate,
          formId: formId,
          supervisorId: supervisorId || 0,
          listEm: listEm ? listEm : "",
        },
      };
      const response = await fetch(url, requestOptions);
      const tableDetails = await response.json();
      dispatch({ type: "Table_Detail", tableDetails });
    },
  ExportDetail: (data) => async (dispatch, getState) => {
    const url = URL + "spiralform/ExportRawData";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        jsonData: JSON.stringify(data),
      },
    };
    const response = await fetch(url, requestOptions);
    const exportDetail = await response.json();
    dispatch({ type: "Export_Detail", exportDetail });
  },
  ExportImages: (data) => async (dispatch, getState) => {
    const url = URL + "spiralform/ExportImages";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
        jsonData: JSON.stringify(data),
      },
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "Export_Images", results });
  },
  InActiveSpiralForm: (data) => async (dispatch, getState) => {
    const url = URL + "spiralform/InactiveSpiralForm";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        formId: data.id,
      },
    };
    const response = await fetch(url, requestOptions);
    const inActiveForm = await response.json();
    dispatch({ type: "Inactive_Spiral_Form", inActiveForm });
  },
  DeleteSpiralForm: (id) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/Delete_SpiralFormResult";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        id: id,
      },
    };
    const response = await fetch(url, requestOptions);
    const deleteFormResult = await response.json();
    dispatch({ type: "Delete_Spiral_Form_Result", deleteFormResult });
  },
  SendEmail: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/SendEmail";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "POST_SendEmail", results });
  },
  GetEmployees: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/Notify/GetEmployees";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(data),
      },
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "GET_Notify_GetEmployees", results });
  },
  SendNotification: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/SendNotification";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, requestOptions);
    const results = await response.json();
    dispatch({ type: "POST_SendNotification", results });
  },
  AddressSurveyInsert: (data) => async (dispatch, getState) => {
    const url = URL + "SpiralForm/AddressSurveyInsert";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.formData),
    };
    const response = await fetch(url + data.dataByDomain, requestOptions);
    const resultAddressSurvey = await response.json();
    dispatch({ type: "POST_InsertAddressSurveyResult", resultAddressSurvey });
  },
};

export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "POST_CREATE_FORM": {
      return {
        ...state,
        createForm: action.results,
        loading: false,
        forceReload: false,
      };
    }
    case "GET_LIST_FORM": {
      return {
        ...state,
        errors: "Success",
        loading: false,
        list: action.results,
        forceReload: false,
      };
    }
    case "GET_GetById": {
      return {
        ...state,
        spiralForm: action.result,
      };
    }
    case "GET_GetByaccesskey": {
      return {
        ...state,
        spiralForm: action.result,
      };
    }
    case "GET_GetShops": {
      return {
        ...state,
        shops: action.result,
      };
    }
    case "GET_GetResultById": {
      return {
        ...state,
        formResult: action.result,
      };
    }
    case "GET_GetResultTotal": {
      return {
        ...state,
        resultTotals: action.result,
      };
    }
    case "POST_InsertResult": {
      return {
        ...state,
        result: action.result,
      };
    }
    case "POST_UpdateResult": {
      return {
        ...state,
        result: action.result,
      };
    }
    case "POST_UploadImages": {
      return {
        ...state,
        images: action.result,
      };
    }
    case "POST_UploadAudio": {
      return {
        ...state,
        images: action.result,
      };
    }
    case "Table_Detail": {
      return {
        ...state,
        tableDetails: action.tableDetails,
      };
    }
    case "Export_Detail": {
      return {
        ...state,
        exportDetail: action.exportDetail,
      };
    }
    case "Export_Images": {
      return {
        ...state,
        exportImages: action.results,
      };
    }
    case "Inactive_Spiral_Form": {
      return {
        ...state,
        inActiveForm: action.inActiveForm,
      };
    }
    case "Delete_Spiral_Form_Result": {
      return {
        ...state,
        deleteFormResult: action.deleteFormResult,
      };
    }
    case "POST_SendEmail": {
      return {
        ...state,
        sendEmail: action.results,
      };
    }
    case "GET_Notify_GetEmployees": {
      return {
        ...state,
        employees: action.results,
      };
    }
    case "POST_SendNotification": {
      return {
        ...state,
        sendNotification: action.results,
      };
    }
    case "POST_InsertAddressSurveyResult": {
      return {
        ...state,
        resultAddressSurvey: action.resultAddressSurvey,
      };
    }
    default:
      return state;
  }
};
