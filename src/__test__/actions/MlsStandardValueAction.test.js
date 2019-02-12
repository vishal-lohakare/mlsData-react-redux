import {
  getStandardValues,
  getMappedValues,
  getUnmappedValues,
  postMappedValues,
  postUnmappedValues,
  deleteMappedValues,
  deleteUnmappedValues,
  getMlsInfoSource,
  getMlsCananicalFields,
  postStandardValue
} from 'actions/MlsStandardValueAction';

import {
  GET_STANDARD_VALUES_REQUEST,
  GET_STANDARD_VALUES_SUCCESS,
  GET_STANDARD_VALUES_FAILURE,
  GET_MAPPED_VALUES_REQUEST,
  GET_MAPPED_VALUES_SUCCESS,
  GET_MAPPED_VALUES_FAILURE,
  GET_UNMAPPED_VALUES_REQUEST,
  GET_UNMAPPED_VALUES_SUCCESS,
  GET_UNMAPPED_VALUES_FAILURE,
  POST_MAPPED_VALUES_REQUEST,
  POST_MAPPED_VALUES_SUCCESS,
  POST_MAPPED_VALUES_FAILURE,
  POST_UNMAPPED_VALUES_REQUEST,
  POST_UNMAPPED_VALUES_SUCCESS,
  POST_UNMAPPED_VALUES_FAILURE,
  DELETE_MAPPED_VALUES_REQUEST,
  DELETE_MAPPED_VALUES_SUCCESS,
  DELETE_MAPPED_VALUES_FAILURE,
  DELETE_UNMAPPED_VALUES_REQUEST,
  DELETE_UNMAPPED_VALUES_SUCCESS,
  DELETE_UNMAPPED_VALUES_FAILURE,
  GET_MLSINFO_SOURCE_REQUEST,
  GET_MLSINFO_SOURCE_SUCCESS,
  GET_MLSINFO_SOURCE_FAILURE,
  GET_MLS_CANONICAL_FIELDS_REQUEST,
  GET_MLS_CANONICAL_FIELDS_SUCCESS,
  GET_MLS_CANONICAL_FIELDS_FAILURE,
  POST_NEW_STANDARD_VALUE_REQUEST,
  POST_NEW_STANDARD_VALUE_SUCCESS,
  POST_NEW_STANDARD_VALUE_FAILURE
} from 'constants/action';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';
import {
  apiBaseURL
} from 'constants/global';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: "OK",
    headers: {
      'Content-type': 'application/json'
    }
  });
};

let store;
const fieldType = 'ADDRESS';
const mlsName = 'FLEXMLS';
const standardValueId = 1;
const standardValue = '15-20 Years';
const mappedUnmappedData = [{
  value: 'AGE21',
  id: 445,
}];

const data = '{"name":"testname","url":"http://testmls.com?status=active","sourceId":3,"body":"","bodyType":"Json","requestType":"","mlsUrlHeaderDto":[{"headerValue":"Authorization","headerKey":"Token","isSelected":true}]}';

