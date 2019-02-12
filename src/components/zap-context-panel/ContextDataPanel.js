// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSessionData } from 'utils/session';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Input,
  Label,
  Button,
  UncontrolledCollapse,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody
} from 'reactstrap';
import _ from 'lodash';

import './ContextDataPanel.scss';
import {
  AutoSuggestion
} from 'components';
import * as MlsContextVariableAction from 'actions/MlsContextVariableAction';
import { contextVariableKeys } from 'constants/global';

const mapDispatchToProps = (dispatch) => ({
  MlsContextVariableAction: bindActionCreators(MlsContextVariableAction, dispatch)
})

const mapStateToProps = state => {
  return {
    MlsContextVariables: _.get(state.MlsContextVariablesData, 'MlsContextVariables', {}),
    MlsContextVariablesData: _.get(state.MlsContextVariablesData, 'MlsContextVariables.payload', {}),
    MlsDeleteContextData: _.get(state.MlsContextVariablesData, 'MlsDeleteContextData', {}),
    MlsConfig: _.get(state.MLSConfigureData, 'MlsConfigureResult', {}),
    MlsConfigData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsResource: _.get(state.MlsContextVariablesData, 'MlsSuggestResource', {}),
    MlsResourceData: _.get(state.MlsContextVariablesData, 'MlsSuggestResource.payload', {}),
    MlsClass: _.get(state.MlsContextVariablesData, 'MlsSuggestClasses', {}),
    MlsClassData: _.get(state.MlsContextVariablesData, 'MlsSuggestClasses.payload', {}),
    MlsSystemTable: _.get(state.MlsContextVariablesData, 'MlsSuggestSystemTable', {}),
    MlsSystemTableData: _.get(state.MlsContextVariablesData, 'MlsSuggestSystemTable.payload', {}),
    MlsLookupName: _.get(state.MlsContextVariablesData, 'MlsSuggestLookupName', {}),
    MlsLookupNameData: _.get(state.MlsContextVariablesData, 'MlsSuggestLookupName.payload', {}),
    MlsLookupValue: _.get(state.MlsContextVariablesData, 'MlsSuggestLookupValue', {}),
    MlsLookupValueData: _.get(state.MlsContextVariablesData, 'MlsSuggestLookupValue.payload', {}),
    MlsHierarchy: _.get(state.MlsContextVariablesData, 'MlsHierarchy', {}),
    MlsHierarchyData: _.get(state.MlsContextVariablesData, 'MlsHierarchy.payload', {}),
    isOpenNewContextModal: _.get(state.MlsContextVariablesData, 'isOpenNewContextModal', false),
    contextVariableName: _.get(state.MlsContextVariablesData, 'contextVariableName', ''),
  }
}

type Props = {
  location: {
    state: {
      source: string,
    }
  },
  MlsContextVariableAction: typeof MlsContextVariableAction,
  MlsContextVariablesData: Array<Object>,
  MlsDeleteContextData: {
    isResponseSuccess: boolean
  },
  MlsContextVariables: {
    isResponseSuccess: boolean,
    isFail: boolean,
  },
  MlsConfig : {
    isResponseSuccess: boolean
  },
  MlsConfigData: Object,
  MlsResourceData : Array<Object>,
  MlsClassData : Array<Object>,
  MlsSystemTableData : Array<Object>,
  MlsLookupNameData : Array<Object>,
  MlsLookupValueData : Array<Object>,
  MlsHierarchyData : Array<Object>,
  isOpenNewContextModal: boolean,
  contextVariableName: string,
  MlsResource: {
    isResponseSuccess: boolean
  },
  MlsClass : {
    isResponseSuccess: boolean
  },
  MlsSystemTable: {
    isResponseSuccess: boolean
  },
  MlsLookupName : {
    isResponseSuccess: boolean
  },
  MlsLookupValue: {
    isResponseSuccess: boolean
  },
  MlsHierarchy : {
    isResponseSuccess: boolean
  }
};

type State = {
  contextVariablesData: Array<Object>,
  checkedContextVariables: Array<Object>,
  formToggle: boolean,
  mlsHierarchyType: string,
  prevMlsHierarchyType: string,
  isOpenNewContextModal: boolean,
  prevContextVariableName: string,
  contextVariableName: string,
  contextVariableValue: string,
  disableAddNewContextButton: boolean,
  autoSuggestData: Array<Object>,
  autoSuggestValue: string,
  autoSuggestKey: string,
  selectedValueId: string,
  showAutoSuggestion: boolean,
  parentId: number,
  disabledContextVariableValue: boolean,
  isAdd: boolean,
  suggestionHeader: boolean,
  source: string,
  id: number,
  searchKeys: Array<string>,
  isContextVariableUpdated: boolean,
  dataToBeUpdated: Object,
  searchText: string,
  contextValue: string
};

