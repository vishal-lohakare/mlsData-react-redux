// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
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
import _ from 'lodash';
import { showLoader, hideLoader } from 'utils/loader';

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

export default function MLSMonitoringReducer(state: Object = initialState, action: Object) {

  const newState = _.cloneDeep(state);

  switch(action.type) {
    case POST_MLS_VIEW_MONITOR_REQUEST:
      showLoader();
      return requestData(state, 'MlsMonitoringInfo');

    case POST_MLS_VIEW_MONITOR_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsMonitoringInfo');

    case POST_MLS_VIEW_MONITOR_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsMonitoringInfo');

    case GET_PAUSE_JOB_REQUEST:
    case GET_RESUME_JOB_REQUEST:
    case GET_STOP_JOB_REQUEST:
      showLoader();
      return requestData(state, 'MlsMonitoringAction');

    case GET_PAUSE_JOB_SUCCESS:
    case GET_RESUME_JOB_SUCCESS:
    case GET_STOP_JOB_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsMonitoringAction');

    case GET_PAUSE_JOB_FAILURE:
    case GET_RESUME_JOB_FAILURE:
    case GET_STOP_JOB_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsMonitoringAction');

    case SET_PLAY_ON_DEMAND_SOURCE:
      newState.MlsPlayOnDemand = {
        downloadType: action.downloadType,
        mlsId: action.mlsId
      };
      return  {
        ...newState
      }

     default:
      return state;
 }
}
