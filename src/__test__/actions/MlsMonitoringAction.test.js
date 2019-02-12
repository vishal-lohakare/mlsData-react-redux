import { GetMonitoringData,
  pauseJob,
  resumeJob,
  stopJob,
  clearJobPlayOnDemand,
  filterJobPlayOnDemand } from 'actions/MlsMonitoringAction.js';
import {
  POST_MLS_VIEW_MONITOR_REQUEST,
  POST_MLS_VIEW_MONITOR_SUCCESS,
  POST_MLS_VIEW_MONITOR_FAILURE,
  GET_PAUSE_JOB_REQUEST,
  GET_PAUSE_JOB_SUCCESS,
  GET_PAUSE_JOB_FAILURE,
  GET_RESUME_JOB_REQUEST,
  GET_RESUME_JOB_SUCCESS,
  GET_RESUME_JOB_FAILURE,
  GET_STOP_JOB_REQUEST,
  GET_STOP_JOB_SUCCESS,
  GET_STOP_JOB_FAILURE,
  SET_PLAY_ON_DEMAND_SOURCE
} from 'constants/action';
import { apiBaseURL } from 'constants/global';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);

describe('Mls Monitoring Actions', () => {
  it('Get Monitoring list Success', () => {
    const data = ['{"downloadId":79,"mlsId":2,"source":"FLEXMLS","resourceType":"Listing","resourceId":null,"urlId":"433","status":"Paused","mlsEventStageDtoList":[{"eventStageName":"Download Request","startDate":1543502422655,"endDate":1543502422655,"status":"In Progress"},{"eventStageName":"Download Raw Data","startDate":1543502580314,"endDate":1543502843222,"status":"Paused"}]}'];
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: POST_MLS_VIEW_MONITOR_REQUEST },
      {
        type: POST_MLS_VIEW_MONITOR_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const postData = {"DATE_RANGE":["2018-11-01 00:00:00","2018-11-29 23:59:59"]};
    store.dispatch(GetMonitoringData(postData));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-view/monitor`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Monitoring list failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: POST_MLS_VIEW_MONITOR_REQUEST },
      {
        type: POST_MLS_VIEW_MONITOR_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const postData = {"DATE_RANGE":["2018-11-01 00:00:00","2018-11-29 23:59:59"]};
    store.dispatch(GetMonitoringData(postData));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Pause Job Success', () => {
    const data = '{"downloadId":8,"mlsId":15,"urlId":"17","downloadType":"Listing","nifiEventAction":"PAUSE","resumeMessage":null}';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: GET_PAUSE_JOB_REQUEST },
      {
        type: GET_PAUSE_JOB_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const downloadId = 8;
    store.dispatch(pauseJob(downloadId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-nifi-event/pause/${downloadId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Pause Job failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_PAUSE_JOB_REQUEST },
      {
        type: GET_PAUSE_JOB_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const downloadId = 8;
    store.dispatch(pauseJob(downloadId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Resume Job Success', () => {
    const data = '{"downloadId":79,"mlsId":2,"urlId":"433","downloadType":"Listing","nifiEventAction":"RESUME","resumeMessage":{"key":"downloadTime","value":"40","metadataTime":1543502843222}}';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: GET_RESUME_JOB_REQUEST },
      {
        type: GET_RESUME_JOB_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const downloadId = 79;
    store.dispatch(resumeJob(downloadId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-nifi-event/resume/${downloadId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Resume Job failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_RESUME_JOB_REQUEST },
      {
        type: GET_RESUME_JOB_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const downloadId = 8;
    store.dispatch(resumeJob(downloadId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Stop Job Success', () => {
    const data = '{"downloadId":2,"mlsId":15,"urlId":"17","downloadType":"Listing","nifiEventAction":"STOP","resumeMessage":null}';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValue({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
      Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: GET_STOP_JOB_REQUEST },
      {
        type: GET_STOP_JOB_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]
    const downloadId = 2;
    store.dispatch(stopJob(downloadId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-nifi-event/stop/${downloadId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Stop Job failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_STOP_JOB_REQUEST },
      {
        type: GET_STOP_JOB_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    const downloadId = 2;
    store.dispatch(stopJob(downloadId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Filter Job On Play on Demand', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: SET_PLAY_ON_DEMAND_SOURCE,
        mlsId: 2,
        downloadType: 'listing'
      }
    ]
    store.dispatch(filterJobPlayOnDemand(2, 'listing'));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Clear Job On Play on Demand', () => {
    const store = mockStore({});
    const expectedActions = [
      {
        type: SET_PLAY_ON_DEMAND_SOURCE,
        mlsId: -1,
        downloadType: ''
      }
    ]
    store.dispatch(clearJobPlayOnDemand());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
