import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { MappedUnmapped } from 'components';

const mlsStandardValueMapDtos = [{
  changeDate: 1548786600000,
  createDate: 1548786600000,
  enteredBy: 0,
  fieldType: "AGE",
  id: 5096,
  source: "FLEXMLS",
  standardValueId: 259079,
  value: "Ag106"
}];

const mappedData = {
  payload : [
  {
    "id": 25,
    "value": "CURRENT_TAXES",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null,
    mlsStandardValueMapDtos
  }
]};

const selectedMapped = [
  {
    "id": 25,
    "value": "CURRENT_TAXES",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  }
];

const mlsUnmappedValueDtos = [{
  changeDate: null,
  createDate: null,
  fieldType: "AGE",
  id: null,
  source: "FLEXMLS",
  value: "ADDRESS"
}];

const unMappedData ={
  payload :
  {
    "id": 1,
    "value": "ADDRESS",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null,
    mlsUnmappedValueDtos
  }
 };

const selectedUnmapped = [
  {
    "id": 1,
    "value": "ADDRESS",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  }
]

const inputData = {
    mappedData,
    unMappedData,
    moveToUnmapped: () => {},
    moveToMapped: () => {}
}

describe('Zap Mapped Unmapped component', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<MappedUnmapped {...inputData}/>);
  });

  it('should render correctly.', () => {
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('onSearch function should be triggered correctly in case mapped', () => {
    const event = { preventDefault() {}, target: { value: 'ADDRESS' } };
    wrapper.setProps({ onSearchMappedValues: () => {}, onSearchUnMappedValues: () => {}});
    const spy = jest.spyOn(wrapper.instance(), "onSearch");
    wrapper.instance().forceUpdate();
    wrapper.find(".mappedSearch").simulate('change', event, 'mapped');
    expect(spy).toBeCalled();
  });

  it('selectContent function remove selection unmappedCase', () => {
    wrapper.setState({selectedUnmapped});
    const event = { preventDefault() {}, target: { value: 'ADDRESS' } };
    const spy = jest.spyOn(wrapper.instance(), "selectContent");
    wrapper.instance().forceUpdate();
    wrapper.find(".unmapped").simulate('click', event, 'unmapped');
    expect(spy).toBeCalled();
  });

  it('selectContent function in case no mtach found', () => {
    wrapper.setState({selectedUnmapped: selectedMapped});
    const event = { preventDefault() {}, target: { value: 'ADDRESS' } };
    const spy = jest.spyOn(wrapper.instance(), "selectContent");
    wrapper.instance().forceUpdate();
    wrapper.find(".unmapped").simulate('click', event, 'unmapped');
    expect(spy).toBeCalled();
  });

  it('selectContent function should be triggered correctly in case unmapped', () => {
    const event = { preventDefault() {}, target: { value: 'ADDRESS' } };
    const spy = jest.spyOn(wrapper.instance(), "selectContent");
    wrapper.instance().forceUpdate();
    wrapper.find(".unmapped").simulate('click', event, 'unmapped');
    expect(spy).toBeCalled();
  });

  it('moveToMapped function should be triggered correctly', () => {
    wrapper.setState({selectedUnmapped});
    const spy = jest.spyOn(wrapper.instance(), "moveToMapped");
    wrapper.instance().forceUpdate();
    wrapper.find(".mappedArrow").simulate('click');
    expect(spy).toBeCalled();
  });

  it('moveToMapped function when nothing is selected', () => {
    wrapper.setState({selectedUnmapped: []});
    const spy = jest.spyOn(wrapper.instance(), "moveToMapped");
    wrapper.instance().forceUpdate();
    wrapper.find(".mappedArrow").simulate('click');
    expect(spy).toBeCalled();
  });

  it('moveToUnmapped function should be triggered correctly', () => {
    wrapper.setState({selectedMapped});
    const spy = jest.spyOn(wrapper.instance(), "moveToUnmapped");
    wrapper.instance().forceUpdate();
    wrapper.find(".unmappedArrow").simulate('click');
    expect(spy).toBeCalled();
  });

  it('moveToUnmapped function when nothing is selected', () => {
    wrapper.setState({selectedMapped: []});
    const spy = jest.spyOn(wrapper.instance(), "moveToUnmapped");
    wrapper.instance().forceUpdate();
    wrapper.find(".unmappedArrow").simulate('click');
    expect(spy).toBeCalled();
  });

  it('onNextClick function for mappedCase', () => {
    wrapper.setState({selectedMapped});
    wrapper.setProps({ onUnMappedNextClick: () => {}});
    const spy = jest.spyOn(wrapper.instance(), "onNextClick");
    wrapper.instance().forceUpdate();
    wrapper.find(".nextLink").simulate('click', 'mapped');
    expect(spy).toBeCalled();
  });

  it('onPreviousClick function for mappedCase', () => {
    wrapper.setState({selectedMapped});
    wrapper.setProps({ onUnMappedPreviousClick: () => {}});
    const spy = jest.spyOn(wrapper.instance(), "onPreviousClick");
    wrapper.instance().forceUpdate();
    wrapper.find(".previousLink").simulate('click', 'mapped');
    expect(spy).toBeCalled();
  });
});
