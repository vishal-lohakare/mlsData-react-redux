import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { ContextDataPanelComp as ContextDataPanel } from 'components';
import { AutoSuggestion } from 'components'

const contextVariablesData = [
  {
    "id": 24,
    "mlsInfoId": 137,
    "type": {
      "id": 2,
      "type": "manually completed",
      "parentType": null,
      "lastUpdateTs": "2018-10-04T00:00:00.000Z",
      "createTs": "2018-10-04T00:00:00.000Z"
    },
    "key": "PRICE_FIELD",
    "value": "ListPrice",
    "elasticSearchIndexId": null,
    "hierarchyInfoId": 0,
    "lastUpdateTs": "2018-10-18T00:00:00.000Z",
    "createTs": "2018-10-18T00:00:00.000Z"
  },
  {
    "id": 22,
    "mlsInfoId": 137,
    "type": {
      "id": 2,
      "type": "manually completed",
      "parentType": null,
      "lastUpdateTs": "2018-10-04T00:00:00.000Z",
      "createTs": "2018-10-04T00:00:00.000Z"
    },
    "key": "STATUS_ACTIVE",
    "value": "200004325490",
    "elasticSearchIndexId": null,
    "hierarchyInfoId": 0,
    "lastUpdateTs": "2018-10-18T00:00:00.000Z",
    "createTs": "2018-10-18T00:00:00.000Z"
  },
  {
    "id": 23,
    "mlsInfoId": 137,
    "type": {
      "id": 2,
      "type": "manually completed",
      "parentType": null,
      "lastUpdateTs": "2018-10-04T00:00:00.000Z",
      "createTs": "2018-10-04T00:00:00.000Z"
    },
    "key": "STATUS_PENDING",
    "value": "200004324452",
    "elasticSearchIndexId": null,
    "hierarchyInfoId": 0,
    "lastUpdateTs": "2018-10-18T00:00:00.000Z",
    "createTs": "2018-10-18T00:00:00.000Z"
  },
];

const selectedEntryList = [
  {
    selectedKey: 'Resource',
    selectedValue: 'Property',
    selectedValueId: 'jbhjks7838',
    parentId: 1,
  },
  {
    selectedKey: 'Class',
    selectedValue: 'A',
    selectedValueId: 'fhgvhbm7289',
    parentId: 2,
  },
  {
    selectedKey: 'LookupName',
    selectedValue: 'OpenHouse',
    selectedValueId: 'abc133',
    parentId: 3,
  }
]

const autoSuggestData = [
  {
  "resource": "Property",
  },
  {
  "resource": "OpenHouse",
  },
];

const MlsContextVariableAction = {
  deleteContextVariables: jest.fn(),
  getMlsContextVariables: jest.fn(),
  getMetadataHierarchy: jest.fn(),
  addNewContextVariable: jest.fn(),
  getSuggestResource: jest.fn(),
  getSuggestClasses: jest.fn(),
  getSuggestSystemTableName: jest.fn(),
  getSuggestLookupName: jest.fn(),
  getSuggestLookupValue: jest.fn(),
  toogleContextVariableModal: jest.fn(),
  updateContextVariable: jest.fn(),
 };

const inputData = {
    contextVariablesData: contextVariablesData,
    MlsDeleteContextData: {
      isResponseSuccess: false
    },
    MlsContextVariables : {
      isResponseSuccess : false
    },
    MlsConfig : {
      isResponseSuccess : false
    },
    MlsResource: {
      isResponseSuccess: false
    },
    MlsClass : {
      isResponseSuccess: false
    },
    MlsSystemTable: {
      isResponseSuccess: false
    },
    MlsLookupName : {
      isResponseSuccess: false
    },
    MlsLookupValue: {
      isResponseSuccess: false
    },
    MlsHierarchy : {
      isResponseSuccess: false
    },
    MlsConfigData : [{
      source: 'FLEXMLS'
    }],
    MlsContextVariableAction
};


