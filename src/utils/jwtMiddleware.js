import { API } from 'utils/API';
import { getCookie, setCookieData } from 'utils/session.js';
import { showLoader, hideLoader } from 'utils/loader';
import jwt from 'jwt-simple';
import moment from 'moment';
import {
  TOKEN_REFRESH_REQUEST,
  TOKEN_REFRESH_FAILURE
} from 'constants/action.js'

export default function jwtMiddleware({ dispatch }) {
  return (next) => (action) => {
    if (typeof action === 'object') {
      if (getCookie('zapToken')) {
        var tokenExpiration = jwt.decode(getCookie('zapToken'), '', 'HS256').exp;
        if (action.type !== 'TOKEN_REFRESH_REQUEST' && tokenExpiration && (moment.unix(tokenExpiration) - moment(Date.now()) < 300000)) {
          showLoader();
          return refreshToken(dispatch).then(() => next(action));
        }
      }
    }
    return next(action);
  };
}

export function refreshToken(dispatch) {
  var freshTokenPromise = new API().get('/api/jwt/refresh', false, {}, 'http://authentication.services.aur.test.ziprealty.com')
    .then(response => {
      response.text().then((data) => {
        hideLoader();
        setCookieData('zapToken', JSON.parse(data).tokens.zap);
      })
    })
    .catch(error => {
        dispatch({
            type: TOKEN_REFRESH_FAILURE
        });
        return Promise.reject(error);
    });

  dispatch({
      type: TOKEN_REFRESH_REQUEST,
      freshTokenPromise
  });

  return freshTokenPromise;
}
