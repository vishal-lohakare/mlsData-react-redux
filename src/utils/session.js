import _ from 'lodash';

const getSessionData = (key) => {
  return (key === 'MlsStages') ? JSON.parse(localStorage.getItem(key)) :  localStorage.getItem(key);
};

const setSessionData = (key, value) => {
  if(key === 'MlsStages'){
    let stages = [];
    if(getSessionData(key) !== null && getSessionData(key).length != 0){
      stages = getSessionData(key);
    }
    stages = _.union(stages, value);
    localStorage.setItem(key, JSON.stringify(stages));
  }else{
    return localStorage.setItem(key, value);
  }
};

const clearSessionData = (key) => {
  return (key) ? localStorage.removeItem(key) : localStorage.clear();
};

const setCookieData = (cookieName, cookieValue) => {
  document.cookie = cookieName+ '=' + cookieValue +'; path=/';
}

const getCookie = (cname) => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieData = decodedCookie.split(';');
    for(let i = 0; i <cookieData.length; i++) {
      let cookieItem = cookieData[i];
      while (cookieItem.charAt(0) == ' ') {
          cookieItem = cookieItem.substring(1);
      }
      if (cookieItem.indexOf(name) == 0) {
        return cookieItem.substring(name.length, cookieItem.length);
      }
    }
    return '';
}

const clearCookie = () => {
  document.cookie =
  'zapToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  document.cookie =
  'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export { getSessionData, setSessionData, clearSessionData, setCookieData, clearCookie, getCookie };
