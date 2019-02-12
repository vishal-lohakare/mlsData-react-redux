import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { CustomPagination } from 'components';

const pageData = [
  {
    "id": 1,
    "name": "ADDRESS",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  },
  {
    "id": 2,
    "name": "AGE",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  },
  {
    "id": 3,
    "name": "AMENITIES",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  },
  {
    "id": 4,
    "name": "AREA",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": "This field have to be a INTEGER ",
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  },
  {
    "id": 5,
    "name": "ASSESSMENTS",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  }
];

const updatedPageData = [
  {
    "id": 1,
    "name": "ADDRESS",
    "type": "REPORT",
    "dataType": "MEDIUMTEXT",
    "dataLength": 0,
    "notes": null,
    "lastUpdateTs": "2018-10-15T18:30:00.000Z",
    "createTs": null
  }
]

const pageContent = {
    payload: pageData
  }

const inputProps = {
  headerText: "Canonical Fields",
  numberOfEntriesPerPage: 1,
  pageContent: pageContent,
  keyName: "name",
  onItemClick: () => {},
  showAddNewSection: true,
  addNewValue: () => {},
  resetPagination: false
};

describe('Zap Pagination component', () => {
  it('should render correctly.', () => {
    const output = shallow(<CustomPagination {...inputProps} />);
    output.setProps({pageData: updatedPageData});
    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('should render correctly.', () => {
    const output = shallow(<CustomPagination {...inputProps} numberOfEntriesPerPage={5} />);
    output.setState({pageNumber: 1, selectedValueId: 1});
    expect(shallowToJson(output)).toMatchSnapshot();
  });

  it('onNextClick function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onNextClick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(6).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onNextClick function when user is on last page', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    wrapper.setState({pageNumber: 5});
    const spy = jest.spyOn(wrapper.instance(), "onNextClick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(6).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onPageNumberclick function at first page', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onPageNumberclick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(1).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onPageNumberclick function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onPageNumberclick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(3).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onPageNumberclick function at last page', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onPageNumberclick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(5).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onPreviousClick function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onPreviousClick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(0).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onPreviousClick function hen user clicked on in between page', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    wrapper.setState({pageNumber: 3})
    const spy = jest.spyOn(wrapper.instance(), "onPreviousClick");
    wrapper.instance().forceUpdate();
    wrapper.find("PaginationLink").at(0).simulate('click');
    expect(spy).toBeCalled();
  });

  it('clearFilter function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "clearFilter");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(2).simulate('click');
    expect(spy).toBeCalled();
  });

  it('clearFilter function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    wrapper.setState({searchQuery: 's'});
    const spy = jest.spyOn(wrapper.instance(), "clearFilter");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(2).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onCombinedSearch function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const spy = jest.spyOn(wrapper.instance(), "onCombinedSearch");
    wrapper.instance().forceUpdate();
    wrapper.find("ListGroupItem").at(1).simulate('click');
    expect(spy).toBeCalled();
  });

  it('onSearchText function should be triggered correctly', () => {
    const wrapper = shallow(<CustomPagination {...inputProps} />);
    const event = { preventDefault() {}, target: { value: 'A' } };
    const spy = jest.spyOn(wrapper.instance(), "onSearchText");
    wrapper.instance().forceUpdate();
    wrapper.find("Input").simulate('change', event);
    expect(spy).toBeCalled();
  });

});
