import {
  addNewEmptyCard,
  saveUrlData,
  saveListingCalibrationUrlData,
  updateUrlData,
  getMlsUrl,
  deleteMlsUrlHeader,
  deleteMlsUrl,
  deleteNewlyAddedCard,
  getMlsUrlPreview,
  getMlsUrlPhotoPreview,
  getMlsUrlPlaceHolderValues
} from 'actions/MlsUrlBuilderAction';

import {
  ADD_NEW_URL_DATA,
  DELETE_NEW_URL_DATA,
  SAVE_MLS_URL_REQUEST,
  SAVE_MLS_URL_SUCCESS,
  SAVE_MLS_URL_FAILURE,
  SAVE_MLS_LISTING_CALIBRATION_URL_REQUEST,
  SAVE_MLS_LISTING_CALIBRATION_URL_SUCCESS,
  SAVE_MLS_LISTING_CALIBRATION_URL_FAILURE,
  UPDATE_MLS_URL_REQUEST,
  UPDATE_MLS_URL_SUCCESS,
  UPDATE_MLS_URL_FAILURE,
  GET_MLS_URL_REQUEST,
  GET_MLS_URL_SUCCESS,
  GET_MLS_URL_FAILURE,
  DELETE_URL_HEADER_REQUEST,
  DELETE_URL_HEADER_SUCCESS,
  DELETE_URL_HEADER_FAILURE,
  DELETE_MLS_URL_REQUEST,
  DELETE_MLS_URL_SUCCESS,
  DELETE_MLS_URL_FAILURE,
  GET_MLS_PREVIEW_RAW_DATA_REQUEST,
  GET_MLS_PREVIEW_RAW_DATA_SUCCESS,
  GET_MLS_PREVIEW_RAW_DATA_FAILURE,
  GET_MLS_PREVIEW_PHOTO_DATA_REQUEST,
  GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS,
  GET_MLS_PREVIEW_PHOTO_DATA_FAILURE,
  GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST,
  GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS,
  GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE
} from 'constants/action';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';
import {
  apiBaseURL
} from 'constants/global';
import { url } from 'inspector';

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

const data = '{"name":"testname","url":"http://testmls.com?status=active","sourceId":3,"body":"","bodyType":"Json","requestType":"","mlsUrlHeaderDto":[{"headerValue":"Authorization","headerKey":"Token","isSelected":true}]}'

const newData = {
  UrlDetails: {
    urlname: "testname",
    urlvalue: "http://testmls.com?status=active",
    bodyTextValue: "",
    bodyType: "Json",
    requestType: "",
    downloadType: "Agent Downloaded File"
  },
  HeaderDetails: [
    {
      headerValue: "Authorization",
      headerKe: "Token",
      isSelected: true,
    }
  ],
}

const previewQuery = { source: "FLEXMLS", urlId: 11, urlvalue: "${Search}?Class=${CLASS_PROPERTY}&Count=1&Format=${FORMAT}&Offset=${OFFSET_NUM}&searchType=${SearchType}", downloadType: "Agent" };

const previewData = '{"Response Code":"0","Response Msg":"Success","Total Results":"2427","delimiter":"09","Columns":"OFFICE_15,OFFICE_14,BROKERSHORT,OFFICE_13,OFFICE_12,OFFICE_11,OFFICE_0,OFFICE_10,OFFICE_1,OFFICE_2,SYSTEM_ACCESS,OFFICE_18,OFFICE_17,IDXOPT,BROKERNAME,TIMESTAMP,OFFICE_3,OFFICE_4,OFFICE_5,OFFICE_6,OFFICE_7,OFFICE_8,OFFICE_9,","Data":[{"OFFICE_15":"03790","OFFICE_14":"43013","BROKERSHORT":"660000076","OFFICE_13":"OH","OFFICE_12":"Croton","OFFICE_11":"","OFFICE_0":"20131118193557774402000000","OFFICE_10":"30 S High St.","OFFICE_1":"660000168","OFFICE_2":"Real Estate & Auction Services, LLC.","SYSTEM_ACCESS":"1","OFFICE_18":"(866) 538-0333","OFFICE_17":"","IDXOPT":"In","BROKERNAME":"C. H. Chip Carpenter","TIMESTAMP":"2018-06-21T02:02:40.477","OFFICE_3":"(866) 538-0333","OFFICE_4":"","OFFICE_5":"","OFFICE_6":"(740) 893-6100","OFFICE_7":null,"OFFICE_8":null,"OFFICE_9":null}]}';

