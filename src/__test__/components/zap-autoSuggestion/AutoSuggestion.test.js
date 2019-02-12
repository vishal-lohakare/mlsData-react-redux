import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { AutoSuggestion } from 'components';


const autoSuggestData = [
  {
        "id": 46,
        "mlsInfoId": 2,
        "type": {
            "id": 2,
            "type": "manually completed",
            "parentType": null,
            "lastUpdateTs": "2018-10-04T00:00:00.000Z",
            "createTs": "2018-10-04T00:00:00.000Z"
        },
        "key": "CLASS_OFFICE",
        "value": "CLASS_OFFICE",
        "elasticSearchIndexId": null,
        "hierarchyInfoId": 0,
        "lastUpdateTs": "2018-11-13T00:00:00.000Z",
        "createTs": "2018-11-13T00:00:00.000Z"
    },
    {
        "id": 48,
        "mlsInfoId": 2,
        "type": {
            "id": 2,
            "type": "manually completed",
            "parentType": null,
            "lastUpdateTs": "2018-10-04T00:00:00.000Z",
            "createTs": "2018-10-04T00:00:00.000Z"
        },
        "key": "CLASS_AGENT",
        "value": "CLASS_AGENT",
        "elasticSearchIndexId": null,
        "hierarchyInfoId": 0,
        "lastUpdateTs": "2018-11-13T00:00:00.000Z",
        "createTs": "2018-11-13T00:00:00.000Z"
    }
]

const inputProps = {
  autoSuggestData: autoSuggestData,
  autoSuggestKey: 'key',
  handleInputChange: () => {},
  renderSuggestionItem: () => {},
  onUpdateValueToField: () => {},
  searchKeys: ['key', 'value'],
  suggestionHeader: true,
  renderSuggestionHeader: () => {},
  querySeparator: "=",
  expressionSeparator: ";",
  value: ""
}

const inputPropsWithoutSeparators = {
  autoSuggestData: autoSuggestData,
  autoSuggestKey: 'key',
  handleInputChange: () => {},
  renderSuggestionItem: () => {},
  onUpdateValueToField: () => {},
  searchKeys: ['key', 'value'],
  suggestionHeader: true,
  renderSuggestionHeader: () => {},
  value: ""
}

describe('Zap AutoSuggestion component', () => {
  it('should render correctly.', () => {
    const output = shallow(<AutoSuggestion {...inputProps} />);
    output.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('componentWillUnmount should be called on unmount', () => {
    const component = shallow(<AutoSuggestion {...inputProps} />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

  it('should render correctly without value prop.', () => {
    const output = shallow(<AutoSuggestion {...inputProps} dataValue=""/>);
    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, target: { value: 'Count' } };
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, target: { value: 'Count=1', selectionStart: 7 } };
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, target: { value: 'Count=1;Test=2;', selectionStart: 3 } };
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, target: { value: 'Count=1;Test=2', selectionStart: 10 } };
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, target: { value: ''} };
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('onSelectValue function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} value="Class=A" />);
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true, cursorPosition: 7});
    const spy = jest.spyOn(wrapper.instance(), "onSelectValue");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onSelectValue function should be triggered correctly', () => {
    const wrapper = shallow(<AutoSuggestion {...inputPropsWithoutSeparators} />);
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true, cursorPosition: 7});
    const spy = jest.spyOn(wrapper.instance(), "onSelectValue");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onSelectValue function should be triggered correctly when key is selected', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} value='Class=A' />);
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true, cursorPosition: 3 });
    const item = { id: 3 };
    const spy = jest.spyOn(wrapper.instance(), "onSelectValue");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('click', item);
    expect(spy).toBeCalled();
  });

  it('handleInputKeyup function should be triggered correctly when user has selected key and entered =', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 32, ctrlKey: true, target: { selectionStart: 5 } };
    wrapper.setState({textValue: 'Test=', showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleInputKeyup");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('keyUp', event);
    expect(spy).toBeCalled();
  });

  it('handleInputKeyup function should be triggered correctly when user hit ctrl and space at empty field', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, keyCode: 32, ctrlKey: true, target: { selectionStart: 0 } };
    wrapper.setState({textValue: '', showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleInputKeyup");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('keyUp', event);
    expect(spy).toBeCalled();
  });

  it('handleInputKeyup function should be triggered correctly when user press down arrow', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} suggestionHeader={false} />);
    wrapper.setState({textValue: '', autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    const event = { preventDefault() {}, which: 40 };
    document.body.innerHTML = '<ListGroupItem class="autoSuggestListItem"></ListGroupItem>';
    const spy = jest.spyOn(wrapper.instance(), "handleInputKeyup");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('keyUp', event);
    expect(spy).toBeCalled();
  });

  it('handleInputKeyup function should be triggered correctly when user presses Semicolon', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, which: 186 };
    const spy = jest.spyOn(wrapper.instance(), "handleInputKeyup");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").at(0).simulate('keyUp', event);
    expect(spy).toBeCalled();
  });

  it('handleKeyDownListItem function should be triggered correctly when user press down arrow on list item', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} />);
    const event = { preventDefault() {}, which: 40, target: { nextSibling: {tabindex: 0, focus: jest.fn()}, parentNode: { firstChild: '<div></div>'}}};
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownListItem");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('keyDown', event, 0);
    expect(spy).toBeCalled();
  });

  it('handleKeyDownListItem function should be triggered correctly when user press down arrow on list item', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} suggestionHeader={false} />);
    const event = { preventDefault() {}, which: 40, target: { nextSibling: null, parentNode: { firstChild: {tabindex: 0, focus: jest.fn()}}}};
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownListItem");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('keyDown', event, 0);
    expect(spy).toBeCalled();
  });

  it('handleKeyDownListItem function should be triggered correctly when user press up arrow on list item', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} suggestionHeader={false} />);
    const event = { preventDefault() {}, which: 38, target: { previousSibling: {tabindex: 0, focus: jest.fn()}, parentNode: { lastChild: '<div></div>'}}};
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownListItem");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('keyDown', event, 0);
    expect(spy).toBeCalled();
  });

  it('handleKeyDownListItem function should be triggered correctly when user press up arrow on list item', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} suggestionHeader={false} />);
    const event = { preventDefault() {}, which: 38, target: { previousSibling: null, parentNode: { lastChild: {tabindex: 0, focus: jest.fn()}}}};
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownListItem");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('keyDown', event, 0);
    expect(spy).toBeCalled();
  });

  it('handleKeyDownListItem function should be triggered correctly when user press enter on list item', () => {
    const wrapper = shallow(<AutoSuggestion {...inputProps} / >);
    const event = { preventDefault() {}, which: 13};
    wrapper.setState({autoSuggestData: autoSuggestData, showAutoSuggestionList: true});
    const spy = jest.spyOn(wrapper.instance(), "handleKeyDownListItem");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('keyDown', event, 0);
    expect(spy).toBeCalled();
  });
});
