import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    regions: [],
    loading: true,
    errors: {},
    forceReload: false
}
export const RegionActionCreate = {
    GetListRegion: (accId) => async (dispatch, getState) => {
        const url = URL + 'region/list';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const regions = await response.json();
        dispatch({ type: 'GET_ListRegion', regions });
    },
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_ListRegion':
            {
                return {
                    ...state,
                    regions: action.regions,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        default:
            return state;
    }
};