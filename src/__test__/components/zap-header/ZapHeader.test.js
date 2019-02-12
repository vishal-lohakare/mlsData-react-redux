// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ZapHeaderComp as ZapHeader } from 'components';

const MlsZapPanelAction = {
  toggleSideBar: jest.fn()
 };

 const MlsZapHeaderAction = {
  clearSessionData: jest.fn()
 };

const inputData = {
  MlsLogin: {isShowFullHeader:true},
  MlsZapPanelAction,
  MlsZapHeaderAction
  };

describe('ZapHeader component', () => {
  it('should render correctly.', () => {
    const output = shallow(<ZapHeader {...inputData}/>);
    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('Navigation Panel toggle should be triggered correctly', () => {
    const wrapper = shallow(<ZapHeader {...inputData} />);
    const event = { preventDefault() {} };
    const spy = jest.spyOn(wrapper.instance(), "handlePanelClick");
    wrapper.instance().forceUpdate();
    wrapper.find("Button").simulate('click', event);
    expect(spy).toBeCalled();
    expect(MlsZapPanelAction.toggleSideBar).toBeCalled();
  });

  it('logout functionality should work as expected', () => {
    const wrapper = shallow(<ZapHeader {...inputData} />);
    const event = { preventDefault() {} };
    const spy = jest.spyOn(wrapper.instance(), "handleLogout");
    wrapper.instance().forceUpdate();
    wrapper.find(".logoutWrapper").simulate('click', event);
    expect(spy).toBeCalled();
    expect(MlsZapHeaderAction.clearSessionData).toBeCalled();
  });
});
