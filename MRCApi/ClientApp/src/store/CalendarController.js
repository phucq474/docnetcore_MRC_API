import { URL, getToken } from "../Utils/Helpler";
const initialState = {
    calendars: [],
    getCycle: []
}
export const CalendarCreateAction = {
    GetCalendar: (data) => async (dispatch, getState) => {
        const url = URL + 'calendar/GetList';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'Year': 0,
                'Month': 0,
                'Date': ''
            }
        };
        const response = await fetch(url, requestOptions);
        const calendars = await response.json();
        dispatch({ type: 'GET_List_Calendar', calendars });
    },
    GetCycle: () => async (dispatch, getState) => {
        const url = URL + 'calendar/GetCycle';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(url, requestOptions);
        const calendars = await response.json();
        dispatch({ type: 'GetCycle', calendars });
    }
};
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_List_Calendar':
            {
                return {
                    ...state,
                    calendars: action.calendars
                }
            }
        case 'GetCycle':
            {
                return {
                    ...state,
                    getCycle: action.calendars
                }
            }
        default:
            return state;
    }
};