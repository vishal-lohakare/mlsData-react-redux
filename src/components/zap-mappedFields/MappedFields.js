// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Row,
  Col,
  Tooltip,
} from 'reactstrap';

import _ from 'lodash';
import { hideLoader } from 'utils/loader';
import { AutoComplete } from 'components';
import './MappedFields.scss';

const mapStateToProps = state => {
  return {
    MlsCanonicalData: _.get(state.MLSCanonicalData, 'MlsSample.payload', {}),
    MlsAutoCompleteOptions: _.get(state.MLSCanonicalData, 'MlsAutoCompleteOptions.payload', []),
  }
}

type Props = {
  MlsMappedFieldData: Object,
  MlsUpdateMappedField: {
    isResponseSuccess: boolean
  },
  MlsMappedField: {
    isResponseSuccess: boolean,
    payload: Object
  },
  MlsCanonicalFunctionsData: {
    isResponseSuccess: boolean,
    payload: Array<Object>
  },
  MlsCanonicalData: Object,
  MlsAutoCompleteOptions: Array<Object>,
  MlsCanonical: {
    isResponseSuccess: boolean
  },
  postMappedData: Function,
  updateMappedData: Function,
  getCanonicalFunctions: Function,
  getAutoCompleteFunctions: Function,
  MlsAutoCompleteFunctionsData: Object,
  transformPreviewData: Function,
  onSelectFieldToMap: Function,
  selectedDownloadType: string,
  getSampleFileData: Function,
  resetMapping: Function,
  isAutoMap?: boolean,
  multiSelect: boolean,
  resetMappedData: boolean,
  selectedCanonicalField: string
};

type State = {
  isFieldSearchOpen: boolean,
  isDescSearchOpen: boolean,
  selectedMappedData: Array<Object>,
  availableFunctions: Array<Object>,
  checkedFields: Array<string>,
  modal: boolean,
  filteredData: Array<Object>,
  isCheckedUnchecked: Array<Object>,
  checked: boolean,
  tooltipOpen: boolean,
  sampleDataTooltipOpen: string,
  expression: string,
  matchingExpressions: Array<Object>,
  autoCompleteFunctions: Array<Object>,
  subExpression: string,
  metaCharacter: string,
  selectedClass: string,
  classNameList: Array<Object>,
  fieldSearchQuery: string,
  descSearchQuery: string,
  isFieldMapped: boolean
};

export class MappedFields extends Component<Props, State>  {

  resourceList: Array<Object> = [];
  classNameList: Array<Object> = [];
  filteredMappedFieldsByClass: Array<Object> = [];
  sampleTooltipElement: ?HTMLDivElement;
  static defaultProps = {
    isAutoMap: false,
    multiSelect: true,
    onSelectFieldToMap: () => {},
    MlsUpdateMappedField: {
      isResponseSuccess: false
    },
    MlsCanonicalFunctionsData: {
      isResponseSuccess: false,
      payload: []
    },
    MlsAutoCompleteFunctionsData: {
      isResponseSuccess: false
    },
    postMappedData: () => {},
    updateMappedData: () => {},
    getCanonicalFunctions: () => {},
    getAutoCompleteFunctions: () => {},
    getSampleFileData: () => {}
  };

