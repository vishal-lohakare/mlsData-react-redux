// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  GET_CONTEXT_VARIABLES_REQUEST,
  GET_CONTEXT_VARIABLES_SUCCESS,
  GET_CONTEXT_VARIABLES_FAILURE,
  ADD_NEW_CONTEXT_VARIABLE_REQUEST,
  ADD_NEW_CONTEXT_VARIABLE_SUCCESS,
  ADD_NEW_CONTEXT_VARIABLE_FAILURE,
  UPDATE_CONTEXT_VARIABLE_REQUEST,
  UPDATE_CONTEXT_VARIABLE_SUCCESS,
  UPDATE_CONTEXT_VARIABLE_FAILURE,
  DELETE_CONTEXT_VARIABLES_REQUEST,
  DELETE_CONTEXT_VARIABLES_SUCCESS,
  DELETE_CONTEXT_VARIABLES_FAILURE,
  GET_SUGGEST_RESOURCE_REQUEST,
  GET_SUGGEST_RESOURCE_SUCCESS,
  GET_SUGGEST_RESOURCE_FAILURE,
  GET_SUGGEST_CLASSES_REQUEST,
  GET_SUGGEST_CLASSES_SUCCESS,
  GET_SUGGEST_CLASSES_FAILURE,
  GET_SUGGEST_SYSTEM_TABLE_REQUEST,
  GET_SUGGEST_SYSTEM_TABLE_SUCCESS,
  GET_SUGGEST_SYSTEM_TABLE_FAILURE,
  GET_SUGGEST_LOOKUP_NAME_REQUEST,
  GET_SUGGEST_LOOKUP_NAME_SUCCESS,
  GET_SUGGEST_LOOKUP_NAME_FAILURE,
  GET_SUGGEST_LOOKUP_VALUE_REQUEST,
  GET_SUGGEST_LOOKUP_VALUE_SUCCESS,
  GET_SUGGEST_LOOKUP_VALUE_FAILURE,
  GET_METADATA_HIERARCHY_REQUEST,
  GET_METADATA_HIERARCHY_SUCCESS,
  GET_METADATA_HIERARCHY_FAILURE,
  TOOGLE_CONTEXT_VARIABLE_MODAL,
} from 'constants/action';

import {
  hideLoader, showLoader
} from 'utils/loader';

import _ from 'lodash';

const initialState = {
  MlsContextVariables: {
  },
  MlsAddContextData: {
    isLoading: false
  },
  MlsUpdateContextData: {
    isLoading: false
  },
  MlsDeleteContextData: {
    isLoading: false
  },
  MlsSuggestResource: {
    isLoading: false
  },
  MlsSuggestClasses: {
    isLoading: false
  },
  MlsSuggestSystemTable: {
    isLoading: false
  },
  MlsSuggestLookupName: {
    isLoading: false
  },
  MlsSuggestLookupValue: {
    isLoading: false
  },
  MlsHierarchy: {
    isLoading: false
  },
  isOpenNewContextModal: false,
  contextVariableName: ''
}

export default function MLSContextVariableReducer(state: Object = initialState, action: Object) {
  const newState = _.cloneDeep(state);
  switch(action.type) {

    case GET_CONTEXT_VARIABLES_REQUEST:
      showLoader();
      return requestData(state, 'MlsContextVariables');

    case GET_CONTEXT_VARIABLES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsContextVariables');

    case GET_CONTEXT_VARIABLES_FAILURE:
      hideLoader();
      newState.MlsContextVariables.payload = [];
      return failureData(newState, action.error, 'MlsContextVariables');

    case ADD_NEW_CONTEXT_VARIABLE_REQUEST:
      showLoader();
      return requestData(state, 'MlsAddContextData');

    case ADD_NEW_CONTEXT_VARIABLE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsAddContextData');

    case ADD_NEW_CONTEXT_VARIABLE_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsAddContextData');

    case UPDATE_CONTEXT_VARIABLE_REQUEST:
      showLoader();
      return requestData(state, 'MlsUpdateContextData');

    case UPDATE_CONTEXT_VARIABLE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsUpdateContextData');

    case UPDATE_CONTEXT_VARIABLE_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsUpdateContextData');

    case DELETE_CONTEXT_VARIABLES_REQUEST:
      showLoader();
      return requestData(state, 'MlsDeleteContextData');

    case DELETE_CONTEXT_VARIABLES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsDeleteContextData');

    case DELETE_CONTEXT_VARIABLES_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsDeleteContextData');

    case GET_SUGGEST_RESOURCE_REQUEST:
      showLoader();
      return requestData(state, 'MlsSuggestResource');

    case GET_SUGGEST_RESOURCE_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSuggestResource');

    case GET_SUGGEST_RESOURCE_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsSuggestResource');

    case GET_SUGGEST_CLASSES_REQUEST:
      showLoader();
      return requestData(state, 'MlsSuggestClasses');

    case GET_SUGGEST_CLASSES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsSuggestClasses');

    case GET_SUGGEST_CLASSES_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'MlsSuggestClasses');

      case GET_SUGGEST_SYSTEM_TABLE_REQUEST:
        showLoader();
        return requestData(state, 'MlsSuggestSystemTable');

      case GET_SUGGEST_SYSTEM_TABLE_SUCCESS:
        hideLoader();
        return successData(state, action.data, 'MlsSuggestSystemTable');

      case GET_SUGGEST_SYSTEM_TABLE_FAILURE:
        hideLoader();
        return failureData(state, action.data, 'MlsSuggestSystemTable');

      case GET_SUGGEST_LOOKUP_NAME_REQUEST:
        showLoader();
        return requestData(state, 'MlsSuggestLookupName');

      case GET_SUGGEST_LOOKUP_NAME_SUCCESS:
        hideLoader();
        return successData(state, action.data, 'MlsSuggestLookupName');

      case GET_SUGGEST_LOOKUP_NAME_FAILURE:
        hideLoader();
        return failureData(state, action.data, 'MlsSuggestLookupName');

      case GET_SUGGEST_LOOKUP_VALUE_REQUEST:
        showLoader();
        return requestData(state, 'MlsSuggestLookupValue');

      case GET_SUGGEST_LOOKUP_VALUE_SUCCESS:
        hideLoader();
        return successData(state, action.data, 'MlsSuggestLookupValue');

      case GET_SUGGEST_LOOKUP_VALUE_FAILURE:
        hideLoader();
        return failureData(state, action.data, 'MlsSuggestLookupValue');

      case GET_METADATA_HIERARCHY_REQUEST:
        showLoader();
        return requestData(state, 'MlsHierarchy');

      case GET_METADATA_HIERARCHY_SUCCESS:
        hideLoader();
        return successData(state, action.data, 'MlsHierarchy');

      case GET_METADATA_HIERARCHY_FAILURE:
        hideLoader();
        return failureData(state, action.data, 'MlsHierarchy');

      case TOOGLE_CONTEXT_VARIABLE_MODAL:
        newState.isOpenNewContextModal = !newState.isOpenNewContextModal
        newState.contextVariableName = action.contextVariableName;
        return newState;

    default:
      return state;
  }
}
