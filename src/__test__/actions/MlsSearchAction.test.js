import {
  getListOfMls,
  updateMLS,
  PlayMlsAgentDownload,
  PlayMlsListingDownload,
  PlayMlsOfficeDownload,
  PlayMlsOpenHouseDownload,
  PlayMlsPhotoDownload
} from 'actions/MlsSearchAction';
import {
  GET_MLS_DETAILS_REQUEST,
  GET_MLS_DETAILS_SUCCESS,
  GET_MLS_DETAILS_FAILURE,
  UPDATE_MLS_STATE_REQUEST,
  UPDATE_MLS_STATE_SUCCESS,
  UPDATE_MLS_STATE_FAILURE,
  POST_MLS_PLAY_AGENT_REQUEST,
  POST_MLS_PLAY_AGENT_SUCCESS,
  POST_MLS_PLAY_AGENT_FAILURE,
  POST_MLS_PLAY_LISTING_REQUEST,
  POST_MLS_PLAY_LISTING_SUCCESS,
  POST_MLS_PLAY_LISTING_FAILURE,
  POST_MLS_PLAY_OFFICE_REQUEST,
  POST_MLS_PLAY_OFFICE_SUCCESS,
  POST_MLS_PLAY_OFFICE_FAILURE,
  POST_MLS_PLAY_OPEN_HOUSE_REQUEST,
  POST_MLS_PLAY_OPEN_HOUSE_SUCCESS,
  POST_MLS_PLAY_OPEN_HOUSE_FAILURE,
  POST_MLS_PLAY_PHOTO_REQUEST,
  POST_MLS_PLAY_PHOTO_SUCCESS,
  POST_MLS_PLAY_PHOTO_FAILURE,
  SET_PLAY_ON_DEMAND_SOURCE
} from 'constants/action';
import { apiBaseURL } from 'constants/global';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);

