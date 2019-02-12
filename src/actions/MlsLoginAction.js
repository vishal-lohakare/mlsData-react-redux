// @flow

import { API } from 'utils/API';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SHOW_FULL_HEADER
} from 'constants/action.js'
import history from 'utils/history';
import type { Dispatch } from 'react-redux';
import { setSessionData, setCookieData } from 'utils/session';
import { startSparkSession } from 'actions/MlsCanonicalMappingAction';

function createLoginData(data) {
  const authValue =  btoa(data.username + ":" + data.password);
  const customHeader = {'authorization': `Basic ${authValue}`};
  return customHeader;
}

export const loginMls = (data: Object) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE],
      callAPI: () => new API().get('/api/jwt/login?withRefresh=true', true, createLoginData(data), 'http://authentication.services.aur.test.ziprealty.com'),
      handleSuccess: (response) => {
        setCookieData('zapToken', response.tokens.zap);
        setCookieData('refreshToken', response.tokens.refresh);
        setCookieData('userName', data.username);
        setSessionData('MlsStages', ['/mlsSearch', '/monitoring', '/dataConstraints']);
        dispatch(showFullHeader(true));
        dispatch(startSparkSession());
        history.push('/mlsSearch', '/monitoring', '/dataConstraints');
      }
    });
  }
}

export const showFullHeader = (isShowFullHeader: boolean) => {
  return {
    type: SHOW_FULL_HEADER,
    isShowFullHeader: isShowFullHeader
  }
}
