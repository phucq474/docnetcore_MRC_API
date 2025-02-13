import { getToken, URL } from '../Utils/Helpler';

export const GetEmployeeIMEIList = async (data) => {
    try {
        const url = URL + 'employee/imei/filter';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'jsonData': JSON.stringify(data),
            },
        };
        const request = await fetch(url, requestOptions);
        const response = await request.json();
        return response
    } catch (e) {
        console.log(e, 'e')
        return []
    }
}

export const GetEmployeeIMEIDetail = async (employeeId) => {
    try {
        const url = URL + 'employee/imei/getdata';
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
                'employeeId': employeeId,
            },
        };
        const request = await fetch(url, requestOptions);
        const response = await request.json();
        return response
    } catch (e) {
        console.log(e, 'e')
        return []
    }
}

export const InsertEmployeeIMEI = async (data) => {
    try {
        const url = URL + 'employee/imei/insert';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(JSON.stringify(data)),
        };
        const request = await fetch(url, requestOptions);
        const response = await request.json();
        return response
    } catch (e) {
        console.log(e, 'e')
        return []
    }
}

