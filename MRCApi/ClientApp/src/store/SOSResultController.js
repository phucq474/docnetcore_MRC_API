import { getToken } from "./../Utils/Helpler";
const initialState = {
  sosResults: [],
  sosDetail: [],
  fileExport: [],
  result: [],
};
export const SOSResultActionCreators = {
  /// SOS-Result
  GetList: (JsonData) => async (dispatch, getState) => {
    const url = "/SOSResult/GetList";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetList", result });
  },
  GetDetail: (JsonData) => async (dispatch, getState) => {
    const url = "/SOSResult/GetDetail";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetDetail", result });
  },
  Export: (JsonData) => async (dispatch, getState) => {
    const url = "/SOSResult/Export";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_Export", result });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "GET_GetList": {
      return {
        ...state,
        sosResults: action.result,
      };
    }
    case "GET_GetDetail": {
      return {
        ...state,
        sosDetail: action.result,
      };
    }
    case "GET_Export": {
      return {
        ...state,
        fileExport: action.result,
      };
    }
    default:
      return state;
  }
};
