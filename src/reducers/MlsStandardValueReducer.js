// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  GET_STANDARD_VALUES_REQUEST,
  GET_STANDARD_VALUES_SUCCESS,
  GET_STANDARD_VALUES_FAILURE,
  GET_SEARCH_STANDARD_VALUES_REQUEST,
  GET_SEARCH_STANDARD_VALUES_SUCCESS,
  GET_SEARCH_STANDARD_VALUES_FAILURE,
  GET_MAPPED_VALUES_REQUEST,
  GET_MAPPED_VALUES_SUCCESS,
  GET_MAPPED_VALUES_FAILURE,
  GET_UNMAPPED_VALUES_REQUEST,
  GET_UNMAPPED_VALUES_SUCCESS,
  GET_UNMAPPED_VALUES_FAILURE,
  POST_UNMAPPED_VALUES_REQUEST,
  POST_UNMAPPED_VALUES_FAILURE,
  POST_MAPPED_VALUES_REQUEST,
  POST_MAPPED_VALUES_FAILURE,
  GET_MLSINFO_SOURCE_REQUEST,
  GET_MLSINFO_SOURCE_SUCCESS,
  GET_MLSINFO_SOURCE_FAILURE,
  GET_MLS_CANONICAL_FIELDS_REQUEST,
  GET_MLS_CANONICAL_FIELDS_SUCCESS,
  GET_MLS_CANONICAL_FIELDS_FAILURE,
  DELETE_UNMAPPED_VALUES_SUCCESS,
  DELETE_MAPPED_VALUES_SUCCESS,
  POST_NEW_STANDARD_VALUE_REQUEST,
  POST_NEW_STANDARD_VALUE_SUCCESS,
  POST_NEW_STANDARD_VALUE_FAILURE,
  GET_SEARCH_MAPPED_VALUES_REQUEST,
  GET_SEARCH_MAPPED_VALUES_SUCCESS,
  GET_SEARCH_MAPPED_VALUES_FAILURE,
  GET_SEARCH_UNMAPPED_VALUES_REQUEST,
  GET_SEARCH_UNMAPPED_VALUES_SUCCESS,
  GET_SEARCH_UNMAPPED_VALUES_FAILURE,
} from 'constants/action';
import {
  hideLoader, showLoader
} from 'utils/loader';

const initialState = {
  MlsInfoSourceResult: {
    isLoading: false,
  },
  MlsCananicalFields: {
    isLoading: false,
  },
  MlsStandardValue: {
    isLoading: false,
    payload: {
      mlsStandardValueDtos: [],
    }
  },
  MlsMappedValue: {
    isLoading: false,
    payload: {
     mlsStandardValueMapDtos: []
   },
  },
  MlsUnmappedValue: {
    payload: {
      mlsUnmappedValueDtos: []
    },
    isLoading: false,
  },
  MlsMappedUnammped: {
    isLoading: false,
  },
  MlsNewStandardValue: {
    isLoading: false,
  }
}

export default function MLSStandardValueReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case GET_MLSINFO_SOURCE_REQUEST:
      showLoader();
      return requestData(state, 'MlsInfoSourceResult');

    case GET_MLSINFO_SOURCE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsInfoSourceResult');

    case GET_MLSINFO_SOURCE_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsInfoSourceResult');

    case GET_MLS_CANONICAL_FIELDS_REQUEST:
      showLoader();
      return requestData(state, 'MlsCananicalFields');

    case GET_MLS_CANONICAL_FIELDS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsCananicalFields');

    case GET_MLS_CANONICAL_FIELDS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsCananicalFields');

    case GET_STANDARD_VALUES_REQUEST:
    case GET_SEARCH_STANDARD_VALUES_REQUEST:
      showLoader();
      return requestData(state, 'MlsStandardValue');

    case GET_STANDARD_VALUES_SUCCESS:
    case GET_SEARCH_STANDARD_VALUES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsStandardValue');

    case GET_STANDARD_VALUES_FAILURE:
    case GET_SEARCH_STANDARD_VALUES_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsStandardValue');

    case GET_MAPPED_VALUES_REQUEST:
    case GET_SEARCH_MAPPED_VALUES_REQUEST:
      showLoader();
      return requestData(state, 'MlsMappedValue');

    case GET_MAPPED_VALUES_SUCCESS:
    case GET_SEARCH_MAPPED_VALUES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsMappedValue');

    case GET_MAPPED_VALUES_FAILURE:
    case GET_SEARCH_MAPPED_VALUES_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsMappedValue');

    case GET_UNMAPPED_VALUES_REQUEST:
    case GET_SEARCH_UNMAPPED_VALUES_REQUEST:
      showLoader();
      return requestData(state, 'MlsUnmappedValue');

    case GET_UNMAPPED_VALUES_SUCCESS:
    case GET_SEARCH_UNMAPPED_VALUES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsUnmappedValue');

    case GET_UNMAPPED_VALUES_FAILURE:
    case GET_SEARCH_UNMAPPED_VALUES_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsUnmappedValue');

    case POST_MAPPED_VALUES_REQUEST:
    case POST_UNMAPPED_VALUES_REQUEST:
      showLoader();
      return requestData(state, 'MlsMappedUnammped');

    case POST_MAPPED_VALUES_FAILURE:
    case POST_UNMAPPED_VALUES_FAILURE:
      hideLoader();
      return state;

    case DELETE_UNMAPPED_VALUES_SUCCESS:
    case DELETE_MAPPED_VALUES_SUCCESS:
      hideLoader();
      return successData(state, {}, 'MlsMappedUnammped');

    case POST_NEW_STANDARD_VALUE_REQUEST:
      showLoader();
      return requestData(state, 'MlsNewStandardValue');

    case POST_NEW_STANDARD_VALUE_SUCCESS:
      hideLoader();
      return successData(state, {}, 'MlsNewStandardValue');

    case POST_NEW_STANDARD_VALUE_FAILURE:
      hideLoader();
      return failureData(state, {}, 'MlsNewStandardValue');

    default:
      return state;
  }
}