export class ContextDataPanel extends Component<Props, State> {

 constructor(props: Props) {
    super(props);
    const { MlsConfigData } = this.props;

    this.state = {
      contextVariablesData : [],
      checkedContextVariables : [],
      formToggle : false,
      prevMlsHierarchyType: 'MlsHierarchyType',
      mlsHierarchyType: 'MlsHierarchyType',
      isOpenNewContextModal: false,
      contextVariableName: '',
      prevContextVariableName: '',
      contextVariableValue: '',
      disableAddNewContextButton: true,
      autoSuggestData: [],
      autoSuggestValue: 'metadataName',
      autoSuggestKey: 'metadataName',
      selectedValueId: '',
      showAutoSuggestion: false,
      parentId: -1,
      disabledContextVariableValue: true,
      isAdd: true,
      suggestionHeader: false,
      source: _.isUndefined(MlsConfigData.source) ? getSessionData('MlsName') : MlsConfigData.source,
      id: _.isUndefined(MlsConfigData.id) ? getSessionData('MlsID') : MlsConfigData.id,
      searchKeys: ["metadataName"],
      isContextVariableUpdated: false,
      dataToBeUpdated: {},
      searchText: '',
      contextValue: ''
    };
  }

  componentDidMount() {
    const { MlsContextVariableAction, MlsConfigData, location } = this.props;
    const { state } = !_.isUndefined(location) ? location : { state: {}};
    const source = _.isUndefined(state) || _.isUndefined(state.source) ? _.isUndefined(MlsConfigData.source) ? getSessionData('MlsName') : MlsConfigData.source : state.source;
    if (source) {
      this.setState({ source });
      MlsContextVariableAction.getMlsContextVariables(source);
    }
  }

