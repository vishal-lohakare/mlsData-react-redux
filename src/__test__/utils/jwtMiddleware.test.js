import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import jwtMiddleware from 'utils/jwtMiddleware';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';
import jwt from 'jsonwebtoken';
import {
  LOGIN_REQUEST,
  TOKEN_REFRESH_REQUEST,
  LOGIN_SUCCESS,
  SHOW_FULL_HEADER
} from 'constants/action.js';
import { loginMls } from 'actions/MlsLoginAction';
import { getCookie, setCookieData } from 'utils/session';


const middleware = [thunk, callAPIMiddleware, jwtMiddleware];
const mockStore = configureStore(middleware);

const cookieValue = jwt.sign({
  exp: Math.floor((Date.now()/1000)+300001),
  data: 'foobar'
}, 'secret');
const data = '{"username":"test","password":"test"}';
const response = {"tokens": {"zap": cookieValue, "refresh": cookieValue}};



const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

describe('JWT Middleware Utils - ', () => {

  beforeEach(function(){
    document.cookie = "zapToken=" + cookieValue + "; domain=; path=/; expires=1434555910537";
  });

  it('refresh token success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, ok: true, data:response, text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, JSON.stringify(response)))).mockResolvedValue(JSON.stringify(response))
    })
    const a = new Promise(()=>{}, ()=>{})
    const expectedActions = [
      {"type": "LOGIN_REQUEST"}, {"data": {"payload": response, "status": 200}, "type": "LOGIN_SUCCESS"}
    ]
    const handleSuccess = jest.fn();
    const store = mockStore({});
    store.dispatch(loginMls(data, handleSuccess));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual('http://authentication.services.aur.test.ziprealty.com/api/jwt/login?withRefresh=true')
      if(store.getActions.length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions.length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: SHOW_FULL_HEADER, isShowFullHeader: true}]);
      }
    });

  });
});
