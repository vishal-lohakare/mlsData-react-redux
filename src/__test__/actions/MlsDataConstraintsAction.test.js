import {
  getDataConstraintsList,
  enableDisableConstraint,
  getMlsNames,
  getConstraintPhases,
  getConstraintFields,
  getConstraintFieldValues,
  getConstraintFieldMetrics,
  getConstraintExpression,
  createConstraint,
  editConstraint
} from 'actions/MlsDataConstraintsAction';
import {
  GET_DATA_CONSTRAINTS_REQUEST,
  GET_DATA_CONSTRAINTS_SUCCESS,
  GET_DATA_CONSTRAINTS_FAILURE,
  ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST,
  ENABLE_DISABLE_DATA_CONSTRAINT_SUCCESS,
  ENABLE_DISABLE_DATA_CONSTRAINT_FAILURE,
  GET_MLS_NAMES_REQUEST,
  GET_MLS_NAMES_SUCCESS,
  GET_MLS_NAMES_FAILURE,
  GET_CONSTRAINT_PHASES_REQUEST,
  GET_CONSTRAINT_PHASES_SUCCESS,
  GET_CONSTRAINT_PHASES_FAILURE,
  GET_CONSTRAINT_FIELDS_REQUEST,
  GET_CONSTRAINT_FIELDS_SUCCESS,
  GET_CONSTRAINT_FIELDS_FAILURE,
  GET_CONSTRAINT_FIELD_VALUES_REQUEST,
  GET_CONSTRAINT_FIELD_VALUES_SUCCESS,
  GET_CONSTRAINT_FIELD_VALUES_FAILURE,
  GET_CONSTRAINT_FIELD_METRICS_REQUEST,
  GET_CONSTRAINT_FIELD_METRICS_SUCCESS,
  GET_CONSTRAINT_FIELD_METRICS_FAILURE,
  GET_CONSTRAINT_EXPRESSION_REQUEST,
  GET_CONSTRAINT_EXPRESSION_SUCCESS,
  GET_CONSTRAINT_EXPRESSION_FAILURE,
  CREATE_CONSTRAINT_REQUEST,
  CREATE_CONSTRAINT_SUCCESS,
  CREATE_CONSTRAINT_FAILURE,
  EDIT_CONSTRAINT_REQUEST,
  EDIT_CONSTRAINT_SUCCESS,
  EDIT_CONSTRAINT_FAILURE,
} from 'constants/action';
import { apiBaseURL } from 'constants/global';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);
const data = '[{"id":1,"source":"BRIGHTMLS|FLEXMLS","phase":"*","downloadType":"[listing|photo|office|agent|iopenhome]","metricSource":"field:Status, value:AC","startDateInterval":"TODAY - 7","endDateInterval":"TODAY","createTs":1547663400000,"updateTs":1547663400000,"expression":"current_value > 1.1 history calculated value OR current_value > 1.1 history calculated value ","notes":"Pause all downloads of BRIGHTMLS","enabled":true}]';
describe('Mls Data Constraints Actions', () => {
  it('Get Data Constraints Success', () => {

    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: GET_DATA_CONSTRAINTS_REQUEST },
      {
        type: GET_DATA_CONSTRAINTS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getDataConstraintsList());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Data Constraints failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_DATA_CONSTRAINTS_REQUEST },
      {
        type: GET_DATA_CONSTRAINTS_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getDataConstraintsList());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('update Data Constraints Success', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data:data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),

    })

    const expectedActions = [
      { type: ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST},
      {
        type: ENABLE_DISABLE_DATA_CONSTRAINT_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(enableDisableConstraint(data));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('update Data Constraint failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type:ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST},
      {
        type: ENABLE_DISABLE_DATA_CONSTRAINT_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    store.dispatch(enableDisableConstraint(data));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get MlsNames Success', () => {
    const data = '["MDP_IA_DMAAR","TEMP","MDP_NJ_MCMLS","MDP_OK_OKC","MDP_MI_NGLRMLS"]';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: GET_MLS_NAMES_REQUEST },
      {
        type: GET_MLS_NAMES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getMlsNames());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/mls-info/source`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get MlsNames failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_MLS_NAMES_REQUEST },
      {
        type: GET_MLS_NAMES_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getMlsNames());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Phases Success', () => {
    const data = '["Download Request","Download Raw Data","Canonical Raw Data","Standardize Canonical Data","Enrich Data","Publishing"]';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: GET_CONSTRAINT_PHASES_REQUEST },
      {
        type: GET_CONSTRAINT_PHASES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getConstraintPhases());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/download/phase-type`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Phases failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_CONSTRAINT_PHASES_REQUEST },
      {
        type: GET_CONSTRAINT_PHASES_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getConstraintPhases());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Fields Success', () => {
    const data = '[{"id":1,"downloadId":"214","metricSource":"L_ListingID","phase":"phase","numOfNulls":0,"standardDeviation":0.0,"min":"0","max":"1"},{"id":2,"downloadId":"214","metricSource":"L_Class","phase":"phase","numOfNulls":0,"standardDeviation":0.0,"min":"0","max":"1"}]';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: GET_CONSTRAINT_FIELDS_REQUEST },
      {
        type: GET_CONSTRAINT_FIELDS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getConstraintFields());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint/fields`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Fields failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_CONSTRAINT_FIELDS_REQUEST },
      {
        type: GET_CONSTRAINT_FIELDS_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]
    store.dispatch(getConstraintFields());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint FieldValues Success', () => {
    const data = '["W", "A", "C"]';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: GET_CONSTRAINT_FIELD_VALUES_REQUEST },
      {
        type: GET_CONSTRAINT_FIELD_VALUES_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getConstraintFieldValues("1,2,3"));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint/fields/values?ids=${encodeURIComponent(ids)}`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint FieldValues failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_CONSTRAINT_FIELD_VALUES_REQUEST },
      {
        type: GET_CONSTRAINT_FIELD_VALUES_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getConstraintFieldValues("1,2,3"));
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Field Metrics Success', () => {
    const data = '["median","non_null_count","null_count","null_percent","pattern_count","standard_deviation","total_count","unique_count","uniqueness"]';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: GET_CONSTRAINT_FIELD_METRICS_REQUEST },
      {
        type: GET_CONSTRAINT_FIELD_METRICS_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getConstraintFieldMetrics());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint/fields/metrics`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Field Metrics failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_CONSTRAINT_FIELD_METRICS_REQUEST },
      {
        type: GET_CONSTRAINT_FIELD_METRICS_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getConstraintFieldMetrics());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Field Expression Success', () => {
    const data = '["CURRENT_VALUE","HISTORY_VALUE"]';
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: GET_CONSTRAINT_EXPRESSION_REQUEST },
      {
        type: GET_CONSTRAINT_EXPRESSION_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(getConstraintExpression());
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint/expression/key-words`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Get Constraint Field Expression failure', () => {
    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockRejectedValueOnce( {status: 400, error:{} })

    const expectedActions = [
      { type: GET_CONSTRAINT_EXPRESSION_REQUEST },
      {
        type: GET_CONSTRAINT_EXPRESSION_FAILURE,
        error: {
          "error": {
            "message": "Something went wrong. Please try again later."
          },
          "status": "",
          "statusText": ""
        }
      }
    ]

    store.dispatch(getConstraintExpression());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Create Constraint Success', () => {
    const data = '{}';
    const postQuery = {
      downloadType: "agent",
      enabled: true,
      endDateInterval: "TODAY-1",
      expression: "CURRENT_VALUE>=HISTORY_VALUE",
      id: 4,
      metricSource: "field:L_ListingID",
      notes: "Testint",
      phase: "Canonical Raw Data",
      source: "MDP_NJ_MCMLS",
      startDateInterval: "TODAY"
    }

    const store = mockStore({});
    window.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      status: 200,
      data: data,
      ok: true,
      text: jest.fn().mockImplementation(() =>
     Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
    })

    const expectedActions = [
      { type: CREATE_CONSTRAINT_REQUEST },
      {
        type: CREATE_CONSTRAINT_SUCCESS,
        data: { payload: JSON.parse(data), status: 200 },
      },
    ]

    store.dispatch(createConstraint(postQuery));
    store.subscribe(() => {
      expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint`)
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('Create Constraint failure', () => {
      const postQuery = {
        downloadType: "agent",
        enabled: true,
        endDateInterval: "TODAY-1",
        expression: "CURRENT_VALUE>=HISTORY_VALUE",
        id: 4,
        metricSource: "field:L_ListingID",
        notes: "Testint",
        phase: "Canonical Raw Data",
        source: "MDP_NJ_MCMLS",
        startDateInterval: "TODAY"
      }
      const store = mockStore({});
      window.fetch = jest
      .fn()
      .mockRejectedValueOnce( {status: 400, error:{} })

      const expectedActions = [
        { type: CREATE_CONSTRAINT_REQUEST },
        {
          type: CREATE_CONSTRAINT_FAILURE,
          error: {
            "error": {
              "message": "Something went wrong. Please try again later."
            },
            "status": "",
            "statusText": ""
          }
        }
      ]

      store.dispatch(createConstraint(postQuery));
      store.subscribe(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('Edit Constraint Success', () => {
      const data = '{}';
      const postQuery = {
        downloadType: "agent",
        enabled: true,
        endDateInterval: "TODAY-1",
        expression: "CURRENT_VALUE>=HISTORY_VALUE",
        id: 4,
        metricSource: "field:L_ListingID",
        notes: "Testint",
        phase: "Canonical Raw Data",
        source: "MDP_NJ_MCMLS",
        startDateInterval: "TODAY"
      }

      const store = mockStore({});
      window.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        status: 200,
        data: data,
        ok: true,
        text: jest.fn().mockImplementation(() =>
       Promise.resolve(mockResponse(200, null, data))).mockResolvedValue(data),
      })

      const expectedActions = [
        { type: EDIT_CONSTRAINT_REQUEST },
        {
          type: EDIT_CONSTRAINT_SUCCESS,
          data: { payload: JSON.parse(data), status: 200 },
        },
      ]

      store.dispatch(editConstraint(postQuery));
      store.subscribe(() => {
        expect(fetch.mock.calls[0][0]).toEqual(`${apiBaseURL}/data-constraint`)
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('Edit Constraint failure', () => {
        const postQuery = {
          downloadType: "agent",
          enabled: true,
          endDateInterval: "TODAY-1",
          expression: "CURRENT_VALUE>=HISTORY_VALUE",
          id: 4,
          metricSource: "field:L_ListingID",
          notes: "Testint",
          phase: "Canonical Raw Data",
          source: "MDP_NJ_MCMLS",
          startDateInterval: "TODAY"
        }
        const store = mockStore({});
        window.fetch = jest
        .fn()
        .mockRejectedValueOnce( {status: 400, error:{} })

        const expectedActions = [
          { type: EDIT_CONSTRAINT_REQUEST },
          {
            type: EDIT_CONSTRAINT_FAILURE,
            error: {
              "error": {
                "message": "Something went wrong. Please try again later."
              },
              "status": "",
              "statusText": ""
            }
          }
        ]

        store.dispatch(editConstraint(postQuery));
        store.subscribe(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
});
