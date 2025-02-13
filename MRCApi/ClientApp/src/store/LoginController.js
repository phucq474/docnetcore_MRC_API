import {URL} from '../Utils/Helpler'
const initialState = {
  login: [],
  username: "",
  password: "",
  fistname: "",
  loading: false,
  errors: {},
  forceReload: false
};
export const actionCreators = {
  SendMail: data => async (dispatch,getState) => {
    const url = URL + 'api/users/password';
    const requestOptions = {
      method: 'GET',
      headers: {
        'username': data.use_set,
        'email': data.email,
      }
    };
    const request = new Request(url,requestOptions);
    const response = fetch(request);
    response.then(res => res.text())
      .then((results) => {
        dispatch({type: "RESET_PASS",results});
      },
        (error) => {
          console.log(error);
        })
  },
  SignIn: loginInfo => async (dispatch,getState) => {
    const url = URL + 'api/users/login';
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginInfo)
    };
    const request = new Request(url,requestOptions);
    const response = fetch(request);
    let loginjson;
    response
      .then(res => res.json())
      .then((result) => {
        loginjson = result;
        dispatch({type: "FETCH_LOGIN",loginjson});
      },
        (error) => {})
  }
};
export const reducer = (state,action) => {
  state = state || initialState;
  switch(action.type) {
    case "FETCH_LOGIN": {
      return {
        ...state,
        login: action.loginjson,
        loading: false,
        errors: {},
        forceReload: false
      };
    }
    case 'RESET_PASS':
      {
        return {
          ...state,
          loading: false,
          errors: action.results,
          forceReload: false
        }
      }
    default:
      return state;
  }
};
