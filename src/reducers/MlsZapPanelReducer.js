// @flow

import {
    TOGGLE_SIDEBAR,
    NAVIGATION_URL_UPDATE,
    UPDATE_LINK_STATUS
  } from 'constants/action';
import _ from 'lodash';
import { getSessionData } from 'utils/session';

  const initialState = {
      panelIsOpen: false,
      pathname: '/',
      linkStatus: []
  }

  export default function MLSZapPanelReducer(state: Object = initialState, action: Object) {
    const newState = _.cloneDeep(state);

    switch(action.type) {
      case TOGGLE_SIDEBAR:
        newState.panelIsOpen = !state.panelIsOpen;
        return  {
          ...newState
        }

      case NAVIGATION_URL_UPDATE:
        newState.pathname = action.pathname;
        return  {
          ...newState
        }

      case UPDATE_LINK_STATUS:
        newState.linkStatus = getSessionData('MlsStages');
        return  {
          ...newState
        }

      default:
        return state;
    }
  }
