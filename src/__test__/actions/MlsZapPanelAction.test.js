import { toggleSideBar, navigationUrlUpdate, updateLinkStatus} from 'actions/MlsZapPanelAction';
import {
  TOGGLE_SIDEBAR,
  NAVIGATION_URL_UPDATE,
  UPDATE_LINK_STATUS
} from 'constants/action';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import callAPIMiddleware from 'utils/networkMiddlewareUtils';

const middleware = [thunk, callAPIMiddleware];
const mockStore = configureStore(middleware);

describe('MlsZapPanelActions', () => {

  it('Toggle Sidebar status', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: TOGGLE_SIDEBAR }
    ]

    store.dispatch(toggleSideBar());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Navigate URL update', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: NAVIGATION_URL_UPDATE }
    ]

    store.dispatch(navigationUrlUpdate());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

  it('Update Link Status', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: UPDATE_LINK_STATUS }
    ]

    store.dispatch(updateLinkStatus());
    store.subscribe(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

  });

})
