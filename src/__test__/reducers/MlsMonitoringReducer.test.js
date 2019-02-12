import MLSMonitoringReducer from 'reducers/MlsMonitoringReducer';
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

const initialState = {
  MlsMonitoringInfo: {
    isLoading: false,
    payload: [],
  },
  MlsPlayOnDemand: {
    downloadType: '',
    mlsId: -1
  },
  MlsMonitoringAction: {
    isLoading: false
  }
};

describe('MlsMonitoring reducer', () => {

  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MLSMonitoringReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return monitoring request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringInfo:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: [],
      },
    }
    expect(MLSMonitoringReducer(initialState, {
      type: POST_MLS_VIEW_MONITOR_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return post success action data ', () => {
    const payloadValue = [
      {
        "downloadId": 79,
        "mlsId": 2,
        "source": "FLEXMLS",
        "resourceType": "Listing",
        "resourceId": null,
        "urlId": "433",
        "status": "Paused",
        "mlsEventStageDtoList": [
          {
            "eventStageName": "Download Request",
            "startDate": 1543502422655,
            "endDate": 1543502422655,
            "status": "In Progress"
          },
          {
            "eventStageName": "Download Raw Data",
            "startDate": 1543502580314,
            "endDate": 1543502843222,
            "status": "Paused"
          }
        ]
      }
    ];
    const expectedData = {
      ...initialState,
      MlsMonitoringInfo:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: POST_MLS_VIEW_MONITOR_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return post failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringInfo:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        payload: [],
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: POST_MLS_VIEW_MONITOR_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  });

  it('reducer should return pause job request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_PAUSE_JOB_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return pause job success action data ', () => {
    const payloadValue = {
      "downloadId": 8,
      "mlsId": 15,
      "urlId": "17",
      "downloadType": "Listing",
      "nifiEventAction": "PAUSE",
      "resumeMessage": null
    };

    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_PAUSE_JOB_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return pause job failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_PAUSE_JOB_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  });

  it('reducer should return resume job request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_RESUME_JOB_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return resume job success action data ', () => {
    const payloadValue = {
      "downloadId": 79,
      "mlsId": 2,
      "urlId": "433",
      "downloadType": "Listing",
      "nifiEventAction": "RESUME",
      "resumeMessage": {
        "key": "downloadTime",
        "value": "40",
        "metadataTime": 1543502843222
      }
    };

    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_RESUME_JOB_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return resume job failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_RESUME_JOB_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  });

  it('reducer should return stop job request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_STOP_JOB_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return stop job success action data ', () => {
    const payloadValue = {
      "downloadId": 2,
      "mlsId": 15,
      "urlId": "17",
      "downloadType": "Listing",
      "nifiEventAction": "STOP",
      "resumeMessage": null
    };

    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_STOP_JOB_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return stop job failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsMonitoringAction:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: GET_STOP_JOB_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  });

  it('reducer should return new downloadType and mlsId ', () => {
    const expectedData = {
      ...initialState,
      MlsPlayOnDemand: {
        downloadType: 'listing',
        mlsId: 2
      }
    }
    expect(MLSMonitoringReducer(initialState, {
      type: SET_PLAY_ON_DEMAND_SOURCE,
      downloadType: 'listing',
      mlsId: 2
    })).toEqual(expectedData);
  });
});