describe('MlsStandardValueActions', () => {
  

  beforeEach(() => {
    store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, ok: true, data:data, text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    });
  })

  it('Get Standard Values success', () => {

    const expectedActions = [
      { type:  GET_STANDARD_VALUES_REQUEST},
      {
        type: GET_STANDARD_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getStandardValues(fieldType));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/standard-value?fieldType=${fieldType}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Standard Values failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} });

    const expectedActions = [
      { type:  GET_STANDARD_VALUES_REQUEST},
      {
        type: GET_STANDARD_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getStandardValues(fieldType));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mapped Values success', () => {

    const expectedActions = [
      { type:  GET_MAPPED_VALUES_REQUEST},
      {
        type: GET_MAPPED_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getMappedValues(standardValueId, mlsName, fieldType));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/standard-value-map?fieldType=${fieldType}&mls=${mlsName}&standardValueId=${standardValueId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mapped Values failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type:  GET_MAPPED_VALUES_REQUEST},
      {
        type: GET_MAPPED_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" },
      }
    ]

    store.dispatch(getMappedValues(standardValueId, mlsName, fieldType));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Get UnMapped Values success', () => {

    const expectedActions = [
      { type:  GET_UNMAPPED_VALUES_REQUEST},
      {
        type: GET_UNMAPPED_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getUnmappedValues(fieldType, mlsName));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/unmapped-value?fieldType=${fieldType}&source=${mlsName}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get UnMapped Values failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type:  GET_UNMAPPED_VALUES_REQUEST},
      {
        type: GET_UNMAPPED_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" },
      }
    ]

    store.dispatch(getUnmappedValues(fieldType, mlsName));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post mapped value action success', () => {
    const expectedActions = [
      { type:  POST_MAPPED_VALUES_REQUEST},
      {
        type: POST_MAPPED_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(postMappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/standard-value-map/bulk`);
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_MAPPED_VALUES_REQUEST}]);
      }
    });
  });

  it('Post mapped value action failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: POST_MAPPED_VALUES_REQUEST },
      {
        type: POST_MAPPED_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(postMappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post unmapped value action success', () => {

    const expectedActions = [
      { type:  POST_UNMAPPED_VALUES_REQUEST},
      {
        type: POST_UNMAPPED_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(postUnmappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/unmapped-value/multiple`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_UNMAPPED_VALUES_REQUEST}]);
      }
    });
  });

  it('Post unmapped value action failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: POST_UNMAPPED_VALUES_REQUEST },
      {
        type: POST_UNMAPPED_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(postUnmappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Delete mapped value action success', () => {

    const expectedActions = [
      { type:  DELETE_MAPPED_VALUES_REQUEST},
      {
        type: DELETE_MAPPED_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(deleteMappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/standard-value-map`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_MAPPED_VALUES_REQUEST}]);
      }
    });
  });

  it('Delete mapped value action success', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: DELETE_MAPPED_VALUES_REQUEST },
      {
        type: DELETE_MAPPED_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(deleteMappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Delete unmapped value action success', () => {

    const expectedActions = [
      { type:  DELETE_UNMAPPED_VALUES_REQUEST},
      {
        type: DELETE_UNMAPPED_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(deleteUnmappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/unmapped-value/multiple`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_UNMAPPED_VALUES_REQUEST}]);
      }
    });
  });

  it('Delete unmapped value action success', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: DELETE_UNMAPPED_VALUES_REQUEST },
      {
        type: DELETE_UNMAPPED_VALUES_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later."
        }, 
        status: "" ,
        statusText: "" }
      }
    ]

    store.dispatch(deleteUnmappedValues(mappedUnmappedData, fieldType, mlsName, standardValueId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mls info source action success', () => {

    const expectedActions = [
      { type:  GET_MLSINFO_SOURCE_REQUEST},
      {
        type: GET_MLSINFO_SOURCE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getMlsInfoSource());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-info/source`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mls info source action failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_MLSINFO_SOURCE_REQUEST },
      {
        type: GET_MLSINFO_SOURCE_FAILURE,
        error: { error: {
          message: "Something went wrong. Please try again later.",
        }, 
        status: "" ,
        statusText: ""}
      }
    ]

    store.dispatch(getMlsInfoSource());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mls Cananical Fields action success', () => {

    const expectedActions = [
      { type:  GET_MLS_CANONICAL_FIELDS_REQUEST},
      {
        type: GET_MLS_CANONICAL_FIELDS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getMlsCananicalFields(true));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields?standardizable=true`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mls Cananical Fields action failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_MLS_CANONICAL_FIELDS_REQUEST },
      {
        type: GET_MLS_CANONICAL_FIELDS_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "" ,
        statusText: ""}
      }
    ]

    store.dispatch(getMlsCananicalFields(true));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post new standard value action success', () => {

    const expectedActions = [
      { type:  POST_NEW_STANDARD_VALUE_REQUEST},
      {
        type: POST_NEW_STANDARD_VALUE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(postStandardValue(standardValue, fieldType));
    store.subscribe(() => {
       expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/standard-value`)

      if(store.getActions().length === 2) {
         expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
         expect(store.getActions()).toEqual([...expectedActions, { type: GET_STANDARD_VALUES_REQUEST }]);
      }
    });

  });

  it('Post new standard value action failure', () => {

    window.fetch = jest
    .fn()
    .mockRejectedValue( {status: 400, error:{} })

    const expectedActions = [
      { type: POST_NEW_STANDARD_VALUE_REQUEST },
      {
        type: POST_NEW_STANDARD_VALUE_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later.",
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(postStandardValue(standardValue, fieldType));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

})
