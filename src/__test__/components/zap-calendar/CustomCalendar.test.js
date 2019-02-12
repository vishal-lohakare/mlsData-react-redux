import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { CustomCalendar } from 'components';
import Calendar from 'react-calendar';
import moment from 'moment';

const inputProps = {
  selectedDate: new Date(2018, 11, 24),
  onChangeDate: () => {},
}

describe('Custom Calendar', () => {
  it('Custom calendar should render correctly', () => {
    const wrapper = shallow(<CustomCalendar {...inputProps} />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('toggleCalendar function should be triggered correctly', () => {
    const wrapper = shallow(<CustomCalendar {...inputProps} minDate={new Date()}/>);
    const spy = jest.spyOn(wrapper.instance(), "toggleCalendar");
    wrapper.instance().forceUpdate();
    wrapper.find('Button').simulate('click');
    expect(spy).toBeCalled();
  });

  it('onChangeDate function should be triggered correctly with without select range prop', () => {
    const wrapper = shallow(<CustomCalendar {...inputProps}/>);
    wrapper.setState({isCalendarOpen: true});
    const spy = jest.spyOn(wrapper.instance(), "onChangeDate");
    wrapper.instance().forceUpdate();
    wrapper.find(Calendar).prop('onChange')(new Date());
    expect(spy).toBeCalled();
  });

  it('onChangeDate function should be triggered correctly with with select range prop', () => {
    const wrapper = shallow(<CustomCalendar {...inputProps} selectRange={true}/>);
    wrapper.setState({isCalendarOpen: true});
    const spy = jest.spyOn(wrapper.instance(), "onChangeDate");
    wrapper.instance().forceUpdate();
    const date = [
      new Date(moment(new Date()).startOf('week')),
      new Date(moment(new Date()).endOf('week'))
    ];
    wrapper.find(Calendar).prop('onChange')(date);
    expect(spy).toBeCalled();
  });

  it('componentWillUnmount should be called on unmount', () => {
    const component = shallow(<CustomCalendar {...inputProps}/>);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

  it('onDocumentClick function should be triggered correctly', () => {
    const map = {};
    const mockFn = jest.fn();
    document.addEventListener = jest.fn((event, mockFn) => {
      map[event] = mockFn;
    });
    const wrapper = mount(<CustomCalendar {...inputProps}/>);
    map.click();
  });

})
