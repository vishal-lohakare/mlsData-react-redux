import React from 'react';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { AutoCompleteComp as AutoComplete }  from 'components';

const functions = [
  {
    "name":"concat",
    "type":"fn(exprs_varargs: Column) -> Column",
    "doc":"Concatenates multiple input string columns together into a single string column.",
    "origin":"apache-spark-functions"
  },
  {
    "name":"concat_ws",
    "type":"fn(sep: string, exprs_varargs: Column) -> Column",
    "doc":"Concatenates multiple input string columns together into a single string column, using the given separator.",
    "origin":"apache-spark-functions"
  },
  {
    "name":"contains",
    "type":"fn(e: Column, other: Column) -> Column",
    "doc":"Contains the other column.",
    "origin":"apache-spark-functions"
  },
  {
    "name":"conv",
    "type":"fn(num: Column, fromBase: number, toBase: number) -> Column",
    "doc":"Convert a number in a string column from one base to another.",
    "origin":"apache-spark-functions"
  }
]

const inputProps = {
  MlsGetAutoCompleteOptionsData: {
    payload: {
      functions: functions
    }
  },
  MlsCanonicalActions: {
    getAutoCompleteOptions: jest.fn()
  },
  selectedFields: [{
    id: '7OtNhsQo9EL7OdyVImlf',
    tableSystemName: 'ADD0',
    standardName: 'null',
    shortName: 'Street Address',
    longName: 'Street Address',
    lookupName: 'Street Address',
    relevance: 100,
    active: false
  },
  {
    id: 'LfN3mCZe8QiN89tqVn8x',
    tableSystemName: 'OFFICE_14',
    standardName: 'null',
    shortName: 'Zip',
    longName: 'Zip',
    lookupName: 'null',
    relevance: 0,
    active: false
  }],
  value: "",
  udfs: [{"id":1,"enumValue":"SUM_ALL","description":"Sum of all numbers coming from raw columns data","active":true,"lastUpdateTs":1539791700000,"createTs":1539791700000,"expression":null}],
  onChange: jest.fn()
};

describe('Zap Autocomplete component', () => {
  it('should render correctly.', () => {
    const wraper = shallow(<AutoComplete {...inputProps}/>);
    expect(shallowToJson(wraper)).toMatchSnapshot();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, target: { value: 'con' } };
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('handleKeyDown function should be triggered correctly down', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    document.body.innerHTML = '<ul id="listBox" />';
    const event = { preventDefault() {}, keyCode: 40 };
    wrapper.setState({
      showAutoCompleteContainer: true
    });
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDown");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('keyDown', event);
    expect(spy).toBeCalled();
  });

  it('handleKeyDown function should be triggered correctly up', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    document.body.innerHTML = '<ul id="listBox" />';
    const event = { preventDefault() {}, keyCode: 38 };
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDown");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('keyDown', event);
    expect(spy).toBeCalled();
  });

  it('handleKeyDown function should be triggered correctly esc', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    document.body.innerHTML = '<ul id="listBox" />';
    const event = { preventDefault() {}, keyCode: 27 };
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDown");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('keyDown', event);
    expect(spy).toBeCalled();
  });

  it('handleKeyDown function should be triggered correctly esc', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    document.body.innerHTML = '<ul id="listBox" />';
    const event = { preventDefault() {}, keyCode: 32, ctrlKey: true };
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDown");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('keyDown', event);
    expect(spy).toBeCalled();
  });

  it('handleKeyDown function should be triggered correctly esc', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    document.body.innerHTML = '<ul id="listBox" />';
    const event = { preventDefault() {}, keyCode: 67 };
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDown");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('keyDown', event);
    expect(spy).toBeCalled();
  });

  it('complete function should be triggered correctly', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {} };
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    const spy = jest.spyOn(wrapper.instance(), "completeFunction");
    wrapper.find("li").at(0).simulate('click', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly Down', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 40, target: { nextSibling: {focus: jest.fn() } }};
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly Down', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 40, target: { parentNode: {firstChild: {focus: jest.fn() }}}};
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly Up', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 38, target: { previousSibling: {focus: jest.fn() } }};
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly Up', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 38, target: { parentNode:{ lastChild:{ focus: jest.fn()} }} };
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly Esc', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 27, target: { parentNode: { classList: { remove: jest.fn() } } }};
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly Enter', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 13 };
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    const spy2 = jest.spyOn(wrapper.instance(), "completeFunction");
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
    expect(spy2).toBeCalled();
  });

  it('handleKeyDownOption function should be triggered correctly for default', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 67 };
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownOption");
    document.body.innerHTML = '<input id="autocomplete" type="text"/>';
    wrapper.find("li").at(0).simulate('keyDown', event);
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });


  it('onFocusElement function should be triggered correctly', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onFocusElement");
    wrapper.find("li").at(0).simulate('focus');
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('onFocusAutoComplete function should be triggered correctly', () => {
    const wrapper = shallow(<AutoComplete {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onFocusAutoComplete");
    wrapper.setState({
      showAutoCompleteOptionInfo: true
    });
    wrapper.find("Input").at(0).simulate('focus');
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('componentWillUnmount should be called on unmount', () => {
    const component = shallow(<AutoComplete {...inputProps} />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

  it('onClickOutsideAutoComplete function should be triggered correctly', () => {
    const map = {};
    const mockFn = jest.fn();
    document.addEventListener = jest.fn((event, mockFn) => {
      map[event] = mockFn;
    });
    const wrapper = mount(<AutoComplete {...inputProps}/>);
    map.click();
  });


});