  state = {
    isFieldSearchOpen: false,
    isDescSearchOpen: false,
    descSearchQuery: '',
    fieldSearchQuery: '',
    selectedMappedData: [],
    availableFunctions: [],
    checkedFields: [],
    modal: false,
    filteredData: this.props.MlsMappedField.payload ? this.props.MlsMappedField.payload.fields : [],
    isCheckedUnchecked: [],
    checked: false,
    tooltipOpen: false,
    sampleDataTooltipOpen: '',
    expression: '',
    matchingExpressions: [],
    autoCompleteFunctions: [],
    subExpression: '',
    metaCharacter: '',
    selectedClass: '',
    classNameList: [],
    isFieldMapped: false
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    const { getAutoCompleteFunctions, getCanonicalFunctions, isAutoMap } = this.props;
    if(!isAutoMap){
      getAutoCompleteFunctions();
      getCanonicalFunctions();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps: Props) {
    const { MlsMappedField } = this.props;
    const { selectedClass } = this.state;
    if(MlsMappedField.isResponseSuccess !== prevProps.MlsMappedField.isResponseSuccess && MlsMappedField.isResponseSuccess) {
      hideLoader();
      const { fields, mlsCanonicalFieldsMappingDtoList } = MlsMappedField.payload;
      if(fields) {
        this.resourceList = _.sortBy(_.uniqBy(fields, 'resource'), ['resource']);
        this.classNameList = _.sortBy(_.uniqBy(fields, 'className'), ['className']);
        const classToSelect = this.classNameList.length > 0 ? this.classNameList[0].className : "";
        const defaultClass = selectedClass ? selectedClass : classToSelect;
        const filteredData = _.filter(fields, (item) => {
          return (item.className === defaultClass);
        });
        const mapping = _.find(mlsCanonicalFieldsMappingDtoList, {className: defaultClass});
        this.filteredMappedFieldsByClass = _.sortBy(filteredData, [function(field) { return !field.active; }]);
        this.setState({
          expression: mapping ? mapping.expression : '',
          filteredData: this.filteredMappedFieldsByClass,
          selectedMappedData: fields,
          isFieldSearchOpen: false,
          isDescSearchOpen: false,
          selectedClass: defaultClass,
          classNameList : this.classNameList,
          isFieldMapped: mapping ? true : false,
          fieldSearchQuery: "",
          descSearchQuery: "",
        }, () => {
          this.getCheckedFieldsOnLoad();
        });
      } else {
        this.setState({
          checkedFields: [],
          isCheckedUnchecked: [],
          isFieldSearchOpen: false,
          isDescSearchOpen: false,
          fieldSearchQuery: "",
          descSearchQuery: "",
        });
      }
    }

    if(this.props.MlsCanonicalFunctionsData.isResponseSuccess !==  prevProps.MlsCanonicalFunctionsData.isResponseSuccess
      && this.props.MlsCanonicalFunctionsData.isResponseSuccess) {
      const payload = this.props.MlsCanonicalFunctionsData.payload;
      this.setState(() => ({
        availableFunctions: payload,
      }));
    }

    if(this.props.MlsAutoCompleteFunctionsData.isResponseSuccess !==  prevProps.MlsAutoCompleteFunctionsData.isResponseSuccess
      && this.props.MlsAutoCompleteFunctionsData.isResponseSuccess) {
        const { payload } = this.props.MlsAutoCompleteFunctionsData;
        this.setState(() => ({ autoCompleteFunctions: payload, matchingExpressions: payload }));
    }
    if(prevProps.selectedDownloadType !== this.props.selectedDownloadType) {
      this.setState({filteredData: []});
    }
    if(prevProps.resetMappedData !== this.props.resetMappedData && this.props.resetMappedData) {
      this.setState({
        filteredData: [],
        expression: '',
        checkedFields: [],
        isCheckedUnchecked: [],
        isFieldSearchOpen: false,
        isDescSearchOpen: false,
        selectedClass: ""
      });
    }
  }

  handleClickOutside = (event: Object) => {
    if(this.sampleTooltipElement && !this.sampleTooltipElement.contains(event.target)) {
      this.setState({
        sampleDataTooltipOpen: ''
      });
    }
  };

  getCheckedFieldsOnLoad = () => {
    const checkedFields = [], isCheckedUnchecked = [];
    _.map(this.state.filteredData, (row) => {
      if(row.active){
        isCheckedUnchecked.push(row);
        checkedFields.push(row.tableSystemName);
      }
    });
    this.setState({
      checkedFields,
      isCheckedUnchecked
    });
  };

  onCheckedChange = (row: Object) => {
    let newIsCheckedUnchecked = _.cloneDeep(this.state.isCheckedUnchecked);
    const { multiSelect, onSelectFieldToMap } = this.props;
    const rowIndex = _.findIndex(newIsCheckedUnchecked, row);
    const isRowPresent = rowIndex === -1;
    if(multiSelect) {
      isRowPresent ? newIsCheckedUnchecked.push(row) : newIsCheckedUnchecked.splice(rowIndex, 1);
    } else {
      newIsCheckedUnchecked = isRowPresent ? [row] : [];
      const selectedField = isRowPresent ? row : null;
      onSelectFieldToMap(selectedField);
    }
    const newCheckedFields = newIsCheckedUnchecked.length > 0 ? _.map(newIsCheckedUnchecked, (item) => item.tableSystemName) : [];
    this.setState({
      isCheckedUnchecked: newIsCheckedUnchecked,
      checkedFields: newCheckedFields
    });
  };

  onSearchIconClick = (type: string) => {
    let {isDescSearchOpen, isFieldSearchOpen, fieldSearchQuery, descSearchQuery } = this.state;
    if(type === 'desc'){
      isDescSearchOpen = !isDescSearchOpen;
    }else{
      isFieldSearchOpen = !isFieldSearchOpen;
    }
    this.setState({
      isDescSearchOpen,
      isFieldSearchOpen,
      filteredData: this.filteredMappedFieldsByClass,
      fieldSearchQuery: isFieldSearchOpen ? fieldSearchQuery : '',
      descSearchQuery: isDescSearchOpen ? descSearchQuery : '',
    }, () => {
      const targetName = isFieldSearchOpen ? 'fieldSearch' : isDescSearchOpen ?  'descSearch' : '';
      const targetValue = isFieldSearchOpen ? fieldSearchQuery : isDescSearchOpen ? descSearchQuery : '';
      this.onCombinedSearch({target: {name: targetName, value: targetValue}});
    });
  };

  onCombinedSearch = (event: Object) => {
    const { name, value } = event.target;
    let { fieldSearchQuery, descSearchQuery, filteredData } = this.state;
    let newFilteredData = [];
    if(name === "fieldSearch"){
      fieldSearchQuery = value;
    } else if(name=== "descSearch") {
      descSearchQuery = value;
    } else {
      fieldSearchQuery = '';
      descSearchQuery = '';
    }

    if(fieldSearchQuery !== '' || descSearchQuery !== '') {
      newFilteredData = _.filter(this.filteredMappedFieldsByClass, (item) => {
        const descText =  this.getMappedFieldDescription(item);
        return descText.toLowerCase().indexOf(descSearchQuery.toLowerCase()) > -1 && item.tableSystemName.toLowerCase().indexOf(fieldSearchQuery.toLowerCase()) > -1;
      });
    } else {
      newFilteredData = filteredData;
    }

    this.setState({filteredData: newFilteredData, fieldSearchQuery, descSearchQuery });
  }

  onSelectClass = (event: Object) => {
    const selectedClass = event.target.value;
    const { payload : { fields, mlsCanonicalFieldsMappingDtoList } } = this.props.MlsMappedField;
    let filteredByClassName = [], isCheckedUnchecked = [], checkedFields = [];
    filteredByClassName = _.filter(fields, (item) => {
      if(item.className === selectedClass) {
        if(item.active) {
          isCheckedUnchecked.push(item);
          checkedFields.push(item.tableSystemName);
        }
        return true;
      }
    });
    filteredByClassName = _.sortBy(filteredByClassName, [function(field) { return !field.active; }]);
    this.filteredMappedFieldsByClass = filteredByClassName;
    const mapping = _.find(mlsCanonicalFieldsMappingDtoList, {className: selectedClass});
    this.setState({
      filteredData: filteredByClassName,
      selectedClass: selectedClass,
      isCheckedUnchecked,
      checkedFields,
      isDescSearchOpen: false,
      isFieldSearchOpen: false,
      fieldSearchQuery: '',
      descSearchQuery: '',
      expression: mapping ? mapping.expression : '',
      isFieldMapped: mapping ? true : false
    });
  }

  getExtractedFields = () => {
    const regexToMatchDoubleQuotes = /"(.*?)"/g;
    const regexToMatchSingleQuotes = /'(.*?)'/g;
    const { MlsAutoCompleteOptions } = this.props;
    const { isCheckedUnchecked, availableFunctions } = this.state;
    const actualFields = [];
    let { expression } = this.state;
    let newIsCheckedUnchecked = _.cloneDeep(isCheckedUnchecked);
    let sortedCheckedFieldsByLength = [], maxFieldLength = 0, currentMatch;
    newIsCheckedUnchecked.sort(function(prevField, nextField) {
      return nextField.tableSystemName.length - prevField.tableSystemName.length;
    });
    expression = expression.toLowerCase().replace(/\)/g, "");
    expression = expression.replace(regexToMatchDoubleQuotes, "");
    expression = expression.replace(regexToMatchSingleQuotes, "");
    _.map(MlsAutoCompleteOptions, ({ name }) => {
      expression = this.removeFunctionsFromExpression(expression, name);
    });
    _.map(availableFunctions, ({ enumValue }) => {
      expression = this.removeFunctionsFromExpression(expression, enumValue);
    });
    _.map(newIsCheckedUnchecked, (field) => {
      const rawField = field.tableSystemName.toLowerCase();
      const fieldIndex = expression.indexOf(rawField);
      if(fieldIndex !== -1) {
        field.active = true;
        actualFields.push(field);
        expression = expression.replace(rawField, "");
      }
    });
    return actualFields;
  }

