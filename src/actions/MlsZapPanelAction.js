import {
  TOGGLE_SIDEBAR,
  NAVIGATION_URL_UPDATE,
  UPDATE_LINK_STATUS
} from 'constants/action';

export const toggleSideBar = () => ({
    type: TOGGLE_SIDEBAR
});

export const navigationUrlUpdate = (pathname) => ({
    type: NAVIGATION_URL_UPDATE,
    pathname: pathname
});

export const updateLinkStatus = (linkstatus) => ({
    type: UPDATE_LINK_STATUS,
    linkStatus: linkstatus
});
