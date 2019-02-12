import MlsSearchReducer from 'reducers/MlsSearchReducer';
import {
  GET_MLS_DETAILS_REQUEST,
  GET_MLS_DETAILS_SUCCESS,
  GET_MLS_DETAILS_FAILURE,
  UPDATE_MLS_STATE_REQUEST,
  UPDATE_MLS_STATE_SUCCESS,
  UPDATE_MLS_STATE_FAILURE,
  POST_MLS_PLAY_AGENT_REQUEST,
  POST_MLS_PLAY_AGENT_SUCCESS,
  POST_MLS_PLAY_AGENT_FAILURE,
  POST_MLS_PLAY_LISTING_REQUEST,
  POST_MLS_PLAY_LISTING_SUCCESS,
  POST_MLS_PLAY_LISTING_FAILURE,
  POST_MLS_PLAY_OFFICE_REQUEST,
  POST_MLS_PLAY_OFFICE_SUCCESS,
  POST_MLS_PLAY_OFFICE_FAILURE,
  POST_MLS_PLAY_OPEN_HOUSE_REQUEST,
  POST_MLS_PLAY_OPEN_HOUSE_SUCCESS,
  POST_MLS_PLAY_OPEN_HOUSE_FAILURE,
  POST_MLS_PLAY_PHOTO_REQUEST,
  POST_MLS_PLAY_PHOTO_SUCCESS,
  POST_MLS_PLAY_PHOTO_FAILURE
} from 'constants/action';

const initialState = {
  MlsDetailsInfo: {
    isLoading: false
  },
  MlsUpdateInfo: {
    isLoading: false
  },
  MlsPlayInfo: {
    isLoading: false
  }
};

const downloadRequestExpectedData = {
  ...initialState,
  MlsPlayInfo:
  {
    isLoading: true,
    isResponseSuccess: false,
    isFail: false,
  },
};

const payloadValue = [];
const downloadSuccessExpectedData = {
  ...initialState,
  MlsPlayInfo:
  {
    isLoading: false,
    error: {},
    isResponseComplete: true,
    isResponseSuccess: true,
    isFail: false,
    payload: payloadValue,
    status: 200
  }
};

const downloadFailureExpectedData = {
  ...initialState,
  MlsPlayInfo:
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
};

describe('Mls search reducer', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="loading" className="hide">' +
    '<div><img src={require("images/loader.gif")} /></div>' +
    '</div>';
  });

  it('reducer should return initialState', () => {
    expect(MlsSearchReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return get mls request action data', () => {
    const expectedData = {
      ...initialState,
      MlsDetailsInfo:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    };
    expect(MlsSearchReducer(initialState, {
      type: GET_MLS_DETAILS_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return get mls success action data ', () => {
    const expectedData = {
      ...initialState,
      MlsDetailsInfo:
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
    expect(MlsSearchReducer(initialState, {
      type: GET_MLS_DETAILS_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return get mls failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsDetailsInfo:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false
      }
    };
    expect(MlsSearchReducer(initialState, {
      type: GET_MLS_DETAILS_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  });

  it('reducer should return update mls request action data', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateInfo:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
    };
    expect(MlsSearchReducer(initialState, {
      type: UPDATE_MLS_STATE_REQUEST,
      data: {}
    })).toEqual(expectedData);
  });

  it('reducer should return update mls success action data ', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateInfo:
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
    expect(MlsSearchReducer(initialState, {
      type: UPDATE_MLS_STATE_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(expectedData);
  });

  it('reducer should return update mls failure action data ', () => {
    const expectedData = {
      ...initialState,
      MlsUpdateInfo:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false
      }
    };
    expect(MlsSearchReducer(initialState, {
      type: UPDATE_MLS_STATE_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  });

  it('reducer should return post agent request action data', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_AGENT_REQUEST,
      data: {}
    })).toEqual(downloadRequestExpectedData);
  });

  it('reducer should return post agent success action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_AGENT_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(downloadSuccessExpectedData);
  });

  it('reducer should return post agent failure action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_AGENT_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(downloadFailureExpectedData);
  });

  it('reducer should return post listing request action data', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_LISTING_REQUEST,
      data: {}
    })).toEqual(downloadRequestExpectedData);
  });

  it('reducer should return post listing success action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_LISTING_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(downloadSuccessExpectedData);
  });

  it('reducer should return post listing failure action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_LISTING_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(downloadFailureExpectedData);
  });

  it('reducer should return post office request action data', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_OFFICE_REQUEST,
      data: {}
    })).toEqual(downloadRequestExpectedData);
  });

  it('reducer should return post office success action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_OFFICE_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(downloadSuccessExpectedData);
  });

  it('reducer should return post office failure action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_OFFICE_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(downloadFailureExpectedData);
  });

  it('reducer should return open house request action data', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_OPEN_HOUSE_REQUEST,
      data: {}
    })).toEqual(downloadRequestExpectedData);
  });

  it('reducer should return open house success action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_OPEN_HOUSE_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(downloadSuccessExpectedData);
  });

  it('reducer should return open house failure action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_OPEN_HOUSE_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(downloadFailureExpectedData);
  });

  it('reducer should return photo request action data', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_PHOTO_REQUEST,
      data: {}
    })).toEqual(downloadRequestExpectedData);
  });

  it('reducer should return photo success action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_PHOTO_SUCCESS,
      data: {
        payload: payloadValue,
        status: 200,
      }
    })).toEqual(downloadSuccessExpectedData);
  });

  it('reducer should return photo failure action data ', () => {
    expect(MlsSearchReducer(initialState, {
      type: POST_MLS_PLAY_PHOTO_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(downloadFailureExpectedData);
  });
});