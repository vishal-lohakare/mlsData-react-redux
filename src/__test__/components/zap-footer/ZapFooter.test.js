// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import {ZapFooter} from 'components';

describe('ZapFooter component', () => {
  it('should render correctly.', () => {
    const output = shallow(<ZapFooter/>);
    expect(shallowToJson(output)).toMatchSnapshot();
  });
});
