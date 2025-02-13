import { getToken } from "./../Utils/Helpler";
const initialState = {
  sellInIMV: [],
  templated: [],
  exported: [],
  imported: [],
  result: [],
};
export const SellInIMVActionCreators = {
  GetList: (JsonData, accId) => async (dispatch, getState) => {
    const url = "SellInIMV/GetList";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_GetList", result });
  },
  Import: (files, accId) => async (dispatch, getState) => {
    const url = "SellInIMV/Import";
    const formData = new FormData();
    formData.append("files", files);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
      body: formData,
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_Import", result });
  },
  GetTemplate: (accId) => async (dispatch, getState) => {
    const url = "/SellInIMV/GetTemplate";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_Template", result });
  },
  Export: (JsonData, accId) => async (dispatch, getState) => {
    const url = "/SellInIMV/Export";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(JsonData),
        accId: accId || "",
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
        sellInIMV: action.result,
      };
    }
    case "GET_Export": {
      return {
        ...state,
        exported: action.result,
      };
    }
    case "GET_Template": {
      return {
        ...state,
        templated: action.result,
      };
    }
    case "POST_Import": {
      return {
        ...state,
        imported: action.result,
      };
    }
    default:
      return state;
  }
};