const updateData = {
  UrlDetails: {
    id: 29,
    urlname: "testname",
    urlvalue: "http://testmls.com?status=active",
    bodyTextValue: "",
    bodyType: "Json",
    requestType: "",
    downloadType: "Agent Downloaded File"
  },
  HeaderDetails: [
    {
      headerId: 2,
      headerValue: "Authorization",
      headerKe: "Token",
      isSelected: true,
    }
  ],
}
const sourceId = 3;

const placeHolderValues = '["LAST_AGENT_DOWNLOAD_TS","LAST_OFFICE_DOWNLOAD_TS","LAST_PHOTO_DOWNLOAD_TS","LAST_INCREMENTAL_LISTING_DOWNLOAD_TS","LAST_FULL_LISTING_DOWNLOAD_TS","NOW","TODAY"]';

describe('MlsUrlBuilderActions', () => {

  it('addNewEmptyCard', () => {
    const expectedAction = {
      type: ADD_NEW_URL_DATA,
    }

    expect(addNewEmptyCard()).toEqual(expectedAction);
  })

  it('Build Mls url action save listing calibration new url success', () => {

    const store = mockStore({});
    const urlId = 142;
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200, ok: true, data: data, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: SAVE_MLS_LISTING_CALIBRATION_URL_REQUEST },
      {
        type: SAVE_MLS_LISTING_CALIBRATION_URL_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(saveListingCalibrationUrlData(urlId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-listing-download/price-ranges-calibration/${urlId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Build Mls url action save listing calibration new url failure', () => {

    const store = mockStore({});
    const urlId = 142;
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: SAVE_MLS_LISTING_CALIBRATION_URL_REQUEST },
      {
        type: SAVE_MLS_LISTING_CALIBRATION_URL_FAILURE,
        error: {
          error: {
            message: "Something went wrong. Please try again later."
          },
          status: "",
          statusText: ""
        }
      }
    ]

    store.dispatch(saveListingCalibrationUrlData(urlId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-listing-download/price-ranges-calibration/${urlId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Build Mls url action add new url data success', () => {

    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200, ok: true, data: data, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: SAVE_MLS_URL_REQUEST },
      {
        type: SAVE_MLS_URL_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(saveUrlData(newData, sourceId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-url`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Build Mls url action add new url data failure', () => {

    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: SAVE_MLS_URL_REQUEST },
      {
        type: SAVE_MLS_URL_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]

    store.dispatch(saveUrlData(newData, sourceId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Build Mls url action update url data success', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200, ok: true, data: data, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: UPDATE_MLS_URL_REQUEST },
      {
        type: UPDATE_MLS_URL_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(updateUrlData(updateData, sourceId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-url`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Build Mls url action update url data failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: UPDATE_MLS_URL_REQUEST },
      {
        type: UPDATE_MLS_URL_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]

    store.dispatch(updateUrlData(newData, sourceId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Build Mls url action get url data success', () => {
    const store = mockStore({});
    const source = '3';
    window.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200, ok: true, data: data, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: GET_MLS_URL_REQUEST },
      {
        type: GET_MLS_URL_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getMlsUrl(source));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-url/${source}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Build Mls url action get url data failure', () => {
    const store = mockStore({});
    const source = '3';
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: GET_MLS_URL_REQUEST },
      {
        type: GET_MLS_URL_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]

    store.dispatch(getMlsUrl(source));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Build Mls url action delete header success', () => {
    const store = mockStore({});
    const headerId = 2;
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200, ok: true, data: data, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: DELETE_URL_HEADER_REQUEST },
      {
        type: DELETE_URL_HEADER_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(deleteMlsUrlHeader(headerId, sourceId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-url/header/${headerId}`)

      if (store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if (store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_MLS_URL_REQUEST }]);
      }
    });
  });

  it('Build Mls url action delete header failure', () => {
    const store = mockStore({});
    const headerId = 2;
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: DELETE_URL_HEADER_REQUEST },
      {
        type: DELETE_URL_HEADER_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]
    store.dispatch(deleteMlsUrlHeader(headerId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('deleteNewlyAddedCard', () => {
    const expectedAction = {
      type: DELETE_NEW_URL_DATA,
    }

    expect(deleteNewlyAddedCard()).toEqual(expectedAction);
  })

  it('Build Mls url action delete URL success', () => {
    const store = mockStore({});
    const urlId = 2;
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200, ok: true, data: data, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: DELETE_MLS_URL_REQUEST },
      {
        type: DELETE_MLS_URL_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(deleteMlsUrl(urlId, sourceId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-url/${urlId}`)
      if (store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if (store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_MLS_URL_REQUEST }]);
      }
    });
  });

  it('Build Mls url action delete URL failure', () => {

    const store = mockStore({});
    const urlId = 2;
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: DELETE_MLS_URL_REQUEST },
      {
        type: DELETE_MLS_URL_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]

    store.dispatch(deleteMlsUrl(urlId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });


  it('Mls url action get preview raw data success', () => {
    const { source, urlId, urlvalue, downloadType } = previewQuery;
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200, ok: true, data: previewData, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, previewData))).mockResolvedValue(previewData)
      })

    const expectedActions = [
      { type: GET_MLS_PREVIEW_RAW_DATA_REQUEST },
      {
        type: GET_MLS_PREVIEW_RAW_DATA_SUCCESS,
        data: { payload: JSON.parse(previewData), status: 200 },
      }
    ]

    store.dispatch(getMlsUrlPreview(previewQuery));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/preview/rawData?source=${source}&urlId=${urlId}&url=${encodeURIComponent(urlvalue)}&downloadType=${downloadType}`);
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Mls url action get preview raw data failure', () => {

    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: GET_MLS_PREVIEW_RAW_DATA_REQUEST },
      {
        type: GET_MLS_PREVIEW_RAW_DATA_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]

    store.dispatch(getMlsUrlPreview(previewQuery));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Mls url action get preview photo data success', () => {
    const { urlId } = previewQuery;
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200, ok: true, data: previewData, text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, previewData))).mockResolvedValue(previewData)
      })

    const expectedActions = [
      { type: GET_MLS_PREVIEW_PHOTO_DATA_REQUEST },
      {
        type: GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS,
        data: { payload: JSON.parse(previewData), status: 200 },
      }
    ]

    store.dispatch(getMlsUrlPhotoPreview(previewQuery));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-photo-download/${urlId}`);
      expect(store.getActions()).toEqual(expectedActions);
    });

  });


  it('Mls url action get preview photo data failure', () => {

    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: GET_MLS_PREVIEW_PHOTO_DATA_REQUEST },
      {
        type: GET_MLS_PREVIEW_PHOTO_DATA_FAILURE,
        error: {
          error: {
            message: 'Something went wrong. Please try again later.'
          },
          status: '',
          statusText: ''
        }
      }
    ]

    store.dispatch(getMlsUrlPhotoPreview(previewQuery));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

});

it('Mls url action get place holder data success', () => {
  const store = mockStore({});
  window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200, ok: true, data: placeHolderValues, text: jest.fn().mockImplementation(() =>
        Promise.resolve(mockResponse(200, null, placeHolderValues))).mockResolvedValue(placeHolderValues)
    })

  const expectedActions = [
    { type: GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST },
    {
      type: GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS,
      data: { payload: JSON.parse(placeHolderValues), status: 200 },
    }
  ]

  store.dispatch(getMlsUrlPlaceHolderValues());
  store.subscribe(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });

});

it('Mls url action get place holder data failure', () => {

  const store = mockStore({});
  window.fetch = jest
    .fn()
    .mockRejectedValueOnce({ status: 400, error: {} })

  const expectedActions = [
    { type: GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST },
    {
      type: GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE,
      error: {
        error: {
          message: 'Something went wrong. Please try again later.'
        },
        status: '',
        statusText: ''
      }
    }
  ]

  store.dispatch(getMlsUrlPlaceHolderValues());
  store.subscribe(() => {
    expect(store.getActions()).toEqual(expectedActions);
  });

});
