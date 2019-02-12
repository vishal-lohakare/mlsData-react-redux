import {
  getCanonicalFields,
  getSampleData,
  getMappedFields,
  postMappedFields,
  updateMappedFields,
  getAvailableFunctions,
  getAutoCompleteFunctions,
  postUuid,
  postTransformationPreview,
  getDownloadTypeList,
  startSparkSession,
  deleteMapping
} from 'actions/MlsCanonicalMappingAction';

import {
  GET_CANONICAL_FIELDS_REQUEST,
  GET_CANONICAL_FIELDS_SUCCESS,
  GET_CANONICAL_FIELDS_FAILURE,
  GET_RAWFIELD_SAMPLE_DATA_REQUEST,
  GET_RAWFIELD_SAMPLE_DATA_SUCCESS,
  GET_RAWFIELD_SAMPLE_DATA_FAILURE,
  GET_MAPPED_FIELDS_REQUEST,
  GET_MAPPED_FIELDS_SUCCESS,
  GET_MAPPED_FIELDS_FAILURE,
  UPDATE_MAPPED_FIELDS_REQUEST,
  UPDATE_MAPPED_FIELDS_SUCCESS,
  UPDATE_MAPPED_FIELDS_FAILURE,
  GET_AVAILABLE_FUNCTIONS_REQUEST,
  GET_AVAILABLE_FUNCTIONS_SUCCESS,
  GET_AVAILABLE_FUNCTIONS_FAILURE,
  GET_AUTOCOMPLETE_FUNCTIONS_REQUEST,
  GET_AUTOCOMPLETE_FUNCTIONS_SUCCESS,
  GET_AUTOCOMPLETE_FUNCTIONS_FAILURE,
  POST_TRANSFORMATION_PREVIEW_REQUEST,
  POST_TRANSFORMATION_PREVIEW_SUCCESS,
  POST_TRANSFORMATION_PREVIEW_FAILURE,
  POST_UUID_REQUEST,
  POST_UUID_SUCCESS,
  POST_UUID_FAILURE,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE,
  GET_START_SPARK_REQUEST,
  GET_START_SPARK_SUCCESS,
  GET_START_SPARK_FAILURE,
  DELETE_CANONICAL_MAPPING_REQUEST,
  DELETE_CANONICAL_MAPPING_SUCCESS,
  DELETE_CANONICAL_MAPPING_FAILURE,
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


const data = '[{"id":213,"name":"MLS_LONGITUDE","type":"REPORT","dataType":"MEDIUMTEXT","dataLength":0,"notes":null,"lastUpdateTs":"2018-10-15T18:30:00.000Z","createTs":null},{"id":214,"name":"ONE_QUARTER_BATHS","type":"REPORT","dataType":"MEDIUMTEXT","dataLength":0,"notes":null,"lastUpdateTs":"2018-10-15T18:30:00.000Z","createTs":null},{"id":215,"name":"THREE_QUARTER_BATHS","type":"REPORT","dataType":"MEDIUMTEXT","dataLength":0,"notes":null,"lastUpdateTs":"2018-10-15T18:30:00.000Z","createTs":null}]';

const preivewData = '[{"uuid":"0d0bcdc8-48e6-4b09-acff-fd893514f9c3","dataFrame":[{"MLSListDate":"2018-11-13","Sewer":"Public Sewer","ListAgentMlsId":"3217406"}]}]';

const downloadedTypesList = '["Listing Downloaded File","Agent Downloaded File"]';

const source = 'FLEXMLS';
const mlsId = 2;
const mappingId = 1500;
const downloadType = 'Listing';
const selectedField = 'AGE';

describe('Canonical Mapping Actions', () => {

  it('Get canonical Mapping List success', () => {

    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_CANONICAL_FIELDS_REQUEST },
      {
        type: GET_CANONICAL_FIELDS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getCanonicalFields('Listing', 2));
    store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields?downloadType=Listing&mlsId=2`)
        expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Get canonical Mapping List Failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_CANONICAL_FIELDS_REQUEST },
      {
        type: GET_CANONICAL_FIELDS_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getCanonicalFields('Listing', 2));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });
});

describe('Raw Field sample data GET API', () => {
  it('Get raw field sample data success', () => {

    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_RAWFIELD_SAMPLE_DATA_REQUEST },
      {
        type: GET_RAWFIELD_SAMPLE_DATA_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getSampleData('FLEXMLS','Agent','OFFICE_15'));
    store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/sample-data/FLEXMLS/Agent/OFFICE_15`)
        expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Get raw field sample data failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_RAWFIELD_SAMPLE_DATA_REQUEST },
      {
        type: GET_RAWFIELD_SAMPLE_DATA_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getSampleData('FLEXMLS','Agent','OFFICE_15'));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

});

describe('Mapped fields GET API', () => {
  it('Get mapped fields success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_MAPPED_FIELDS_REQUEST },
      {
        type: GET_MAPPED_FIELDS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getMappedFields(source, selectedField, downloadType));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields/FLEXMLS/mappings/AGE?downloadType=Listing`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get mapped fields failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_MAPPED_FIELDS_REQUEST },
      {
        type: GET_MAPPED_FIELDS_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getMappedFields(source, selectedField, downloadType));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Mapped fields POST API', () => {
  it('post mapped fields success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const updateData = {
        id :213,
        name : "MLS_LONGITUDE",
        type: "REPORT",
        dataType: "MEDIUMTEXT",
        dataLength: 0,
        notes: null,
        lastUpdateTs: "2018-10-15T18:30:00.000Z",
        createTs: null
      }

    const expectedActions = [
      { type: UPDATE_MAPPED_FIELDS_REQUEST },
      {
        type: UPDATE_MAPPED_FIELDS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(postMappedFields(source, selectedField, updateData, downloadType, mlsId));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields/FLEXMLS/mappings/AGE`)
        expect(store.getActions()).toEqual(expectedActions);
      }

      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_CANONICAL_FIELDS_REQUEST}]);
      }
      
    });
  });
});

