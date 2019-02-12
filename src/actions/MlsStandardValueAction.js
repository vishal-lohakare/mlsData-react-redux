// @flow

import type { Dispatch } from 'react-redux';
import _ from 'lodash';

import { API } from 'utils/API';
import {
  GET_STANDARD_VALUES_REQUEST,
  GET_STANDARD_VALUES_SUCCESS,
  GET_STANDARD_VALUES_FAILURE,
  GET_MAPPED_VALUES_REQUEST,
  GET_MAPPED_VALUES_SUCCESS,
  GET_MAPPED_VALUES_FAILURE,
  GET_UNMAPPED_VALUES_REQUEST,
  GET_UNMAPPED_VALUES_SUCCESS,
  GET_UNMAPPED_VALUES_FAILURE,
  POST_MAPPED_VALUES_REQUEST,
  POST_MAPPED_VALUES_SUCCESS,
  POST_MAPPED_VALUES_FAILURE,
  POST_UNMAPPED_VALUES_REQUEST,
  POST_UNMAPPED_VALUES_SUCCESS,
  POST_UNMAPPED_VALUES_FAILURE,
  DELETE_MAPPED_VALUES_REQUEST,
  DELETE_MAPPED_VALUES_SUCCESS,
  DELETE_MAPPED_VALUES_FAILURE,
  DELETE_UNMAPPED_VALUES_REQUEST,
  DELETE_UNMAPPED_VALUES_SUCCESS,
  DELETE_UNMAPPED_VALUES_FAILURE,
  GET_MLSINFO_SOURCE_REQUEST,
  GET_MLSINFO_SOURCE_SUCCESS,
  GET_MLSINFO_SOURCE_FAILURE,
  GET_MLS_CANONICAL_FIELDS_REQUEST,
  GET_MLS_CANONICAL_FIELDS_SUCCESS,
  GET_MLS_CANONICAL_FIELDS_FAILURE,
  POST_NEW_STANDARD_VALUE_REQUEST,
  POST_NEW_STANDARD_VALUE_SUCCESS,
  POST_NEW_STANDARD_VALUE_FAILURE,
  GET_SEARCH_STANDARD_VALUES_REQUEST,
  GET_SEARCH_STANDARD_VALUES_SUCCESS,
  GET_SEARCH_STANDARD_VALUES_FAILURE,
  GET_SEARCH_MAPPED_VALUES_REQUEST,
  GET_SEARCH_MAPPED_VALUES_SUCCESS,
  GET_SEARCH_MAPPED_VALUES_FAILURE,
  GET_SEARCH_UNMAPPED_VALUES_REQUEST,
  GET_SEARCH_UNMAPPED_VALUES_SUCCESS,
  GET_SEARCH_UNMAPPED_VALUES_FAILURE,
} from 'constants/action';
import { STANDARDVALUESLIMIT, UNMAPPEDVALUESLIMIT, MAPPEDVALUESLIMIT } from 'constants/global';

const convertDataToPost = (data: Array<Object>, sourceMls: string, fieldType: string, isMappedData: boolean = false, standardValueId:number = -1) => {
  let postData = [];
  let tempObj = {

  }
  _.map(data, (item) => {

    tempObj = {
      source: sourceMls,
      fieldType: fieldType,
      value: item.value,
    }

    if(isMappedData) {
      tempObj = {
        ...tempObj,
        standardValueId: standardValueId,
        enteredBy: 0
      }
    }
    postData.push(tempObj)
  })
  return postData;
}

const getDeletedValueId = (data: Array<Object>) => {
  let deletedId = [];
  _.map(data, (item) => {
    deletedId.push(item.id.toString());
  })
  return deletedId;
}

export const getStandardValues = (fieldType: string, pageNumber: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_STANDARD_VALUES_REQUEST, GET_STANDARD_VALUES_SUCCESS, GET_STANDARD_VALUES_FAILURE],
      callAPI: () => new API().get(`/standard-value?fieldType=${fieldType}&limit=${STANDARDVALUESLIMIT}&offset=${STANDARDVALUESLIMIT * pageNumber}`, false)
    })
  }
}

export const searchStandardValues = (fieldType: string, searchQuery: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SEARCH_STANDARD_VALUES_REQUEST, GET_SEARCH_STANDARD_VALUES_SUCCESS, GET_SEARCH_STANDARD_VALUES_FAILURE],
      callAPI: () => new API().get(`/standard-value/search/?searchString=${searchQuery}&fieldType=${fieldType}`, false)
    })
  }
}

export const getMappedValues = (standardValueId: number, mlsName: string, fieldTypeValue: string, pageNumber: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MAPPED_VALUES_REQUEST, GET_MAPPED_VALUES_SUCCESS, GET_MAPPED_VALUES_FAILURE],
      callAPI: () => new API().get(`/standard-value-map?fieldType=${fieldTypeValue}&mls=${mlsName}&standardValueId=${standardValueId}&limit=${MAPPEDVALUESLIMIT}&offset=${MAPPEDVALUESLIMIT * pageNumber}`, false)
    })
  }
}

