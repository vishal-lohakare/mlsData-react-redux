import MlsDataConstraintsReducer from 'reducers/MlsDataConstraintsReducer';
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

const payloadValue =[];

const initialState = {
  MlsConstraintsInfo: {
    isLoading: false
  },
  MlsNames: {
    isLoading: false,
    payload: [],
  },
  ConstraintPhases: {
    isLoading: false,
    payload: []
  },
  ConstraintFields: {
    isLoading: false,
    payload: []
  },
  ConstraintFieldValues: {
    isLoading: false,
    payload: []
  },
  ConstraintFieldMetrics: {
    isLoading: false,
    payload: []
  },
  ConstraintExpression: {
    isLoading: false,
    payload: []
  },
  CreateConstraint: {
    isLoading: false
  },
  EditConstraint: {
    isLoading: false
  },
  MlsConstraintUpdateInfo: {
    isLoading: false
  }
};

describe('Mls Data Constraints reducer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MlsDataConstraintsReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return get data constraints request action data', () => {
    const expectedData = {
      ...initialState,
      MlsConstraintsInfo:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_DATA_CONSTRAINTS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get data constraints success action data ', () => {
    const expectedData = {
      ...initialState,
      MlsConstraintsInfo:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_DATA_CONSTRAINTS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get data constraints failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsConstraintsInfo:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false
      }
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_DATA_CONSTRAINTS_FAILURE
    })).toEqual(expectedData);
  });

  it('reducer should return update data constraints request action data', () => {
    const expectedData = {
      ...initialState,
      MlsConstraintUpdateInfo:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: ENABLE_DISABLE_DATA_CONSTRAINT_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return update data constraints success action data ', () => {
    const expectedData = {
      ...initialState,
      MlsConstraintUpdateInfo:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: payloadValue,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: ENABLE_DISABLE_DATA_CONSTRAINT_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return update data constraints failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsConstraintUpdateInfo:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false
      }
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: ENABLE_DISABLE_DATA_CONSTRAINT_FAILURE
    })).toEqual(expectedData);
  });

  it('reducer should return MLS Names request action data', () => {
    const expectedData = {
      ...initialState,
      MlsNames:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_MLS_NAMES_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return MLS Names success action data ', () => {
    const MlsNamespayload = ["MDP_IA_DMAAR","TEMP","MDP_NJ_MCMLS","MDP_OK_OKC","MDP_MI_NGLRMLS"];
    const expectedData = {
      ...initialState,
      MlsNames:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_MLS_NAMES_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return MLS Names failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsNames:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        payload: []
      }
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_MLS_NAMES_FAILURE,
      error: {},
      status: 400
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Phases request action data', () => {
    const expectedData = {
      ...initialState,
      ConstraintPhases:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_PHASES_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Phases success action data ', () => {
    const MlsNamespayload = ["Download Request","Download Raw Data","Canonical Raw Data","Standardize Canonical Data","Enrich Data","Publishing"];
    const expectedData = {
      ...initialState,
      ConstraintPhases:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_PHASES_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Phases failure action data ', () => {
    const expectedData = {
      ...initialState,
      ConstraintPhases:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        payload: []
      }
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_PHASES_FAILURE,
      error: {},
      status: 400
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Fields request action data', () => {
    const expectedData = {
      ...initialState,
      ConstraintFields:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELDS_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Fields success action data ', () => {
    const MlsNamespayload = [{"id":1,"downloadId":"214","metricSource":"L_ListingID","phase":"phase","numOfNulls":0,"standardDeviation":0.0,"min":"0","max":"1"},{"id":2,"downloadId":"214","metricSource":"L_Class","phase":"phase","numOfNulls":0,"standardDeviation":0.0,"min":"0","max":"1"}];
    const expectedData = {
      ...initialState,
      ConstraintFields:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELDS_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Fields failure action data ', () => {
    const expectedData = {
      ...initialState,
      ConstraintFields:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        payload: []
      }
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELDS_FAILURE,
      error: {},
      status: 400
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Field Values request action data', () => {
    const expectedData = {
      ...initialState,
      ConstraintFieldValues:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELD_VALUES_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Field Values success action data ', () => {
    const MlsNamespayload = ["W", "A", "C"];
    const expectedData = {
      ...initialState,
      ConstraintFieldValues:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELD_VALUES_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Field Values failure action data ', () => {
      const expectedData = {
        ...initialState,
        ConstraintFieldValues:
        {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
          payload: []
        }
      };
      expect(MlsDataConstraintsReducer(initialState, {
        type: GET_CONSTRAINT_FIELD_VALUES_FAILURE,
        error: {},
        status: 400
      })).toEqual(expectedData);
    });


  it('reducer should return Constraint Field Metrics request action data', () => {
    const expectedData = {
      ...initialState,
      ConstraintFieldMetrics:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELD_METRICS_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Field Metrics success action data ', () => {
    const MlsNamespayload = ["median","non_null_count","null_count","null_percent","pattern_count","standard_deviation","total_count","unique_count","uniqueness"];
    const expectedData = {
      ...initialState,
      ConstraintFieldMetrics:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_FIELD_METRICS_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Field Metrics failure action data ', () => {
      const expectedData = {
        ...initialState,
        ConstraintFieldMetrics:
        {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
          payload: []
        }
      };
      expect(MlsDataConstraintsReducer(initialState, {
        type: GET_CONSTRAINT_FIELD_METRICS_FAILURE,
        error: {},
        status: 400
      })).toEqual(expectedData);
    });


  it('reducer should return Constraint Expression request action data', () => {
    const expectedData = {
      ...initialState,
      ConstraintExpression:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
        payload: []
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_EXPRESSION_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Expression success action data ', () => {
    const MlsNamespayload = ["median","non_null_count","null_count","null_percent","pattern_count","standard_deviation","total_count","unique_count","uniqueness"];
    const expectedData = {
      ...initialState,
      ConstraintExpression:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: GET_CONSTRAINT_EXPRESSION_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Constraint Expression failure action data ', () => {
      const expectedData = {
        ...initialState,
        ConstraintExpression:
        {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
          payload: []
        }
      };
      expect(MlsDataConstraintsReducer(initialState, {
        type: GET_CONSTRAINT_EXPRESSION_FAILURE,
        error: {},
        status: 400
      })).toEqual(expectedData);
    });

  it('reducer should return Create Constraint request action data', () => {
    const expectedData = {
      ...initialState,
      CreateConstraint:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: CREATE_CONSTRAINT_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Create Constraint success action data ', () => {
    const MlsNamespayload = {};
    const expectedData = {
      ...initialState,
      CreateConstraint:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: CREATE_CONSTRAINT_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Create Constraint failure action data ', () => {
      const expectedData = {
        ...initialState,
        CreateConstraint:
        {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
        }
      };
      expect(MlsDataConstraintsReducer(initialState, {
        type: CREATE_CONSTRAINT_FAILURE,
        error: {},
        status: 400
      })).toEqual(expectedData);
    });

  it('reducer should return Edit Constraint request action data', () => {
    const expectedData = {
      ...initialState,
      EditConstraint:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: EDIT_CONSTRAINT_REQUEST
    })).toEqual(expectedData);
  });

  it('reducer should return Edit Constraint success action data ', () => {
    const MlsNamespayload = {};
    const expectedData = {
      ...initialState,
      EditConstraint:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: MlsNamespayload,
        status: 200
      },
    };
    expect(MlsDataConstraintsReducer(initialState, {
      type: EDIT_CONSTRAINT_SUCCESS,
      data: {
        payload: MlsNamespayload,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return Edit Constraint failure action data ', () => {
      const expectedData = {
        ...initialState,
        EditConstraint:
        {
          isFail: true,
          isResponseSuccess: false,
          isResponseComplete: true,
          isLoading: false,
        }
      };
      expect(MlsDataConstraintsReducer(initialState, {
        type: EDIT_CONSTRAINT_FAILURE,
        error: {},
        status: 400
      })).toEqual(expectedData);
    });


});
