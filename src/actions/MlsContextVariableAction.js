// @flow

import type { Dispatch } from 'react-redux';
import _ from 'lodash';

import { API } from 'utils/API';
import {
  GET_CONTEXT_VARIABLES_REQUEST,
  GET_CONTEXT_VARIABLES_SUCCESS,
  GET_CONTEXT_VARIABLES_FAILURE,
  DELETE_CONTEXT_VARIABLES_REQUEST,
  DELETE_CONTEXT_VARIABLES_SUCCESS,
  DELETE_CONTEXT_VARIABLES_FAILURE,
  ADD_NEW_CONTEXT_VARIABLE_REQUEST,
  ADD_NEW_CONTEXT_VARIABLE_SUCCESS,
  ADD_NEW_CONTEXT_VARIABLE_FAILURE,
  UPDATE_CONTEXT_VARIABLE_REQUEST,
  UPDATE_CONTEXT_VARIABLE_SUCCESS,
  UPDATE_CONTEXT_VARIABLE_FAILURE,
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
  TOOGLE_CONTEXT_VARIABLE_MODAL
} from 'constants/action'

export const getMlsContextVariables = ( source: string ) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_CONTEXT_VARIABLES_REQUEST, GET_CONTEXT_VARIABLES_SUCCESS, GET_CONTEXT_VARIABLES_FAILURE],
      callAPI: () => new API().get(`/mls-context-variable/${source}`, false)
    })
  }
}

export const deleteContextVariables = (deletedContextVariablesData: Array<Object>, source: string, showUpdatedList: boolean = true) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [DELETE_CONTEXT_VARIABLES_REQUEST, DELETE_CONTEXT_VARIABLES_SUCCESS, DELETE_CONTEXT_VARIABLES_FAILURE],
      callAPI: () => new API().delete('/mls-context-variable', false, deletedContextVariablesData ),
      handleSuccess: () => {
        if(showUpdatedList) {
          dispatch(getMlsContextVariables(source));
        }
      }
    })
  }
}

export const addNewContextVariable = (mlsId: number, contextData: Object, mlsName: string, metadataType?: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [ADD_NEW_CONTEXT_VARIABLE_REQUEST, ADD_NEW_CONTEXT_VARIABLE_SUCCESS, ADD_NEW_CONTEXT_VARIABLE_FAILURE],
      callAPI: () => new API().post('/mls-context-variable', false, JSON.stringify({
        mlsInfoId: mlsId,
        type: {
          id: 2,
          type: 'manually completed'
        },
        key: contextData.key,
        value: contextData.value,
        elasticSearchIndexId: contextData.elasticSearchIndexId ? contextData.elasticSearchIndexId : '',
        hierarchyInfoId: contextData.hierarchyInfoId ? contextData.hierarchyInfoId : '',
        metadataType
      })),
      handleSuccess: () => {
        dispatch(getMlsContextVariables(mlsName));
      }
    })
  };
}

export const updateContextVariable = (mlsId: number, contextData: Object, mlsName: string, metadataType: string, id: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [UPDATE_CONTEXT_VARIABLE_REQUEST, UPDATE_CONTEXT_VARIABLE_SUCCESS, UPDATE_CONTEXT_VARIABLE_FAILURE],
      callAPI: () => new API().put(`/mls-context-variable/${id}`, false, JSON.stringify({
        mlsInfoId: mlsId,
        type: {
          id: 2,
          type: 'manually completed'
        },
        key: contextData.key,
        value: contextData.value,
        elasticSearchIndexId: contextData.elasticSearchIndexId ? contextData.elasticSearchIndexId : '',
        hierarchyInfoId: contextData.hierarchyInfoId ? contextData.hierarchyInfoId : '',
        metadataType,
        id
      })),
      handleSuccess: () => {
        dispatch(getMlsContextVariables(mlsName));
      }
    })
  };
}

export const getSuggestResource = (source: string, query: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SUGGEST_RESOURCE_REQUEST, GET_SUGGEST_RESOURCE_SUCCESS, GET_SUGGEST_RESOURCE_FAILURE],
      callAPI: () => new API().get(`/suggest/${source}/resource?searchString=${query}`, false)
    })
  }
}

export const getSuggestClasses = (source: string, searchString: string, resource: string = '',) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SUGGEST_CLASSES_REQUEST, GET_SUGGEST_CLASSES_SUCCESS, GET_SUGGEST_CLASSES_FAILURE],
      callAPI: () => new API().get(`/suggest/${source}/classes?resource=${resource}&searchString=${searchString}`, false)
    })
  }
}

export const getSuggestSystemTableName = (source: string, searchString: string, resource: string = '', className: string = '') => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SUGGEST_SYSTEM_TABLE_REQUEST, GET_SUGGEST_SYSTEM_TABLE_SUCCESS, GET_SUGGEST_SYSTEM_TABLE_FAILURE],
      callAPI: () => new API().get(`/suggest/${source}/system-table-name?query=${searchString}&resource=${resource}&class=${className}`, false)
    })
  }
}

export const getSuggestLookupName = (source: string, searchString: string, className: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SUGGEST_LOOKUP_NAME_REQUEST, GET_SUGGEST_LOOKUP_NAME_SUCCESS, GET_SUGGEST_LOOKUP_NAME_FAILURE],
      callAPI: () => new API().get(`/suggest/${source}/lookupName?className=${className}&searchString=${searchString}`, false)
    })
  };
}

export const getSuggestLookupValue = (source: string, searchString: string, resource: string, lookupName: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_SUGGEST_LOOKUP_VALUE_REQUEST, GET_SUGGEST_LOOKUP_VALUE_SUCCESS, GET_SUGGEST_LOOKUP_VALUE_FAILURE],
      callAPI: () => new API().get(`/suggest/${source}/lookup-value?query=${searchString}&resource=${resource}&lookupName=${lookupName}`, false)
    })
  }
}

export const getMetadataHierarchy = (hierarchyType: string, parentId: any = '') => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_METADATA_HIERARCHY_REQUEST, GET_METADATA_HIERARCHY_SUCCESS, GET_METADATA_HIERARCHY_FAILURE],
      callAPI: () => new API().get(`/metadata-hierarchy?hierarchyType=${hierarchyType}&parentId=${parentId}`, false)
    })
  }
}

export const toogleContextVariableModal = (contextVariableName: string) => {
  return(dispatch: Dispatch) => {
    dispatch({
      type: TOOGLE_CONTEXT_VARIABLE_MODAL,
      contextVariableName
    })
  }
}
