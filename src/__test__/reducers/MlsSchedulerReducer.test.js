import MLSSchedulerReducer from 'reducers/MlsSchedulerReducer';
import {
  GET_MLS_SCHEDULER_EVENTS_REQUEST,
  GET_MLS_SCHEDULER_EVENTS_SUCCESS,
  GET_MLS_SCHEDULER_EVENTS_FAILURE,
  GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST,
  GET_MLS_SCHEDULER_EVENT_DETAILS_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_DETAILS_FAILURE,
  GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST,
  GET_MLS_SCHEDULER_EVENT_DELETE_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_DELETE_FAILURE,
  GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST,
  GET_MLS_SCHEDULER_EVENT_UPDATE_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_UPDATE_FAILURE,
  GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST,
  GET_MLS_SCHEDULER_EVENT_CREATE_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_CREATE_FAILURE,
  GET_LISTING_SCHEDULE_EXIST_REQUEST,
  GET_LISTING_SCHEDULE_EXIST_SUCCESS,
  GET_LISTING_SCHEDULE_EXIST_FAILURE,
} from 'constants/action';


const initialState = {
  MlsSchedulerEvents: {
    isLoading: false,
    payload: []
  },
  MlsSchedulerEventDetails: {
    isLoading: false,
  },
  MlsSchedulerDeleteEvent: {
    isLoading: false,
  },
  MlsSchedulerUpdateEvent: {
    isLoading: false,
  },
  MlsSchedulerCreateEvent: {
    isLoading: false,
  },
  MlsListingEventStatus: {
    isLoading: false,
  }
}

describe('MlsSchedulerReducer', () => {

  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MLSSchedulerReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return get events list request action data', () => {
    const expectedData = {
      ...initialState,
      MlsSchedulerEvents:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: [],
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENTS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get events list success action data', () => {
    const eventData = '[{"title":"DOWNLOAD_JOB_22","urlId":22,"startDate":"2018-12-07T09:30:00.000Z","endDate":"2018-12-07T10:00:00.000Z","eventChainId":null,"eventStatus":"Future","scheduleType":"DAILY","mlsInfoId":2},{"title":"DOWNLOAD_JOB_22","urlId":22,"startDate":"2018-12-08T09:30:00.000Z","endDate":"2018-12-08T10:00:00.000Z","eventChainId":null,"eventStatus":"Future","scheduleType":"DAILY","mlsInfoId":2},{"title":"DOWNLOAD_JOB_106","urlId":106,"startDate":"2018-12-07T03:30:00.000Z","endDate":"2018-12-07T04:00:00.000Z","eventChainId":null,"eventStatus":"Future","scheduleType":"DAILY","mlsInfoId":2},{"title":"DOWNLOAD_JOB_106","urlId":106,"startDate":"2018-12-08T03:30:00.000Z","endDate":"2018-12-08T04:00:00.000Z","eventChainId":null,"eventStatus":"Future","scheduleType":"DAILY","mlsInfoId":2},{"title":"DOWNLOAD_JOB_108","urlId":108,"startDate":"2018-12-07T04:30:00.000Z","endDate":"2018-12-07T05:00:00.000Z","eventChainId":null,"eventStatus":"Future","scheduleType":"DAILY","mlsInfoId":2},{"title":"DOWNLOAD_JOB_108","urlId":108,"startDate":"2018-12-08T04:30:00.000Z","endDate":"2018-12-08T05:00:00.000Z","eventChainId":null,"eventStatus":"Future","scheduleType":"DAILY","mlsInfoId":2}]'

    const expectedData = {
      ...initialState,
      MlsSchedulerEvents:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: eventData,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENTS_SUCCESS,
      data: {
        payload: eventData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get events list failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsSchedulerEvents:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        isResponseComplete: true,
        payload: [],
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENTS_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });


  it('reducer should return get event details request action data', () => {
    const expectedData = {
      ...initialState,
      MlsSchedulerEventDetails:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get event details success action data', () => {
    const eventData = '{"name":"DOWNLOAD_JOB_106","group":"DOWNLOAD_GROUP_2","urlId":106,"mlsInfoId":2,"startDate":"2018-12-24T22:30:00.000Z","scheduleType":"DAILY","hour":22,"min":30,"everyMinuteJobDescriptor":null}';

    const expectedData = {
      ...initialState,
      MlsSchedulerEventDetails:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: eventData,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_DETAILS_SUCCESS,
      data: {
        payload: eventData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get event details failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsSchedulerEventDetails:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_DETAILS_FAILURE,
      error: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });


  it('reducer should return delete event request action data', () => {
    const expectedData = {
      ...initialState,
      MlsSchedulerDeleteEvent:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return delete event success action data', () => {

    const expectedData = {
      ...initialState,
      MlsSchedulerDeleteEvent:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: {},
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_DELETE_SUCCESS,
      data: {
        payload: {},
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get event details failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsSchedulerDeleteEvent:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_DELETE_FAILURE,
      error: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });


  it('reducer should return update event request action data', () => {
    const expectedData = {
      ...initialState,
      MlsSchedulerUpdateEvent:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return update event success action data', () => {
    const eventData = '{"name":"DOWNLOAD_JOB_106","group":"DOWNLOAD_GROUP_2","urlId":106,"mlsInfoId":2,"startDate":"2018-12-24T22:30:00.000Z","scheduleType":"DAILY","hour":22,"min":30,"everyMinuteJobDescriptor":null}';

    const expectedData = {
      ...initialState,
      MlsSchedulerUpdateEvent:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: eventData,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_UPDATE_SUCCESS,
      data: {
        payload: eventData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get event details failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsSchedulerUpdateEvent:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_UPDATE_FAILURE,
      error: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });


  it('reducer should return create event request action data', () => {
    const expectedData = {
      ...initialState,
      MlsSchedulerCreateEvent:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return create event success action data', () => {
    const eventData = '{"name":"DOWNLOAD_JOB_106","group":"DOWNLOAD_GROUP_2","urlId":106,"mlsInfoId":2,"startDate":"2018-12-24T22:30:00.000Z","scheduleType":"DAILY","hour":22,"min":30,"everyMinuteJobDescriptor":null}';

    const expectedData = {
      ...initialState,
      MlsSchedulerCreateEvent:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: eventData,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_CREATE_SUCCESS,
      data: {
        payload: eventData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return create event failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsSchedulerCreateEvent:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_MLS_SCHEDULER_EVENT_CREATE_FAILURE,
      error: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('Verify listing  reducer should return create event request action data', () => {
    const expectedData = {
      ...initialState,
      MlsListingEventStatus:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_LISTING_SCHEDULE_EXIST_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('Verify listing reducer should return create event success action data', () => {

    const expectedData = {
      ...initialState,
      MlsListingEventStatus:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: true,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_LISTING_SCHEDULE_EXIST_SUCCESS,
      data: {
        payload: true,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('Verify listing reducer should return create event failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsListingEventStatus:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSSchedulerReducer(initialState, {
      type: GET_LISTING_SCHEDULE_EXIST_FAILURE,
      error: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

});