export const searchMappedValues = (standardValueId: number, mlsName: string, fieldTypeValue: string, pageNumber: number, searchQuery: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SEARCH_MAPPED_VALUES_REQUEST, GET_SEARCH_MAPPED_VALUES_SUCCESS, GET_SEARCH_MAPPED_VALUES_FAILURE],
      callAPI: () => new API().get(`/standard-value-map/search?fieldType=${fieldTypeValue}&mls=${mlsName}&standardValueId=${standardValueId}&searchString=${searchQuery}&limit=${MAPPEDVALUESLIMIT}&offset=${MAPPEDVALUESLIMIT * pageNumber}`, false)
    })
  }
}

export const getUnmappedValues = (fieldType: string, sourceMls: string, pageNumber: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_UNMAPPED_VALUES_REQUEST, GET_UNMAPPED_VALUES_SUCCESS, GET_UNMAPPED_VALUES_FAILURE],
      callAPI: () => new API().get(`/unmapped-value/multiple/?fieldType=${fieldType}&source=${sourceMls}&limit=${UNMAPPEDVALUESLIMIT}&offset=${UNMAPPEDVALUESLIMIT * pageNumber}`, false)
    })
  }
}

export const searchUnmappedValues = (fieldType: string, sourceMls: string, pageNumber: number, searchQuery: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SEARCH_UNMAPPED_VALUES_REQUEST, GET_SEARCH_UNMAPPED_VALUES_SUCCESS, GET_SEARCH_UNMAPPED_VALUES_FAILURE],
      callAPI: () => new API().get(`/unmapped-value/search?fieldType=${fieldType}&source=${sourceMls}&searchString=${searchQuery}&limit=${UNMAPPEDVALUESLIMIT}&offset=${UNMAPPEDVALUESLIMIT * pageNumber}`, false)
    })
  }
}

export const postMappedValues = (mappedData: Array<Object>, fieldType: string, sourceMls: string, standardValueId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MAPPED_VALUES_REQUEST, POST_MAPPED_VALUES_SUCCESS, POST_MAPPED_VALUES_FAILURE],
      callAPI: () => new API().post('/standard-value-map/bulk', false, JSON.stringify(
        convertDataToPost(mappedData, sourceMls, fieldType, true, standardValueId)
      )),
      handleSuccess: () => {
        dispatch(getMappedValues(standardValueId, sourceMls, fieldType, 0));
        dispatch(deleteUnmappedValues(mappedData, fieldType, sourceMls));
      }
    })
  }
}

export const postUnmappedValues = (unmappedData: Array<Object>, fieldType: string, sourceMls: string, standardValueId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_UNMAPPED_VALUES_REQUEST, POST_UNMAPPED_VALUES_SUCCESS, POST_UNMAPPED_VALUES_FAILURE],
      callAPI: () => new API().post('/unmapped-value/multiple', false, JSON.stringify(
        convertDataToPost(unmappedData, sourceMls, fieldType)
      )),
      handleSuccess: () => {
        dispatch(getUnmappedValues(fieldType, sourceMls, 0));
        dispatch(deleteMappedValues(unmappedData, fieldType, sourceMls, standardValueId));
      }
    })
  }
}

export const deleteMappedValues = (deletedMappedData: Array<Object>, fieldType: string, sourceMls: string, standardValueId: number) => {
  const deletedId = getDeletedValueId(deletedMappedData);
  return(dispatch: Dispatch) => {
    dispatch({
      types: [DELETE_MAPPED_VALUES_REQUEST, DELETE_MAPPED_VALUES_SUCCESS, DELETE_MAPPED_VALUES_FAILURE],
      callAPI: () => new API().delete('/standard-value-map', false, deletedId),
      handleSuccess: () => {
        dispatch(getMappedValues(standardValueId, sourceMls, fieldType, 0));
      }
    })
  }
}

export const deleteUnmappedValues = (deletedUnmappedData: Array<Object>, fieldType: string, sourceMls: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [DELETE_UNMAPPED_VALUES_REQUEST, DELETE_UNMAPPED_VALUES_SUCCESS, DELETE_UNMAPPED_VALUES_FAILURE],
      callAPI: () => new API().delete('/unmapped-value/multiple', false, deletedUnmappedData),
      handleSuccess: () => {
        dispatch(getUnmappedValues(fieldType, sourceMls, 0));
      }
    })
  }
}

export const getMlsInfoSource = () => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MLSINFO_SOURCE_REQUEST, GET_MLSINFO_SOURCE_SUCCESS, GET_MLSINFO_SOURCE_FAILURE],
      callAPI: () => new API().get('/mls-info/source', false)
    })
  }
}

export const getMlsCananicalFields = (isStandardizable: boolean) => {
  const standardizable = isStandardizable ? `?standardizable=${isStandardizable.toString()}` : '';
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MLS_CANONICAL_FIELDS_REQUEST, GET_MLS_CANONICAL_FIELDS_SUCCESS, GET_MLS_CANONICAL_FIELDS_FAILURE],
      callAPI: () => new API().get(`/mls-canonical-fields${standardizable}`, false)
    })
  }
}

export const postStandardValue =(standardValue: string, fieldType: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_NEW_STANDARD_VALUE_REQUEST, POST_NEW_STANDARD_VALUE_SUCCESS, POST_NEW_STANDARD_VALUE_FAILURE],
      callAPI: () => new API().post('/standard-value', false, JSON.stringify({
        fieldType: fieldType,
        value: standardValue,
        enteredBy: 0,
      })),
      handleSuccess: () => {
        dispatch(getStandardValues(fieldType, 0));
      }
    })
  }
}
