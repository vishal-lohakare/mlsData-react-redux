// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
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

import { showLoader, hideLoader } from 'utils/loader';

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

export default function MLSSchedulerReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case GET_MLS_SCHEDULER_EVENTS_REQUEST:
      showLoader();
      return requestData(state, 'MlsSchedulerEvents');

    case GET_MLS_SCHEDULER_EVENTS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSchedulerEvents');

    case GET_MLS_SCHEDULER_EVENTS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsSchedulerEvents');

    case GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST:
      showLoader();
      return requestData(state, 'MlsSchedulerEventDetails');

    case GET_MLS_SCHEDULER_EVENT_DETAILS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSchedulerEventDetails');

    case GET_MLS_SCHEDULER_EVENT_DETAILS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsSchedulerEventDetails');

    case GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST:
      showLoader();
      return requestData(state, 'MlsSchedulerDeleteEvent');

    case GET_MLS_SCHEDULER_EVENT_DELETE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSchedulerDeleteEvent');

    case GET_MLS_SCHEDULER_EVENT_DELETE_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsSchedulerDeleteEvent');

    case GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST:
      showLoader();
      return requestData(state, 'MlsSchedulerUpdateEvent');

    case GET_MLS_SCHEDULER_EVENT_UPDATE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSchedulerUpdateEvent');

    case GET_MLS_SCHEDULER_EVENT_UPDATE_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsSchedulerUpdateEvent');

    case GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST:
      showLoader();
      return requestData(state, 'MlsSchedulerCreateEvent');

    case GET_MLS_SCHEDULER_EVENT_CREATE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSchedulerCreateEvent');

    case GET_MLS_SCHEDULER_EVENT_CREATE_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsSchedulerCreateEvent');

    case GET_LISTING_SCHEDULE_EXIST_REQUEST:
      showLoader();
      return requestData(state, 'MlsListingEventStatus');

    case GET_LISTING_SCHEDULE_EXIST_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsListingEventStatus');

    case GET_LISTING_SCHEDULE_EXIST_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsListingEventStatus');

    default:
      return state;
  }
}
