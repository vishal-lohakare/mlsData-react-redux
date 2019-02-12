import MlsContextVariableReducer from 'reducers/MlsContextVariableReducer';
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

const initialState = {
  MlsContextVariables: {
  },
  MlsDeleteContextData: {
    isLoading: false
  },
  MlsAddContextData: {
    isLoading: false,
  },
  MlsUpdateContextData: {
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
  MlsUpdateContextData: {
    isLoading: false
  },
  isOpenNewContextModal: false,
  contextVariableName: ''
}

const addNewContextData = {
      "id": 46,
      "mlsInfoId": 2,
      "type": {
          "id": 2,
          "type": "manually completed",
          "parentType": null,
          "lastUpdateTs": "2018-10-04T00:00:00.000Z",
          "createTs": "2018-10-04T00:00:00.000Z"
      },
      "key": "CLASS_OFFICE",
      "value": "CLASS_OFFICE",
      "elasticSearchIndexId": null,
      "hierarchyInfoId": 0,
      "lastUpdateTs": "2018-11-13T00:00:00.000Z",
      "createTs": "2018-11-13T00:00:00.000Z"
  };

describe('MlsContextVariable Reducer', () => {

  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MlsContextVariableReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return GET_CONTEXT_VARIABLES_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsContextVariables: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_CONTEXT_VARIABLES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_CONTEXT_VARIABLES_SUCCESS action data', () => {
    const mlsContextVariables = [
      {
        "id": 24,
        "mlsInfoId": 137,
        "type": {
          "id": 2,
          "type": "manually completed",
          "parentType": null,
          "lastUpdateTs": "2018-10-04T00:00:00.000Z",
          "createTs": "2018-10-04T00:00:00.000Z"
        },
        "key": "PRICE_FIELD",
        "value": "ListPrice",
        "elasticSearchIndexId": null,
        "hierarchyInfoId": 0,
        "lastUpdateTs": "2018-10-18T00:00:00.000Z",
        "createTs": "2018-10-18T00:00:00.000Z"
      }
    ];

    const expectedData = {
      ...initialState,
      MlsContextVariables: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: mlsContextVariables,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_CONTEXT_VARIABLES_SUCCESS,
      data: {
        payload: mlsContextVariables,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_CONTEXT_VARIABLES_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsContextVariables: {
        isFail : true,
        isLoading : false,
        payload: [],
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_CONTEXT_VARIABLES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });

  it('reducer should return add new context variable request action data', () => {
    const expectedData = {
      ...initialState,
      MlsAddContextData: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: ADD_NEW_CONTEXT_VARIABLE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return add new context variable success action data', () => {
    const expectedData = {
      ...initialState,
      MlsAddContextData: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: addNewContextData,
        isResponseComplete: true,
        isResponseSuccess : true,
        status: 200,
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: ADD_NEW_CONTEXT_VARIABLE_SUCCESS,
      data: {
        payload: addNewContextData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return add new context variable failure action data', () => {
    const expectedData = {
      ...initialState,
      MlsAddContextData: {
        isFail : true,
        isLoading : false,
        isResponseComplete: true,
        isResponseSuccess : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: ADD_NEW_CONTEXT_VARIABLE_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return update context variable request action data', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateContextData: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: UPDATE_CONTEXT_VARIABLE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return update context variable success action data', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateContextData: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: addNewContextData,
        isResponseComplete: true,
        isResponseSuccess : true,
        status: 200,
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: UPDATE_CONTEXT_VARIABLE_SUCCESS,
      data: {
        payload: addNewContextData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return update context variable failure action data', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateContextData: {
        isFail : true,
        isLoading : false,
        isResponseComplete: true,
        isResponseSuccess : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: UPDATE_CONTEXT_VARIABLE_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return delete context variable request action data', () => {
    const expectedData = {
      ...initialState,
      MlsDeleteContextData: {
        isLoading : true,
        isFail: false,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: DELETE_CONTEXT_VARIABLES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return delete context variable success action data', () => {
    const expectedData = {
      ...initialState,
      MlsDeleteContextData: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: addNewContextData,
        isResponseComplete: true,
        isResponseSuccess : true,
        status: 200,
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: DELETE_CONTEXT_VARIABLES_SUCCESS,
      data: {
        payload: addNewContextData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return delete context variable failure action data', () => {
    const expectedData = {
      ...initialState,
      MlsDeleteContextData: {
        isFail : true,
        isLoading : false,
        isResponseComplete: true,
        isResponseSuccess : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: DELETE_CONTEXT_VARIABLES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_RESOURCE_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestResource: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_RESOURCE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_RESOURCE_SUCCESS action data', () => {
    const resourceData = [{
      "id": "g20E96iBYT0AFQTYB2AD",
      "resource": "ListingSubTable",
      "resourceStandardName": "ListingSubTable"
    }]

    const expectedData = {
      ...initialState,
      MlsSuggestResource: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: resourceData,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_RESOURCE_SUCCESS,
      data: {
        payload: resourceData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_RESOURCE_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestResource: {
        isFail : true,
        isLoading : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_RESOURCE_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_CLASSES_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestClasses: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_CLASSES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_CLASSES_SUCCESS action data', () => {
    const classData = [{
      "id": "XJyxmjTBtJ7hATg6yGNH",
      "resource": "Property",
      "className": "RESILEASE",
      "score": 101
    }]

    const expectedData = {
      ...initialState,
      MlsSuggestClasses: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: classData,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_CLASSES_SUCCESS,
      data: {
        payload: classData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_CLASSES_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestClasses: {
        isFail : true,
        isLoading : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_CLASSES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_SYSTEM_TABLE_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestSystemTable: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_SYSTEM_TABLE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_SYSTEM_TABLE_SUCCESS action data', () => {
    const suggestSysTableData = [{
      "id": "8DDCmkCXKbhXLIsbDZp3",
      "tableSystemName": "SellingAgentMLSID",
      "standardName": "SaleAgentAgentID",
      "shortName": "Selling Agent MLSID",
      "longName": "Selling Agent MLSID",
      "lookupName": "null",
      "dbName": "R2888",
      "dataType": "Character"
    }]

    const expectedData = {
      ...initialState,
      MlsSuggestSystemTable: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: suggestSysTableData,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_SYSTEM_TABLE_SUCCESS,
      data: {
        payload: suggestSysTableData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_SYSTEM_TABLE_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestSystemTable: {
        isFail : true,
        isLoading : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_SYSTEM_TABLE_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_LOOKUP_NAME_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestLookupName: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_LOOKUP_NAME_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_LOOKUP_NAME_SUCCESS action data', () => {
    const lookupNameData = [{
      "id": "1yRz4GsLkda4pbHHrFFx",
      "lookupName": "CAMPaymentFreq",
      "lookupVisibleName": "CAM Payment Freq"
    }]

    const expectedData = {
      ...initialState,
      MlsSuggestLookupName: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: lookupNameData,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_LOOKUP_NAME_SUCCESS,
      data: {
        payload: lookupNameData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_LOOKUP_NAME_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestLookupName: {
        isFail : true,
        isLoading : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_LOOKUP_NAME_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_LOOKUP_VALUE_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestLookupValue: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_LOOKUP_VALUE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_LOOKUP_VALUE_SUCCESS action data', () => {
    const lookupValueData = [{
      "id": "5gLxfOXFLiS8yNT5PCIb",
      "lookupValue": "15C0C4GRN3AM",
      "lookupShortValue": "Office Level",
      "lookupLongValue": "Office Level"
    }]

    const expectedData = {
      ...initialState,
      MlsSuggestLookupValue: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: lookupValueData,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_LOOKUP_VALUE_SUCCESS,
      data: {
        payload: lookupValueData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_SUGGEST_LOOKUP_VALUE_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsSuggestLookupValue: {
        isFail : true,
        isLoading : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_SUGGEST_LOOKUP_VALUE_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });
  it('reducer should return GET_METADATA_HIERARCHY_REQUEST action data', () => {
    const expectedData = {
      ...initialState,
      MlsHierarchy: {
        isFail : false,
        isLoading : true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_METADATA_HIERARCHY_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return GET_METADATA_HIERARCHY_SUCCESS action data', () => {
    const metadataHierarchy = [{
      "id": 2,
      "metadataName": "Class",
      "parentId": 1,
      "hierarchyType": "MD",
      "createDate": 1541116800000,
      "updateDate": 1541116800000,
      "child": null,
      "hierarchyString": null
    }]

    const expectedData = {
      ...initialState,
      MlsHierarchy: {
        error: {},
        isFail : false,
        isLoading : false,
        payload: metadataHierarchy,
        status: 200,
        isResponseComplete: true,
        isResponseSuccess : true
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_METADATA_HIERARCHY_SUCCESS,
      data: {
        payload: metadataHierarchy,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return GET_METADATA_HIERARCHY_FAILURE action data', () => {
    const expectedData = {
      ...initialState,
      MlsHierarchy: {
        isFail : true,
        isLoading : false,
        error: {
          errorMessage: "No data found"
        },
        status: 400,
        isResponseComplete: true,
        isResponseSuccess : false
      }
    }

    expect(MlsContextVariableReducer(initialState, {
      type: GET_METADATA_HIERARCHY_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400
      }
    })).toEqual(expectedData);
  });

  it('reducer should return TOOGLE_CONTEXT_VARIABLE_MODAL open and data to add new variable', () => {
    const expectedData = {
      ...initialState,
      isOpenNewContextModal: true,
      contextVariableName: 'NEW_VARIABLE'
    }
    expect(MlsContextVariableReducer(initialState, {
      type: TOOGLE_CONTEXT_VARIABLE_MODAL,
      contextVariableName: 'NEW_VARIABLE'
    })).toEqual(expectedData);
  });

})
