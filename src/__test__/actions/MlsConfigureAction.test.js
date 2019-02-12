import {
  searchMLSExist,
  postMLSInfo,
  downloadMetadata,
  downloadUpdatedMetadata,
  clearConfigResult,
  getMetaDataDownloadPreview,
  getMetaDataLookupDownloadPreview,
  getPreviewColumnUniqueData
} from 'actions/MlsConfigureAction';
import {
  SEARCH_MLS_REQUEST,
  SEARCH_MLS_SUCCESS,
  SEARCH_MLS_FAILURE,
  POST_MLS_DATA_REQUEST,
  POST_MLS_DATA_SUCCESS,
  POST_MLS_DATA_FAILURE,
  GET_MLS_DOWNLOAD_FILES_REQUEST,
  GET_MLS_DOWNLOAD_FILES_SUCCESS,
  GET_MLS_DOWNLOAD_FILES_FAILURE,
  GET_MLS_DOWNLOAD_UPDATED_FILES_REQUEST,
  GET_MLS_DOWNLOAD_UPDATED_FILES_SUCCESS,
  GET_MLS_DOWNLOAD_UPDATED_FILES_FAILURE,
  GET_METADATA_DOWNLOAD_PREVIEW_REQUEST,
  GET_METADATA_DOWNLOAD_PREVIEW_SUCCESS,
  GET_METADATA_DOWNLOAD_PREVIEW_FAILURE,
  GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_REQUEST,
  GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_SUCCESS,
  GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_FAILURE,
  GET_PREVIEW_COL_UNIQUE_VALUES_REQUEST,
  GET_PREVIEW_COL_UNIQUE_VALUES_SUCCESS,
  GET_PREVIEW_COL_UNIQUE_VALUES_FAILURE,
  CLEAR_MLS_CONFIG_DATA,
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

const data = ['{"id":212,"source":"FLEXMLS","loginId":"FLEXMLS1ghjj6","password":"FLEXMLS1","previousPassword":null,"loginUrl":"FLEXMLS1hhh23432346","userAgentId":"","userAgentPassword":"","retsVersion":"","multiLogin":false,"comments":null,"isActive":false,"lastUpdateTs":"2018-10-03T18:30:00.000Z","createTs":null}']
const mockinput = {"id":212,"source":"FLEXMLS","loginId":"FLEXMLS1ghjj6","password":"FLEXMLS1","previousPassword":null,"loginUrl":"FLEXMLS1hhh23432346"};

describe('MlsConfigActions', () => {

  it('Search Mls actions Success', () => {
    const text = 'FLEXMLS'
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: SEARCH_MLS_REQUEST },
      {
        type: SEARCH_MLS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(searchMLSExist(text));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-info/FLEXMLS?onlyExactMatch=true`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Search Mls actions Failure', () => {
    const text = 'FLEXMLS'
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: SEARCH_MLS_REQUEST },
      {
        type: SEARCH_MLS_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later.",
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(searchMLSExist(text));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('download metadata actions success', () => {
    const text = 'FLEXMLS'
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: GET_MLS_DOWNLOAD_FILES_REQUEST },
      {
        type: GET_MLS_DOWNLOAD_FILES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(downloadMetadata(text));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-metadata/files/FLEXMLS`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('download metadata actions failure', () => {
    const text = 'FLEXMLS'
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_MLS_DOWNLOAD_FILES_REQUEST },
      {
        type: GET_MLS_DOWNLOAD_FILES_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later.",
        }, 
        status: "",
        statusText: ""
       }
      }
    ]

    store.dispatch(downloadMetadata(text));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('download updated metadata actions success', () => {
    const text = 'FLEXMLS'
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      ok: true,
      data:data,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_MLS_DOWNLOAD_UPDATED_FILES_REQUEST },
      {
        type: GET_MLS_DOWNLOAD_UPDATED_FILES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(downloadUpdatedMetadata(text));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_MLS_DOWNLOAD_FILES_REQUEST }]);
      }

    });
  });

  it('download updated metadata actions failure', () => {
    const text = 'FLEXMLS'
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_MLS_DOWNLOAD_UPDATED_FILES_REQUEST },
      {
        type: GET_MLS_DOWNLOAD_UPDATED_FILES_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later.",
        },
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(downloadUpdatedMetadata(text));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_MLS_DOWNLOAD_FILES_REQUEST }]);
      }
    });

  });

  it('Post Mls actions success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, ok: true, data:data, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: POST_MLS_DATA_REQUEST },
      {
        type: POST_MLS_DATA_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(postMLSInfo(mockinput));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-info`)
      expect(store.getActions()).toEqual(expectedActions);
    })
  })

  it('Post Mls actions failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce({status: 400, error:{}
    })

    const expectedActions = [
      { type: POST_MLS_DATA_REQUEST },
      {
        type: POST_MLS_DATA_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(postMLSInfo(mockinput));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-info`)
      expect(store.getActions()).toEqual(expectedActions);
    })
  })

  it('Clear configure MLS data', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: CLEAR_MLS_CONFIG_DATA }
    ]

    store.dispatch(clearConfigResult());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Get Metadata Download Preview Success', () => {
    const data = ['{"id":"ty2H5IJw3xjZyMbs15L8","resource":"Office","resourceStandardName":"Office","className":"Office","classStandardName":"Office","classDescription":"Office","tableSystemName":"OFFICE_12","standardName":"null","shortName":"City","longName":"City","lookupName":"null","totalCount":0}'];
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
      { type: GET_METADATA_DOWNLOAD_PREVIEW_REQUEST },
      {
        type: GET_METADATA_DOWNLOAD_PREVIEW_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getMetaDataDownloadPreview('FLEXMLS', 0, 50, data));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/FLEXMLS/metadata?pageOffset=0&pageSize=49`);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Metadata Download Preview Failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_METADATA_DOWNLOAD_PREVIEW_REQUEST },
      {
        type: GET_METADATA_DOWNLOAD_PREVIEW_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getMetaDataDownloadPreview());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Metadata Lookup Download Preview Success', () => {
    const data = ['{"id":"YQ3ShN08gnqqqowUssI6","resource":"Property","resourceStandardName":"Property","lookupName":"GFLU20131104144438110429000000","lookupVisibleName":"Cmplex/Sub Amenities","lookupValue":"15BTY5NH2VX1","lookupShortValue":"Tennis Court","lookupLongValue":"Tennis Court","totalCount":0}'];
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
      { type: GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_REQUEST },
      {
        type: GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getMetaDataLookupDownloadPreview('FLEXMLS', 0, 50, data));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/FLEXMLS/metadata-lookup?pageOffset=0&pageSize=49`);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Metadata Lookup Download Preview Failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_REQUEST },
      {
        type: GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getMetaDataLookupDownloadPreview());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Preview Column Unique Data Success', () => {
    const data = ['["property","activeagent","agent","office","openhouse"]'];
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_PREVIEW_COL_UNIQUE_VALUES_REQUEST },
      {
        type: GET_PREVIEW_COL_UNIQUE_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getPreviewColumnUniqueData('FLEXMLS', 'resource', true, data));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/FLEXMLS/columns/resource?isMetadata=true`);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Preview Column Unique Data Failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_PREVIEW_COL_UNIQUE_VALUES_REQUEST },
      {
        type: GET_PREVIEW_COL_UNIQUE_VALUES_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getPreviewColumnUniqueData('FLEXMLS', 'resource', true));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
})
