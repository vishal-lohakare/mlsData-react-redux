import {
  apiBaseURL,
  autocompleteURL
} from 'constants/global';
import _ from 'lodash';
import { getCookie } from 'utils/session';

export class API {
  _getHeader(customHeader) {
    return {
      ...customHeader,
      'Accept': 'application/json',
      'Content-Type': 'application/json;charet=UTF-8'
    }
  }


  async get(url, preAuth, customHeader, customBaseUrl='') {
    const commonHeaders = this._getHeader(customHeader);
    const finalBaseUrl = _.isEmpty(customBaseUrl) ? apiBaseURL : customBaseUrl;

    if (!preAuth) {
      const token = (url === '/api/jwt/refresh') ? getCookie('refreshToken') : getCookie('zapToken');
      const headers = {
        ...commonHeaders,
        'Authorization' : `Bearer ${token}`,
      };
      return fetch(`${finalBaseUrl}${url}`, { headers, method: 'GET'});
    } else {
        return fetch(`${finalBaseUrl}${url}`, { headers: commonHeaders, method: 'GET'});
    }

  }

  async getFile(fileName, type) {

    if (getCookie("zapToken") !== '') {
      const token = getCookie("zapToken");
      const headers = {
        'Content-Disposition': 'attachment',
        'Authorization' : `Bearer ${token}`,
      };

     return fetch(`${apiBaseURL}/mls-metadata/file/${fileName}?type=${type}`, { headers, method: 'GET'})
      .then(response => response.text()).then(result => result);
    } else {
      return "Authentication failed";
    }

  }

  async post(url, preAuth, data, autocomplete = null) {
    const commonHeaders = this._getHeader();
    const finalBaseUrl = Object.is(autocomplete, null) ? apiBaseURL : autocompleteURL;
    if (!preAuth) {
      const token = getCookie("zapToken");

      const headers = {
        ...commonHeaders,
        'Authorization' : `Bearer ${token}`,
      };

      return fetch(`${finalBaseUrl}${url}`, { headers, method: 'POST', body: data});

    } else {
      return fetch(`${finalBaseUrl}${url}`, { headers: commonHeaders, method: 'POST', body: data});
    }

  }

  async put(url, preAuth, data) {
    const commonHeaders = this._getHeader();
    if (!preAuth) {
      const token = getCookie("zapToken");

      const headers = {
        ...commonHeaders,
        'Authorization' : `Bearer ${token}`,
      };

      return fetch(`${apiBaseURL}${url}`, { headers, method: 'PUT', body: data});

    } else {
      return fetch(`${apiBaseURL}${url}`, { headers: commonHeaders, method: 'PUT', body: data});
    }

  }

  async delete(url, preAuth, data) {
    const commonHeaders = this._getHeader();
    if (!preAuth) {
      const token = getCookie("zapToken");

      const headers = {
        ...commonHeaders,
        'Authorization' : `Bearer ${token}`,
      };

      return fetch(`${apiBaseURL}${url}`, { headers, method: 'DELETE', body: JSON.stringify(data)});

    } else {
      return fetch(`${apiBaseURL}${url}`, { headers: commonHeaders, method: 'DELETE', body: JSON.stringify(data)});
    }

  }
}
