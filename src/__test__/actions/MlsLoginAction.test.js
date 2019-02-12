import { loginMls, showFullHeader } from 'actions/MlsLoginAction';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CLEAR_SESSION_DATA,
  SHOW_FULL_HEADER
} from 'constants/action';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';
import { setCookieData, setSessionData } from 'utils/session';
import { startSparkSession } from 'actions/MlsCanonicalMappingAction';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);


const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

const data = '{"username":"test","password":"test"}';
const response = '{"tokens":{"zap":"ajghdjhsa89.sadhkjw8we7s.sabhgiujklw788.sbghiujnsa876d","refresh":"ajghdjhsa89.sadhkjw8we7s.sabhgiujklw788.sbghiujnsa876d"}}';

describe('MlsLoginActions', () => {

  it('Login Mls actions success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, ok: true, data:data, text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, response))).mockResolvedValue(response)
    })
    const expectedActions = [
      { type: LOGIN_REQUEST },
      {
        type: LOGIN_SUCCESS,
        data: { payload: JSON.parse(response), status: 200 }
      }
    ]
    const store = mockStore({});
    store.dispatch(loginMls(data));
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

  it('Login Mls actions failure', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 401, ok: false, statusText: "", text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(401, null, ""))).mockResolvedValue({message: "Unauthorized"})
    })
    const expectedActions = [
      { type: LOGIN_REQUEST },
      { type: CLEAR_SESSION_DATA },
      {
        type: LOGIN_FAILURE,
        error: {
          error: {message: "Unauthorized"},
          status: 401,
          statusText: ""
        }
      }
    ]
    const store = mockStore({});
    store.dispatch(loginMls(data));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual([{ type: LOGIN_REQUEST }, { type: CLEAR_SESSION_DATA },]);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual(expectedActions);
      }
    });
  });

  it('Showfullheader URL update', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: SHOW_FULL_HEADER }
    ]

    store.dispatch(showFullHeader(true));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

})
