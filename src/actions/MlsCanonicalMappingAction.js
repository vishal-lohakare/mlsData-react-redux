// @flow

import { API } from 'utils/API';
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
  CLEAR_MAPPED_FIELDS,
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
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
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
} from 'constants/action';

import type { Dispatch } from 'react-redux';

export const clearMappedFields = () => {
  return({
    type: CLEAR_MAPPED_FIELDS
  });
}

export const getCanonicalFields = (downloadType: string, MlsId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_CANONICAL_FIELDS_REQUEST, GET_CANONICAL_FIELDS_SUCCESS, GET_CANONICAL_FIELDS_FAILURE],
      callAPI: () => new API().get(`/mls-canonical-fields?downloadType=${downloadType}&mlsId=${MlsId}`, false)
  })
 }
}

export const getSampleData = (source: string, sampleFileType: string, rawField: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_RAWFIELD_SAMPLE_DATA_REQUEST, GET_RAWFIELD_SAMPLE_DATA_SUCCESS, GET_RAWFIELD_SAMPLE_DATA_FAILURE],
      callAPI: () => new API().get(`/sample-data/${source}/${sampleFileType}/${rawField}`, false)
  })
 }
}

export const getMappedFields = (source: string = '', selectedField: string, downloadType: string = '') => {
  const finalUrl = Object.is(downloadType, '') ? `/mls-canonical-fields/${source}/mappings/${selectedField}` : `/mls-canonical-fields/${source}/mappings/${selectedField}?downloadType=${downloadType}`;
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MAPPED_FIELDS_REQUEST, GET_MAPPED_FIELDS_SUCCESS, GET_MAPPED_FIELDS_FAILURE],
      callAPI: () => new API().get(finalUrl, false)
  })
 }
}

export const postMappedFields = (source: string, selectedField: string, data: string, downloadType: string, MlsId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [UPDATE_MAPPED_FIELDS_REQUEST, UPDATE_MAPPED_FIELDS_SUCCESS, UPDATE_MAPPED_FIELDS_FAILURE],
      callAPI: () => new API().post(`/mls-canonical-fields/${source}/mappings/${selectedField}`, false, data),
      handleSuccess: () => {
        dispatch(getCanonicalFields(downloadType, MlsId));
        dispatch(getCanonicalMappings(source, downloadType));
        dispatch(getMappedFields(source, selectedField, downloadType));
      }
  })
 }
}

export const updateMappedFields = (source: string, selectedField: string, data: string, downloadType: string, MlsId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [UPDATE_MAPPED_FIELDS_REQUEST, UPDATE_MAPPED_FIELDS_SUCCESS, UPDATE_MAPPED_FIELDS_FAILURE],
      callAPI: () => new API().put(`/mls-canonical-fields/${source}/mappings/${selectedField}`, false, data),
      handleSuccess: () => {
        dispatch(getCanonicalFields(downloadType, MlsId));
        dispatch(getCanonicalMappings(source, downloadType));
        dispatch(getMappedFields(source, selectedField, downloadType));
      }
  })
 }
}

export const getAvailableFunctions = (source: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_AVAILABLE_FUNCTIONS_REQUEST, GET_AVAILABLE_FUNCTIONS_SUCCESS, GET_AVAILABLE_FUNCTIONS_FAILURE],
      callAPI: () => new API().get(`/mls-canonical-fields/${source}/mappings/functions`, false)
  })
 }
}

export const getAutoCompleteFunctions = () => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_AUTOCOMPLETE_FUNCTIONS_REQUEST, GET_AUTOCOMPLETE_FUNCTIONS_SUCCESS, GET_AUTOCOMPLETE_FUNCTIONS_FAILURE],
      callAPI: () => new API().get(`/mls-canonical-fields/transformations`, false)
  })
 }
}

export const startSparkSession = () => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_START_SPARK_REQUEST, GET_START_SPARK_SUCCESS, GET_START_SPARK_FAILURE],
      callAPI: () => new API().get(`/temporal-data-frame`, false),
    })
  }
}

export const postUuid = (source: string, downloadType?: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_UUID_REQUEST, POST_UUID_SUCCESS, POST_UUID_FAILURE],
      callAPI: () => new API().post(`/temporal-data-frame`, false, JSON.stringify({
          "source": source,
          "type": "raw",
          downloadType
      })),

  })
 }
}

export const postTransformationPreview = (uuid: string, expr: string, columnName: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_TRANSFORMATION_PREVIEW_REQUEST, POST_TRANSFORMATION_PREVIEW_SUCCESS, POST_TRANSFORMATION_PREVIEW_FAILURE],
      callAPI: () => new API().post(`/temporal-data-frame/${uuid}`, false, JSON.stringify({
        "columnName": columnName,
        "expr": expr
      })),

  })
 }
}

export const getDownloadTypeList = () => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [
        GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST,
        GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
        GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE
      ],
      callAPI: () => new API().get(`/download/common-type`, false)
  })
 }
}

export const deleteMapping = (mappingId: number, downloadType: string, mlsId: number, source: string, selectedField: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [DELETE_CANONICAL_MAPPING_REQUEST,DELETE_CANONICAL_MAPPING_SUCCESS,DELETE_CANONICAL_MAPPING_FAILURE],
      callAPI: () => new API().delete(`/mls-canonical-fields/${source}/mappings/${mappingId}`, false),
      handleSuccess: () => {
        dispatch(getCanonicalFields(downloadType, mlsId));
        dispatch(getMappedFields(source, selectedField, downloadType));
        dispatch(getCanonicalMappings(source, downloadType));
      }
    })
  }
}

export const getAutoCompleteOptions = (source: string = '') => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_AUTOCOMPLETE_OPTIONS_REQUEST, GET_AUTOCOMPLETE_OPTIONS_SUCCESS, GET_AUTOCOMPLETE_OPTIONS_FAILURE],
      callAPI: () => new API().post(`/options`, false, JSON.stringify({
          'query': {
              'type': 'completions',
              'file': 'myfile',
              'end': { 'line': 0, 'ch': source.length },
              'types': true,
              'sort': true,
              'guess': true,
              'docs': true,
              'urls': true,
              'origins': true,
              'lineCharPositions': true,
              'caseInsensitive': true
          },
          'files': [{
              'type': 'full',
              'name': 'myfile',
              'text': source
          }]
      }), true)
  })
 }
}

export const getCanonicalMappings = (source: string, downloadType: string) => {
  return {
    types: [GET_CANONICAL_MAPPING_REQUEST, GET_CANONICAL_MAPPING_SUCCESS, GET_CANONICAL_MAPPING_FAILURE],
    callAPI: () => new API().get(`/mls-canonical-fields/${source}/mappings/all/${downloadType}`, false)
  }
}


export const getAutoMappings = (mlsId: number, downloadType: string) => {
  return {
    types: [GET_AUTO_MAPPINGS_REQUEST, GET_AUTO_MAPPINGS_SUCCESS, GET_AUTO_MAPPINGS_FAILURE],
    callAPI: () => new API().get(`/mls-auto-mapped-canonical-fields/${mlsId}/${downloadType}`, false)
  }
}

export const saveAutoMappings = (mlsId: number, queryData: Array<Object>) => {
  return {
    types: [POST_AUTO_MAPPINGS_REQUEST, POST_AUTO_MAPPINGS_SUCCESS, POST_AUTO_MAPPINGS_FAILURE],
    callAPI: () => new API().post(`/mls-auto-mapped-canonical-fields/${mlsId}/bulkInsertMapping`, false, JSON.stringify(queryData))
  }
}
