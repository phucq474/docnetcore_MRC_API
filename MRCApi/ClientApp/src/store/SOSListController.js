import { getToken } from "../Utils/Helpler";

const initialState = {
  sosList: [],
  imported: null,
  exported: null,
  updated: null,
};
export const SOSListActionCreators = {
  GetList: (accId) => async (dispatch, getState) => {
    const url = "/SOSList/Filter";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_SOS_LIST", result });
  },
  Update: (data) => async (dispatch, getState) => {
    const url = "/SOSList/Insert";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const insertSOSList = await response.json();
    dispatch({ type: "INSERT_SOS_LIST", insertSOSList });
  },
  Export: (accId) => async (dispatch, getState) => {
    const url = "/SOSList/Export";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        accId: accId || "",
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_SOS_Export", result });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "GET_SOS_LIST": {
      return {
        ...state,
        sosList: action.result,
      };
    }
    case "GET_SOS_Export": {
      return {
        ...state,
        exported: action.result,
      };
    }

    default:
      return state;
  }
};