const inputState = {
  contextVariablesData: inputData.contextVariablesData,
  checkedContextVariables: inputData.contextVariablesData,
  formToggle: true,
  showAutoSuggestion: true,
  isOpenNewContextModal: true,
}

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ContextDataPanel  {...inputData} />);
});


describe('Zap Context Variable Panel component', () => {

  it('should render correctly.', () => {
    wrapper.setProps({MlsContextVariables: { isResponseSuccess: true}});
    wrapper.setState({
      contextVariablesData: inputData.contextVariablesData,
      checkedContextVariables: inputData.contextVariablesData,
      formToggle: true,
    });
    wrapper.instance().forceUpdate();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('checkboxClick function should be triggered correctly', () => {
    wrapper.setProps({MlsResource: { isResponseSuccess: true}});
    wrapper.setState({
      contextVariablesData: inputData.contextVariablesData,
      checkedContextVariables: inputData.contextVariablesData
    });
    const event = { preventDefault() {}, target: inputData[0] };
    const spy = jest.spyOn(wrapper.instance(), "checkboxClick");
    wrapper.instance().forceUpdate();
    wrapper.find(".checkbox_0").simulate('click', contextVariablesData[0]);
    expect(spy).toBeCalled();
  });

  it('deleteContextData function should be triggered correctly', () => {
    wrapper.setProps({MlsClass: { isResponseSuccess: true}});
    wrapper.setState(
      {
        contextVariablesData: inputData.contextVariablesData,
        checkedContextVariables: inputData.contextVariablesData,
        formToggle: true
      });
    const event = { preventDefault() {}, target: inputData[0] };
    const spy = jest.spyOn(wrapper.instance(), "deleteContextData");
    wrapper.instance().forceUpdate();
    wrapper.find(".delete").simulate('click', event);
    expect(spy).toBeCalled();
    expect(MlsContextVariableAction.deleteContextVariables).toBeCalled();
  });

  it('toggleButton function should be triggered correctly', () => {
    wrapper.setProps({MlsSystemTable: { isResponseSuccess: true}});
    wrapper.setState({ formToggle: true});
    const event = { preventDefault() {}, target: inputData[0] };
    const spy = jest.spyOn(wrapper.instance(), "toggleButton");
    wrapper.instance().forceUpdate();
    wrapper.find("#toggler").simulate('click', event);
    expect(spy).toBeCalled();
  });

  it('addNewContextToggle function should be triggered correctly', () => {
    wrapper.setProps({MlsLookupName: { isResponseSuccess: true}});
    wrapper.setState(
      {
        contextVariablesData: inputData.contextVariablesData,
        checkedContextVariables: inputData.contextVariablesData,
        formToggle: true
      });
    const event = { preventDefault() {}, target: inputData[0] };
    const spy = jest.spyOn(wrapper.instance(), "addNewContextToggle");
    wrapper.instance().forceUpdate();
    wrapper.find(".addMore").simulate('click', event);
    expect(spy).toBeCalled();
  });

  it('onInputChange function should be triggered correctly', () => {
    wrapper.setProps({MlsLookupValue: { isResponseSuccess: true}});
    wrapper.setState({...inputState});
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "onInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("#contextVariableName").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('onInputChange function should be triggered correctly', () => {
    wrapper.setProps({MlsHierarchy: { isResponseSuccess: true}});
    wrapper.setState({
      ...inputState,
      contextVariableName: 'CLASS_AGENT',
      contextVariableValue: 'class_agent',
      mlsHierarchyType: 'MD'
    });
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "onInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find("#contextVariableName").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('onChangeHierarchyType function should be triggered correctly', () => {
    wrapper.setState({...inputState});
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "onChangeHierarchyType");
    wrapper.instance().forceUpdate();
    wrapper.find("#MlsHierarchyType").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('onChangeHierarchyType function should be triggered correctly', () => {
    wrapper.setState({...inputState});
    const event = { preventDefault() {}, target: { value: 'MlsHierarchyType' } };
    const spy = jest.spyOn(wrapper.instance(), "onChangeHierarchyType");
    wrapper.instance().forceUpdate();
    wrapper.find("#MlsHierarchyType").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('_onAddNewContextVariable function should be triggered correctly for adding new variable', () => {
    wrapper.setState({
      ...inputState,
      disableAddNewContextButton: false
    });
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "_onAddNewContextVariable");
    wrapper.instance().forceUpdate();
    wrapper.find("Button").at(1).simulate('click', event);
    expect(spy).toBeCalled();
  });

  it('_onAddNewContextVariable function should be triggered correctly for editing existing variable with different key', () => {
    jest.useFakeTimers();
    wrapper.setState({
      ...inputState,
      disableAddNewContextButton: false,
      isAdd: false,
      prevContextVariableName: 'abc',
      contextVariableName: 'bcd'
    });
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "_onAddNewContextVariable");
    wrapper.instance().forceUpdate();
    wrapper.find("Button").at(1).simulate('click', event);
    expect(spy).toBeCalled();
    jest.runAllTimers();
  });

  it('_onAddNewContextVariable function should be triggered correctly for editing existing variable with same key', () => {
    wrapper.setState({
      ...inputState,
      disableAddNewContextButton: false,
      isAdd: false,
      prevContextVariableName: 'abc',
      contextVariableName: 'abc'
    });
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "_onAddNewContextVariable");
    wrapper.instance().forceUpdate();
    wrapper.find("Button").at(1).simulate('click', event);
    expect(spy).toBeCalled();
  });

  it('onEditContextData function should be triggered correctly', () => {
    wrapper.setState({
      ...inputState,
      disableAddNewContextButton: false,
      isAdd: false,
      checkedContextVariables: inputData.contextVariablesData
    });
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "onEditContextData");
    wrapper.instance().forceUpdate();
    wrapper.find(".edit").simulate('click', event);
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly in case of Resource', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('Resource', '', selectedEntryList);
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly in case of Class', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('Class', '', selectedEntryList);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('Class', '', {});
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly in case of TableSystemName', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('TableSystemName', '', selectedEntryList);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('TableSystemName', '', {});
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly in case of LookupName', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('LookupName', '', selectedEntryList);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('LookupName', '', {});
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly in case of LookupValue', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('LookupValue', '', selectedEntryList);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('LookupValue', '', {});
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly in case of default', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "handleInputChange");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('LookupValue', inputData.MlsConfigData, selectedEntryList);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('handleInputChange')('', inputData.MlsConfigData, {});
    expect(spy).toBeCalled();
  });

  it('updateQuery function should be triggered correctly', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "updateQuery");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('onUpdateValueToField')(selectedEntryList, true, true);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('onUpdateValueToField')({});
    expect(spy).toBeCalled();
  });

  it('updateQuery function should be triggered correctly', () => {
    wrapper.setState({
      ...inputState,
      autoSuggestData
    });
    const spy = jest.spyOn(wrapper.instance(), "updateQuery");
    wrapper.instance().forceUpdate();
    wrapper.find(AutoSuggestion).prop('onUpdateValueToField')(selectedEntryList, true, false);
    expect(spy).toBeCalled();
    wrapper.find(AutoSuggestion).prop('onUpdateValueToField')({});
    expect(spy).toBeCalled();
  });

  it('onSearchText function should be triggered correctly for searching in context variable panel with value', () => {
    wrapper.setProps({
      MlsContextVariablesData: inputData.contextVariablesData
    });
    const event = { target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "onSearchText");
    wrapper.instance().forceUpdate();
    wrapper.find(".contextSearch").simulate('change', event);
    expect(spy).toBeCalled();
  });

  it('onSearchText function should be triggered correctly for searching in context variable panel with no value', () => {
    wrapper.setProps({
      MlsContextVariablesData: inputData.contextVariablesData
    });
    const event = { target: { value: '' } };
    const spy = jest.spyOn(wrapper.instance(), "onSearchText");
    wrapper.instance().forceUpdate();
    wrapper.find(".contextSearch").simulate('change', event);
    expect(spy).toBeCalled();
  });
});
