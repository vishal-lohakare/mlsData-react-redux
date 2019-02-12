import MLSZapPanelReducer from 'reducers/MlsZapPanelReducer';
import {
  TOGGLE_SIDEBAR,
  NAVIGATION_URL_UPDATE
} from 'constants/action';


const initialState = {
  panelIsOpen: false,
  pathname: '/',
  linkStatus: []
}

describe('MlsZapPanel reducer', () => {

  it('reducer should return initialState', () => {
    expect(MLSZapPanelReducer(undefined, {})).toEqual(initialState);
  });

  it('reducer should return navigation URL pathname', () => {
    const expectedData = {
      panelIsOpen: false,
      pathname: '/',
      linkStatus: []
    }
    expect(MLSZapPanelReducer(initialState, {
      type: NAVIGATION_URL_UPDATE,
      pathname: '/',
      linkStatus: []
    })).toEqual(expectedData);
  })

  it('reducer should return panel toggle status', () => {
    const expectedData = {
      panelIsOpen: true,
      pathname: "/",
      linkStatus: []
    }
    expect(MLSZapPanelReducer(initialState, {
      type: TOGGLE_SIDEBAR,
      panelIsOpen: true
    })).toEqual(expectedData);
  })
  
})
