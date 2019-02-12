// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  SEARCH_MLS_REQUEST,
  SEARCH_MLS_SUCCESS,
  SEARCH_MLS_FAILURE,
  POST_MLS_DATA_REQUEST,
  POST_MLS_DATA_SUCCESS,
  POST_MLS_DATA_FAILURE,
  GET_MLS_DOWNLOAD_FILES_REQUEST,
  GET_MLS_DOWNLOAD_FILES_SUCCESS,
  GET_MLS_DOWNLOAD_FILES_FAILURE,
  GET_MLS_DOWNLOAD_UPDATED_FILES_REQUEST,
  GET_MLS_DOWNLOAD_UPDATED_FILES_SUCCESS,
  GET_MLS_DOWNLOAD_UPDATED_FILES_FAILURE,
  CLEAR_MLS_CONFIG_DATA,
  GET_METADATA_DOWNLOAD_PREVIEW_REQUEST,
  GET_METADATA_DOWNLOAD_PREVIEW_SUCCESS,
  GET_METADATA_DOWNLOAD_PREVIEW_FAILURE,
  GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_REQUEST,
  GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_SUCCESS,
  GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_FAILURE,
  GET_PREVIEW_COL_UNIQUE_VALUES_REQUEST,
  GET_PREVIEW_COL_UNIQUE_VALUES_SUCCESS,
  GET_PREVIEW_COL_UNIQUE_VALUES_FAILURE,
  POST_PREVIEW_DATA
} from 'constants/action';
import _ from 'lodash';
import { showLoader, hideLoader } from 'utils/loader';

const initialState = {
  MlsConfigureResult: {
    isLoading: false,
  },
  MlsDownloadFiles: {
    isLoading: false
  },
  MlsDownloadUpdatedFiles: {
    isLoading: false,
  },
  MlsMetadataDownloadPreview: {
    isLoading: false
  },
  MlsMetadataLookupDownloadPreview: {
    isLoading: false
  },
  MlsPreviewColumnUniqueData: {
    isLoading: false
  },
  MlsDetailsInfo: {
    isLoading: false
  }
}

const emptyState = {
  source: '',
  loginId: '',
  password: '',
  loginUrl: '',
  userAgentId: '',
  userAgentPassword: '',
  retsVersion: '',
  basicAuth: 'no',
  collapse: false,
  clientError: false,
  propUpdated: false,
  isFirst: true,
  isConfigMls: true
}

export default function MLSConfigureReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case SEARCH_MLS_REQUEST:
      showLoader();
      return requestData(state, 'MlsConfigureResult');

    case SEARCH_MLS_SUCCESS:
      return successData(state, {...action.data, isSearchSuccess: true}, 'MlsConfigureResult');

    case SEARCH_MLS_FAILURE:
      hideLoader();
     return failureData(state, action.data, 'MlsConfigureResult');

    case POST_MLS_DATA_REQUEST:
      showLoader();
      return requestData(state, 'MlsConfigureResult');

    case POST_MLS_DATA_SUCCESS:
      hideLoader();
      return successData(state, {payload: [action.data.payload], status: action.data.status, isAddUpdateSuccess: true}, 'MlsConfigureResult');

    case POST_MLS_DATA_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsConfigureResult');

    case GET_MLS_DOWNLOAD_FILES_REQUEST:
      return requestData(state, 'MlsDownloadFiles');

    case GET_MLS_DOWNLOAD_FILES_SUCCESS:
        hideLoader();
      return successData(state, action.data, 'MlsDownloadFiles');

    case GET_MLS_DOWNLOAD_FILES_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsDownloadFiles');

    case GET_MLS_DOWNLOAD_UPDATED_FILES_REQUEST:
      showLoader();
      return requestData(state, 'MlsDownloadUpdatedFiles');

    case GET_MLS_DOWNLOAD_UPDATED_FILES_SUCCESS:
      return successData(state, action.data, 'MlsDownloadUpdatedFiles');

    case GET_MLS_DOWNLOAD_UPDATED_FILES_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsDownloadUpdatedFiles');

    case CLEAR_MLS_CONFIG_DATA:
      return {...initialState};

    case GET_METADATA_DOWNLOAD_PREVIEW_REQUEST:
      showLoader();
      return requestData(state, 'MlsMetadataDownloadPreview');

    case GET_METADATA_DOWNLOAD_PREVIEW_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsMetadataDownloadPreview');

    case GET_METADATA_DOWNLOAD_PREVIEW_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsMetadataDownloadPreview');

    case GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_REQUEST:
      showLoader();
      return requestData(state, 'MlsMetadataLookupDownloadPreview');

    case GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsMetadataLookupDownloadPreview');

    case GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsMetadataLookupDownloadPreview');

    case GET_PREVIEW_COL_UNIQUE_VALUES_REQUEST:
      showLoader();
      return requestData(state, 'MlsPreviewColumnUniqueData');

    case GET_PREVIEW_COL_UNIQUE_VALUES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsPreviewColumnUniqueData');

    case GET_PREVIEW_COL_UNIQUE_VALUES_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsPreviewColumnUniqueData');
 
    case POST_PREVIEW_DATA:
      const newState = _.cloneDeep(state);
      newState[action.source] = action.previewData;
      return newState;
    default:
      return state;
  }
}
