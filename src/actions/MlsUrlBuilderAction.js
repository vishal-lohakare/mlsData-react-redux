// @flow

import type { Dispatch } from 'react-redux';
import { API } from 'utils/API' ;
import _ from 'lodash';
import {
  GET_MLS_URL_REQUEST,
  GET_MLS_URL_SUCCESS,
  GET_MLS_URL_FAILURE,
  ADD_NEW_URL_DATA,
  SAVE_MLS_URL_REQUEST,
  SAVE_MLS_URL_SUCCESS,
  SAVE_MLS_URL_FAILURE,
  SAVE_MLS_LISTING_CALIBRATION_URL_REQUEST,
  SAVE_MLS_LISTING_CALIBRATION_URL_SUCCESS,
  SAVE_MLS_LISTING_CALIBRATION_URL_FAILURE,
  UPDATE_MLS_URL_REQUEST,
  UPDATE_MLS_URL_SUCCESS,
  UPDATE_MLS_URL_FAILURE,
  DELETE_URL_HEADER_REQUEST,
  DELETE_URL_HEADER_SUCCESS,
  DELETE_URL_HEADER_FAILURE,
  DELETE_MLS_URL_REQUEST,
  DELETE_MLS_URL_SUCCESS,
  DELETE_MLS_URL_FAILURE,
  DELETE_NEW_URL_DATA,
  GET_MLS_PREVIEW_RAW_DATA_REQUEST,
  GET_MLS_PREVIEW_RAW_DATA_SUCCESS,
  GET_MLS_PREVIEW_RAW_DATA_FAILURE,
  GET_MLS_PREVIEW_PHOTO_DATA_REQUEST,
  GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS,
  GET_MLS_PREVIEW_PHOTO_DATA_FAILURE,
  GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST,
  GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS,
  GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE,
  GET_MLS_URL_TEMPLATES_REQUEST,
  GET_MLS_URL_TEMPLATES_SUCCESS,
  GET_MLS_URL_TEMPLATES_FAILURE
} from 'constants/action';


export const addNewEmptyCard = () => {
  return {
    type: ADD_NEW_URL_DATA,
  }
}

export const deleteNewlyAddedCard = (index: number) => {
  return {
    type: DELETE_NEW_URL_DATA,
    data: index
  }
}

const convertHeaderToJson = (data: Object) => {
  let tempArray = [];
  let tempObj = {};
  _.map(data, (item) => {
    if(item.headerId) {
      tempObj = {headerKey: item.headerKey, headerValue: item.headerValue, isSelected: item.isSelected, headerId: item.headerId}
    } else {
      tempObj = {headerKey: item.headerKey, headerValue: item.headerValue, isSelected: item.isSelected}
    }
    tempArray.push(tempObj);
  })
  return tempArray;
}

export const saveListingCalibrationUrlData = (urlId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [SAVE_MLS_LISTING_CALIBRATION_URL_REQUEST, SAVE_MLS_LISTING_CALIBRATION_URL_SUCCESS, SAVE_MLS_LISTING_CALIBRATION_URL_FAILURE],
      callAPI: () => new API().post(`/mls-listing-download/price-ranges-calibration/${urlId}`, false, JSON.stringify({
        'type': 'FIX_NUM_SPLITS',
        'splitsNum': 4
        })
      )
    })
  }
}

export const saveUrlData = (data: Object, sourceId: number) => {
  const { urlname, urlvalue, bodyTextValue, downloadType } = data.UrlDetails;
  return(dispatch: Dispatch) => {
    dispatch({
      types: [SAVE_MLS_URL_REQUEST, SAVE_MLS_URL_SUCCESS, SAVE_MLS_URL_FAILURE],
      callAPI: () => new API().post('/mls-url', false, JSON.stringify({
        'name': urlname,
        'url': urlvalue,
        'mlsInfoId': sourceId,
        'body': bodyTextValue,
        'bodyType': 'string',
        'requestType': 'string',
        'downloadType': downloadType,
        'mlsUrlHeaderDto': convertHeaderToJson(data.HeaderDetails),
        })
      ),
      handleSuccess: (data: Object) => {
        downloadType === 'Listing' ? dispatch(saveListingCalibrationUrlData(data.id)) : '';
      }
    })
  }
}

export const updateUrlData = (data: Object, sourceId: number) => {
  const { id, urlname, urlvalue, bodyTextValue, downloadType } = data.UrlDetails;
  return(dispatch: Dispatch) => {
    dispatch({
      types: [UPDATE_MLS_URL_REQUEST, UPDATE_MLS_URL_SUCCESS, UPDATE_MLS_URL_FAILURE],
      callAPI: () => new API().put('/mls-url', false, JSON.stringify({
        'id': id,
        'name': urlname,
        'url': urlvalue,
        'mlsInfoId': sourceId,
        'body': bodyTextValue,
        'bodyType': 'string',
        'requestType': 'string',
        'downloadType': downloadType,
        'isActive': true,
        'mlsUrlHeaderDto': convertHeaderToJson(data.HeaderDetails),
        })
      ),
      handleSuccess: () => {
        downloadType === 'Listing' ? dispatch(saveListingCalibrationUrlData(id)) : '';
      }
    })
  }
}

export const getMlsUrl = (id: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MLS_URL_REQUEST, GET_MLS_URL_SUCCESS, GET_MLS_URL_FAILURE],
      callAPI: () => new API().get(`/mls-url/${id}`, false)
    })
  }
}

export const deleteMlsUrlHeader = (headerId: number, id: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [DELETE_URL_HEADER_REQUEST, DELETE_URL_HEADER_SUCCESS, DELETE_URL_HEADER_FAILURE],
      callAPI: () => new API().delete(`/mls-url/header/${headerId}`, false),
      handleSuccess: () => {
        dispatch(getMlsUrl(id));
      }
    })
  }
}

export const deleteMlsUrl = (urlId: number, id: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [DELETE_MLS_URL_REQUEST, DELETE_MLS_URL_SUCCESS, DELETE_MLS_URL_FAILURE],
      callAPI: () => new API().delete(`/mls-url/${urlId}`, false),
      handleSuccess: () => {
        dispatch(getMlsUrl(id));
      }
    })
  }
}

export const getMlsUrlPreview = (query: Object) => {
  const { source, urlId, urlvalue, downloadType } = query;
  return({
    types: [GET_MLS_PREVIEW_RAW_DATA_REQUEST, GET_MLS_PREVIEW_RAW_DATA_SUCCESS, GET_MLS_PREVIEW_RAW_DATA_FAILURE],
    callAPI: () => new API().get(`/preview/rawData?source=${source}&urlId=${urlId}&url=${encodeURIComponent(urlvalue)}&downloadType=${downloadType}`, false)
  });
}

export const getMlsUrlPhotoPreview = (query: Object, ) => {
  const { urlId } = query;
  return({
    types: [GET_MLS_PREVIEW_PHOTO_DATA_REQUEST, GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS, GET_MLS_PREVIEW_PHOTO_DATA_FAILURE],
    callAPI: () => new API().get(`/mls-photo-download/${urlId}`, false)
  });
}

export const getMlsUrlPlaceHolderValues = () => {
  return({
    types: [GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST, GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS, GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE],
    callAPI: () => new API().get(`/mls-context-variable/globals`, false)
  });
}

export const getMlsUrlTemplates = () => {
  return({
    types: [GET_MLS_URL_TEMPLATES_REQUEST, GET_MLS_URL_TEMPLATES_SUCCESS, GET_MLS_URL_TEMPLATES_FAILURE],
    callAPI: () => new API().get("/mls-url/url-template", false)
  });
}
