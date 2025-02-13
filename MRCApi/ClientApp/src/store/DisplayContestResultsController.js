import { URL, getToken } from "../Utils/Helpler";
const initialState = {
  resultList: [],
  resultStatus: [],
  exported: [],
  exportedPPT: [],
  displayPhotos: [],
  updated: null,
};
export const actionCreatorsDisplayContestResult = {
  GetList: (data) => async (dispatch, getState) => {
    const url = URL + "DisplayContestResults/GetList";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_GetList", result });
  },
  GetDetail: (data) => async (dispatch, getState) => {
    const url = URL + "DisplayContestResults/GetDetail";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_GetDetail", result });
  },
  GetPhotos: (data) => async (dispatch, getState) => {
    const url = URL + "DisplayContestResults/GetPhotos";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_GetPhotos", result });
  },
  Update: (data) => async (dispatch, getState) => {
    const url = URL + "DisplayContestResults/Update";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_Update", result });
  },
  Export: (data) => async (dispatch, getState) => {
    const url = URL + "DisplayContestResults/Export";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_Export", result });
  },
  ExportPPT: (data) => async (dispatch, getState) => {
    const url = URL + "DisplayContestResults/ExportPPT";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: getToken(),
        "Content-Type": "application/json",
      },
      body: "'" + JSON.stringify(data) + "'",
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "POST_ExportPPT", result });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "POST_GetList": {
      return {
        ...state,
        resultList: action.result,
      };
    }
    case "POST_GetDetail": {
      return {
        ...state,
        resultStatus: action.result,
      };
    }
    case "POST_GetPhotos": {
      return {
        ...state,
        displayPhotos: action.result,
      };
    }
    case "POST_Update": {
      return {
        ...state,
        updated: action.result,
      };
    }
    case "POST_Export": {
      return {
        ...state,
        exported: action.result,
      };
    }
    case "POST_ExportPPT": {
      return {
        ...state,
        exportedPPT: action.result,
      };
    }
    default:
      return state;
  }
};
