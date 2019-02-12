// @flow

import thunk from 'redux-thunk';
import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import callAPIMiddleware from './networkMiddlewareUtils';
import jwtMiddleware from './jwtMiddleware'
import MLSConfigureReducer from 'reducers/MlsConfigureReducer';
import MLSSearchReducer from 'reducers/MlsSearchReducer';
import MLSLoginReducer from 'reducers/MlsLoginReducer';
import MLSZapPanelReducer from 'reducers/MlsZapPanelReducer';
import MLSUrlBuilderReducer from 'reducers/MlsUrlBuilderReducer';
import MLSCanonicalMappingReducer from 'reducers/MlsCanonicalMappingReducer';
import MLSStandardValueReducer from 'reducers/MlsStandardValueReducer';
import MLSContextVariableReducer from 'reducers/MlsContextVariableReducer';
import MLSSchedulerReducer from 'reducers/MlsSchedulerReducer';
import MLSMonitoringReducer from 'reducers/MlsMonitoringReducer';
import MLSDataConstraintsReducer from 'reducers/MlsDataConstraintsReducer';

const reducers = combineReducers({
  MLSSearchData: MLSSearchReducer,
  MLSConfigureData: MLSConfigureReducer,
  MLSLoginData: MLSLoginReducer,
  MLSZapPanelData: MLSZapPanelReducer,
  MLSUrlBuilderData: MLSUrlBuilderReducer,
  MLSCanonicalData: MLSCanonicalMappingReducer,
  MLSStandardValueData: MLSStandardValueReducer,
  MlsContextVariablesData: MLSContextVariableReducer,
  MlsSchedulerData: MLSSchedulerReducer,
  MLSMonitoringData: MLSMonitoringReducer,
  MLSConstraintsData: MLSDataConstraintsReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_SESSION_DATA') {
    state = undefined
  }

  return reducers(state, action)
 }


const middleware = [thunk, callAPIMiddleware, jwtMiddleware];

export const store = createStore(rootReducer, compose(
  applyMiddleware(...middleware),
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
    ?
    window.devToolsExtension()
    :
    f => f
));
