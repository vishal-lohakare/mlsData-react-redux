// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SHOW_FULL_HEADER,
  CLEAR_SESSION_DATA
} from 'constants/action';
import _ from 'lodash';
import { getCookie } from 'utils/session';
import { showLoader, hideLoader } from 'utils/loader';

const initialState = {
  MlsLogin: {
    isLoading: false,
  },
  showFullHeader: {
    isShowFullHeader: getCookie('zapToken') === '' ? false : true
  }
}

export default function MLSLoginReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case LOGIN_REQUEST:
      showLoader();
      return requestData(state, 'MlsLogin');

    case LOGIN_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsLogin');

    case LOGIN_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsLogin');

    case CLEAR_SESSION_DATA:
    case SHOW_FULL_HEADER:
      const newState = _.cloneDeep(state);
      newState.showFullHeader.isShowFullHeader = action.isShowFullHeader;
      return {...newState};

    default:
      return state;
  }
}
