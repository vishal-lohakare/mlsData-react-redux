import _ from 'lodash';

export const requestData = (state, stateName) => {
  let newState = _.cloneDeep(state);
  newState[stateName] = Object.assign(newState[stateName], {
    isLoading: true,
    isResponseSuccess: false,
    isFail: false,
  });
  return newState;
}

export const successData = (state, payload, stateName) => {
  let newState = _.cloneDeep(state);
  newState[stateName] = Object.assign(newState[stateName], {
    error: {},
    ...payload,
    isLoading: false,
    isResponseSuccess: true,
    isFail: false,
    isResponseComplete: true,
  });
  return newState;
}

export const failureData = (state, error, stateName) => {
  let newState = _.cloneDeep(state);
  newState[stateName] = Object.assign(newState[stateName], {
    ...error,
    isFail: true,
    isResponseSuccess: false,
    isResponseComplete: true,
    isLoading: false,
  });
  return newState;
}
