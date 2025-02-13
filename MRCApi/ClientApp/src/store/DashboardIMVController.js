import { getToken, URL } from "../Utils/Helpler";

const initialState = {
  sellInTotal: [],
};
export const DashboardIMVCreateAction = {
  SellInTotal: (data) => async (dispatch, getState) => {
    const url = "DashboardIMV/SellIn/Total";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: getToken(),
        JsonData: JSON.stringify(data),
      },
    };
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    dispatch({ type: "GET_SellIn_Total", result });
  },
};
export const reducer = (state, action) => {
  state = state || initialState;
  switch (action.type) {
    case "GET_SellIn_Total": {
      return {
        ...state,
        sellInTotal: action.result,
      };
    }
    default:
      return state;
  }
};
