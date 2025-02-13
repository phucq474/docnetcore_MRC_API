import moment from 'moment';
import { Button } from 'primereact/button';
import Cookies from 'js-cookie';
export const DefaultTheme = "nova-accent";
export const URL = "/";
const CookieKey = "H8992x00yhhi6222288jll1208njjul"
export const setLogin = (jsonLogin) => {
    let userInfo = JSON.parse(jsonLogin);
    Cookies.set(CookieKey, userInfo.token, { expires: 7 })
    userInfo.token = null;
    localStorage.setItem("USER", JSON.stringify(userInfo));
    setLangue(false);
}
export const listTheme = (onItemClick) => [
    {
        label: "Dark",
        items:
            [{
                index: 1, themeName: "luna-amber", label: "Nền Đen Vàng", command: (e) => onItemClick(e)
            },
            {
                index: 2, themeName: "luna-blue", label: "Nền Đen Xanh Ngọc", command: (e) => onItemClick(e)
            },
            {
                index: 3, themeName: "luna-green", label: "Nền Đen Xanh Lá", command: (e) => onItemClick(e)
            }, {
                index: 4, themeName: "luna-pink", label: "Nền Đen Hồng",
                command: (e) => onItemClick(e)
            },]
    }, {
        label: 'Light',
        items: [
            { index: 5, themeName: "nova-alt", label: "Nền Sáng 1", command: (e) => onItemClick(e) },
            { index: 6, themeName: "nova-accent", label: "Nền Sáng 2", command: (e) => onItemClick(e) },
            { index: 7, themeName: "nova", label: "Nền Sáng 3", command: (e) => onItemClick(e) },
            { index: 8, themeName: "rhea", label: "Nền Sáng 4", command: (e) => onItemClick(e) },
        ]
    }
]
export const showToast = (toast, message, typemessage) => {
    if (typemessage === undefined) typemessage = "error";
    toast.show({ severity: typemessage, summary: 'Thông báo', detail: message, life: 3000 });
}
export const showConfirm = (toast, message, yes) => {
    toast.show({
        severity: 'warn', sticky: true, content: (
            <div className="p-flex p-flex-column" style={{ flex: '1' }}>
                <div className="p-text-center">
                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                    <h4>Are you sure?</h4>
                    <p>{message}</p>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-col-6">
                        <Button onClick={() => yes()} label="Yes" className="p-button-success" />
                    </div>
                    <div className="p-col-6">
                        <Button onClick={() => toast.clear()} label="No" className="p-button-secondary" />
                    </div>
                </div>
            </div>
        )
    });
}
export var getAccountId = function () {
    const login = localStorage.getItem("USER");
    if (login === undefined || login === null) return window.location.href = "/login";
    else return JSON.parse(login).accountId;
}
export var getEmployeeId = function () {
    const login = localStorage.getItem("USER");
    if (login === undefined || login === null) return window.location.href = "/login";
    else return JSON.parse(login).id;
}
export const getLogin = function () {
    const jsonLogin = localStorage.getItem("USER");
    if (jsonLogin === undefined || jsonLogin === null)
        return null;
    const today = parseInt(new moment(new Date()).format("YYYYMMDD"), 0);
    const login = JSON.parse(jsonLogin);
    if (login.expriedDate < today) return null;
    else return login;
}
export const fileToBase64 = (filename, filepath) => {
    return new Promise(resolve => {
        var file = new File([filename], filepath);
        var reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.readAsDataURL(file);
    });
};
export function formatCurrency(NumValue, num) {
    if (num === undefined || num === null) num = 0;
    if (NumValue === null || NumValue === undefined) return 0;
    else {
        var s = '' + (Math.floor(NumValue)), d = NumValue % 1, i = s.length, r = '';
        while ((i -= 3) > 0) { r = ',' + s.substr(i, 3) + r; }
        return s.substr(0, i + 3) + r + (d ? '.' + Math.round(d * Math.pow(10, num || 2)) : '');
    }
}
export function download(filePath) {
    if (filePath) {
        var link = document.createElement('a');
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    }
}
export var getToken = function () {
    const token = Cookies.get(CookieKey);
    if (token !== undefined && token.length > 10)
        return 'Bearer ' + token;
    else window.location.href = "/login";
}
export const GetDateFrom = (idate) => {
    let strDate = idate.toString();
    return strDate.substr(0, 4) + '-' + strDate.substr(4, 2) + '-' + strDate.substr(6, 7);
}
export const Accept_Headers = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'POST,GET, PUT, OPTIONS, DELETE',
    'Access-Control-Allow-Origin': '*',
}
export const dictionary = () => {
    const login = getLogin();
    if (login !== null && login.langueList !== null && login.langueList)
        return JSON.parse(login.langueList);
    else return []
}
export const setLangue = (LangueId) => {
    let libaryLang = dictionary();
    libaryLang.forEach(item => {
        let langSwith = LangueId === false ? 1 : 0;
        if (item.LangValue === langSwith) {
            localStorage.setItem("LangActive", item.LangData);
            return;
        }
    });
}
export const getLangue = () => {
    const Strlange = localStorage.getItem("LangActive");
    let langObject = JSON.parse(Strlange);
    return langObject;
}
export const LangType = () => {
    const isVie = localStorage.getItem("isVie");
    return isVie === "true" ? true : false;
}
export const searchIndex = (array, key) => {
    for (let i = 0, len = array.length; i < len; i++) {
        if (array[i] === key) return i
    }
    return -1
}
export const findIndex = (arr, key, value) => {
    let index = -1;
    for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i][key] === value) return i
    }
    return index
}
export async function HelpPermission(pageId) {
    try {
        let defaultPermission = { create: false, delete: false, edit: false, export: false, import: false, view: false }
        let permission = sessionStorage.getItem("permission")
        if (permission) {
            permission = JSON.parse(permission)
            if (!permission[pageId]) return defaultPermission
            else return permission[pageId]
        } else {
            const url = URL + 'menu/GetPermission';
            const requestOptions = {
                method: 'GET', headers: {
                    'Authorization': getToken(),
                    'employeeId': getEmployeeId(),
                },
            };
            const response = await fetch(url, requestOptions);
            const menuDatas = await response.json();
            let permission = {}
            for (let i = 0, lenDatas = menuDatas.length; i < lenDatas; i++) {
                permission[menuDatas[i].menuId] = await menuDatas[i]
            }
            await sessionStorage.setItem("permission", JSON.stringify(permission))
            if (!permission[pageId]) return defaultPermission
            return permission[pageId]
        }
    } catch (e) { }
}
export const b64EncodeUnicode = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
}
export const b64DecodeUnicode = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
}
export const removeVietnameseTones = (str) => {
    if (!str) return ""
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}
export const getImageUpdateName = async (imageUrl) => {
    try {
        if (!imageUrl) return ""
        let indexSlash = await imageUrl.lastIndexOf("/")
        indexSlash = await indexSlash !== -1 ? indexSlash : imageUrl.lastIndexOf("\\")
        let clonePhoto = ""
        if (indexSlash !== -1) {
            clonePhoto = await imageUrl.slice(indexSlash + 1)
            let indexCopy = await clonePhoto.indexOf("_copy_")
            if (indexCopy !== -1) {
                let numCount = await +clonePhoto.slice(0, indexCopy) + 1
                clonePhoto = await numCount + clonePhoto.slice(indexCopy)
            } else {
                clonePhoto = "1_copy_" + clonePhoto
            }
        }
        return clonePhoto
    } catch (e) { }
}
export const getFolderImagePath = async (imageUrl) => {
    try {
        if (!imageUrl) return ""
        let folderPath = await ""
        let indexSlash = await imageUrl.lastIndexOf("/")
        indexSlash = await indexSlash !== -1 ? indexSlash : imageUrl.lastIndexOf("\\")
        if (isHttpUrl(imageUrl)) {
            folderPath = await imageUrl.slice(0, indexSlash).replace(new URL(imageUrl).origin, "")
        } else {
            folderPath = await imageUrl.slice(0, indexSlash)
        }
        let lo = await 0, hi = await folderPath.length - 1
        while (lo <= hi && (folderPath.charCodeAt(lo) === 47 || folderPath.charCodeAt(lo) === 92)) lo = await lo + 1
        while (hi > lo && (folderPath.charCodeAt(hi) === 47 || folderPath.charCodeAt(hi) === 92)) hi = await hi - 1
        folderPath = await folderPath.slice(lo, hi + 1)
        return "/" + folderPath + "/"
    } catch (e) { }
}
export const isHttpUrl = (string) => {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
        return false;
    }
}
export const validInput = (type, string) => {
    if (!type || !string) return false
    switch (type) {
        case 'phone':
            return (/(0[\d]|84)+([0-9]{6,11})\b/g).test(string)
        case 'phones':
            return (/[a-zA-Z]/g).test(string)
        case 'email':
            return (/^\S+@\S+\.\S+$/g).test(string)
        default:
            return false
    }
}
export const toSetArray = (data, key, filterByKey = null, filterByValue = null) => {
    if (filterByKey === null && filterByValue === null) {
        return data.filter((v, i, a) => a.findIndex(t => (t[key] === v[key])) === i && !!v[key])
    } else {
        return data.filter((v, i, a) => a.findIndex(t => (t[key] === v[key])) === i && !!v[key] && v[filterByKey] === filterByValue)
    }
}
export const getUrlParams = (hashKey = null) => {
    try {
        let searchString = window.location.search
        const params = new URLSearchParams(searchString), dict = {}
        for (const [key, value] of params.entries()) dict[key] = value
        if (hashKey) return dict[hashKey]
        else return dict
    } catch (e) { }
}

export async function getDefaultCycle(accId) {
    try {
        let selectDefault = null;
        if (getAccountId() >= 0 || accId) {
            const url = URL + 'calendar/GetCycle';
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization': getToken(),
                    'Content-Type': 'application/json',
                    'accId': accId || ""
                }
            };
            const response = await fetch(url, requestOptions);
            const calendars = await response.json();
            if (calendars.status === 200) {
                const data = await calendars.data;
                data.forEach(item => {
                    if (item.isDefault === 1) {
                        selectDefault = {
                            fromDate: item.fromDate,
                            toDate: item.toDate
                        }
                        return selectDefault;
                    }
                })
            }
        }
        return selectDefault;
    } catch (e) { }
}