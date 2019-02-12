import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import  ZapPreview  from '../../../components/zap-preview/ZapPreview';

  const previewTableData = [ 
     {Sewer: "Public Sewer", ListAgentMlsId: "3217406", ListAgentLastName: "Palatano", Address: "Public Sewer3217406Palatano"},
     {Sewer: "Public Sewer", ListAgentMlsId: "3143777", ListAgentLastName: "Moore", Address: "Public Sewer3143777Moore"},
     {Sewer: "Public Sewer", ListAgentMlsId: "3228726", ListAgentLastName: "Wagner", Address: "Public Sewer3228726Wagner"},
     {Sewer: "Public Sewer", ListAgentMlsId: "3158743", ListAgentLastName: "Masih", Address: "Public Sewer3158743Masih"},
     {Sewer: "Public Sewer", ListAgentMlsId: "78774", ListAgentLastName: "Gatewood", Address: "Public Sewer78774Gatewood"}
  ] 
  const previewTableHeader = ['Sewer','ListAgentMlsId','ListAgentLastName']

const inputData = {
  previewTableData: previewTableData,
  previewTableHeader: previewTableHeader,
  modalClose: () => {}
};

describe('Zap Table component', () => {

  it('should render correctly.', () => {
    const wrapper = shallow(<ZapPreview {...inputData}/>);
    wrapper.instance().forceUpdate();
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('renderContentList function with data should be triggered correctly', () => {
    const wrapper = shallow(<ZapPreview  {...inputData}/>);
    const instance = wrapper.instance();
    instance.renderContentList(previewTableHeader, previewTableData);
  });

  it('renderContentList function with data should be triggered correctly', () => {
    const wrapper = shallow(<ZapPreview  {...inputData}/>);
    const instance = wrapper.instance();
    instance.renderContentList(previewTableHeader, []);
  });

});
