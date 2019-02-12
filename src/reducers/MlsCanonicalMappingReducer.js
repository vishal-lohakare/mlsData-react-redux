// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  GET_CANONICAL_FIELDS_REQUEST,
  GET_CANONICAL_FIELDS_SUCCESS,
  GET_CANONICAL_FIELDS_FAILURE,
  GET_RAWFIELD_SAMPLE_DATA_REQUEST,
  GET_RAWFIELD_SAMPLE_DATA_SUCCESS,
  GET_RAWFIELD_SAMPLE_DATA_FAILURE,
  GET_MAPPED_FIELDS_REQUEST,
  GET_MAPPED_FIELDS_SUCCESS,
  GET_MAPPED_FIELDS_FAILURE,
  UPDATE_MAPPED_FIELDS_REQUEST,
  UPDATE_MAPPED_FIELDS_SUCCESS,
  UPDATE_MAPPED_FIELDS_FAILURE,
  GET_AVAILABLE_FUNCTIONS_REQUEST,
  GET_AVAILABLE_FUNCTIONS_SUCCESS,
  GET_AVAILABLE_FUNCTIONS_FAILURE,
  GET_AUTOCOMPLETE_FUNCTIONS_REQUEST,
  GET_AUTOCOMPLETE_FUNCTIONS_SUCCESS,
  GET_AUTOCOMPLETE_FUNCTIONS_FAILURE,
  POST_TRANSFORMATION_PREVIEW_REQUEST,
  POST_TRANSFORMATION_PREVIEW_SUCCESS,
  POST_TRANSFORMATION_PREVIEW_FAILURE,
  POST_UUID_REQUEST,
  POST_UUID_SUCCESS,
  POST_UUID_FAILURE,
  GET_AUTOCOMPLETE_OPTIONS_REQUEST,
  GET_AUTOCOMPLETE_OPTIONS_SUCCESS,
  GET_AUTOCOMPLETE_OPTIONS_FAILURE,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE,
  GET_START_SPARK_REQUEST,
  GET_START_SPARK_SUCCESS,
  GET_START_SPARK_FAILURE,
  DELETE_CANONICAL_MAPPING_REQUEST,
  DELETE_CANONICAL_MAPPING_SUCCESS,
  DELETE_CANONICAL_MAPPING_FAILURE,
  GET_CANONICAL_MAPPING_REQUEST,
  GET_CANONICAL_MAPPING_SUCCESS,
  GET_CANONICAL_MAPPING_FAILURE,
  GET_AUTO_MAPPINGS_REQUEST,
  GET_AUTO_MAPPINGS_SUCCESS,
  GET_AUTO_MAPPINGS_FAILURE,
  POST_AUTO_MAPPINGS_REQUEST,
  POST_AUTO_MAPPINGS_SUCCESS,
  POST_AUTO_MAPPINGS_FAILURE,
  CLEAR_MAPPED_FIELDS
} from 'constants/action';

import { showLoader, hideLoader } from 'utils/loader';

const initialState = {
  MlsCanonical: {
    isLoading: false,
  },
  MlsSample: {
    isLoading: false,
  },
  MlsMappedField: {
    isLoading: false
  },
  MlsCanonicalFunctions: {
    isLoading: false
  },
  MlsAutoCompleteFunctions: {
    isLoading: false
  },
  MlsTransformationPreview: {
    isLoading: false
  },
  MlsUuid: {
    isLoading: false
  },
  MlsDowloadTypesList: {
    isLoading: false
  },
  MlsSparkSession: {
    isLoading: false
  },
  MlsAutoCompleteOptions: {
    isLoading: false
  },
  MlsUpdateMappedField: {
    isLoading: false
  },
  MlsDeleteMapping: {
    isLoading: false
  },
  MlsExistingMappedFields: {
    isLoading: false,
  },
  MlsAutoMap: {
    isLoading: false
  },
  saveMlsAutoMapping:{
    isLoading: false
  }
}