  componentDidUpdate(prevProps: Object) {
    const newState = _.cloneDeep(this.state);
    const {
      MlsContextVariables,
      MlsContextVariablesData,
      MlsResource,
      MlsResourceData,
      MlsClass,
      MlsClassData,
      MlsSystemTable,
      MlsSystemTableData,
      MlsLookupName,
      MlsLookupNameData,
      MlsLookupValue,
      MlsLookupValueData,
      MlsHierarchy,
      MlsHierarchyData,
      isOpenNewContextModal,
      contextVariableName
    } = this.props;

    if(prevProps.MlsContextVariables.isResponseSuccess !== MlsContextVariables.isResponseSuccess && MlsContextVariables.isResponseSuccess) {
      newState.contextVariablesData = MlsContextVariablesData;
      newState.searchText = '';
      this.setState({...newState});
    }

    if(prevProps.MlsResource.isResponseSuccess !== MlsResource.isResponseSuccess && MlsResource.isResponseSuccess) {
      newState.autoSuggestData = MlsResourceData;
      newState.autoSuggestKey = 'resource';
      newState.autoSuggestValue = 'resource';
      newState.searchKeys = contextVariableKeys['resource'];
      newState.suggestionHeader = true;
      this.setState({...newState});
    }

    if(prevProps.MlsClass.isResponseSuccess !== MlsClass.isResponseSuccess && MlsClass.isResponseSuccess) {
      newState.autoSuggestData = MlsClassData;
      newState.autoSuggestKey = 'className';
      newState.autoSuggestValue = 'className';
      newState.searchKeys = contextVariableKeys['className'];
      newState.suggestionHeader = true;
      this.setState({...newState});
    }

    if(prevProps.MlsSystemTable.isResponseSuccess !== MlsSystemTable.isResponseSuccess && MlsSystemTable.isResponseSuccess) {
      newState.autoSuggestData = MlsSystemTableData;
      newState.autoSuggestKey = 'tableSystemName';
      newState.autoSuggestValue = 'tableSystemName';
      newState.searchKeys = contextVariableKeys['tableSystemName'];
      newState.suggestionHeader = true;
      this.setState({...newState});
    }

    if(prevProps.MlsLookupName.isResponseSuccess !== MlsLookupName.isResponseSuccess && MlsLookupName.isResponseSuccess) {
      newState.autoSuggestData = MlsLookupNameData;
      newState.autoSuggestKey = 'lookupName';
      newState.autoSuggestValue = 'lookupName';
      newState.searchKeys = contextVariableKeys['lookupName'];
      newState.suggestionHeader = true;
      this.setState({...newState});
    }

    if(prevProps.MlsLookupValue.isResponseSuccess !== MlsLookupValue.isResponseSuccess && MlsLookupValue.isResponseSuccess) {
      newState.autoSuggestData = MlsLookupValueData;
      newState.autoSuggestKey = 'lookupValue';
      newState.autoSuggestValue = 'lookupValue';
      newState.searchKeys = contextVariableKeys['lookupValue'];
      newState.suggestionHeader = true;
      this.setState({...newState});
    }

    if(prevProps.MlsHierarchy.isResponseSuccess !== MlsHierarchy.isResponseSuccess && MlsHierarchy.isResponseSuccess) {
      newState.autoSuggestData = MlsHierarchyData;
      newState.autoSuggestKey = 'metadataName';
      newState.autoSuggestValue = 'metadataName';
      newState.searchKeys = contextVariableKeys['metadataName'];
      newState.suggestionHeader = false;
      this.setState({...newState});
    }
    if(prevProps.isOpenNewContextModal !== isOpenNewContextModal) {
      this.setState(() => ({
        isAdd: true,
        contextVariableName: contextVariableName,
        contextVariableValue: '',
        selectedValueId: '',
        mlsHierarchyType: 'MlsHierarchyType',
        showAutoSuggestion: false,
        isOpenNewContextModal: !this.state.isOpenNewContextModal,
      }));
    }

    if(prevProps.MlsContextVariables.isFail !== this.props.MlsContextVariables.isFail &&
      this.props.MlsContextVariables.isFail) {
        newState.contextVariablesData = MlsContextVariablesData;
        newState.searchText = '';
        this.setState({...newState});
    }

    if(prevProps.MlsDeleteContextData.isResponseSuccess !== this.props.MlsDeleteContextData.isResponseSuccess &&
      this.props.MlsDeleteContextData.isResponseSuccess) {
      const { isContextVariableUpdated } = this.state;
      if(isContextVariableUpdated) {
        const { MlsContextVariableAction } = this.props;
        const { mlsHierarchyType, source, id, dataToBeUpdated } = this.state;

        MlsContextVariableAction.addNewContextVariable(
          id,
          dataToBeUpdated,
          source,
          mlsHierarchyType
        );

        this.setState(() => ({
          contextVariableName: '',
          contextVariableValue: '',
          selectedValueId: '',
          mlsHierarchyType: 'MlsHierarchyType',
          isOpenNewContextModal: false
        }));
      }
    }
  }

  checkboxClick = (item : Object) => {
    const newState = _.cloneDeep(this.state);
    const { checkedContextVariables } = newState;
    const isExist = checkedContextVariables.some(data => data.id === item.id);
    if(!isExist) {
      newState.checkedContextVariables.push(item);
    } else {
      newState.checkedContextVariables = checkedContextVariables.filter(data => data.id !== item.id);
    }
    this.setState({checkedContextVariables: newState.checkedContextVariables});
  }

  onEditContextData = () => {
    const { checkedContextVariables } = this.state;
    const checkedContextVariablesLength = checkedContextVariables.length;
    if(!_.isEmpty(checkedContextVariables)) {
      const { key, metadataType, value } = checkedContextVariables[checkedContextVariablesLength - 1];

      this.props.MlsContextVariableAction.getMetadataHierarchy(metadataType);
      this.setState({
        isAdd: false,
        showAutoSuggestion: metadataType === 'MD' || metadataType === 'MDL',
        disabledContextVariableValue: metadataType !== 'Literal',
        disableAddNewContextButton: true,
        prevContextVariableName: key,
        contextVariableName: key,
        prevMlsHierarchyType: metadataType,
        contextVariableValue: value,
        mlsHierarchyType: metadataType,
        isOpenNewContextModal: !this.state.isOpenNewContextModal
      });
    }
  }

  deleteContextData = (showUpdatedList: boolean) => {
    const newState = _.cloneDeep(this.state);
    let deletedId = [];
    if(newState.checkedContextVariables.length) {
      _.map(newState.checkedContextVariables, (item) => {
        deletedId.push(item.id.toString());
      })
      newState.checkedContextVariables = [];
      this.props.MlsContextVariableAction.deleteContextVariables(deletedId, this.state.source, showUpdatedList);
      this.setState({checkedContextVariables: newState.checkedContextVariables});
    }
  }

