import { getToken } from "./../Utils/Helpler";
import moment from "moment";
const initialState = {
  oolTargetFilter: [],
  oolSaveTarget: [],
  ooltargetsTemplate: [],
  resultImportOOLTarget: [],
  loading: false,
  errors: {},
  forceReload: false,
};
export const actionCreatorsOOL = {
  FilterTarget: (JsonData) => async (dispatch, getState) => {
    const url = "/ooltargets/Filter";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const oolTargetFilter = await response.json();
    dispatch({ type: "GET_OOL_TARGET", oolTargetFilter });
  },
  SaveOOLTarget: (Action, data, index) => async (dispatch, getState) => {
    const url = URL + "/ooltargets/Save";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-type": "application/json",
        Action: Action,
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const oolSaveTarget = await response.json();
    const payload = { oolSaveTarget, Action, index };
    dispatch({ type: "Save_OOL_TARGET", payload });
  },
  GetTemplateTarget: (JSonData) => async (dispatch, getState) => {
    const url = "/ooltargets/Template";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JSonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const ooltargetsTemplate = await response.json();
    dispatch({ type: "GET_TEMPLATE_OOL_TARGET", ooltargetsTemplate });
  },
  ImportTarget: (fileUpload) => async (dispatch, getState) => {
    const url = "/ooltargets/ImportTagertOOL";
    const formData = new FormData();
    formData.append("fileUpload", fileUpload);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
      body: formData,
    };
    const response = await fetch(url, requestOptions);
    const resultImportOOLTarget = await response.json();
    dispatch({ type: "IMPORT_OOL_TARGET", resultImportOOLTarget });
  },
  ExportTarget: (JSonData) => async (dispatch, getState) => {
    const url = "/ooltargets/ExportTarget";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JSonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const ooltargetsExport = await response.json();
    dispatch({ type: "EXPORT_OOL_TARGET", ooltargetsExport });
  },
  /// OOL-Result
  FilterResult: (JsonData) => async (dispatch, getState) => {
    const url = "/WorkingResultOOL/Filter_OOLResult";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const oolResultFilter = await response.json();
    dispatch({ type: "GET_OOL_RESULT", oolResultFilter });
  },
  ExportResult: (JsonData) => async (dispatch, getState) => {
    const url = "/WorkingResultOOL/Export_OOLResult";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const oolResultExport = await response.json();
    dispatch({ type: "EXPORT_OOL_RESULT", oolResultExport });
  },
  DetailResult: (JsonData) => async (dispatch, getState) => {
    const url = "/WorkingResultOOL/Detail_OOLResult";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        EmployeeId: JsonData.employeeId,
        ShopId: JsonData.shopId,
        WorkDate: +moment(JsonData.workDate).format("YYYYMMDD"),
      },
    };
    const response = await fetch(url, requestOptions);
    const oolResultDetail = await response.json();
    dispatch({ type: "DETAIL_OOL_RESULT", oolResultDetail });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  let list = state.list;
  let listOOLTarget = state.oolTargetFilter;
  switch (action.type) {
    case "GET_OOL_TARGET": {
      return {
        ...state,
        oolTargetFilter: action.oolTargetFilter,
        loading: false,
        errors: "Success",
        forceReload: false,
      };
    }
    case "Save_OOL_TARGET": {
      if (
        typeof action.payload.SaveOOLTarget === "object" &&
        action.payload.SaveOOLTarget[0] &&
        action.payload.SaveOOLTarget[0].response === "1"
      ) {
        if (action.payload.Action === "UPDATE") {
          let result = action.payload.SaveOOLTarget[0];
          Object.assign(listOOLTarget[action.payload.index], result);
        } else if (action.payload.Action === "DELETE") {
          listOOLTarget.splice(action.payload.index, 1);
        } else if (action.payload.Action === "INSERT") {
          listOOLTarget = action.payload.SaveOOLTarget;
        } else {
          return false;
        }
      }
      return {
        ...state,
        oolSaveTarget: action.payload.SaveOOLTarget,
        oolTargetFilter: listOOLTarget,
      };
    }
    case "GET_TEMPLATE_OOL_TARGET": {
      return {
        ...state,
        ooltargetsTemplate: action.ooltargetsTemplate,
        loading: false,
        forceReload: false,
      };
    }
    case "IMPORT_OOL_TARGET": {
      return {
        ...state,
        resultImportOOLTarget: action.resultImportOOLTarget,
        loading: false,
        errors: action.results,
        forceReload: false,
      };
    }
    case "EXPORT_OOL_TARGET": {
      return {
        ...state,
        ooltargetsExport: action.ooltargetsExport,
        loading: false,
        errors: action.results,
        forceReload: false,
      };
    }
    /// OOL-Resulut
    case "GET_OOL_RESULT": {
      return {
        ...state,
        oolResultFilter: action.oolResultFilter,
        loading: false,
        errors: action.results,
        forceReload: false,
      };
    }
    case "EXPORT_OOL_RESULT": {
      return {
        ...state,
        oolResultExport: action.oolResultExport,
        loading: false,
        errors: action.results,
        forceReload: false,
      };
    }
    case "DETAIL_OOL_RESULT": {
      return {
        ...state,
        oolResultDetail: action.oolResultDetail,
        loading: false,
        errors: action.results,
        forceReload: false,
      };
    }
    default:
      return state;
  }
};
