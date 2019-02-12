import {
  getMlsContextVariables,
  deleteContextVariables,
  addNewContextVariable,
  updateContextVariable,
  getSuggestResource,
  getSuggestSystemTableName,
  getSuggestLookupName,
  getSuggestLookupValue,
  getMetadataHierarchy,
  getSuggestClasses,
  toogleContextVariableModal
} from 'actions/MlsContextVariableAction';
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
  TOOGLE_CONTEXT_VARIABLE_MODAL,
} from 'constants/action'

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';
import {
  apiBaseURL
} from 'constants/global';

let store;
const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);
const text = 'FLEXMLS'

const mockResponse = (status, statusText, response) => {
  return new window.Response(response, {
    status: status,
    statusText: "OK",
    headers: {
      'Content-type': 'application/json'
    }
  });
};

const data = ['{"id": 24,"mlsInfoId": 137,"type": {"id": 2,"type": "manually completed","parentType": null,"lastUpdateTs": "2018-10-04T00:00:00.000Z","createTs": "2018-10-04T00:00:00.000Z"},"key": "PRICE_FIELD","value": "ListPrice","elasticSearchIndexId": null,"hierarchyInfoId": 0,"lastUpdateTs": "2018-10-18T00:00:00.000Z","createTs": "2018-10-18T00:00:00.000Z"}'];
const resourceData = ['{"id": "g20E96iBYT0AFQTYB2AD","resource": "ListingSubTable","resourceStandardName": "ListingSubTable"}']
const classData = ['{"id": "XJyxmjTBtJ7hATg6yGNH","resource": "Property","className": "RESILEASE","score": 101}']
const suggestSysTableData = ['{"id": "8DDCmkCXKbhXLIsbDZp3","tableSystemName": "SellingAgentMLSID","standardName": "SaleAgentAgentID","shortName": "Selling Agent MLSID","longName": "Selling Agent MLSID","lookupName": "null","dbName": "R2888","dataType": "Character"}']
const lookupNameData = ['{"id": "1yRz4GsLkda4pbHHrFFx","lookupName": "CAMPaymentFreq","lookupVisibleName": "CAM Payment Freq"}']
const metadataHierarchy = ['{"id": 2,"metadataName": "Class","parentId": 1,"hierarchyType": "MD","createDate": 1541116800000,"updateDate": 1541116800000,"child": null,"hierarchyString": null}']
const lookupValueData = ['{"id": "5gLxfOXFLiS8yNT5PCIb","lookupValue": "15C0C4GRN3AM","lookupShortValue": "Office Level","lookupLongValue": "Office Level"}']

const source = "flexmls";
const query = "a";
const resource = 'property';
const className = 'A';
const hierarchyType = 'MD';
const parentId = 1;
const lookupName = 'xyz';