  removeFunctionsFromExpression = (expression: string, valueToMatch: string) => {
    const autoCompleteOptionToMatch = valueToMatch.toLowerCase() + "(";
    if(expression.indexOf(autoCompleteOptionToMatch) !== -1) {
      expression = expression.replace(autoCompleteOptionToMatch, "");
    }
    return expression;
  }

  modalToggle = () => {
    const {
      isCheckedUnchecked,
      availableFunctions,
      selectedClass,
      classNameList,
      expression
    } = this.state;
    const {
      selectedDownloadType,
      postMappedData,
      updateMappedData,
      MlsMappedField: { payload: { mlsCanonicalFieldsMappingDtoList } },
      MlsAutoCompleteOptions,
    } = this.props;
    const postData = {};
    const sortedFields = this.getExtractedFields();
    postData.fields = sortedFields;
    postData.className = selectedClass;
    postData.classDesc = _.filter(classNameList, {'className': selectedClass})[0].classDescription;

    const newSelectedFunction = _.find(availableFunctions, (item) => {
      return item.enumValue.toLowerCase() === 'custom'
    });

    const mapping = _.find(mlsCanonicalFieldsMappingDtoList, {className: selectedClass});
    postData.function = { ...newSelectedFunction, expression };
    postData.downloadType = selectedDownloadType;
    if(mapping) {
      postData.mlsMappingId = mapping.mlsMappingId;
      updateMappedData(JSON.stringify(postData));
    } else {
      postMappedData(JSON.stringify(postData));
    }
  };


