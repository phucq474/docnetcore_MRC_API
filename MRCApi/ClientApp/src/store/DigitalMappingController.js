import { URL, getToken } from '../Utils/Helpler';
const initialState = {
    shoplist: [],
    errors: '',
    loading: false,
    listEmployeeToCalculate: []
}
export const MappingActionCreate = {
    GetShops: (data) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/mapgetshop';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonSearch': JSON.stringify(data),
            },
        };
        const response = await fetch(url, requestOptions);
        const shoplist = await response.json();
        dispatch({ type: 'GET_SHOPS', shoplist });
    },
    CalculateDistance: () => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/CalculateDistance';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(url, requestOptions);
        const listEmployeeToCalculate = await response.json();
        dispatch({ type: 'CalculateDistance', listEmployeeToCalculate });
    },
    GetListResult: (data) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/MappingResult';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        const mappingResult = await response.json();
        dispatch({ type: 'GetListResult', mappingResult });
    },
    DetailByEmployee: (data) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/MappingDetail';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, requestOptions);
        const mappingDetail = await response.json();
        dispatch({ type: 'MappingDetail', mappingDetail });
    },
    CalculateByEmployee: (EmployeeId, WorkDate) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/CalculateDistanceByEmployee';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                EmployeeId: EmployeeId,
                WorkDate: WorkDate
            }
        };
        const response = await fetch(url, requestOptions);
        const resultToCalculate = await response.json();
        dispatch({ type: 'CalculateByEmployee', resultToCalculate })
    },
    ExportDistance: (FromDate, ToDate, SupId, EmployeeId) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/DigitalMappingExport';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                FromDate: FromDate,
                ToDate: ToDate,
                SupId: SupId,
                EmployeeId: EmployeeId
            }
        };
        const response = await fetch(url, requestOptions);
        const urlExport = await response.json();
        dispatch({ type: 'ExportDistance', urlExport });
    },
    RouteByEmployee: (data) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/RouteByEmployee';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonSearch': JSON.stringify(data),
            },
        };
        const response = await fetch(url, requestOptions);
        const routeResult = await response.json();
        dispatch({ type: 'RouteByEmployee', routeResult });
    },
    RouteFromStartPoint: (data) => async (dispatch, getState) => {
        const url = URL + 'digitalmapping/DistanceFromStartPoint';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'JsonSearch': JSON.stringify(data)
            }
        };
        const response = await fetch(url, requestOptions);
        const routeFromStartPoint = await response.json();
        dispatch({ type: 'RouteFromStartPoint', routeFromStartPoint });
    },
    GetListCustomer: (FromDate, ToDate, EmployeeId) => async (dispatch) => {
        const url = URL + 'digitalmapping/GetListCustomer';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                FromDate: FromDate,
                ToDate: ToDate,
                EmployeeId: EmployeeId
            }
        };
        const response = await fetch(url, requestOptions);
        const listCustomer = await response.json();
        dispatch({ type: 'ListCustomer', listCustomer });
    }
}
export const reducer = (state, action) => {
    state = state || initialState;
    switch (action.type) {
        case 'GET_SHOPS': {
            return {
                ...state,
                loading: false,
                errors: 'Success',
                shoplist: action.shoplist
            }
        }
        case 'CalculateDistance': {
            return {
                ...state,
                listEmployeeToCalculate: action.listEmployeeToCalculate
            }
        }
        case 'GetListResult': {
            return {
                ...state,
                MappingResult: action.mappingResult
            }
        }
        case 'MappingDetail': {
            return {
                ...state,
                MappingDetail: action.mappingDetail
            }
        }
        case 'CalculateByEmployee': {
            return {
                ...state,
                CalculateByEmployee: action.resultToCalculate
            }
        }
        case 'ExportDistance': {
            return {
                ...state,
                urlExport: action.urlExport.fileUrl
            }
        }
        case 'RouteByEmployee': {
            return {
                ...state,
                routeResult: action.routeResult
            }
        }
        case 'RouteFromStartPoint': {
            return {
                ...state,
                routeFromStartPoint: action.routeFromStartPoint
            }
        }
        case 'ListCustomer': {
            return {
                ...state,
                listCustomer: action.listCustomer
            }
        }
        default:
            return state;
    }
};