  toggleButton = () => {
    this.setState(() => ({ formToggle: !this.state.formToggle}));
  }

  addNewContextToggle = () => {
    this.props.MlsContextVariableAction.toogleContextVariableModal('');
  }

  getQueryType = (selectedEntryList: Array<Object>, queryType: string) => {
    return _.filter(selectedEntryList, {selectedKey: queryType});
  }

  handleInputChange = (queryType: string, searchQuery: string, selectedEntryList: Array<Object>, inputValue: string) => {
    let resource = '';
    let className = '';
    let lookupName = '';
    const newState = _.cloneDeep(this.state);
    const searchQueryLength = searchQuery.length;
    const { MlsContextVariableAction, MlsConfigData, MlsHierarchyData } = this.props;
    const { searchKeys, autoSuggestKey, source } = this.state;
    newState.contextValue = inputValue;
    switch(queryType) {
      case 'Resource':
        if( autoSuggestKey !== 'resource')
        MlsContextVariableAction.getSuggestResource(source, '');
        break;

      case 'Class':
        if( autoSuggestKey !== 'className') {
          resource = this.getQueryType(selectedEntryList, 'Resource');
          resource = _.size(resource) > 0 ? resource[0].selectedValue : '';
          MlsContextVariableAction.getSuggestClasses(_.toLower(source), '', _.toLower(resource));
        }
        break;

      case 'TableSystemName':
        if( autoSuggestKey !== 'tableSystemName') {
          resource = this.getQueryType(selectedEntryList, 'Resource');
          resource = _.size(resource) > 0 ? resource[0].selectedValue : '';
          className = this.getQueryType(selectedEntryList, 'Class');
          className = _.size(className) > 0 ? className[0].selectedValue : '';
          MlsContextVariableAction.getSuggestSystemTableName(source, '', _.toLower(resource), _.toLower(className));
        }
        break;

      case 'LookupName':
        if( autoSuggestKey !== 'lookupName') {
          className = this.getQueryType(selectedEntryList, 'Class');
          className = _.size(className) > 0 ? className[0].selectedValue : '';
          MlsContextVariableAction.getSuggestLookupName(source, '', _.toLower(className));
        }
        break;

      case 'LookupValue':
        if( autoSuggestKey !== 'lookupValue') {
          resource = this.getQueryType(selectedEntryList, 'Resource');
          resource = _.size(resource) > 0 ? resource[0].selectedValue : '';
          lookupName = this.getQueryType(selectedEntryList, 'LookupName');
          lookupName = _.size(lookupName) > 0 ? lookupName[0].selectedValue : '';
          MlsContextVariableAction.getSuggestLookupValue(source, '', _.toLower(resource), _.toLower(lookupName));
        }
        break;

      default:
        newState.autoSuggestData = MlsHierarchyData;
        newState.autoSuggestKey = 'metadataName';
        newState.autoSuggestValue = 'metadataName';
        newState.suggestionHeader = false;
        newState.searchKeys = queryType.length > 0 ? searchKeys : ["metadataName"];
    }
    this.setState({ ...newState });
  }

