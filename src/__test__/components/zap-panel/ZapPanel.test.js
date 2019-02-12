// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ZapPanelComp as ZapPanel }  from 'components';

const MlsZapPanelAction = {
  toggleSideBar: jest.fn()
 };

const inputData = {
  MlsZapPanelData: {
    panelIsOpen: true,
    pathname: '/standardValue',
    linkStatus: [0, 1]
  },
  showFullHeader : {
    isShowFullHeader: true
  },
  MlsZapPanelAction
};

describe('ZapPanel component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<ZapPanel  {...inputData}/>);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('Link click function should be triggered correctly', () => {
    const wrapper = shallow(<ZapPanel {...inputData} />);
    const event = { preventDefault() {} };
    const spy = jest.spyOn(wrapper.instance(), "handleLinkClick");
    wrapper.instance().forceUpdate();
    wrapper.find("NavItem").at(1).simulate('click', event);
    expect(spy).toBeCalled();
    expect(MlsZapPanelAction.toggleSideBar).toBeCalled();
  });

});
