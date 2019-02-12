// @flow

import { requestData, successData, failureData } from 'utils/reducerUtils';
import {
  GET_MLS_URL_REQUEST,
  GET_MLS_URL_SUCCESS,
  GET_MLS_URL_FAILURE,
  ADD_NEW_URL_DATA,
  UPDATE_MLS_URL_REQUEST,
  UPDATE_MLS_URL_SUCCESS,
  UPDATE_MLS_URL_FAILURE,
  SAVE_MLS_URL_REQUEST,
  SAVE_MLS_URL_SUCCESS,
  SAVE_MLS_URL_FAILURE,
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
  GET_MLS_URL_TEMPLATES_FAILURE,
} from 'constants/action';

import _ from 'lodash';

import {
  hideLoader, showLoader
} from 'utils/loader';

const initialState = {
    UrlData: [],
    UrlSavedData: {
      isLoading: false,
    },
    GetUrlData: {
      isLoading: false,
    },
    PreviewRawData: {
      isLoading: false,
      payload: {
        Columns: '',
        Data: []
      }
    },
    MlsPlaceHolderValues: {
      isLoading: false
    },
    MlsUrlTemplates: {
      isLoading: false,
      payload: []
    }
}

const transformUrlData = (newData, requestType="new") => {
  if(_.isArray(newData)) {
    let tempData = [];
    _.map(newData, (item) => {
      tempData.push({
        isUpdated: false,
        UrlDetails: {
          urlname: item.name,
          urlvalue: item.url,
          bodyTextValue: item.body,
          bodyType: item.bodyType,
          id: item.id,
          downloadType: item.downloadType,
          sourceId: item.mlsInfoId,
          isActive: item.isActive
        },
        HeaderDetails: item.mlsUrlHeaderDto
      })
    })
    return tempData;
  } else {
    const tempData = {
      isUpdated: false,
      UrlDetails: {
        urlname: newData.name,
        urlvalue: newData.url,
        bodyTextValue: newData.body,
        bodyType: newData.bodyType,
        id: newData.id,
        downloadType: newData.downloadType,
        sourceId: newData.mlsInfoId,
        isActive: newData.isActive
      },
      HeaderDetails: newData.mlsUrlHeaderDto
    }
    const successFlag = requestType === "new" ? { newEntry : true, updatedEntry : false } : { updatedEntry : true, newEntry : false } ;
    return {
        ...tempData,
        ...successFlag
    }
  }
}

export default function MLSUrlBuilderReducer(state: Object = initialState, action: Object) {
  const newState = _.cloneDeep(state);
  switch(action.type) {
    case ADD_NEW_URL_DATA:
      newState.UrlData.push({
        isUpdated: false,
        isNewUrl: true,
        UrlDetails: {
          urlname: '',
          urlvalue: '',
          bodyTextValue: '',
          bodyType: ''
        },
        HeaderDetails: []
      })
      return {
        ...newState
      };

    case DELETE_NEW_URL_DATA:
      newState.UrlData.splice(action.data, 1);
      return {
        ...newState
      };

    case GET_MLS_URL_REQUEST:
      showLoader();
      return requestData(state, 'GetUrlData');

    case GET_MLS_URL_SUCCESS:
      hideLoader();
      newState.UrlData = transformUrlData(action.data.payload);
      return successData(newState, action.data, 'GetUrlData');

    case GET_MLS_URL_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'GetUrlData');

    case UPDATE_MLS_URL_REQUEST:
      showLoader();
      return requestData(state, 'UrlSavedData');

    case UPDATE_MLS_URL_SUCCESS:
      hideLoader();
      _.map(newState.UrlData, (item, index) => {
          if(item.UrlDetails.id===action.data.payload.id) {
            newState.UrlData[index] = transformUrlData(action.data.payload, "update")
          }
        });
       return successData(newState, action.data, 'UrlSavedData');

    case UPDATE_MLS_URL_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'UrlSavedData');

    case SAVE_MLS_URL_REQUEST:
      showLoader();
      return requestData(state, 'UrlSavedData');

    case SAVE_MLS_URL_SUCCESS:
      hideLoader();
      newState.UrlData[newState.UrlData.length - 1] = transformUrlData(action.data.payload)
      return successData(newState, action.data, 'UrlSavedData');

    case SAVE_MLS_URL_FAILURE:
      hideLoader();
      return failureData(state, action.data, 'UrlSavedData');

    case DELETE_URL_HEADER_REQUEST:
    case DELETE_MLS_URL_REQUEST:
      showLoader();
      return state;

    case DELETE_URL_HEADER_SUCCESS:
    case DELETE_MLS_URL_SUCCESS:
      hideLoader();
      return state;

    case DELETE_URL_HEADER_FAILURE:
    case DELETE_MLS_URL_FAILURE:
      hideLoader();
      return state

    case GET_MLS_PREVIEW_PHOTO_DATA_REQUEST:
    case GET_MLS_PREVIEW_RAW_DATA_REQUEST:
      showLoader();
      return requestData(state, 'PreviewRawData');

    case GET_MLS_PREVIEW_PHOTO_DATA_SUCCESS:
    case GET_MLS_PREVIEW_RAW_DATA_SUCCESS:
      hideLoader();
      return successData(state, action.data, 'PreviewRawData');

    case GET_MLS_PREVIEW_PHOTO_DATA_FAILURE:
    case GET_MLS_PREVIEW_RAW_DATA_FAILURE:
      hideLoader();
      return failureData(state, action.error, 'PreviewRawData');

    case GET_MLS_URL_PLACEHOLDER_VALUES_REQUEST:
      return requestData(state, 'MlsPlaceHolderValues');

    case GET_MLS_URL_PLACEHOLDER_VALUES_SUCCESS:
      return successData(state, action.data, 'MlsPlaceHolderValues');

    case GET_MLS_URL_PLACEHOLDER_VALUES_FAILURE:
      return failureData(state, action.error, 'MlsPlaceHolderValues');

    case GET_MLS_URL_TEMPLATES_REQUEST:
      return requestData(state, 'MlsUrlTemplates');

    case GET_MLS_URL_TEMPLATES_SUCCESS:
      return successData(state, action.data, 'MlsUrlTemplates');

    case GET_MLS_URL_TEMPLATES_FAILURE:
      return failureData(state, action.error, 'MlsUrlTemplates');

    default:
      return state;
  }
}