  onInputChange = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    newState[event.target.name] = event.target.value;
    this.setState({...newState}, this._getSaveButtonDisableState);
  }

  updateQuery = (selectedEntryList: Array<Object>, isGetMetadataHierarchy: boolean, toValueUpdate: boolean, inputValue: string) => {
    const { mlsHierarchyType } = this.state;
    const { getMetadataHierarchy } = this.props.MlsContextVariableAction;
    if(!toValueUpdate){
      if(isGetMetadataHierarchy) {
        getMetadataHierarchy(mlsHierarchyType, _.last(selectedEntryList).parentId);
      }
      this.setState({
        contextValue: inputValue
      });
      return;
    }
    const newState = _.cloneDeep(this.state);
    const contextVariableValue = _.last(selectedEntryList) ? _.last(selectedEntryList).selectedValue : '';
    newState.contextVariableValue = contextVariableValue;
    newState.contextValue = inputValue;
    newState.selectedValueId = _.last(selectedEntryList) ? _.last(selectedEntryList).selectedValueId : '';
    newState.parentId = _.last(selectedEntryList) ? _.last(selectedEntryList).parentId : '';
    this.setState({...newState}, this._getSaveButtonDisableState);
    if(isGetMetadataHierarchy) getMetadataHierarchy(mlsHierarchyType, newState.parentId);
  }

  onChangeHierarchyType = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const mlsHierarchyValue = event.target.value;
    newState.mlsHierarchyType = mlsHierarchyValue;
    newState.showAutoSuggestion = false;
    newState.disabledContextVariableValue = mlsHierarchyValue === 'Literal' ? false : true

    if (mlsHierarchyValue !== "MlsHierarchyType" && mlsHierarchyValue !== 'Literal') {
      this.props.MlsContextVariableAction.getMetadataHierarchy(mlsHierarchyValue, '');
      newState.showAutoSuggestion = true;
    }
    this.setState({...newState}, this._getSaveButtonDisableState);
  }

  getContextDataToSend = () => {
    const { contextVariableName, contextVariableValue, selectedValueId, parentId } = this.state;
    return {
      key: contextVariableName,
      value: contextVariableValue,
      elasticSearchIndexId: selectedValueId,
      hierarchyInfoId: parentId
    };
  };

  _onAddNewContextVariable = () => {
    const { MlsContextVariableAction } = this.props;
    const { 
      contextVariableName, 
      isAdd, 
      mlsHierarchyType, 
      prevContextVariableName,
      prevMlsHierarchyType, 
      checkedContextVariables, 
      source, 
      id, 
      contextVariableValue
    } = this.state;
    let isContextVariableUpdated = false, dataToBeUpdated = {};
    const checkedContextVariablesLength = checkedContextVariables.length;

    if(isAdd) {
      MlsContextVariableAction.addNewContextVariable(id, this.getContextDataToSend(), source, mlsHierarchyType);
    } else {
      if((prevContextVariableName !== contextVariableName) || (prevMlsHierarchyType !== mlsHierarchyType)) {
        dataToBeUpdated = this.getContextDataToSend();
        this.deleteContextData(false);
        isContextVariableUpdated = true;
      } else {
        MlsContextVariableAction.updateContextVariable(
          id,
          this.getContextDataToSend(),
          source,
          mlsHierarchyType,
          checkedContextVariables[checkedContextVariablesLength - 1].id
        );
        checkedContextVariables[checkedContextVariablesLength - 1].value = contextVariableValue;
      }
    }

    this.setState(() => ({
      contextVariableName: '',
      contextVariableValue: '',
      selectedValueId: '',
      mlsHierarchyType,
      isOpenNewContextModal: false,
      isContextVariableUpdated,
      dataToBeUpdated
    }));
  }

  _getSaveButtonDisableState() {
    const { mlsHierarchyType, contextVariableName, contextVariableValue } = this.state;
    let disableAddNewContextButton = true;
    if(mlsHierarchyType !== 'MlsHierarchyType' && contextVariableName !== '' && contextVariableValue !== '') {
      disableAddNewContextButton =  false;
    }
    this.setState(() => ({disableAddNewContextButton: disableAddNewContextButton}));
  }

  getSuggestionHeaderTitle = (title: string) => {
    const result = title.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  _renderSuggestions = (item: Object, isHeader: boolean = false) => {
    const { autoSuggestValue } = this.state;
    const cells = [];
    if(autoSuggestValue !== "metadataName") {
      const width = 100/contextVariableKeys[autoSuggestValue].length;
      let index=0;
      _.forEach(item, (value, key) => {
        if(contextVariableKeys[autoSuggestValue].indexOf(key) !== -1)
        if(isHeader) {
          const title = this.getSuggestionHeaderTitle(key);
          cells.push(
            <div
              className="suggestionCell suggestionCellHeader"
              key={index}
              title={title}
              style={{width: `${width}%`}}
            >
              {title}
            </div>
          );
        } else {
          cells.push(
            <div
              className="suggestionCell"
              key={index}
              title={value}
              style={{width: `${width}%`}}
            >
              {value}
            </div>
          );
        }
        index++;
      });
    }
    return (
      autoSuggestValue === "metadataName" ?
      <Fragment>
        <a href="javascript: void(0);">{item[autoSuggestValue]}</a>
      </Fragment>
      :
      <div className="suggestionTableRow">
        {cells}
      </div>
    );
  }

  _renderSuggestionHeader = (item: Object) => {
    return this._renderSuggestions(item, true);
  }

  _renderSuggestionItem = (item: Object) => {
    return this._renderSuggestions(item, false);
  }

  onSearchText = (event: Object) => {
    const { MlsContextVariablesData } = this.props;
    const searchText = event.target.value.toLowerCase().trim();
    let filtered;

    if(searchText !== '') {
      filtered = MlsContextVariablesData.filter(data =>
        data.key.toLowerCase().indexOf(searchText) > -1 || data.value.toLowerCase().indexOf(searchText) > -1
      );
    } else {
      filtered = MlsContextVariablesData;
    }

    this.setState(() => ({ contextVariablesData: filtered, searchText }));
  }

  render() {
    const {
      contextVariablesData,
      formToggle,
      mlsHierarchyType,
      isOpenNewContextModal,
      contextVariableName,
      contextVariableValue,
      disableAddNewContextButton,
      autoSuggestData,
      autoSuggestKey,
      autoSuggestValue,
      showAutoSuggestion,
      disabledContextVariableValue,
      isAdd,
      suggestionHeader,
      searchKeys,
      searchText,
      contextValue
    } = this.state;
    return (

      <div className="contextPanelContainer">
        <Button color="light" id="toggler"
          className={formToggle ? "fa fa-chevron-circle-right hideIcon" : "fa fa-chevron-circle-left"}
          onClick={this.toggleButton}>
            {!formToggle && <i className="fa fa-folder-open"></i>}
        </Button>
        <UncontrolledCollapse toggler="#toggler">
          <Card>
            <CardHeader className="textAlignment">Context Data</CardHeader>
              <CardBody >
                <div>
                  <FormGroup>
                    <Input type="search" name="search" placeholder="Search" className="contextSearch" onChange={this.onSearchText} value={searchText}/>
                  </FormGroup>
                  <div className="checkboxList">
                  { _.size(contextVariablesData) < 1 && "No Context Variable available" }
                    <div className="contextVariablesData">
                      { _.map(contextVariablesData, (item, index) =>
                        <FormGroup className="checkboxRow" key={item.id}>
                          <Input id={item.key}
                            onClick={() => this.checkboxClick(item)}
                            type="checkbox"
                            className={`checkbox_${index}`}
                            name={item.key}
                            value={item.key + ' = ' + item.value}/>
                          <Label for={item.key}>{item.key + ' = ' + item.value}</Label>
                        </FormGroup>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            <CardFooter className="row verticalDivider footerButton">
              <div className="col-5 addMore" onClick={this.addNewContextToggle}>
                <i color="primary" className="fa fa-plus footerIcon"></i>
                <Label>Add More</Label>
              </div>
              <div className="col-3 edit" onClick={this.onEditContextData}>
                <i color="primary" className="fa fa-pencil footerIcon"></i>
                <Label>Edit</Label>
              </div>
              <div
                className="col-4 delete"
                disabled={_.size(contextVariablesData) < 1 }
                onClick={() => this.deleteContextData(true)}>
                <i color="primary" className="fa fa-trash footerIcon"></i>
                <Label>Delete</Label>
              </div>
          </CardFooter>
          </Card>
        </UncontrolledCollapse>

        <Modal isOpen={isOpenNewContextModal} className="contextModal">
          <ModalHeader toggle={this.addNewContextToggle}>{ isAdd ? 'Add New' : 'Edit'} Context Variable</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="MlsHierarchyType">Metadata Type</Label>
              <Input
                type="select"
                name="MlsHierarchyType"
                id="MlsHierarchyType"
                value={mlsHierarchyType}
                onChange={this.onChangeHierarchyType}>
                  <option value="MlsHierarchyType">Select Metadata Type</option>
                  <option value="MD">Metadata</option>
                  <option value="MDL">Metadata Lookup</option>
                  <option value="Literal">Literal</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Context Variable Name</Label>
              <Input
                id="contextVariableName"
                name="contextVariableName"
                onChange={this.onInputChange}
                value={contextVariableName}
              />
            </FormGroup>
            <FormGroup>
              <Label>Context Variable Value</Label>
              <Input
                id="contextVariableValue"
                name="contextVariableValue"
                onChange={this.onInputChange}
                disabled={disabledContextVariableValue}
                value={contextVariableValue}
              />
            </FormGroup>
            { showAutoSuggestion &&
              <AutoSuggestion
                autoSuggestData={autoSuggestData}
                autoSuggestKey={autoSuggestKey}
                handleInputChange={this.handleInputChange}
                renderSuggestionItem={this._renderSuggestionItem}
                onUpdateValueToField={this.updateQuery}
                searchKeys={searchKeys}
                suggestionHeader={suggestionHeader}
                renderSuggestionHeader={this._renderSuggestionHeader}
                querySeparator="="
                expressionSeparator=";"
                value={contextValue}
              />
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this._onAddNewContextVariable} disabled={disableAddNewContextButton}>Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextDataPanel);
