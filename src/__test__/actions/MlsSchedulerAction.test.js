import {
  getSchedulerEvents,
  getSchedulerEventDetails,
  deleteSchedulerEvent,
  updateSchedulerEvent,
  createSchedulerEvent,
  isListingScheduleExist
} from 'actions/MlsSchedulerAction';

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

const data = '[{"title":"FLEXMLS_DEMO_Office","jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","urlId":305,"startDate":"2019-01-23T07:00:00.000Z","endDate":"2019-01-23T07:15:00.000Z","eventChainId":null,"eventStatus":"Enabled","scheduleType":"DAILY","mlsInfoId":277,"downloadType":"office","jobStatus":"Future"},{"title":"FLEXMLS_DEMO_Office","jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","urlId":305,"startDate":"2019-01-24T07:00:00.000Z","endDate":"2019-01-24T07:15:00.000Z","eventChainId":null,"eventStatus":"Enabled","scheduleType":"DAILY","mlsInfoId":277,"downloadType":"office","jobStatus":"Future"},{"title":"FLEXMLS_DEMO_Office","jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","urlId":305,"startDate":"2019-01-25T07:00:00.000Z","endDate":"2019-01-25T07:15:00.000Z","eventChainId":null,"eventStatus":"Enabled","scheduleType":"DAILY","mlsInfoId":277,"downloadType":"office","jobStatus":"Future"},{"title":"FLEXMLS_DEMO_Office","jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","urlId":305,"startDate":"2019-01-26T07:00:00.000Z","endDate":"2019-01-26T07:15:00.000Z","eventChainId":null,"eventStatus":"Enabled","scheduleType":"DAILY","mlsInfoId":277,"downloadType":"office","jobStatus":"Future"}]'

const getQuery = {
  mlsInfoId: 0,
  startDate: "2018-12-06T11:57:33.520Z",
  endDate:"2018-12-09T11:57:33.520Z"
};

const eventDetailsData = '{"jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","title":"FLEXMLS_DEMO_Office","group":"DOWNLOAD_GROUP_277","urlId":305,"mlsInfoId":277,"startDate":"2019-01-23T07:00:00.000Z","scheduleType":"DAILY","hour":7,"min":0,"downloadType":"office","eventStatus":"Enabled","everyMinuteJobDescriptor":null,"timeZone":"CST"}';

const getEventDetailsQueryPayload = '{"mlsInfoId":2,"jobName":"DOWNLOAD_JOB_22"}';

const getEventDetailsQuery = {
  mlsInfoId: 2,
  jobId: "188d3f2f-1ca4-4ebf-8c4e-78974c607689"
};

const updateEventQuery = '{"jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","title":"FLEXMLS_DEMO_Office","group":"DOWNLOAD_GROUP_277","urlId":305,"mlsInfoId":277,"startDate":"2019-01-23T08:00:00.000Z","scheduleType":"DAILY","hour":8,"min":0,"downloadType":"office","eventStatus":"Enabled","timeZone":"IST"}';

const updateEventData = '{"jobId":"188d3f2f-1ca4-4ebf-8c4e-78974c607689","title":"FLEXMLS_DEMO_Office","group":"DOWNLOAD_GROUP_277","urlId":305,"mlsInfoId":277,"startDate":"2019-01-23T08:00:00.000Z","scheduleType":"DAILY","hour":8,"min":0,"downloadType":"office","eventStatus":"Enabled","everyMinuteJobDescriptor":null,"timeZone":"IST"}';

