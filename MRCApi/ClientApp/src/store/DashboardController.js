import { getToken, URL } from "../Utils/Helpler";

const initialState = {
    selloutSummary: [],
    loading: true,
    errors: {},
}
export const CreateDashboardAction = {
    SellOutSummary: (data) => async (dispatch, getState) => {
        const url = URL + 'dashboard/sellout/summary';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'info':JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        await response.json().then(results => {
            dispatch({ type: 'GET_SELLOUT_SUMMARY', results });
        }).catch(reason => {
            dispatch({ type: 'ERROR_EXCEPTION', reason });
        });
    }

}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_SELLOUT_SUMMARY':
            {
                return {
                    ...state,
                    selloutSummary: action.results,
                    loading: false,
                    errors: {},
                }
            }
        case 'ERROR_EXCEPTION':
            {
                return {
                    ...state,
                    errors: action.reason,
                    loading: false,
                }
            }

        default:
            return state;
    }
}