describe('MlsContextVariableAction', () => {
  beforeEach(() => {
    store = mockStore({});
  });

  it('Get Context variable actions Success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: GET_CONTEXT_VARIABLES_REQUEST },
      {
        type: GET_CONTEXT_VARIABLES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(getMlsContextVariables(source));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-context-variable/${source}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Context variable actions Failure', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_CONTEXT_VARIABLES_REQUEST },
      {
        type: GET_CONTEXT_VARIABLES_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getMlsContextVariables(text));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Delete Context variable actions Success', () => {
    const id=["24"]
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: DELETE_CONTEXT_VARIABLES_REQUEST },
      {
        type: DELETE_CONTEXT_VARIABLES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(deleteContextVariables(id, text));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-context-variable`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_CONTEXT_VARIABLES_REQUEST }]);
      }
    });
  });

  it('Delete Context variable actions Failure', () => {
    const id=['24']
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: DELETE_CONTEXT_VARIABLES_REQUEST },
      {
        type: DELETE_CONTEXT_VARIABLES_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      },
    ]

    store.dispatch(deleteContextVariables(id, text));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Add new Context variable actions Success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: ADD_NEW_CONTEXT_VARIABLE_REQUEST },
      {
        type: ADD_NEW_CONTEXT_VARIABLE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(addNewContextVariable(2, {key: 'Status', value: 'Active', text}));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-context-variable`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_CONTEXT_VARIABLES_REQUEST }]);
      }
    });

  });

  it('Add new Context variable actions Success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: ADD_NEW_CONTEXT_VARIABLE_REQUEST },
      {
        type: ADD_NEW_CONTEXT_VARIABLE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(addNewContextVariable(2, {key: 'Status', value: 'Active', text, elasticSearchIndexId: 'xb4FYvsaeKrX1tWQvr0W', hierarchyInfoId: 2}));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_CONTEXT_VARIABLES_REQUEST }]);
      }
    });

  });

  it('Add new Context variable actions Failure', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: ADD_NEW_CONTEXT_VARIABLE_REQUEST },
      {
        type: ADD_NEW_CONTEXT_VARIABLE_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(addNewContextVariable(2, {key: 'Status', value: 'Active', text}));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });


  it('Update Context variable actions Success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: UPDATE_CONTEXT_VARIABLE_REQUEST },
      {
        type: UPDATE_CONTEXT_VARIABLE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(updateContextVariable(2, {key: 'Status', value: 'Active', text}, source, text, 2 ));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-context-variable/2`)
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_CONTEXT_VARIABLES_REQUEST }]);
      }
    });

  });

  it('Update Context variable actions Success', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:data, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data)
    })

    const expectedActions = [
      { type: UPDATE_CONTEXT_VARIABLE_REQUEST },
      {
        type: UPDATE_CONTEXT_VARIABLE_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      }
    ]

    store.dispatch(updateContextVariable(2, {key: 'Status', value: 'Active', text, elasticSearchIndexId: 'xb4FYvsaeKrX1tWQvr0W', hierarchyInfoId: 2}));
    store.subscribe(() => {
      if(store.getActions().length === 2) {
        expect(store.getActions()).toEqual(expectedActions);
      }
      if(store.getActions().length === 3) {
        expect(store.getActions()).toEqual([...expectedActions, { type: GET_CONTEXT_VARIABLES_REQUEST }]);
      }
    });

  });

  it('Update Context variable actions Failure', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: UPDATE_CONTEXT_VARIABLE_REQUEST },
      {
        type: UPDATE_CONTEXT_VARIABLE_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(updateContextVariable(2, {key: 'Status', value: 'Active', text}));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_RESOURCE_SUCCESS action', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:resourceData, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, resourceData))).mockResolvedValue(resourceData)
    })

    const expectedActions = [
      { type: GET_SUGGEST_RESOURCE_REQUEST },
      {
        type: GET_SUGGEST_RESOURCE_SUCCESS,
        data: { payload: JSON.parse(resourceData), status: 200 },
      }
    ]

    store.dispatch(getSuggestResource(source, query));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/suggest/${source}/resource?searchString=${query}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_RESOURCE_FAILURE action', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_SUGGEST_RESOURCE_REQUEST },
      {
        type: GET_SUGGEST_RESOURCE_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getSuggestResource(source, query));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_CLASSES_SUCCESS action', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:classData, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, classData))).mockResolvedValue(classData)
    })

    const expectedActions = [
      { type: GET_SUGGEST_CLASSES_REQUEST },
      {
        type: GET_SUGGEST_CLASSES_SUCCESS,
        data: { payload: JSON.parse(classData), status: 200 },
      }
    ]

    store.dispatch(getSuggestClasses(source, query, resource));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/suggest/${source}/classes?resource=${resource}&searchString=${query}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_CLASSES_FAILURE action', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_SUGGEST_CLASSES_REQUEST },
      {
        type: GET_SUGGEST_CLASSES_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getSuggestClasses(source, query, resource));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  // it('GET_SUGGEST_SYSTEM_TABLE_SUCCESS action', () => {
  //   window.fetch = jest
  //   .fn()
  //   .mockResolvedValue({status: 200, data:suggestSysTableData, ok: true, text: jest.fn().mockImplementation(() =>
  //    Promise.resolve(mockResponse(200, null, suggestSysTableData))).mockResolvedValue(suggestSysTableData)
  //   })

  //   const expectedActions = [
  //     { type: GET_SUGGEST_SYSTEM_TABLE_REQUEST },
  //     {
  //       type: GET_SUGGEST_SYSTEM_TABLE_SUCCESS,
  //       data: { payload: JSON.parse(suggestSysTableData), status: 200 },
  //     }
  //   ]

  //   store.dispatch(getSuggestSystemTableName(source, query, resource, className));
  //   store.subscribe(() => {
  //     expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/suggest/${source}/system-table-name?query=${query}&resource=${resource}&class=${className}&lookups=true`)
  //     expect(store.getActions()).toEqual(expectedActions);
  //   });

  // });

  it('GET_SUGGEST_SYSTEM_TABLE_FAILURE action', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_SUGGEST_SYSTEM_TABLE_REQUEST },
      {
        type: GET_SUGGEST_SYSTEM_TABLE_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getSuggestSystemTableName(source, query, resource, className));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_LOOKUP_NAME_SUCCESS action', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:lookupNameData, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, lookupNameData))).mockResolvedValue(lookupNameData)
    })

    const expectedActions = [
      { type: GET_SUGGEST_LOOKUP_NAME_REQUEST },
      {
        type: GET_SUGGEST_LOOKUP_NAME_SUCCESS,
        data: { payload: JSON.parse(lookupNameData), status: 200 },
      }
    ]

    store.dispatch(getSuggestLookupName(source, query, className));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/suggest/${source}/lookupName?className=${className}&searchString=${query}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_LOOKUP_NAME_FAILURE action', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_SUGGEST_LOOKUP_NAME_REQUEST },
      {
        type: GET_SUGGEST_LOOKUP_NAME_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getSuggestLookupName(source, query, resource, className));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_LOOKUP_VALUE_SUCCESS action', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:lookupValueData, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, lookupValueData))).mockResolvedValue(lookupValueData)
    })

    const expectedActions = [
      { type: GET_SUGGEST_LOOKUP_VALUE_REQUEST },
      {
        type: GET_SUGGEST_LOOKUP_VALUE_SUCCESS,
        data: { payload: JSON.parse(lookupValueData), status: 200 },
      }
    ]

    store.dispatch(getSuggestLookupValue(source, query, resource, lookupName ));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/suggest/${source}/lookup-value?query=${query}&resource=${resource}&lookupName=${lookupName}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_SUGGEST_LOOKUP_VALUE_FAILURE action', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_SUGGEST_LOOKUP_VALUE_REQUEST },
      {
        type: GET_SUGGEST_LOOKUP_VALUE_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        }, 
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getSuggestLookupValue(source, query, resource, className));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_METADATA_HIERARCHY_SUCCESS action', () => {
    window.fetch = jest
    .fn()
    .mockResolvedValue({status: 200, data:metadataHierarchy, ok: true, text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, metadataHierarchy))).mockResolvedValue(metadataHierarchy)
    })

    const expectedActions = [
      { type: GET_METADATA_HIERARCHY_REQUEST },
      {
        type: GET_METADATA_HIERARCHY_SUCCESS,
        data: { payload: JSON.parse(metadataHierarchy), status: 200 },
      }
    ]

    store.dispatch(getMetadataHierarchy(hierarchyType, parentId));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/metadata-hierarchy?hierarchyType=${hierarchyType}&parentId=${parentId}`)
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('GET_METADATA_HIERARCHY_FAILURE action', () => {
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_METADATA_HIERARCHY_REQUEST },
      {
        type: GET_METADATA_HIERARCHY_FAILURE,
        error: { error: {
          "message": "Something went wrong. Please try again later."
        },
        status: "",
        statusText: "" }
      }
    ]

    store.dispatch(getMetadataHierarchy(hierarchyType, parentId));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('TOOGLE_CONTEXT_VARIABLE_MODAL action', () => {
    const expectedActions = [{ type: TOOGLE_CONTEXT_VARIABLE_MODAL, contextVariableName: 'NEW_VARIABLE' }];
    store.dispatch(toogleContextVariableModal('NEW_VARIABLE'));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

})
