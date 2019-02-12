import MLSCanonicalMappingReducer from 'reducers/MLSCanonicalMappingReducer';
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
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
  GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE,
  GET_START_SPARK_REQUEST,
  GET_START_SPARK_SUCCESS,
  GET_START_SPARK_FAILURE,
  DELETE_CANONICAL_MAPPING_REQUEST,
  DELETE_CANONICAL_MAPPING_SUCCESS,
  DELETE_CANONICAL_MAPPING_FAILURE
} from 'constants/action';

const initialState = {
  MlsCanonical: {
    isLoading: false,
  },
  MlsSample: {
    isLoading: false,
  },
  MlsMappedField: {
    isLoading: false
  },
  MlsCanonicalFunctions: {
    isLoading: false
  },
  MlsAutoCompleteFunctions: {
    isLoading: false
  },
  MlsTransformationPreview: {
    isLoading: false
  },
  MlsUuid: {
    isLoading: false
  },
  MlsDowloadTypesList: {
    isLoading: false
  },
  MlsSparkSession: {
    isLoading: false
  },
  MlsAutoCompleteOptions: {
    isLoading: false
  },
  MlsUpdateMappedField: {
    isLoading: false
  },
  MlsDeleteMapping: {
    isLoading: false
  },
  MlsPropertyTypesList: {
    isLoading: false
  },
  MlsExistingMappedFields: {
    isLoading: true,
  }
}