describe('MlsSchedulerActions', () => {

    beforeEach(() => {
      store = mockStore({});
    })

    it('Get Events Data', () => {

      window.fetch = jest
      .fn()
      .mockResolvedValue({status: 200, ok: true, data:data, text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
      })

      const expectedActions = [
        { type:  GET_MLS_SCHEDULER_EVENTS_REQUEST},
        {
          type: GET_MLS_SCHEDULER_EVENTS_SUCCESS,
          data: { payload: JSON.parse(data), status: 200 },
        }
      ]

      store.dispatch(getSchedulerEvents(getQuery));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/schedule/download/${getQuery.mlsInfoId}/calendar?startDate=${getQuery.startDate}&endDate=${getQuery.endDate}`)
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Get Events Data failure', () => {

      window.fetch = jest
      .fn()
      .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

      const expectedActions = [
        { type: GET_MLS_SCHEDULER_EVENTS_REQUEST },
        {
          type: GET_MLS_SCHEDULER_EVENTS_FAILURE,
          error: {
            "error": {"message": "Something went wrong. Please try again later."},
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(getSchedulerEvents(getQuery));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });


    it('Get Particular Event Details Data', () => {

      window.fetch = jest
      .fn()
      .mockResolvedValue({status: 200, ok: true, data: eventDetailsData, text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, eventDetailsData))).mockResolvedValue(eventDetailsData)
      })

      const expectedActions = [
        { type:  GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST},
        {
          type: GET_MLS_SCHEDULER_EVENT_DETAILS_SUCCESS,
          data: { payload: JSON.parse(eventDetailsData), status: 200 },
        }
      ]

      store.dispatch(getSchedulerEventDetails(getEventDetailsQuery));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/schedule/download/${getEventDetailsQuery.mlsInfoId}/${getEventDetailsQuery.jobId}`)
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Get Particular Event Details failure', () => {

      window.fetch = jest
      .fn()
      .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

      const expectedActions = [
        { type: GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST },
        {
          type: GET_MLS_SCHEDULER_EVENT_DETAILS_FAILURE,
          error: {
            "error": {"message": "Something went wrong. Please try again later."},
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(getSchedulerEventDetails(getEventDetailsQuery));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Delete Particular Event Success', () => {

      window.fetch = jest
      .fn()
      .mockResolvedValue({status: 200, ok: true, data: getEventDetailsQueryPayload, text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, getEventDetailsQueryPayload))).mockResolvedValue(getEventDetailsQueryPayload)
      })

      const expectedActions = [
        { type:  GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST},
        {
          type: GET_MLS_SCHEDULER_EVENT_DELETE_SUCCESS,
          data: { payload: JSON.parse(getEventDetailsQueryPayload), status: 200 },
        }
      ]

      store.dispatch(deleteSchedulerEvent(getEventDetailsQuery));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/schedule/download/${getEventDetailsQuery.mlsInfoId}/${getEventDetailsQuery.jobId}`)
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Delete Particular Event failure', () => {

      window.fetch = jest
      .fn()
      .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

      const expectedActions = [
        { type: GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST },
        {
          type: GET_MLS_SCHEDULER_EVENT_DELETE_FAILURE,
          error: {
            "error": {"message": "Something went wrong. Please try again later."},
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(deleteSchedulerEvent(getEventDetailsQuery));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Update Particular Event Success', () => {

      window.fetch = jest
      .fn()
      .mockResolvedValue({status: 200, ok: true, data: updateEventData, text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, updateEventData))).mockResolvedValue(updateEventData)
      })

      const expectedActions = [
        { type:  GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST},
        {
          type: GET_MLS_SCHEDULER_EVENT_UPDATE_SUCCESS,
          data: { payload: JSON.parse(updateEventData), status: 200 },
        }
      ]

      store.dispatch(updateSchedulerEvent(updateEventQuery));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/schedule/download/update`)
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Update Particular Event failure', () => {

      window.fetch = jest
      .fn()
      .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

      const expectedActions = [
        { type: GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST },
        {
          type: GET_MLS_SCHEDULER_EVENT_UPDATE_FAILURE,
          error: {
            "error": {"message": "Something went wrong. Please try again later."},
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(updateSchedulerEvent(updateEventQuery));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Create an Event Success', () => {

      window.fetch = jest
      .fn()
      .mockResolvedValue({status: 200, ok: true, data: updateEventData, text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, updateEventData))).mockResolvedValue(updateEventData)
      })

      const expectedActions = [
        { type:  GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST},
        {
          type: GET_MLS_SCHEDULER_EVENT_CREATE_SUCCESS,
          data: { payload: JSON.parse(updateEventData), status: 200 },
        }
      ]

      store.dispatch(createSchedulerEvent(updateEventQuery));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/schedule/download`)
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Create an Event failure', () => {

      window.fetch = jest
      .fn()
      .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

      const expectedActions = [
        { type: GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST },
        {
          type: GET_MLS_SCHEDULER_EVENT_CREATE_FAILURE,
          error: {
            "error": {"message": "Something went wrong. Please try again later."},
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(createSchedulerEvent(updateEventQuery));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Verify schedule listing and photo Success', () => {

      window.fetch = jest
      .fn()
      .mockResolvedValue({status: 200, ok: true, data: updateEventData, text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, true))).mockResolvedValue(true)
      })

      const expectedActions = [
        { type:  GET_LISTING_SCHEDULE_EXIST_REQUEST},
        {
          type: GET_LISTING_SCHEDULE_EXIST_SUCCESS,
          data: { payload: JSON.parse(true), status: 200 },
        }
      ]

      store.dispatch(isListingScheduleExist({mlsId: 2, startDate: '2018-12-26 01:30:00'}));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/schedule/download/checkListingSchedule/2/2018-12-26 01:30:00`)
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

    it('Verify schedule listing and photo failure', () => {

      window.fetch = jest
      .fn()
      .mockRejectedValueOnce({error:{
        "error": {"message": "Something went wrong. Please try again later."},
        "status": "",
        "statusText": ""
      }
    })

      const expectedActions = [
        { type: GET_LISTING_SCHEDULE_EXIST_REQUEST },
        {
          type: GET_LISTING_SCHEDULE_EXIST_FAILURE,
          error: {
            "error": {"message": "Something went wrong. Please try again later."},
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(isListingScheduleExist({mlsId: 2, startDate: '2018-12-26 01:30:00'}));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });

    });

  })
