import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { MappedFieldsComp as MappedFields }  from 'components';

const mappedFieldPayload = {
  "fields": [{
      id: '7OtNhsQo9EL7OdyVImlf',
      tableSystemName: 'ADD0',
      standardName: 'null',
      shortName: 'Street Address',
      longName: 'Street Address',
      lookupName: 'Street Address',
      relevance: 100,
      active: false,
      resource: "Property",
      resourceStandardName: "Residential"
    },
    {
      id: 'LfN3mCZe8QiN89tqVn8x',
      tableSystemName: 'OFFICE_14',
      standardName: 'null',
      shortName: 'Zip',
      longName: 'Zip',
      lookupName: 'null',
      relevance: 0,
      active: false,
      resource: "Property",
      resourceStandardName: "Residential"
  },
  {
    id: 'FYrN2AtQrhaM13cepV4p',
    tableSystemName: 'selling_member_address',
    standardName: 'null',
    shortName: 'SellMbrAddy',
    longName: 'null',
    lookupName: 'null',
    relevance: 0,
    active: true,
    resource: "Property",
    resourceStandardName: "Residential"
  }],
  "function": {
    id: 1,
    enumValue: 'SUM_ALL',
    description: 'Sum of all numbers coming from raw columns data',
    active: true,
    lastUpdateTs: 1539791700000,
    createTs: 1539791700000,
    resource: "Property",
    resourceStandardName: "Residential"
  }
};

const canonicalFunctionsData = [
  {
    id: 1,
    enumValue: 'SUM_ALL',
    description: 'Sum of all numbers coming from raw columns data',
    active: true,
    lastUpdateTs: 1539791700000,
    createTs: 1539791700000
  },
  {
    id: 2,
    enumValue: 'CONCAT_ALL_WITH_COMMA',
    description: 'Concatenation of values coming from raw columns data',
    active: true,
    lastUpdateTs: 1539791700000,
    createTs: 1539791700000
  },
  {
    id: 3,
    enumValue: 'CUSTOM',
    description: 'Custom transformation to be executed against specific columns coming from raw columns data',
    active: true,
    lastUpdateTs: 1539791700000,
    createTs: 1539791700000
  }
];

const inputProps = {
  selectedField: "ADDRESS",
  MlsMappedField: {
    isResponseSuccess: false,
    payload: mappedFieldPayload,
  },
  MlsUpdateMappedField: {
    payload: [],
    isResponseSuccess: false,
  },
  MlsCanonicalFunctionsData: {
    payload: canonicalFunctionsData,
    isResponseSuccess: false
  },
  MlsAutoCompleteFunctionsData: {
    payload: [],
    isResponseSuccess: false
  },
  postMappedData: () => {},
  updateMappedData: () => {},
  getAutoCompleteFunctions: () => {},
  getCanonicalFunctions: () => {},
  selectedCanonicalField: "ADDRESS",
  transformPreviewData: () => {},
  MlsCanonicalData: {},
  getSampleFileData: () => {},
  resetMapping: () => {},
};

