import { URL, getToken } from "../Utils/Helpler";
const initialState = {
  fileExport: [],
  result: [],
};
export const SyncDataCreateAction = {
  Import: (file) => async (dispatch, getState) => {
    const url = URL + "SyncData/Import";
    const formData = await new FormData();
    await formData.append("files", file);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
      },
      body: formData,
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_IMPORT", result });
  },
  Export: (data) => async (dispatch, getState) => {
    const url = URL + "SyncData/Export";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        TypeReport: data.TypeReport,
        FromDate: data.FromDate,
        ToDate: data.ToDate,
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_EXPORT", result });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "POST_IMPORT": {
      return {
        ...state,
        result: action.result,
      };
    }
    case "GET_EXPORT": {
      return {
        ...state,
        fileExport: action.result,
      };
    }
    default:
      return state;
  }
};
