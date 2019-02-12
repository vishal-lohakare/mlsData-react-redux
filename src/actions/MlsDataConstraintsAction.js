// @flow

import { API } from 'utils/API';
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
} from 'constants/action.js';

export const getDataConstraintsList = () => {
  return({
    types: [GET_DATA_CONSTRAINTS_REQUEST, GET_DATA_CONSTRAINTS_SUCCESS, GET_DATA_CONSTRAINTS_FAILURE],
    callAPI: () => new API().get(`/data-constraint`, false)
  })
}

export const enableDisableConstraint = (data: Object) => {
  return({
      types: [ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST, ENABLE_DISABLE_DATA_CONSTRAINT_SUCCESS, ENABLE_DISABLE_DATA_CONSTRAINT_FAILURE],
      callAPI: () => new API().put(`/data-constraint`, false, JSON.stringify(data)),
  })
}

export const getMlsNames = () => {
  return({
    types: [GET_MLS_NAMES_REQUEST, GET_MLS_NAMES_SUCCESS, GET_MLS_NAMES_FAILURE],
    callAPI: () => new API().get("/mls-info/source", false)
  })
}

export const getConstraintPhases = () => {
  return({
    types: [GET_CONSTRAINT_PHASES_REQUEST, GET_CONSTRAINT_PHASES_SUCCESS, GET_CONSTRAINT_PHASES_FAILURE],
    callAPI: () => new API().get("/download/phase-type", false)
  })
}

export const getConstraintFields = () => {
  return({
    types: [GET_CONSTRAINT_FIELDS_REQUEST, GET_CONSTRAINT_FIELDS_SUCCESS, GET_CONSTRAINT_FIELDS_FAILURE],
    callAPI: () => new API().get("/data-constraint/fields", false)
  })
}

export const getConstraintFieldValues = (ids: string) => {
  return({
    types: [GET_CONSTRAINT_FIELD_VALUES_REQUEST, GET_CONSTRAINT_FIELD_VALUES_SUCCESS, GET_CONSTRAINT_FIELD_VALUES_FAILURE],
    callAPI: () => new API().get(`/data-constraint/fields/values?ids=${encodeURIComponent(ids)}`, false)
  })
}

export const getConstraintFieldMetrics = () => {
  return({
    types: [GET_CONSTRAINT_FIELD_METRICS_REQUEST, GET_CONSTRAINT_FIELD_METRICS_SUCCESS, GET_CONSTRAINT_FIELD_METRICS_FAILURE],
    callAPI: () => new API().get("/data-constraint/fields/metrics", false)
  })
}

export const getConstraintExpression = () => {
  return({
    types: [GET_CONSTRAINT_EXPRESSION_REQUEST, GET_CONSTRAINT_EXPRESSION_SUCCESS, GET_CONSTRAINT_EXPRESSION_FAILURE],
    callAPI: () => new API().get("/data-constraint/expression/key-words", false)
  })
}

export const createConstraint = (postQuery: Object) => {
  return({
    types: [CREATE_CONSTRAINT_REQUEST, CREATE_CONSTRAINT_SUCCESS, CREATE_CONSTRAINT_FAILURE],
    callAPI: () => new API().post("/data-constraint", false, JSON.stringify(postQuery))
  })
}

export const editConstraint = (postQuery: Object) => {
  return({
    types: [EDIT_CONSTRAINT_REQUEST, EDIT_CONSTRAINT_SUCCESS, EDIT_CONSTRAINT_FAILURE],
    callAPI: () => new API().put("/data-constraint", false, JSON.stringify(postQuery))
  })
}