describe('Zap Mapped Fields component', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<MappedFields  {...inputProps} />);
  });
  it('should render correctly.', () => {
    wrapper.setProps({MlsMappedField: { isResponseSuccess: true, payload: mappedFieldPayload}});
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('getCheckedFieldsOnLoad function should be triggered correctly', () => {
    wrapper.setProps({MlsUpdateMappedField: { isResponseSuccess: true, payload: []}});
    wrapper.setState({ filteredData: inputProps.MlsMappedField.payload.fields});
    const spy = jest.spyOn(wrapper.instance(), "getCheckedFieldsOnLoad");
    wrapper.instance().forceUpdate();
    wrapper.instance().getCheckedFieldsOnLoad();
    expect(spy).toBeCalled();
  });

  it('onCheckedChange function should be triggered correctly', () => {
    wrapper.setProps({MlsCanonicalFunctionsData: { isResponseSuccess: true, payload: canonicalFunctionsData}});
    wrapper.setState({ filteredData: inputProps.MlsMappedField.payload.fields,
      isCheckedUnchecked: [true, false, true]});
    const event = { target: { value: 'ADD0' }};
    const spy = jest.spyOn(wrapper.instance(), "onCheckedChange");
    wrapper.instance().forceUpdate();
    wrapper.find("[type='checkbox']").at(0).simulate('change', event);
    expect(spy).toBeCalled();

    const instance = wrapper.instance();
    instance.onCheckedChange(0, event); // for inactive field
    instance.onCheckedChange(2, event); // for active field

  });

  it('onSearchIconClick function should be triggered correctly', () => {
    wrapper.setProps({MlsAutoCompleteFunctionsData: { isResponseSuccess: true, payload: []}});
    const spy = jest.spyOn(wrapper.instance(), "onSearchIconClick");
    wrapper.instance().forceUpdate();
    wrapper.find("#field").simulate('click');
    expect(spy).toBeCalled();
  });

  it('modalToggle function should be triggered correctly', () => {
    const spy = jest.spyOn(wrapper.instance(), "modalToggle");
    wrapper.setState({
      availableFunctions: canonicalFunctionsData,
      receivedFunction: mappedFieldPayload.function,
      isCheckedUnchecked: [{
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
      }
    ],
      expression: "SUM_ALL(ADD0)",
      selectedFunction: "DEFAULT",
    });
    wrapper.instance().forceUpdate();
    wrapper.find(".saveButton").simulate('click');
    expect(spy).toBeCalled();
  });

  it('toggleTooltip function should be called correctly', () => {
    wrapper.find('Tooltip').at(0).prop('toggle')();
    expect(wrapper.state('tooltipOpen')).toBe(true);
  });

  it('save button click', () => {
    wrapper.setState({ checkedFields: ['member_1','member_16'], selectedFunction: 'SUM_ALL', modal: true });
    wrapper.find('.saveButton').simulate('click');
  });

  it('test for getMappedFieldDescription function with not null data', () => {
    const spy = jest.spyOn(wrapper.instance(), "getMappedFieldDescription");
    wrapper.setState({ mappedField: mappedFieldPayload.fields[0] });
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('test for getMappedFieldDescription function with null longName', () => {
    const spy = jest.spyOn(wrapper.instance(), "getMappedFieldDescription");
    wrapper.setState({ mappedField: mappedFieldPayload.fields[2] });
    wrapper.instance().forceUpdate();
    expect(spy).toBeCalled();
  });

  it('test for getFilteredData function with string data', () => {
    const instance = wrapper.instance();
    instance.getFilteredData('SUM', 'SU');
  });

  it('test for getFilteredData function with object data', () => {
    const instance = wrapper.instance();
    instance.getFilteredData({ name: 'ADD0' }, 'AD');
  });

  it('test for filterExpressions function with mappedFields true', () => {
    const instance = wrapper.instance();
    instance.filterExpressions('sum', ['ADD0', 'Address', 'AddressInternet'], true, 'su');
  });

  it('test for filterExpressions function with mappedFields false and no subexpression', () => {
    const instance = wrapper.instance();
    instance.filterExpressions('sum', ['ADD0', 'Address', 'AddressInternet'], false, '');
  });

  it('getSampleFileData function should be triggered correctly', () => {
    const spy = jest.spyOn(wrapper.instance(), "getSampleFileData");
    wrapper.instance().forceUpdate();
    wrapper.find(".tableSystemName").at(0).simulate('click');
    expect(spy).toBeCalled();
  });

  it('handleInputChange function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance.handleInputChange('resource', 'Property', [{
      selectedKey: 'resource',
      selectedValue: 'Property'
    }]);
  });

  it('handleInputChange function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance.handleInputChange('class', 'A', [{
      selectedKey: 'class',
      selectedValue: 'A'
    }]);
  });

  it('handleInputChange function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance.handleInputChange('', '', [{
      selectedKey: 'k',
      selectedValue: '',
      selectedText: 're'
    }]);
  });

  it('handleInputChange function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance.handleInputChange('', '', [{
      selectedKey: '',
      selectedValue: '',
      selectedText: ''
    }]);
  });

  it('onSearchDesc function should be triggered correctly for given searchQuery', () => {
    const instance = wrapper.instance();
    const event = {
      target: {
        value: 'fea'
      }
    }
    instance.onSearchDesc(event);
  });

  it('onSearchDesc function should be triggered correctly for empty string', () => {
    const instance = wrapper.instance();
    const event = {
      target: {
        value: ''
      }
    }
    instance.onSearchDesc(event);
  });

  it('getSuggestionHeaderTitle function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance.getSuggestionHeaderTitle("className");
  });

  it('_renderSuggestionHeader function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance._renderSuggestionHeader(mappedFieldPayload.fields[0]);
  });

  it('_renderSuggestionItem function should be triggered correctly', () => {
    wrapper.setState({ autoSuggestKey: "resource"});
    const instance = wrapper.instance();
    instance._renderSuggestionItem(mappedFieldPayload.fields[0]);
  });

  it('updateQuery function should be triggered correctly', () => {
    const instance = wrapper.instance();
    instance._updateExpression("Test");
  });

  it('componentWillUnmount should be called on unmount', () => {
    const component = shallow(<MappedFields {...inputProps} />);
    const componentWillUnmount = jest.spyOn(component.instance(), 'componentWillUnmount');
    component.unmount();
    expect(componentWillUnmount).toHaveBeenCalled();
  });

});
