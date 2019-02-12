// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  GET_DATA_CONSTRAINTS_REQUEST,
  GET_DATA_CONSTRAINTS_SUCCESS,
  GET_DATA_CONSTRAINTS_FAILURE,
  ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST,
  ENABLE_DISABLE_DATA_CONSTRAINT_SUCCESS,
  ENABLE_DISABLE_DATA_CONSTRAINT_FAILURE,
  GET_MLS_NAMES_REQUEST,
  GET_MLS_NAMES_SUCCESS,
  GET_MLS_NAMES_FAILURE,
  GET_CONSTRAINT_PHASES_REQUEST,
  GET_CONSTRAINT_PHASES_SUCCESS,
  GET_CONSTRAINT_PHASES_FAILURE,
  GET_CONSTRAINT_FIELDS_REQUEST,
  GET_CONSTRAINT_FIELDS_SUCCESS,
  GET_CONSTRAINT_FIELDS_FAILURE,
  GET_CONSTRAINT_FIELD_VALUES_REQUEST,
  GET_CONSTRAINT_FIELD_VALUES_SUCCESS,
  GET_CONSTRAINT_FIELD_VALUES_FAILURE,
  GET_CONSTRAINT_FIELD_METRICS_REQUEST,
  GET_CONSTRAINT_FIELD_METRICS_SUCCESS,
  GET_CONSTRAINT_FIELD_METRICS_FAILURE,
  GET_CONSTRAINT_EXPRESSION_REQUEST,
  GET_CONSTRAINT_EXPRESSION_SUCCESS,
  GET_CONSTRAINT_EXPRESSION_FAILURE,
  CREATE_CONSTRAINT_REQUEST,
  CREATE_CONSTRAINT_SUCCESS,
  CREATE_CONSTRAINT_FAILURE,
  EDIT_CONSTRAINT_REQUEST,
  EDIT_CONSTRAINT_SUCCESS,
  EDIT_CONSTRAINT_FAILURE,
} from 'constants/action';
import { showLoader, hideLoader } from 'utils/loader';

const initialState = {
  MlsConstraintsInfo: {
    isLoading: false
  },
  MlsNames: {
    isLoading: false,
    payload: [],
  },
  ConstraintPhases: {
    isLoading: false,
    payload: []
  },
  ConstraintFields: {
    isLoading: false,
    payload: []
  },
  ConstraintFieldValues: {
    isLoading: false,
    payload: []
  },
  ConstraintFieldMetrics: {
    isLoading: false,
    payload: []
  },
  ConstraintExpression: {
    isLoading: false,
    payload: []
  },
  CreateConstraint: {
    isLoading: false
  },
  EditConstraint: {
    isLoading: false
  },
  MlsConstraintUpdateInfo: {
    isLoading: false
  }
};

export default function MLSDataConstraintsReducer(state: Object = initialState, action: Object) {

  switch(action.type) {
    case GET_DATA_CONSTRAINTS_REQUEST:
      showLoader();
      return requestData(state, 'MlsConstraintsInfo');

    case GET_DATA_CONSTRAINTS_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsConstraintsInfo');

    case GET_DATA_CONSTRAINTS_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsConstraintsInfo');

    case ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST:
      showLoader();
      return requestData(state, 'MlsConstraintUpdateInfo');

    case ENABLE_DISABLE_DATA_CONSTRAINT_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'MlsConstraintUpdateInfo');

    case ENABLE_DISABLE_DATA_CONSTRAINT_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'MlsConstraintUpdateInfo');

    case GET_MLS_NAMES_REQUEST:
      return requestData(state, 'MlsNames');

    case GET_MLS_NAMES_SUCCESS:
      return successData(state, action.data, 'MlsNames');

    case GET_MLS_NAMES_FAILURE:
      return failureData(state, action.error, 'MlsNames');

    case GET_CONSTRAINT_PHASES_REQUEST:
      return requestData(state, 'ConstraintPhases');

    case GET_CONSTRAINT_PHASES_SUCCESS:
      return successData(state, action.data, 'ConstraintPhases');

    case GET_CONSTRAINT_PHASES_FAILURE:
      return failureData(state, action.error, 'ConstraintPhases');

    case GET_CONSTRAINT_FIELDS_REQUEST:
      return requestData(state, 'ConstraintFields');

    case GET_CONSTRAINT_FIELDS_SUCCESS:
      return successData(state, action.data, 'ConstraintFields');

    case GET_CONSTRAINT_FIELDS_FAILURE:
      return failureData(state, action.error, 'ConstraintFields');

    case GET_CONSTRAINT_FIELD_VALUES_REQUEST:
      showLoader();
      return requestData(state, 'ConstraintFieldValues');

    case GET_CONSTRAINT_FIELD_VALUES_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'ConstraintFieldValues');

    case GET_CONSTRAINT_FIELD_VALUES_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'ConstraintFieldValues');

    case GET_CONSTRAINT_FIELD_METRICS_REQUEST:
      return requestData(state, 'ConstraintFieldMetrics');

    case GET_CONSTRAINT_FIELD_METRICS_SUCCESS:
      return successData(state, action.data, 'ConstraintFieldMetrics');

    case GET_CONSTRAINT_FIELD_METRICS_FAILURE:
      return failureData(state, action.error, 'ConstraintFieldMetrics');

    case GET_CONSTRAINT_EXPRESSION_REQUEST:
      return requestData(state, 'ConstraintExpression');

    case GET_CONSTRAINT_EXPRESSION_SUCCESS:
      return successData(state, action.data, 'ConstraintExpression');

    case GET_CONSTRAINT_EXPRESSION_FAILURE:
      return failureData(state, action.error, 'ConstraintExpression');

    case CREATE_CONSTRAINT_REQUEST:
      showLoader();
      return requestData(state, 'CreateConstraint');

    case CREATE_CONSTRAINT_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'CreateConstraint');

    case CREATE_CONSTRAINT_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'CreateConstraint');

    case EDIT_CONSTRAINT_REQUEST:
      showLoader();
      return requestData(state, 'EditConstraint');

    case EDIT_CONSTRAINT_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'EditConstraint');

    case EDIT_CONSTRAINT_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'EditConstraint');

    default:
      return state;
  }
}
