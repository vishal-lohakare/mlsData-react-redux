import MLSLoginReducer from 'reducers/MlsLoginReducer';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SHOW_FULL_HEADER
} from 'constants/action';


const initialState = {
  MlsLogin: {
    isLoading: false,
  },
  showFullHeader: {
    isShowFullHeader: false
  }
}

describe('MlsLogin reducer', () => {

  it('reducer should return initialState', () => {
    expect(MLSLoginReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return request action data', () => {
    const expectedData = {
      MlsLogin:
      {
        isLoading: true,
        isResponseSuccess: false,
        isFail: false,
      },
      showFullHeader: {
        isShowFullHeader: false
      }
    }
    expect(MLSLoginReducer(initialState, {
      type: LOGIN_REQUEST,
      data: {}
    })).toEqual(expectedData);
  })

  it('reducer should return success action data ', () => {
    const expectedData = {
      MlsLogin:
      {
        isLoading: false,
        error: {},
        isResponseComplete: true,
        isResponseSuccess: true,
        isFail: false,
        payload: {
          token: "khasjdasdjk"
        },
        status: 200
      },
      showFullHeader: {
        isShowFullHeader: false
      }
    }
    expect(MLSLoginReducer(initialState, {
      type: LOGIN_SUCCESS,
      data: {
        payload: {
          token: "khasjdasdjk"
        },
        status: 200
      }
    })).toEqual(expectedData);
  })

  it('reducer should return failure action data ', () => {
    const expectedData = {
      MlsLogin:
      {
        isFail: true,
        isResponseSuccess: false,
        isResponseComplete: true,
        isLoading: false,
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      },
      showFullHeader: {
        isShowFullHeader: false
      }
    }
    expect(MLSLoginReducer(initialState, {
      type: LOGIN_FAILURE,
      error: {
        error: {
          errorMessage: "Unauthorized"
        },
        status: 401
      }
    })).toEqual(expectedData);
  })

  it('reducer should return showFullHeader boolean ', () => {
    const expectedData = {
      MlsLogin:
      {
        isLoading: false,
      },
      showFullHeader: {
        isShowFullHeader: true
      }
    }
    expect(MLSLoginReducer(initialState, {
      type: SHOW_FULL_HEADER,
      isShowFullHeader: true

    })).toEqual(expectedData);
  })

})