export default function MLSCanonicalMappingReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case GET_CANONICAL_FIELDS_REQUEST:
      showLoader();
      return requestData(state, 'MlsCanonical');

    case GET_CANONICAL_FIELDS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsCanonical');

    case GET_CANONICAL_FIELDS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsCanonical');

    case GET_RAWFIELD_SAMPLE_DATA_REQUEST:
      showLoader();
      return requestData(state, 'MlsSample');

    case GET_RAWFIELD_SAMPLE_DATA_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSample');

    case GET_RAWFIELD_SAMPLE_DATA_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsSample');

    case GET_MAPPED_FIELDS_REQUEST:
      showLoader();
      return requestData(state, 'MlsMappedField');

    case GET_MAPPED_FIELDS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsMappedField');

    case GET_MAPPED_FIELDS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsMappedField');

    case UPDATE_MAPPED_FIELDS_REQUEST:
      showLoader();
      return requestData(state, 'MlsUpdateMappedField');

    case UPDATE_MAPPED_FIELDS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsUpdateMappedField');

    case UPDATE_MAPPED_FIELDS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsUpdateMappedField');

    case GET_AVAILABLE_FUNCTIONS_REQUEST:
      return requestData(state, 'MlsCanonicalFunctions');

    case GET_AVAILABLE_FUNCTIONS_SUCCESS:
      return successData(state, action.data, 'MlsCanonicalFunctions');

    case GET_AVAILABLE_FUNCTIONS_FAILURE:
      return failureData(state, action.error, 'MlsCanonicalFunctions');

    case GET_AUTOCOMPLETE_FUNCTIONS_REQUEST:
      return requestData(state, 'MlsAutoCompleteFunctions');

    case GET_AUTOCOMPLETE_FUNCTIONS_SUCCESS:
      return successData(state, action.data, 'MlsAutoCompleteFunctions');

    case GET_AUTOCOMPLETE_FUNCTIONS_FAILURE:
      return failureData(state, action.error, 'MlsAutoCompleteFunctions');

    case POST_TRANSFORMATION_PREVIEW_REQUEST:
      showLoader();
      return requestData(state, 'MlsTransformationPreview');

    case POST_TRANSFORMATION_PREVIEW_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsTransformationPreview');

    case POST_TRANSFORMATION_PREVIEW_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsTransformationPreview');

    case POST_UUID_REQUEST:
      return requestData(state, 'MlsUuid');

    case POST_UUID_SUCCESS:
      return successData(state, action.data, 'MlsUuid');

    case POST_UUID_FAILURE:
      return failureData(state, action.error, 'MlsUuid');

    case GET_AUTOCOMPLETE_OPTIONS_REQUEST:
      return requestData(state, 'MlsAutoCompleteOptions');

    case GET_AUTOCOMPLETE_OPTIONS_SUCCESS:
      return successData(state, action.data, 'MlsAutoCompleteOptions');

    case GET_AUTOCOMPLETE_OPTIONS_FAILURE:
      return failureData(state, action.error, 'MlsAutoCompleteOptions');

    case GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST:
      showLoader();
      return requestData(state, 'MlsDowloadTypesList');

    case GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsDowloadTypesList');

    case GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsDowloadTypesList');

    case GET_START_SPARK_REQUEST:
      return requestData(state, 'MlsSparkSession');

    case GET_START_SPARK_SUCCESS:
      return successData(state, action.data, 'MlsSparkSession');

    case GET_START_SPARK_FAILURE:
      return failureData(state, action.error, 'MlsSparkSession');

    case DELETE_CANONICAL_MAPPING_REQUEST:
      showLoader();
      return requestData(state, 'MlsDeleteMapping');

    case DELETE_CANONICAL_MAPPING_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsDeleteMapping');

    case DELETE_CANONICAL_MAPPING_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsDeleteMapping');

    case GET_CANONICAL_MAPPING_REQUEST:
      showLoader();
      return requestData(state, 'MlsExistingMappedFields');

    case GET_CANONICAL_MAPPING_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsExistingMappedFields');

    case GET_CANONICAL_MAPPING_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsExistingMappedFields');

    case GET_AUTO_MAPPINGS_REQUEST:
      showLoader();
      return requestData(state, 'MlsAutoMap');

    case GET_AUTO_MAPPINGS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsAutoMap');

    case GET_AUTO_MAPPINGS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsAutoMap');

    case POST_AUTO_MAPPINGS_REQUEST:
      showLoader();
      return requestData(state, 'saveMlsAutoMapping');

    case POST_AUTO_MAPPINGS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'saveMlsAutoMapping');

    case POST_AUTO_MAPPINGS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'saveMlsAutoMapping');

    case CLEAR_MAPPED_FIELDS:
      return {
        ...state,
        MlsMappedField: {
          ...state.MlsMappedField,
          payload: { fields: [], mlsCanonicalFieldsMappingDtoList: [] }
        }
      }

    default:
      return state;
  }
}