describe('Mls Search Actions', () => {
  it('Get Mls list Success', () => {
    const data = ['{"mlsName":"SAM","currentStatus":"Active","lastExecution":null,"lastExecutionStatus":null,"avgTime":0,"avgDownloadRecords":1000,"noOfDownloads":10,"noOfDownloadsInDay":5}'];
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
      { type: GET_MLS_DETAILS_REQUEST },
      {
        type: GET_MLS_DETAILS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getListOfMls());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-view`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Mls list failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: GET_MLS_DETAILS_REQUEST },
      {
        type: GET_MLS_DETAILS_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getListOfMls());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('update Mls list Success', () => {
    const data = ['{"mlsName":"SAM","currentStatus":"Active","lastExecution":null,"lastExecutionStatus":null,"avgTime":0,"avgDownloadRecords":1000,"noOfDownloads":10,"noOfDownloadsInDay":5}'];
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
      { type: UPDATE_MLS_STATE_REQUEST },
      {
        type: UPDATE_MLS_STATE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    const source = "FLEXMLS";
    const isActive = true;
    store.dispatch(updateMLS(source, isActive));
    store.subscribe(() => {
      if (store.getActions().length === 2) {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-info/change-mls-state?source=${source}&isActive=${isActive}`)
        expect(store.getActions()).toEqual(expectedActions);
      }
      if (store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_MLS_DETAILS_REQUEST }]);
      }
    });
  });

  it('update Mls list failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: UPDATE_MLS_STATE_REQUEST },
      {
        type: UPDATE_MLS_STATE_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    const source = "FLEXMLS";
    const isActive = true;
    store.dispatch(updateMLS(source, isActive));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post agent download success', () => {
    const data = ['{}'];
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200,
        data: data,
        ok: true,
        text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: POST_MLS_PLAY_AGENT_REQUEST },
      {
        type: POST_MLS_PLAY_AGENT_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const urlId = 106;
    store.dispatch(PlayMlsAgentDownload(urlId, 2));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-agent-download/request/${urlId}`)
      if(store.getActions.length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions.length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {
          type: SET_PLAY_ON_DEMAND_SOURCE,
          downloadType: 'agent',
          mlsId: 2
        }]);
      }
    });
  });

  it('Post agent download failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: POST_MLS_PLAY_AGENT_REQUEST },
      {
        type: POST_MLS_PLAY_AGENT_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const urlId = 106;
    store.dispatch(PlayMlsAgentDownload(urlId, 2));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post Listing download success', () => {
    const data = ['{}'];
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200,
        data: data,
        ok: true,
        text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: POST_MLS_PLAY_LISTING_REQUEST },
      {
        type: POST_MLS_PLAY_LISTING_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const urlId = 150;
    store.dispatch(PlayMlsListingDownload(urlId, 2));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-listing-download/request/${urlId}`)
      if(store.getActions.length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions.length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {
          type: SET_PLAY_ON_DEMAND_SOURCE,
          downloadType: 'listing',
          mlsId: 2
        }]);
      }
    });
  });

  it('Post listing download failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: POST_MLS_PLAY_LISTING_REQUEST },
      {
        type: POST_MLS_PLAY_LISTING_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const urlId = 150;
    store.dispatch(PlayMlsListingDownload(urlId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post Office download success', () => {
    const data = ['{}'];
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200,
        data: data,
        ok: true,
        text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: POST_MLS_PLAY_OFFICE_REQUEST },
      {
        type: POST_MLS_PLAY_OFFICE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const urlId = 150;
    store.dispatch(PlayMlsOfficeDownload(urlId, 2));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-office-download/request/${urlId}`)
      if(store.getActions.length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions.length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {
          type: SET_PLAY_ON_DEMAND_SOURCE,
          downloadType: 'office',
          mlsId: 2
        }]);
      }
    });
  });

  it('Post office download failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: POST_MLS_PLAY_OFFICE_REQUEST },
      {
        type: POST_MLS_PLAY_OFFICE_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const urlId = 150;
    store.dispatch(PlayMlsOfficeDownload(urlId, 2));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post Open House download success', () => {
    const data = ['{}'];
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200,
        data: data,
        ok: true,
        text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: POST_MLS_PLAY_OPEN_HOUSE_REQUEST },
      {
        type: POST_MLS_PLAY_OPEN_HOUSE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const urlId = 131;
    const startDate = "2019-01-10";
    const endDate = "2019-01-10";
    store.dispatch(PlayMlsOpenHouseDownload(urlId, startDate, endDate, 2));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-open-house-download/request/${urlId}?startDate=${startDate}&endDate=${endDate}`)
      if(store.getActions.length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions.length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {
          type: SET_PLAY_ON_DEMAND_SOURCE,
          downloadType: 'openhouse',
          mlsId: 2
        }]);
      }
    });
  });

  it('Post open house download failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: POST_MLS_PLAY_OPEN_HOUSE_REQUEST },
      {
        type: POST_MLS_PLAY_OPEN_HOUSE_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const urlId = 132;
    const startDate = "2019-01-10";
    const endDate = "2019-01-10";
    store.dispatch(PlayMlsOpenHouseDownload(urlId, startDate, endDate, 2));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Post photo download success', () => {
    const data = ['{}'];
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockResolvedValue({
        status: 200,
        data: data,
        ok: true,
        text: jest.fn().mockImplementation(() =>
          Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

    const expectedActions = [
      { type: POST_MLS_PLAY_PHOTO_REQUEST },
      {
        type: POST_MLS_PLAY_PHOTO_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const urlId = 131;
    store.dispatch(PlayMlsPhotoDownload(urlId, 2));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-photo-download/request/${urlId}`)
      if(store.getActions.length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions.length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, {
          type: SET_PLAY_ON_DEMAND_SOURCE,
          downloadType: 'photo',
          mlsId: 2
        }]);
      }
    });
  });

  it('Post photo download failure', () => {
    const store = mockStore({});
    window.fetch = jest
      .fn()
      .mockRejectedValueOnce({ status: 400, error: {} })

    const expectedActions = [
      { type: POST_MLS_PLAY_PHOTO_REQUEST },
      {
        type: POST_MLS_PLAY_PHOTO_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const urlId = 131;
    store.dispatch(PlayMlsPhotoDownload(urlId, 2));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
