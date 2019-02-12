// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
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
  GET_CURRENT_DOWNLOAD_STATUS_REQUEST,
  GET_CURRENT_DOWNLOAD_STATUS_SUCCESS,
  GET_CURRENT_DOWNLOAD_STATUS_FAILURE,
} from 'constants/action';
import { showLoader, hideLoader } from 'utils/loader';

const initialState = {
  MlsDetailsInfo: {
    isLoading: false
  },
  MlsUpdateInfo: {
    isLoading: false
  },
  MlsPlayInfo: {
    isLoading: false
  },
  MlsPlayOnDemandCheck: {
    isLoading: false
  }
};

export default function MLSSearchReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case GET_MLS_DETAILS_REQUEST:
      showLoader();
      return requestData(state, 'MlsDetailsInfo');

    case GET_MLS_DETAILS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsDetailsInfo');

    case GET_MLS_DETAILS_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsDetailsInfo');

    case UPDATE_MLS_STATE_REQUEST:
      showLoader();
      return requestData(state, 'MlsUpdateInfo');

    case UPDATE_MLS_STATE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsUpdateInfo');

    case UPDATE_MLS_STATE_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsUpdateInfo');

    case POST_MLS_PLAY_AGENT_REQUEST:
    case POST_MLS_PLAY_LISTING_REQUEST:
    case POST_MLS_PLAY_OFFICE_REQUEST:
    case POST_MLS_PLAY_OPEN_HOUSE_REQUEST:
    case POST_MLS_PLAY_PHOTO_REQUEST:
      showLoader();
      return requestData(state, 'MlsPlayInfo');

    case POST_MLS_PLAY_AGENT_SUCCESS:
    case POST_MLS_PLAY_LISTING_SUCCESS:
    case POST_MLS_PLAY_OFFICE_SUCCESS:
    case POST_MLS_PLAY_OPEN_HOUSE_SUCCESS:
    case POST_MLS_PLAY_PHOTO_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsPlayInfo');

    case POST_MLS_PLAY_AGENT_FAILURE:
    case POST_MLS_PLAY_LISTING_FAILURE:
    case POST_MLS_PLAY_OFFICE_FAILURE:
    case POST_MLS_PLAY_OPEN_HOUSE_FAILURE:
    case POST_MLS_PLAY_PHOTO_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsPlayInfo');

    case GET_CURRENT_DOWNLOAD_STATUS_REQUEST:
      showLoader();
      return requestData(state, 'MlsPlayOnDemandCheck');

    case GET_CURRENT_DOWNLOAD_STATUS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsPlayOnDemandCheck');

    case GET_CURRENT_DOWNLOAD_STATUS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsPlayOnDemandCheck');

    default:
      return state;
  }
}
