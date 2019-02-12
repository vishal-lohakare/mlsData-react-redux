import MLSStandardValueReducer from 'reducers/MlsStandardValueReducer';
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
  POST_UNMAPPED_VALUES_REQUEST,
  POST_UNMAPPED_VALUES_FAILURE,
  POST_MAPPED_VALUES_REQUEST,
  POST_MAPPED_VALUES_FAILURE,
  GET_MLSINFO_SOURCE_REQUEST,
  GET_MLSINFO_SOURCE_SUCCESS,
  GET_MLSINFO_SOURCE_FAILURE,
  GET_MLS_CANONICAL_FIELDS_REQUEST,
  GET_MLS_CANONICAL_FIELDS_SUCCESS,
  GET_MLS_CANONICAL_FIELDS_FAILURE,
  DELETE_UNMAPPED_VALUES_SUCCESS,
  DELETE_MAPPED_VALUES_SUCCESS,
  POST_NEW_STANDARD_VALUE_REQUEST,
  POST_NEW_STANDARD_VALUE_SUCCESS,
  POST_NEW_STANDARD_VALUE_FAILURE
} from 'constants/action';


const initialState = {
  MlsInfoSourceResult: {
    isLoading: false,
  },
  MlsCananicalFields: {
    isLoading: false,
  },
  MlsStandardValue: {
    isLoading: false,
  },
  MlsMappedValue: {
    payload: [],
    isLoading: false,
  },
  MlsUnmappedValue: {
    payload: [],
    isLoading: false,
  },
  MlsMappedUnammped: {
    isLoading: false,
  },
  MlsNewStandardValue: {
    isLoading: false,
  }
}

describe('MlsStandardValue reducer', () => {

  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MLSStandardValueReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return get Mls info source list request action data', () => {
    const expectedData = {
      ...initialState,
      MlsInfoSourceResult:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MLSINFO_SOURCE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get Mls info source list success action data', () => {
    const mlsSourceList = [
      "FLEXMLS3",
      "testers",
      "ACTRIS",
      "vishal",
      "FLEXMLS1",
    ];
    const expectedData = {
      ...initialState,
      MlsInfoSourceResult:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: mlsSourceList,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MLSINFO_SOURCE_SUCCESS,
      data: {
        payload: mlsSourceList,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get Mls info source list failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsInfoSourceResult:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MLSINFO_SOURCE_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get field type list request action data', () => {
    const expectedData = {
      ...initialState,
      MlsCananicalFields:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MLS_CANONICAL_FIELDS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get field type list success action data', () => {
    const fieldType = [
      {
        "id": 1,
        "name": "ADDRESS",
        "type": "REPORT",
        "dataType": "MEDIUMTEXT",
        "dataLength": 0,
        "notes": null,
        "lastUpdateTs": "2018-10-15T18:30:00.000Z",
        "createTs": null
      }
    ];
    const expectedData = {
      ...initialState,

      MlsCananicalFields:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: fieldType,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MLS_CANONICAL_FIELDS_SUCCESS,
      data: {
        payload: fieldType,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get field type list failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsCananicalFields:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MLS_CANONICAL_FIELDS_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get standard value request action data', () => {
    const expectedData = {
      ...initialState,
      MlsStandardValue:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_STANDARD_VALUES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get standard value success action data', () => {
    const standardValue = [
      {
        id: 1,
        fieldType: 'AGE',
        value: '15-20 Years',
      }
    ];
    const expectedData = {
      ...initialState,
      MlsStandardValue:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: standardValue,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_STANDARD_VALUES_SUCCESS,
      data: {
        payload: standardValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get standard value failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsStandardValue:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_STANDARD_VALUES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get mapped value request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMappedValue:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MAPPED_VALUES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get mapped value success action data', () => {
    const mappedData = [
        {
          "id": 4729,
          "createDate": 1541010600000,
          "changeDate": 1541010600000,
          "source": "FLEXMLS",
          "value": "Ag106",
          "standardValueId": 10,
          "enteredBy": 0,
          "fieldType": "AGE"
      },
    ];
    const expectedData = {
      ...initialState,
      MlsMappedValue:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: mappedData,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MAPPED_VALUES_SUCCESS,
      data: {
        payload: mappedData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get mapped value failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsMappedValue:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        payload:[],
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_MAPPED_VALUES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get unmapped value request action data', () => {
    const expectedData = {
      ...initialState,
      MlsUnmappedValue:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_UNMAPPED_VALUES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get unmapped value success action data', () => {
    const unmappedData = [
      {
        "id": 32,
        "createDate": 1541010600000,
        "changeDate": 1541010600000,
        "source": "FLEXMLS",
        "fieldType": "AGE",
        "value": "Ag101"
      }
    ];
    const expectedData = {
      ...initialState,
      MlsUnmappedValue:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        payload: unmappedData,
        error: {},
        isResponseComplete: true,
        status: 200
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_UNMAPPED_VALUES_SUCCESS,
      data: {
        payload: unmappedData,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get unmapped value failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsUnmappedValue:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        payload: [],
        error: {
          errorMessage: "No data found"
        },
        isResponseComplete: true,
        status: 400
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: GET_UNMAPPED_VALUES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return post unmapped value request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMappedUnammped:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: POST_UNMAPPED_VALUES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return post unmapped value failure action data', () => {

    expect(MLSStandardValueReducer(initialState, {
      type: POST_UNMAPPED_VALUES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(initialState);
  });

  it('reducer should return post mapped value request action data', () => {
    const expectedData = {
      ...initialState,
      MlsMappedUnammped:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: POST_MAPPED_VALUES_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return post mapped value failure action data', () => {

    expect(MLSStandardValueReducer(initialState, {
      type: POST_MAPPED_VALUES_FAILURE,
      data: {
        error: {
          errorMessage: "No data found"
        },
        status: 400,
      }
    })).toEqual(initialState);
  });

  it('reducer should return delete unmapped and mapped value success action data', () => {

    const expectedData = {
      ...initialState,
      MlsMappedUnammped:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        error: {},
        isResponseComplete: true,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: DELETE_UNMAPPED_VALUES_SUCCESS,
      data: {}
    })).toEqual(expectedData);

    expect(MLSStandardValueReducer(initialState, {
      type: DELETE_MAPPED_VALUES_SUCCESS,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return post standard value request action data', () => {
    const expectedData = {
      ...initialState,
      MlsNewStandardValue:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: POST_NEW_STANDARD_VALUE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return post standard value success action data', () => {
    const expectedData = {
      ...initialState,
      MlsNewStandardValue:
      {
        isLoading: false,
        isResponseSuccess: true,
        isFail: false,
        isResponseComplete: true,
        error: {},
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: POST_NEW_STANDARD_VALUE_SUCCESS,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return post standard value failure action data', () => {

    const expectedData = {
      ...initialState,
      MlsNewStandardValue:
      {
        isLoading: false,
        isResponseSuccess: false,
        isFail: true,
        isResponseComplete: true,
      },
    }

    expect(MLSStandardValueReducer(initialState, {
      type: POST_NEW_STANDARD_VALUE_FAILURE,
      data: {}
    })).toEqual(expectedData);
    
  });

});
