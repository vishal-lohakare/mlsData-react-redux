// @flow

import { API } from 'utils/API';
import {
  POST_MLS_DATA_REQUEST,
  POST_MLS_DATA_SUCCESS,
  POST_MLS_DATA_FAILURE,
  SEARCH_MLS_REQUEST,
  SEARCH_MLS_SUCCESS,
  SEARCH_MLS_FAILURE,
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
} from 'constants/action.js'

import type { Dispatch } from 'react-redux';

export const searchMLSExist = (source: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [SEARCH_MLS_REQUEST, SEARCH_MLS_SUCCESS, SEARCH_MLS_FAILURE],
      callAPI: () => new API().get(`/mls-info/${source}?onlyExactMatch=true`, false)
    })
  }
}

export const downloadMetadata = (source: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MLS_DOWNLOAD_FILES_REQUEST, GET_MLS_DOWNLOAD_FILES_SUCCESS, GET_MLS_DOWNLOAD_FILES_FAILURE],
      callAPI: () => new API().get(`/mls-metadata/files/${source.toUpperCase()}`, false)
  })
 }
}

export const downloadUpdatedMetadata = (source: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MLS_DOWNLOAD_UPDATED_FILES_REQUEST, GET_MLS_DOWNLOAD_UPDATED_FILES_SUCCESS, GET_MLS_DOWNLOAD_UPDATED_FILES_FAILURE],
      callAPI: () => new API().post(`/mdp/metadata`, false, source.toUpperCase()),
      handleSuccess: () => {
        dispatch(downloadMetadata(source));
      }
  })
 }
}

export const postMLSInfo = (data: Object) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_DATA_REQUEST, POST_MLS_DATA_SUCCESS, POST_MLS_DATA_FAILURE],
      callAPI: () => new API().post('/mls-info', false, JSON.stringify({
        'id': data.id,
        'source': data.source,
        'loginId': data.username,
        'password': data.password,
        'loginUrl': data.loginURL,
        'userAgentId': data.userAgent,
        'userAgentPassword': data.userAgentPassword,
        'retsVersion': data.retsVersion,
      })),
    });
  }
}

export const clearConfigResult = () => {
  return {
    type: CLEAR_MLS_CONFIG_DATA,
  }
}

export const getMetaDataDownloadPreview = (source: string, offset: number, size: number, data: Object = {}) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_METADATA_DOWNLOAD_PREVIEW_REQUEST, GET_METADATA_DOWNLOAD_PREVIEW_SUCCESS, GET_METADATA_DOWNLOAD_PREVIEW_FAILURE],
      callAPI: () => new API().post(
        `/${source}/metadata?pageOffset=${offset}&pageSize=${size - 1}`, false, JSON.stringify(data))
  })
 }
}

export const getMetaDataLookupDownloadPreview = (source: string, offset: number, size: number, data: Object = {}) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_REQUEST, GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_SUCCESS, GET_METADATA_LOOKUP_DOWNLOAD_PREVIEW_FAILURE],
      callAPI: () => new API().post(
        `/${source}/metadata-lookup?pageOffset=${offset}&pageSize=${size - 1}`, false, JSON.stringify(data))
  })
 }
}

export const getPreviewColumnUniqueData = (source: string, columnName: string, isMetadata: boolean, data: Object = {}) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_PREVIEW_COL_UNIQUE_VALUES_REQUEST, GET_PREVIEW_COL_UNIQUE_VALUES_SUCCESS, GET_PREVIEW_COL_UNIQUE_VALUES_FAILURE],
      callAPI: () => new API().post(
        `/${source}/columns/${columnName}?isMetadata=${isMetadata.toString()}`, false, JSON.stringify(data))
  })
 }
}

export const postPreviewData = (source: string, previewData: Object) => {
  return(dispatch: Dispatch) => {
    dispatch({
      type: 'POST_PREVIEW_DATA',
      source,
      previewData
    });
  }
}