import { API } from 'utils/API';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);

export const dummyActionPost = () => {
  return(dispatch) => {
    dispatch({
      types: ['DUMMY_REQUEST', 'DUMMY_SUCCESS', 'DUMMY_FAILURE'],
      callAPI: () => new API().post('/dummyurl', true),
      handleSuccess: () => {},
      handleFail: () => {},
    });
  }
}

export const dummyActionDelete = () => {
  return(dispatch) => {
    dispatch({
      types: ['DUMMY_REQUEST', 'DUMMY_SUCCESS', 'DUMMY_FAILURE'],
      callAPI: () => new API().delete('/dummyurl', true),
      handleSuccess: () => {},
      handleFail: () => {},
    });
  }
}

export const dummyActionPut = () => {
  return(dispatch) => {
    dispatch({
      types: ['DUMMY_REQUEST', 'DUMMY_SUCCESS', 'DUMMY_FAILURE'],
      callAPI: () => new API().put('/dummyurl', true),
      handleSuccess: () => {},
      handleFail: () => {},
    });
  }
}

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: "",
    statusText: "",
    headers: {
      'Content-type': 'application/json'
    }
  });
};


describe('Network Middleware Utils', () => {

  it('Dummy Action server error', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({status: 400, error: {error: {message: "Something went wrong. Please try again later."}}});
    const expectedActions = [
      { type: 'DUMMY_REQUEST' },
      {
        type: 'DUMMY_FAILURE',
        error: {
          error: {
            message: "Something went wrong. Please try again later."
          },
          status: "",
          statusText: ""
        },
      }
    ]
    const store = mockStore({});
    store.dispatch(dummyActionPost());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Dummy Action server error, server not reachable', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({status: 400, error: {error: {message: "Something went wrong. Please try again later."}}});
    const expectedActions = [
      { type: 'DUMMY_REQUEST' },
      {
        type: 'DUMMY_FAILURE',
        error: {
          error: {
            message: "Something went wrong. Please try again later."
          },
          status: "",
          statusText: ""
        },
      }
    ]
    const store = mockStore({});
    store.dispatch(dummyActionPost());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });


  it('Dummy Action server error 401 Auth', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({status: 400, error: {error: {message: "Something went wrong. Please try again later."}}});
    const expectedActions = [
      { type: 'DUMMY_REQUEST' },
      {type: 'DUMMY_FAILURE',
      error: {
        error: {
          message: "Something went wrong. Please try again later."
        },
        status: "",
        statusText: ""
      }}
    ]
    const store = mockStore({});
    store.dispatch(dummyActionPost());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });


  it('Dummy action delete preauth success with 204', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({status: 204, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, {message: "Success"}))).mockResolvedValue()
    })
    const expectedActions = [
      { type: 'DUMMY_REQUEST' },
      {
        type: 'DUMMY_SUCCESS',
        data: { payload: [], status: 204 }
      }
    ]
    const store = mockStore({});
    store.dispatch(dummyActionDelete());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Dummy action put preauth success with 204', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({status: 204, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(204, {message: "Success with no content"}))).mockResolvedValue()
    })
    const expectedActions = [
      { type: 'DUMMY_REQUEST' },
      {
        type: 'DUMMY_SUCCESS',
        data: { payload: [], status: 204 }
      }
    ]
    const store = mockStore({});
    store.dispatch(dummyActionPut());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });


});
