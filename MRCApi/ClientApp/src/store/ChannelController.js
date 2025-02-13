import { URL, getToken, getAccountId, getEmployeeId } from '../Utils/Helpler';
const initialState = {
    dealers: [],
    loading: true,
    errors: {},
    forceReload: false,
    channelList: [],
}
export const getListChannel = {
    GetChannelList: (accId) => async (dispatch, getState) => {
        const url = URL + 'channel/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'accId': accId || ""
            }
        };
        const response = await fetch(url, requestOptions);
        const channelList = await response.json();
        dispatch({ type: 'GET_CHANNEL_LIST', channelList });
    },

};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_CHANNEL_LIST':
            {
                return {
                    ...state,
                    channelList: action.channelList,
                    loading: false,
                    errors: {},
                    forceReload: false
                }
            }
        default:
            return state;
    }
};