  getMappedFieldDescription = (mappedField: Object) => {
    let { tableSystemName, longName } = mappedField;
    const separator = ' | ';
    if(longName === "null") {
      longName = '';
    }
    if(tableSystemName && longName) {
      tableSystemName = tableSystemName + separator;
    }
    return `${tableSystemName} ${longName}`;
  };

  getSampleFileData = (rowId: string, rawField: string) => {
    const { getSampleFileData} = this.props;
    this.setState({
      sampleDataTooltipOpen: rowId
    });
    getSampleFileData(rawField);
  }

  isValidToSave = () => {
    const { checkedFields, expression } = this.state;
    if(checkedFields && checkedFields.length > 0 && expression) {
      return false;
    }
    return true;
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  getFilteredData = (item: any, searchValue: string) => {
    if(typeof item === "object") {
      return item.name.toLowerCase().startsWith(searchValue)
    } else {
      return item.toLowerCase().startsWith(searchValue);
    }
  };

  filterExpressions = (expression: string, list: Array<any>, mappedFields: boolean = false, subExpression: string) => {
    let matchingExpressions = subExpression ?
      list.filter(item => this.getFilteredData(item, subExpression)) : (mappedFields ? list : (subExpression ?
      list.filter(item => this.getFilteredData(item, subExpression)) :
      list.filter(item => this.getFilteredData(item, expression))));
    this.setState({
      expression: expression.toLowerCase(),
      matchingExpressions,
      subExpression,
    });
  };

  _transformPreviewData = () => {
    this.props.transformPreviewData(this.state.checkedFields, this.state.expression);
  }

  _updateExpression = (value: string) => {
    this.setState({
      expression: value
    });
  }

  render() {
    const {
      checkedFields,
      filteredData,
      availableFunctions,
      isCheckedUnchecked,
      sampleDataTooltipOpen,
      expression,
      isFieldSearchOpen,
      isDescSearchOpen,
      descSearchQuery,
      fieldSearchQuery,
      selectedClass,
      classNameList,
      isFieldMapped
    } = this.state;
    const {
      MlsCanonicalData,
      resetMapping,
      MlsMappedField,
      selectedCanonicalField,
      isAutoMap
    } = this.props;
    const hasData = (MlsCanonicalData.length > 0) ? true : false;
    return (
      <div className="mappedFields">
      {
        (selectedCanonicalField !== '' || isAutoMap) && classNameList.length > 0 &&
        <div className="classDescDropdown">
          <Label for="className">Class</Label>
          <FormGroup className="d-inline-block ml-3">
            <Input
              id="classDesc"
              name="classDesc"
              className="form-control"
              type="select"
              onChange={this.onSelectClass}
              value={selectedClass}
            >
              {
                _.map(classNameList, (item, index) => {
                  return <option value={item.className} key={index}>{`${item.className}: ${item.classDescription}`}</option>
                })
              }
            </Input>
          </FormGroup>
        </div>
      }
        <Card>
          <CardHeader className="cardHeaderWhite">
              <span className="h5 d-inline-block">Mapped Fields</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="mappedFields">
              <Row className="m-0 mappedHeaderRow">
                <Col xs="2" className="mappedTableHeader">Select</Col>
                <Col xs={isAutoMap ? "4" : "3"} className="mappedTableHeader">Field
                  <div className="tableSearch">
                    {
                      filteredData.length > 0 && <img id="field" className="tableSearchIcon" onClick={()=>{this.onSearchIconClick('raw')}} src={require('images/search.png')} />
                    }
                    { isFieldSearchOpen &&
                      <FormGroup>
                        <Input
                          type="search"
                          name="fieldSearch"
                          placeholder="Search"
                          onChange={this.onCombinedSearch}
                          value={fieldSearchQuery}
                          autoFocus={true}
                        />
                      </FormGroup>
                    }
                  </div>
                </Col>
                <Col xs={isAutoMap ? "6" : "5"} className="mappedTableHeader">
                  <span>Description&nbsp;<i className="fa fa-info-circle" id="descriptionTooltip"></i></span>
                  <div className="tableSearch">
                  {
                    filteredData.length > 0 && <img id="desc" className="tableSearchIcon" onClick={()=>{this.onSearchIconClick('desc')}} src={require('images/search.png')} />
                  }
                  { isDescSearchOpen &&
                    <div>
                      <FormGroup>
                        <Input
                          type="search"
                          name="descSearch"
                          placeholder="Search"
                          onChange={this.onCombinedSearch}
                          value={descSearchQuery}
                          autoFocus={true}
                        />
                      </FormGroup>
                    </div>
                  }
                </div>
                  <Tooltip
                    placement="top"
                    isOpen={this.state.tooltipOpen}
                    target="descriptionTooltip"
                    toggle={this.toggleTooltip}>Description is a combination of tableSystemName, longName and lookupName</Tooltip>
                </Col>
                { !isAutoMap &&
                  <Col xs="2" className="mappedTableHeader">Relevancy</Col>
                }
              </Row>
              <div className={ filteredData.length > 0 ? 'mappedTable' : ''}>
                {
                  filteredData && filteredData.map((row, index) => {
                    return (
                      <Row key={row.id} className="m-0 mappedTableCell">
                        <Col xs="2">
                          <FormGroup check>
                            <Input
                              type="checkbox"
                              className="checkbox"
                              data-index={index}
                              checked = {_.findIndex(isCheckedUnchecked, row) !== -1}
                              onChange={ () => {
                                this.onCheckedChange(row);
                              }
                              }
                              id={`checkbox_${index}`}
                              value={row.tableSystemName}
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={isAutoMap ? "4" : "3"}
                          className={row.id}
                        >
                          <span
                            id={`field_${row.id}`}
                            className="tableSystemName"
                            onClick={() => { this.getSampleFileData(row.id, row.tableSystemName)}}
                          >
                            {row.tableSystemName}
                          </span>
                           <Tooltip
                            placement="right"
                            isOpen={sampleDataTooltipOpen === row.id}
                            target={`field_${row.id}`}
                            container={document.getElementsByClassName(row.id.toString())[0]}
                            className={"customTooltip " + (hasData ? 'hasSampleData' : '')}
                            autohide={false}
                            innerRef={(ref) => { this.sampleTooltipElement = ref }}
                            >
                            { hasData ?
                              <ul className="sampleDataList">
                              {
                                _.map(MlsCanonicalData, (data, index) => {
                                  return <li key={index}>{data}</li>
                                })
                              }
                            </ul>
                            : <span>No Sample Data Available...</span> }
                          </Tooltip>
                        </Col>
                        <Col xs={isAutoMap ? "6" : "5"}>
                          {this.getMappedFieldDescription(row)}
                        </Col>
                        { !isAutoMap &&
                          <Col
                            xs="2"
                          >
                            {parseInt(row.relevance) ? (row.relevance).toFixed(2) : 0}
                          </Col>
                        }
                      </Row>
                    )
                  })
                }
              </div>
            </div>
          </CardBody>
        </Card>
        { !isAutoMap &&
          <div>
            <section className="customSection">
              <Row>
                <Col xs="12" md="6" lg="6">
                  <FormGroup>
                    <Label for="autocomplete">Function Expression</Label>
                    <AutoComplete
                      udfs={availableFunctions}
                      selectedFields={isCheckedUnchecked}
                      onChange={this._updateExpression}
                      value={expression}
                    />
                  </FormGroup>
                </Col>
                <Col xs="12" md="3" lg="3" className="d-flex">
                  <Button
                    className="previewButton zapButton align-self-center"
                    disabled={_.isEmpty(expression)}
                    onClick={this._transformPreviewData}>
                    Preview
                  </Button>
                </Col>
              </Row>
            </section>
            <section className="customSection">
              <Card>
                <CardHeader className="functionDetails">Function Details</CardHeader>
                <CardBody>
                  <div>
                    <p>
                      <span className="font-weight-bold">Selected Fields: </span>
                      <span>
                      {
                        checkedFields.join(', ')
                      }
                      </span>
                    </p>
                    { expression &&
                      <p><span className="font-weight-bold">Function Expression: </span>
                        <span>
                          { expression }
                        </span>
                      </p>
                    }
                  </div>
                </CardBody>
              </Card>
              <div className="buttonWrapper">
                <Button
                  className="zapButton"
                  disabled={!isFieldMapped}
                  onClick={() => {
                    const mapping = _.find(MlsMappedField.payload.mlsCanonicalFieldsMappingDtoList, {className: selectedClass});
                    resetMapping(mapping.mlsMappingId);
                  }}
                >
                  Reset Mapping
                </Button>
                <Button
                  className="saveButton zapButton"
                  disabled={this.isValidToSave()}
                  onClick={this.modalToggle}>
                  Save
                </Button>
              </div>
            </section>
          </div>
        }
      </div>
    )
  }
}
export default connect(mapStateToProps, null)(MappedFields);