describe('MlsCanonical reducer', () => {

  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MLSCanonicalMappingReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return canonical request action data', () => {
    const expectedData = {
      ...initialState,
      MlsCanonical:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_CANONICAL_FIELDS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return canonical get success action data ', () => {
    const payloadValue = [
      {
        "id": 1,
        "name": "ADDRESS",
        "type": "REPORT",
        "dataType": "MEDIUMTEXT",
        "dataLength": 0,
        "notes": null,
        "lastUpdateTs": "2018-10-15T18:30:00.000Z",
        "createTs": null
      }];
    const expectedData = {
      ...initialState,
      MlsCanonical:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_CANONICAL_FIELDS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return canonical get failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsCanonical:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_CANONICAL_FIELDS_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return raw field request action data', () => {
    const expectedData = {
      ...initialState,
      MlsSample:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_RAWFIELD_SAMPLE_DATA_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return raw field get success action data ', () => {
    const payloadValue = [
        "00207",
        "00920",
        "07115",
        "07430",
        "00120",
        "08880",
        "01250",
        "03075",
        "08760",
        "05010"];
    const expectedData = {
      ...initialState,
      MlsSample:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_RAWFIELD_SAMPLE_DATA_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return raw field get failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsSample:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_RAWFIELD_SAMPLE_DATA_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return mapped fields get request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMappedField: {
        isLoading: true,
        isFail: false,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_MAPPED_FIELDS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return mapped fields get success action data ', () => {
    const payloadValue = [
      {
        "id": "89zZB2Q944arGqPVMPEI",
        "tableSystemName": "Address",
        "standardName": "null",
        "shortName": "Address",
        "longName": "Address",
        "lookupName": "null",
        "relevance": 100,
        "active": false
      }];
    const expectedData = {
      ...initialState,
      MlsMappedField: {
        isFail: false,
        error: {},
        isLoading: false,
        payload: payloadValue,
        isResponseComplete: true,
        isResponseSuccess: true,
        status: 200
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_MAPPED_FIELDS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return mapped fields get failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsMappedField: {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_MAPPED_FIELDS_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return mapped fields update request action data', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateMappedField: {
        isFail: false,
        isLoading: true,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: UPDATE_MAPPED_FIELDS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return mapped fields update success action data ', () => {
    const payloadValue = [
      {
        "id": "89zZB2Q944arGqPVMPEI",
        "tableSystemName": "Address",
        "standardName": "null",
        "shortName": "Address",
        "longName": "Address",
        "lookupName": "null",
        "relevance": 100,
        "active": false
      }];
    const expectedData = {
      ...initialState,
      MlsUpdateMappedField: {
        isFail: false,
        error: {},
        isLoading: false,
        payload: payloadValue,
        isResponseComplete: true,
        isResponseSuccess: true,
        status: 200
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: UPDATE_MAPPED_FIELDS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return mapped fields update failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateMappedField: {
        isFail: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401,
        isResponseComplete: true,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: UPDATE_MAPPED_FIELDS_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return available functions get request action data', () => {
    const expectedData = {
      ...initialState,
      MlsCanonicalFunctions: {
        isLoading: true,
        isFail: false,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_AVAILABLE_FUNCTIONS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return available functions get success action data ', () => {
    const payloadValue = [
      {
        "id": 1,
        "enumValue": "SUM_ALL",
        "description": "Sum of all numbers coming from raw columns data",
        "active": true,
        "lastUpdateTs": 1539791700000,
        "createTs": 1539791700000,
        "expression": null
      }];
    const expectedData = {
      ...initialState,
      MlsCanonicalFunctions: {
        isLoading: false,
        isResponseSuccess: true,
        error: {},
        payload: payloadValue,
        status: 200,
        isResponseComplete: true,
        isFail: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_AVAILABLE_FUNCTIONS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return available functions get failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsCanonicalFunctions: {
        isFail: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401,
        isResponseComplete: true,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_AVAILABLE_FUNCTIONS_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return autocomplete functions get request action data', () => {
    const expectedData = {
      ...initialState,
      MlsAutoCompleteFunctions: {
        isLoading: true,
        isFail: false,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_AUTOCOMPLETE_FUNCTIONS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return autocomplete functions get success action data ', () => {
    const payloadValue = [
      {
        "name": "!",
        "usage": "! expr - Logical not., ",
        "example": ", ",
        "lastUpdateTs": 1541980800000,
        "createTs": 1541980800000
      }];
    const expectedData = {
      ...initialState,
      MlsAutoCompleteFunctions: {
        isLoading: false,
        error: {},
        isFail: false,
        isResponseComplete: true,
        isResponseSuccess: true,
        payload: payloadValue,
        status: 200
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_AUTOCOMPLETE_FUNCTIONS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return autocomplete functions get failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsAutoCompleteFunctions: {
        isFail: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401,
        isResponseComplete: true,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_AUTOCOMPLETE_FUNCTIONS_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return Mls Uuid post success action data ', () => {
    const payloadValue = [
      {
        "uuid": "0d0bcdc8-48e6-4b09-acff-fd893514f9c3",
        "dataFrame": [
          {
              "MLSListDate": "2018-11-13",
              "Sewer": "Public Sewer",
              "ListAgentMlsId": "3217406",
          }
        ]
      }
    ]
    const expectedData = {
      ...initialState,
      MlsUuid: {
        isFail: false,
        isResponseSuccess: true,
        isResponseComplete: true,
        isLoading: false,
        payload: payloadValue,
        status: 200,
        error: {}
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: POST_UUID_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return Mls Uuid post  failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsUuid: {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: POST_UUID_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return Mls Uuid post request action data', () => {
    const expectedData = {
      ...initialState,
      MlsUuid: {
        isFail: false,
        isResponseSuccess: false,
        isLoading: true,
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: POST_UUID_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return Transformation Preview post success action data ', () => {
    const payloadValue = [
      {
        "uuid": "0d0bcdc8-48e6-4b09-acff-fd893514f9c3",
        "dataFrame": [
          {
              "MLSListDate": "2018-11-13",
              "Sewer": "Public Sewer",
              "ListAgentMlsId": "3217406",
          }
        ]
      }
    ]
    const expectedData = {
      ...initialState,
      MlsTransformationPreview: {
        isFail: false,
        isResponseSuccess: true,
        isResponseComplete: true,
        isLoading: false,
        payload: payloadValue,
        status: 200,
        error: {}
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: POST_TRANSFORMATION_PREVIEW_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return Transformation Preview post  failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsTransformationPreview: {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: POST_TRANSFORMATION_PREVIEW_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return Transformation Preview post request action data', () => {
    const expectedData = {
      ...initialState,
      MlsTransformationPreview: {
        isFail: false,
        isResponseSuccess: false,
        isLoading: true,
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: POST_TRANSFORMATION_PREVIEW_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })


  it('reducer should return download types for canonical field mapping request', () => {
    const expectedData = {
      ...initialState,
      MlsDowloadTypesList: {
        isFail: false,
        isResponseSuccess: false,
        isLoading: true,
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return download types for canonical field mapping sucess', () => {
    const payloadValue = ['Listing Downloaded File', 'Agent Downloaded File'];
    const expectedData = {
      ...initialState,
      MlsDowloadTypesList: {
        isFail: false,
        error: {},
        isLoading: false,
        payload: payloadValue,
        isResponseComplete: true,
        isResponseSuccess: true,
        status: 200
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  })

  it('reducer should return download types for canonical field mapping failure', () => {
    const expectedData = {
      ...initialState,
      MlsDowloadTypesList: {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_MLS_CANONICAL_DOWNLOAD_TYPE_LIST_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should start spark session request', () => {
    const expectedData = {
      ...initialState,
      MlsSparkSession: {
        isFail: false,
        isLoading: true,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_START_SPARK_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should start spark session success', () => {
    const expectedData = {
      ...initialState,
      MlsSparkSession: {
        error: {},
        isFail: false,
        isLoading: false,
        isResponseSuccess: true,
        isResponseComplete: true
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_START_SPARK_SUCCESS
    })).toEqual(expectedData);
  })

  it('reducer should return download types for canonical field mapping failure', () => {
    const expectedData = {
      ...initialState,
      MlsSparkSession: {
        error: {
          errorMessage: 'Unauthorized'
        },
        isFail: true,
        isLoading: false,
        isResponseComplete: true,
        isResponseSuccess: false,
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: GET_START_SPARK_FAILURE,
      error: {
        error: {
          errorMessage: 'Unauthorized'
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer for delete mapping request', () => {
    const expectedData = {
      ...initialState,
      MlsDeleteMapping: {
        isFail: false,
        isLoading: true,
        isResponseSuccess: false
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: DELETE_CANONICAL_MAPPING_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer for delete mapping success', () => {
    const expectedData = {
      ...initialState,
      MlsDeleteMapping: {
        error: {},
        isFail: false,
        isLoading: false,
        isResponseSuccess: true,
        isResponseComplete: true
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: DELETE_CANONICAL_MAPPING_SUCCESS
    })).toEqual(expectedData);
  })

  it('reducer for delete mapping failure', () => {
    const expectedData = {
      ...initialState,
      MlsDeleteMapping: {
        error: {
          errorMessage: 'Unauthorized'
        },
        isFail: true,
        isLoading: false,
        isResponseComplete: true,
        isResponseSuccess: false,
        status: 401
      }
    }
    expect(MLSCanonicalMappingReducer(initialState, {
      type: DELETE_CANONICAL_MAPPING_FAILURE,
      error: {
        error: {
          errorMessage: 'Unauthorized'
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

});
