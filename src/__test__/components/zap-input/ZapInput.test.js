// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ZapInput } from 'components';

const mockFn = jest.fn();
const zapInput = {
  defaultValue: "",
  name: "input",
  placeholder: "type a text",
  type: "text",
  handleChange: mockFn,
  handleBlur: mockFn,
  errorMessage: "Please, write some text",
  minLength: 20,
  maxLength: 40
};

describe('ZapInput component', () => {
  it('ZapInput should render correctly', () => {
    const wrapper = shallow(<ZapInput {...zapInput} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('ZapInput with label should render correctly', () => {
    const temp = {
      ...zapInput,
      label: "Label"
    }
    const wrapper = shallow(<ZapInput {...temp} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('ZapInput with label should render correctly', () => {
    const temp = {
      ...zapInput,
      errorState: true,
      errorMessage: "Please enter value"
    }
    const wrapper = shallow(<ZapInput {...temp} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('ZapInput OnChange function should be triggered correctly', () => {
    const wrapper = shallow(<ZapInput {...zapInput} />);
    const event = { preventDefault() {}, target: { value: 'theValue' } };
    const spy = jest.spyOn(wrapper.instance(), "handleChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('ZapInput OnBlur function should be triggered correctly', () => {
    const wrapper = shallow(<ZapInput {...zapInput} />);
    const event = { preventDefault() {}, target: { value: 'theValue' } };
    const spy = jest.spyOn(wrapper.instance(), "handleBlur");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('blur', event);
    expect(spy).toBeCalled();
  });

});
