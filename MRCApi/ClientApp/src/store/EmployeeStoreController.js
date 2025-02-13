import { URL, getToken } from '../Utils/Helpler'
const initialState = {
    filterResult: [],
    loading: false,
    errors: {},
    forceReload: false
};
export const actionCreators = {
    Filter: (dataFilter, accId) => async (dispatch, getState) => {
        const url = URL + 'EmployeeStore/Filter';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'accId': accId || ""
            },
            body: JSON.stringify(dataFilter)
        }
        const request = new Request(url, requestOptions);
        const response = await fetch(request);
        let filterResult = await response.json();
        dispatch({ type: "POST_FILTER_EMPLOYEESTORE", filterResult });
    },
    UpdateDate: (data, index, accId) => async (dispatch, getState) => {
        const url = URL + 'EmployeeStore/EditFromToDate';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Id': data.id,
                'EmployeeId': data.employeeId,
                'ShopId': data.shopId,
                'FromDate': data.fromDate,
                'ToDate': data.toDate,
                'accId': accId || ""
            },
        }
        const request = new Request(url, requestOptions);
        const response = await fetch(request);
        let updateDate = await response.json();
        const payload = { updateDate, index }
        dispatch({ type: "Update_From_To_Date", payload });
    }
}
export const reducer = (state, action) => {
    state = state || initialState;
    let filterResult = state.filterResult
    switch (action.type) {
        case 'POST_FILTER_EMPLOYEESTORE':
            {
                return {
                    ...state,
                    filterResult: action.filterResult,
                    loading: false,
                    errors: 'Success',
                    forceReload: false
                }
            }
        case 'Update_From_To_Date':
            {

                if (action.payload.updateDate.status === 200) {
                    let result = JSON.parse(action.payload.updateDate.message)
                    Object.assign(filterResult.table1[action.payload.index], result[0])
                }
                return {
                    ...state,
                    updateDate: action.payload.updateDate,
                    filterResult: filterResult
                }
            }
        default:
            return state;
    }
};