describe('Mapped fields PUT API', () => {
  it('update mapped fields success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const updateData = {
      name : "MLS_LONGITUDE"
    }

    const expectedActions = [
      { type: UPDATE_MAPPED_FIELDS_REQUEST },
      {
        type: UPDATE_MAPPED_FIELDS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(updateMappedFields(source, selectedField, updateData, downloadType, mlsId));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields/FLEXMLS/mappings/AGE`)
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_CANONICAL_FIELDS_REQUEST}]);
      }

    });
  });

  it('update mapped fields failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const updateData = {
      name : "MLS_LONGITUDE"
    }

    const expectedActions = [
      { type: UPDATE_MAPPED_FIELDS_REQUEST },
      {
        type: UPDATE_MAPPED_FIELDS_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(updateMappedFields(source, selectedField, updateData, downloadType, mlsId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Mapped fields available functions', () => {
  it('get available functions success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_AVAILABLE_FUNCTIONS_REQUEST },
      {
        type: GET_AVAILABLE_FUNCTIONS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getAvailableFunctions(source));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields/FLEXMLS/mappings/functions`)
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_AVAILABLE_FUNCTIONS_REQUEST}]);
      }
    });
  });

  it('get available functions failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_AVAILABLE_FUNCTIONS_REQUEST },
      {
        type: GET_AVAILABLE_FUNCTIONS_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getAvailableFunctions(source));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});



describe('Autocomplete function', () => {
  it('get Autocomplete function success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_AUTOCOMPLETE_FUNCTIONS_REQUEST },
      {
        type: GET_AUTOCOMPLETE_FUNCTIONS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getAutoCompleteFunctions());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields/transformations`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('get Autocomplete function failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_AUTOCOMPLETE_FUNCTIONS_REQUEST },
      {
        type: GET_AUTOCOMPLETE_FUNCTIONS_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getAutoCompleteFunctions());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('UUID POST API', () => {
  it('post UUID success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: POST_UUID_REQUEST },
      {
        type: POST_UUID_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const source = 'FLEXMLS';
    const downloadType = 'Listing';

    store.dispatch(postUuid(source, downloadType));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/temporal-data-frame`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('post UUID failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: POST_UUID_REQUEST },
      {
        type: POST_UUID_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(postUuid(source, downloadType));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Transformation Preivew POST API', () => {
  it('post Transformation Preivew success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:preivewData,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, preivewData))).mockResolvedValue(preivewData),

    })

    const expectedActions = [
      { type: POST_TRANSFORMATION_PREVIEW_REQUEST },
      {
        type: POST_TRANSFORMATION_PREVIEW_SUCCESS,
        data: { payload: JSON.parse(preivewData), status: 200 },
      },
    ]
    const uuid = '0d0bcdc8-48e6-4b09-acff-fd893514f9c3', columnName = 'ADDRESS', expression = 'concat(ListAgentKey,ListAgentMlsId,ListAgentLastName)';


    store.dispatch(postTransformationPreview(uuid , expression, columnName));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/temporal-data-frame/${uuid}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('post Transformation Preivew failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: POST_TRANSFORMATION_PREVIEW_REQUEST },
      {
        type: POST_TRANSFORMATION_PREVIEW_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    const uuid = '0d0bcdc8-48e6-4b09-acff-fd893514f9c3', columnName = 'ADDRESS', expression = 'concat(ListAgentKey,ListAgentMlsId,ListAgentLastName)';

    store.dispatch(postTransformationPreview(uuid , expression, columnName));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});


describe('Download type list', () => {
  it('get Download type list success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, downloadedTypesList))).mockResolvedValue(downloadedTypesList),

    })

    const expectedActions = [
      { type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST },
      {
        type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
        data: { payload: JSON.parse(downloadedTypesList), status: 200 },
      },
    ]
    store.dispatch(getDownloadTypeList());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/download/common-type`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('get Download type list failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST },
      {
        type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getDownloadTypeList());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Spark Session', () => {
  it('get start spark session success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      ok: true,
      text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, "{}"))).mockResolvedValue("{}"),
    });

    const expectedActions = [
      { type: GET_START_SPARK_REQUEST },
      {
        type: GET_START_SPARK_SUCCESS,
        data: { payload: JSON.parse("{}"), status: 200 },
      }
    ]
    store.dispatch(startSparkSession());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/temporal-data-frame`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('get start spark session failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: GET_START_SPARK_REQUEST },
      {
        type: GET_START_SPARK_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(startSparkSession());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('Delete Mapping', () => {
  it('Delete mapping success', () => {

    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 204,
      data:[],
      ok: true,
      text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(204, null, "[]"))).mockResolvedValue("[]"),
    })

    const expectedActions = [
      { type: DELETE_CANONICAL_MAPPING_REQUEST },
      {
        type: DELETE_CANONICAL_MAPPING_SUCCESS,
        data: { payload: [], status: 204 },
      },

    ]

    store.dispatch(deleteMapping(mappingId,downloadType, mlsId, source, selectedField));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-canonical-fields/${source}/mappings/${mappingId}`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {type: GET_CANONICAL_FIELDS_REQUEST}]);
      }

    });

  });

  it('Delete mapping failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

    const expectedActions = [
      { type: DELETE_CANONICAL_MAPPING_REQUEST },
      {
        type: DELETE_CANONICAL_MAPPING_FAILURE,
        error: {
          "error": {"message": "Something went wrong. Please try again later."},
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(deleteMapping(mappingId,downloadType, mlsId, source, selectedField));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

});
