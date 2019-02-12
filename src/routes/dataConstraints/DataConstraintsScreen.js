// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  FormGroup,
  Input,
  Row,
  Col,
  Table,
  Label,
  Pagination,
  PaginationLink,
  PaginationItem,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';
import { AutoSuggestion } from 'components';
import { getCookie } from 'utils/session';
import _ from 'lodash';
import './DataConstraintsScreen.scss';
import * as MlsDataConstraintsAction from 'actions/MlsDataConstraintsAction';
import * as MlsCanonicalActions from 'actions/MlsCanonicalMappingAction';

const mapDispatchToProps = (dispatch) => ({
  MlsDataConstraintsAction: bindActionCreators(MlsDataConstraintsAction, dispatch),
  MlsCanonicalActions: bindActionCreators(MlsCanonicalActions, dispatch),
});

const mapStateToProps = state => {
  return {
    MlsConstraintsInfo: _.get(state.MLSConstraintsData, 'MlsConstraintsInfo', {}),
    MlsConstraintsData: _.get(state.MLSConstraintsData, 'MlsConstraintsInfo.payload', {}),
    MlsConstraintUpdateInfo: _.get(state.MLSConstraintsData, 'MlsConstraintUpdateInfo', {}),
    MlsNames: _.get(state.MLSConstraintsData, 'MlsNames', {}),
    ConstraintPhases: _.get(state.MLSConstraintsData, 'ConstraintPhases', {}),
    ConstraintFields: _.get(state.MLSConstraintsData, 'ConstraintFields', {}),
    ConstraintFieldValues: _.get(state.MLSConstraintsData, 'ConstraintFieldValues', {}),
    ConstraintFieldMetrics: _.get(state.MLSConstraintsData, 'ConstraintFieldMetrics', {}),
    ConstraintExpression: _.get(state.MLSConstraintsData, 'ConstraintExpression', {}),
    CreateConstraint: _.get(state.MLSConstraintsData, 'CreateConstraint', {}),
    EditConstraint: _.get(state.MLSConstraintsData, 'EditConstraint', {}),
    MlsDownloadTypesList: _.get(state.MLSCanonicalData, 'MlsDowloadTypesList', {}),
  }
};

type Props = {
  MlsCanonicalActions: typeof MlsCanonicalActions,
  MlsDataConstraintsAction: typeof MlsDataConstraintsAction,
  MlsConstraintsInfo: {
    isResponseSuccess: boolean,
  },
  MlsConstraintUpdateInfo: Object,
  MlsConstraintsData: Array<Object>,
  MlsNames: Object,
  ConstraintPhases: Object,
  ConstraintFields: Object,
  ConstraintFieldValues: Object,
  ConstraintFieldMetrics: Object,
  ConstraintExpression: Object,
  CreateConstraint: Object,
  EditConstraint: Object,
  MlsDownloadTypesList: Object,
};

type State = {
  constraintsData: Array<Object>,
  isModalOpen: boolean,
  autoSuggestData: Array<Object>,
  autoSuggestKey: string,
  searchKeys: Array<string>,
  source: Array<Object>,
  phase: Array<Object>,
  downloadType: Array<Object>,
  mlsDownloadTypes: Array<Object>,
  mlsNames: Array<Object>,
  constraintPhases: Array<Object>,
  constraintFields: Array<Object>,
  constraintFieldMetrics: Array<Object>,
  constraintExpression: Array<Object>,
  endInterval: number,
  createConstraint: {
    id: number,
    source: string,
    phase: string,
    downloadType: string,
    metricSource: string,
    startDateInterval: string,
    endDateInterval: string,
    expression: string,
    notes: string,
    enabled: boolean,
    createdBy: string,
    updatedBy: string,
    createTs: number,
    updateTs: number
  },
  showAlert: boolean,
  successMessage: string,
  numberOfEntriesPerPage: number,
  pageNumber: number,
  disablePrevious: boolean,
  disableNext: boolean,
  updatedConstraintId: number,
  isEditConstraint: boolean,
  selectedConstraint: number
};

class MlsDataConstraintsScreen extends Component<Props, State> {

  currentUser: string = getCookie('userName');
  initialAutoSuggestData: Array<Object> = [
    {
      key: "field"
    }
  ];
  nextQuerySuggestions: Array<Object> = [
    { key: "value" },
    { key: "metric" }
  ];
  initialConstraintData: Object = {
    id: 0,
    source: '',
    phase: '',
    downloadType: '',
    metricSource: '',
    startDateInterval: 'TODAY',
    endDateInterval: 'TODAY-1',
    expression: '',
    notes: '',
    enabled: true,
    createdBy: this.currentUser,
    updatedBy: this.currentUser
  };
  constraintFieldsMappedWithIds: Object;

  state = {
    isModalOpen: false,
    autoSuggestData: this.initialAutoSuggestData,
    autoSuggestKey: "key",
    searchKeys: ["key"],
    source: [],
    phase: [],
    downloadType: [],
    mlsDownloadTypes: [],
    mlsNames: [],
    constraintPhases: [],
    constraintFields: [],
    constraintFieldMetrics: [],
    constraintExpression: [],
    endInterval: 1,
    createConstraint: this.initialConstraintData,
    showAlert: false,
    successMessage: '',
    constraintsData: [],
    numberOfEntriesPerPage: 5,
    pageNumber: 1,
    disablePrevious: true,
    disableNext: false,
    updatedConstraintId: -1,
    isEditConstraint: false,
    selectedConstraint: -1
  };

  componentDidMount() {
    const {
      MlsDataConstraintsAction: {
        getDataConstraintsList,
        getMlsNames,
        getConstraintPhases,
        getConstraintFields,
        getConstraintFieldMetrics,
        getConstraintExpression
      },
      MlsCanonicalActions
    } = this.props;
    getDataConstraintsList();
    getMlsNames();
    getConstraintPhases();
    getConstraintFields();
    getConstraintFieldMetrics();
    getConstraintExpression();
    MlsCanonicalActions.getDownloadTypeList();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      MlsConstraintsInfo,
      MlsConstraintsData,
      MlsConstraintUpdateInfo,
      MlsDownloadTypesList,
      MlsNames,
      ConstraintPhases,
      ConstraintFields,
      ConstraintFieldValues,
      ConstraintFieldMetrics,
      ConstraintExpression,
      CreateConstraint,
      EditConstraint,
    } = this.props;

    if(prevProps.MlsConstraintsInfo.isResponseSuccess !== MlsConstraintsInfo.isResponseSuccess
      && MlsConstraintsInfo.isResponseSuccess) {
        this.setState({constraintsData: MlsConstraintsData});
    }

    if(prevProps.MlsConstraintUpdateInfo.isResponseSuccess !== MlsConstraintUpdateInfo.isResponseSuccess
      && MlsConstraintUpdateInfo.isResponseSuccess) {
        const { constraintsData, updatedConstraintId } = this.state;
        const newConstraintsData = _.cloneDeep(constraintsData);
        const index = _.findIndex(constraintsData, { id: updatedConstraintId });
        newConstraintsData[index].enabled = !newConstraintsData[index].enabled;
        this.setState({
          constraintsData: newConstraintsData,
          showAlert: true,
          successMessage: "Constraint updated successfully."
        });
    }

    if(prevProps.EditConstraint.isResponseSuccess !== EditConstraint.isResponseSuccess
      && EditConstraint.isResponseSuccess) {
        this.props.MlsDataConstraintsAction.getDataConstraintsList();
        this.setState({
          isModalOpen: false,
          showAlert: true,
          successMessage: "Constraint updated successfully."
        });
    }

    if(prevProps.MlsDownloadTypesList.isResponseSuccess !== MlsDownloadTypesList.isResponseSuccess && MlsDownloadTypesList.isResponseSuccess) {
      this.setState({
        mlsDownloadTypes: this.getSelectSpecificData(MlsDownloadTypesList.payload, "key")
      });
    }

    if(prevProps.MlsNames.isResponseSuccess !== MlsNames.isResponseSuccess && MlsNames.isResponseSuccess) {
      this.setState({
        mlsNames: this.getSelectSpecificData(MlsNames.payload, "")
      });
    }

    if(prevProps.ConstraintPhases.isResponseSuccess !== ConstraintPhases.isResponseSuccess && ConstraintPhases.isResponseSuccess) {
      this.setState({
        constraintPhases: this.getSelectSpecificData(ConstraintPhases.payload, "")
      });
    }

    if(prevProps.ConstraintFields.isResponseSuccess !== ConstraintFields.isResponseSuccess && ConstraintFields.isResponseSuccess) {
      const fields = ConstraintFields.payload;
      const uniqueFields = _.uniqBy(fields, 'metricSource');
      const fieldsMappedWithIds = {};
      _.map(fields, item => {
        const { metricSource, id } = item;
        if(!fieldsMappedWithIds[metricSource]){
          fieldsMappedWithIds[metricSource] = [id];
        } else {
          fieldsMappedWithIds[metricSource].push(id);
        }
      });
      this.constraintFieldsMappedWithIds = fieldsMappedWithIds;
      this.setState({
        constraintFields: uniqueFields,
      });
    }

    if(prevProps.ConstraintFieldValues.isResponseSuccess !== ConstraintFieldValues.isResponseSuccess && ConstraintFieldValues.isResponseSuccess) {
      this.setState({
        autoSuggestData: ConstraintFieldValues.payload,
        autoSuggestKey: "metricSourceValue",
        searchKeys: ["metricSourceValue"]
      });
    }

    if(prevProps.ConstraintFieldMetrics.isResponseSuccess !== ConstraintFieldMetrics.isResponseSuccess && ConstraintFieldMetrics.isResponseSuccess) {
      const metricsData = _.map(ConstraintFieldMetrics.payload, item => {
        return {
          metricsValue: item
        }
      });
      this.setState({
        constraintFieldMetrics: metricsData,
      });
    }

    if(prevProps.ConstraintExpression.isResponseSuccess !== ConstraintExpression.isResponseSuccess && ConstraintExpression.isResponseSuccess) {
      const expressionData = _.map(ConstraintExpression.payload, item => {
        return {
          expressionValue: item
        }
      });
      this.setState({
        constraintExpression: expressionData,
      });
    }

    if(prevProps.CreateConstraint.isResponseSuccess !== CreateConstraint.isResponseSuccess && CreateConstraint.isResponseSuccess) {
      this.props.MlsDataConstraintsAction.getDataConstraintsList();
      this.setState({
        showAlert: true,
        successMessage: "Constraint created successfully.",
        isModalOpen: false
      });
    }
  }

  getNumberOfPages = () => {
    const { constraintsData, numberOfEntriesPerPage } = this.state;
    return Math.ceil(constraintsData.length / numberOfEntriesPerPage);
  }

  onChangePageSize = (event: Object) => {
    this.setState({ numberOfEntriesPerPage: event.target.value });
  }

  onPageNumberclick = (index: number) => {
    const newState = {
      disablePrevious: false,
      disableNext: false,
      pageNumber: index
    };
    if(index === 1) {
      newState.disablePrevious = true;
      newState.disableNext = false;
    } else if(newState.pageNumber === this.getNumberOfPages()) {
      newState.disablePrevious = false;
      newState.disableNext = true;
    }
    this.setState({ ...newState });
  }

  onNextClick = () => {
    const numberOfPages = this.getNumberOfPages();
    const { pageNumber } = this.state;
    const newState: Object = {
      pageNumber
    }
    if(pageNumber < numberOfPages) {
      newState.pageNumber++;
      newState.disablePrevious = false;
    }
    if(newState.pageNumber === numberOfPages) {
      newState.disableNext = true;
    }
    this.setState({ ...newState });
  }

  onPreviousClick = () => {
    const newState: Object = {
      pageNumber: this.state.pageNumber
    }
    if(newState.pageNumber > 1) {
      newState.pageNumber--;
      newState.disableNext = false;
    }
    if(newState.pageNumber === 1) {
      newState.disablePrevious = true;
    }
    this.setState({ ...newState });
  }

  renderPagination = () => {
    const { disableNext, disablePrevious } = this.state;
    if(this.getNumberOfPages() > 1) {
      return (
        <div>
          <Pagination className="customPagination">
            <PaginationItem disabled={disablePrevious}>
              <PaginationLink previous onClick={this.onPreviousClick} />
            </PaginationItem>
              {this.renderPageTiles()}
            <PaginationItem disabled={disableNext}>
              <PaginationLink next href="javascript:void(0);" onClick={this.onNextClick} />
            </PaginationItem>
          </Pagination>
        </div>
      )
    }
  }

  renderPageTiles = () => {
    let pageArray = [];
    const { pageNumber } = this.state;
    const numberOfPages = this.getNumberOfPages();
    for(let i = 0; i < numberOfPages; i++) {
      pageArray.push(
        <PaginationItem key={i}>
          <PaginationLink
            key={i}
            onClick={() => {
              this.onPageNumberclick(i+1)
            }}
            className={ i+1 === pageNumber ? 'activePage' : '' }
          >
            {i+1}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pageArray;
  }

  enableDisableConstraint = (constraint: Object) => {
    const newConstraintData = _.cloneDeep(constraint);
    newConstraintData.enabled = !newConstraintData.enabled;
    this.setState({updatedConstraintId: newConstraintData.id});
    this.props.MlsDataConstraintsAction.enableDisableConstraint(newConstraintData);
  }

  getSelectSpecificData = (data: Array<any>, selector: string) => {
    const selectData = [];
    selectData.push({
      value: "*",
      label: "All"
    });
    _.map(data, item => {
      const selectedValue = selector === "" ? item : item[selector];
      selectData.push({
        value: selectedValue,
        label: selectedValue
      });
    });
    return selectData;
  }

  onAddNewConstraint = () => {
    this.setState({
      isModalOpen: true,
      createConstraint: this.initialConstraintData,
      phase: [],
      source: [],
      downloadType: [],
      showAlert: false
    });
  }

  getModifiedConstraintFields = (field: string) => {
    return _.map(field.split("|"), item => {
      const fieldValue = item.trim();
      return({
        value: fieldValue,
        label: fieldValue === "*" ? "All" : item
      });
    });
  }

  editConstraint = (constraint: Object, index: number) => {
    const { downloadType, phase, source } = constraint;
    this.setState({
      isModalOpen: true,
      createConstraint: { ...constraint, updatedBy: this.currentUser },
      source: this.getModifiedConstraintFields(source),
      phase: this.getModifiedConstraintFields(phase),
      downloadType: this.getModifiedConstraintFields(downloadType),
      isEditConstraint: true,
      selectedConstraint: index,
      showAlert: false
    });
  }

  renderDataConstraintsTable = () => {
    const { constraintsData, numberOfEntriesPerPage, pageNumber } = this.state;
    const startIndex = numberOfEntriesPerPage * (pageNumber - 1);
    let contentData = [];
    for(let i = startIndex; i < numberOfEntriesPerPage * pageNumber; i++) {
      const item = constraintsData[i];
      if(item) {
        const disabled = item.enabled === false;
        contentData.push(<tr key={i}>
          <td disabled={disabled}>{item.source}</td>
          <td disabled={disabled} className="cellSize">{item.phase}</td>
          <td disabled={disabled}>{item.downloadType}</td>
          <td disabled={disabled} className="cellSize">{item.metricSource}</td>
          <td disabled={disabled}>{item.startDateInterval}</td>
          <td disabled={disabled}>{item.endDateInterval}</td>
          <td disabled={disabled} className="cellSize">{item.expression}</td>
          <td disabled={disabled}>{item.notes}</td>
          <td className="updateConstrait">
            <a href="javascript:void(0);" onClick={() => this.enableDisableConstraint(item)}>
              { item.enabled ? 'Disable' : 'Enable' }
            </a>
          </td>
          <td className="centered" disabled={disabled}>
            {item.updatedBy}
          </td>
          <td className="centered" disabled={disabled}>
            <a href="javascript:void(0);" onClick={() => this.editConstraint(item, i)}>
             <i className="fa fa-edit"></i>
            </a>
          </td>
        </tr>)
      }
    }

    return (
      <Table bordered className="mls-constraint-table">
        <thead>
          <tr>
            <th>
              <span>Source</span>
            </th>
            <th className="cellSize">
              <span>Phase</span>
            </th>
            <th>
              <span>Download Type</span>
            </th>
            <th className="cellSize">
              <span>Metric Source</span>
            </th>
            <th>
              <span>Start Date Interval</span>
            </th>
            <th>
              <span>End Date Interval</span>
            </th>
            <th className="cellSize">
              <span>Expression</span>
            </th>
            <th>
              <span>Notes</span>
            </th>
            <th>
              <span>Enable/Disable</span>
            </th>
            <th>
              <span>Updated By</span>
            </th>
            <th>
              <span>Update</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {contentData}
        </tbody>
      </Table>
    )
  }

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      isEditConstraint: false,
      selectedConstraint: -1
    });
  }

  handleDropdownChange = (selectedValues: Array<Object>, stateKey: string) => {
    const newCreateConstraint = _.cloneDeep(this.state.createConstraint);
    let pipeExpression = "", values = selectedValues;
    const allSelected = _.filter(selectedValues, {value: "*"});
    if(allSelected.length > 0){
      pipeExpression = "*";
      values = allSelected;
    } else {
      pipeExpression = this.getPipeSeparatedValues(selectedValues, 'value');
    }
    newCreateConstraint[stateKey] = pipeExpression;
    this.setState({
      [stateKey]: values,
      createConstraint: newCreateConstraint
    });
  }

  getPipeSeparatedValues = (data: Array<any>, selector: string) => {
    let expression = "";
    _.map(data, (item, index) => {
      expression = index === 0 ? item[selector] : expression + " | " + item[selector];
    });
    return expression;
  }

  getEndDateIntervals = () => {
    let optionsList = [];
    for(let i = 1; i <= 30; i++){
      optionsList.push(<option key={i} value={i}>{i}</option>);
    }
    return optionsList;
  }

  onChangeInterval = (event: Object) => {
    const value = parseInt(event.target.value);
    const newCreateConstraint = _.cloneDeep(this.state.createConstraint);
    newCreateConstraint.endDateInterval = `TODAY-${value}`;
    this.setState({
      endInterval: value,
      createConstraint: newCreateConstraint
    });
  }

  handleMetricChange = (queryType: string, searchQuery: string, selectedEntryList: Array<Object>, inputValue: string) => {
    const { constraintFields, constraintFieldMetrics, autoSuggestKey, createConstraint } = this.state;
    const { getConstraintFieldValues } = this.props.MlsDataConstraintsAction;
    const { selectedKey, selectedValue } = _.last(selectedEntryList);
    if(queryType === "" && selectedKey.length !== 0 && selectedValue.length !== 0){
      this.setState({
        autoSuggestData: this.nextQuerySuggestions,
        autoSuggestKey: "key",
        searchKeys: ["key"],
        createConstraint: { ...createConstraint, metricSource: inputValue },
      });
      return;
    }
    switch(queryType.toLowerCase()){
      case "field":
      this.setState({
        autoSuggestData: constraintFields,
        autoSuggestKey: 'metricSource',
        searchKeys: ['metricSource'],
        createConstraint: { ...createConstraint, metricSource: inputValue },
      });
      break;
      case "value": {
        const fieldKey = selectedEntryList[0].selectedValue;
        const field = _.find(constraintFields, {metricSource: fieldKey});
        if(!_.isEmpty(field) && autoSuggestKey !== 'metricSourceValue'){
          getConstraintFieldValues(_.join(this.constraintFieldsMappedWithIds[fieldKey]));
        }
        this.setState({
          createConstraint: { ...createConstraint, metricSource: inputValue },
        });
        break;
      }
      case "metric":
        this.setState({
          autoSuggestData: constraintFieldMetrics,
          autoSuggestKey: 'metricsValue',
          searchKeys: ['metricsValue'],
          createConstraint: { ...createConstraint, metricSource: inputValue },
        });
      break;

      default:
        this.setState({
          autoSuggestData: this.initialAutoSuggestData,
          autoSuggestKey: "key",
          searchKeys: ["key"],
          createConstraint: { ...createConstraint, metricSource: inputValue },
        });
    }

  }

  _renderMetricSuggestionItem = (item: Object) => {
    const { autoSuggestKey } = this.state;
    return (
      <Fragment>
        <a href="javascript: void(0);">{item[autoSuggestKey]}</a>
      </Fragment>
    );
  }

  onSelectMetricSuggestion = (selectedEntryList: Array<Object>, callAPI: boolean, toValueUpdate: boolean, inputValue: string) => {
    const newState: Object = {
      createConstraint: { ...this.state.createConstraint, metricSource: inputValue }
    };
    const { selectedKey, selectedValue, selectedText } = selectedEntryList[0];
    if(selectedKey.length === 0 && selectedValue.length === 0 && selectedText.length === 0) {
      newState.autoSuggestData = this.initialAutoSuggestData;
      newState.autoSuggestKey = "key";
      newState.searchKeys = ["key"];
    } else if(selectedKey == "field" && selectedValue.length !== 0) {
      newState.autoSuggestData = this.nextQuerySuggestions;
      newState.autoSuggestKey = "key";
      newState.searchKeys = ["key"];
    }
    this.setState({ ...newState });
  }

  handleExpressionChange = (queryType: string, searchQuery: string, selectedEntryList: Array<Object>, inputValue: string) => {
    this.setState({
      createConstraint: { ...this.state.createConstraint, expression: inputValue }
    });
  }

  onSelectExpressionSuggestion = (selectedEntryList: Array<Object>, callAPI: boolean, toValueUpdate: boolean, inputValue: string) => {
    this.setState({
      createConstraint: { ...this.state.createConstraint, expression: inputValue }
    });
  }

  _renderExpressionSuggestionItem = (item: Object) => {
    const { autoSuggestKey } = this.state;
    return (
      <Fragment>
        <a href="javascript: void(0);">{item[autoSuggestKey]}</a>
      </Fragment>
    );
  }

  onMetricFocus = () => {
    this.setState({
      autoSuggestData: this.initialAutoSuggestData,
      autoSuggestKey: "key",
      searchKeys: ["key"]
    });
  }

  onExpressionFocus = () => {
    const { createConstraint: { expression }, constraintExpression } = this.state;
    this.setState({
      autoSuggestData: constraintExpression,
      autoSuggestKey: "expressionValue",
      searchKeys: ["expressionValue"]
    });
  }

  cancelConstraint = () => {
    this.setState({
      isModalOpen: false,
      isEditConstraint: false,
      selectedConstraint: -1
    });
  }

  onSaveConstraint = () => {
    const { createConstraint, editConstraint } = this.props.MlsDataConstraintsAction;
    const { isEditConstraint, createConstraint: data } = this.state;
    if(isEditConstraint){
      editConstraint(data);
      this.setState({
        isEditConstraint: false,
        selectedConstraint: -1
      });
    } else {
      createConstraint(data);
    }
  }

  isSaveDisabled = () => {
    let disabled = false, editDisabled = true;
    const { createConstraint, constraintsData, selectedConstraint, isEditConstraint } = this.state;
    for (let key in createConstraint) {
      if (createConstraint.hasOwnProperty(key) && typeof createConstraint[key] !== "boolean" && key !== "notes") {
        if(!_.isEmpty(createConstraint[key]) && createConstraint[key].length === 0) {
          disabled = true;
          break;
        }
      }
    }
    if(isEditConstraint) {
      editDisabled = _.isEqual(createConstraint, constraintsData[selectedConstraint]);
      return editDisabled || disabled;
    }
    return disabled;
  }

  onChangeNotes = (event: Object) => {
    this.setState({
      createConstraint: { ...this.state.createConstraint, notes: event.target.value }
    });
  }

  render() {
    const {
      numberOfEntriesPerPage,
      isModalOpen,
      source,
      phase,
      downloadType,
      mlsNames,
      constraintPhases,
      mlsDownloadTypes,
      endInterval,
      searchKeys,
      autoSuggestKey,
      autoSuggestData,
      createConstraint,
      showAlert,
      successMessage,
      isEditConstraint
    } = this.state;
    const { CreateConstraint, EditConstraint } = this.props;
    return (
      <Col xs="6" md="11" className="mlsConstraintScreen">
        <h2 className="viewTitle marginLeft">Data Constraints</h2>
        { showAlert &&
          <Alert color="success">
            {successMessage}
          </Alert>
        }

        <Row className="contentWrapper pageSize">
          <Col xs="9">
            <Button
              color="primary"
              onClick={this.onAddNewConstraint}
              className="zapButton addNewButton text-right"
            >
              Add New
            </Button>
          </Col>
          <Col xs="3">
            <FormGroup row>
              <Label for="PageSize" sm="4">Page Size</Label>
              <Col sm="4">
                <Input type="select" name="PageSize" id="PageSize" value={numberOfEntriesPerPage} onChange={this.onChangePageSize}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </Input>
              </Col>
            </FormGroup>
          </Col>
        </Row>

        <Row className="contentWrapper">
          {this.renderDataConstraintsTable()}
        </Row>

        <Row>
          <Col sm="6" md={{ size: 4, offset: 4 }} lg={{ size: 4, offset: 4 }}>
            {this.renderPagination()}
          </Col>
        </Row>

        { isModalOpen &&
          <Modal isOpen={isModalOpen} toggle={this.toggleModal} keyboard={false} className="constraintModal">
            <ModalHeader toggle={this.toggleModal}>
              { isEditConstraint ? "Edit Constraint" : "Add New Constraint" }
            </ModalHeader>
            <ModalBody>
            { (CreateConstraint.isFail || EditConstraint.isFail) &&
              <Alert color="danger">
                { CreateConstraint.isFail ? CreateConstraint.error.errorMessage : EditConstraint.error.errorMessage }
              </Alert>
            }
            { isEditConstraint &&
              <Row>
                <Col xs="3">
                  <label>Created by:</label>
                  <p>{createConstraint.createdBy}</p>
                </Col>
                <Col xs="3">
                  <label>Created at: </label>
                  <p>{moment(new Date(createConstraint.createTs)).format("DD MMM YYYY, HH:mm")}</p>
                </Col>
                <Col xs="3">
                  <label>Last updated by: </label>
                  <p>{createConstraint.updatedBy}</p>
                </Col>
                <Col xs="3">
                  <label>Last updated: </label>
                  <p>{moment(new Date(createConstraint.updateTs)).format("DD MMM YYYY, HH:mm")}</p>
                </Col>
              </Row>
            }
            <Row className="mt-4">
              <Col xs="5">
                <FormGroup>
                  <Label for="source">Source:</Label>
                  <Select
                    value={source}
                    onChange={(selectedValues) => this.handleDropdownChange(selectedValues, 'source')}
                    options={mlsNames}
                    isMulti
                    id="source"
                  />
                  {
                    source.length > 0 &&
                    <p className="expression">
                      <span>Source: </span>
                      <span>
                        { createConstraint.source }
                      </span>
                    </p>
                  }
                </FormGroup>
              </Col>
              <Col sm={{offset: 1}}></Col>
              <Col xs="5">
                <FormGroup>
                  <Label for="phase">Phase:</Label>
                  <Select
                    value={phase}
                    onChange={(selectedValues) => this.handleDropdownChange(selectedValues, 'phase')}
                    options={constraintPhases}
                    isMulti
                    id="phase"
                  />
                  {
                    phase.length > 0 &&
                    <p className="expression">
                      <span>Phase: </span>
                      <span>
                        { createConstraint.phase }
                      </span>
                    </p>
                  }
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="5">
                <FormGroup>
                  <Label for="downloadType">Download Type:</Label>
                  <Select
                    value={downloadType}
                    onChange={(selectedValues) => this.handleDropdownChange(selectedValues, 'downloadType')}
                    options={mlsDownloadTypes}
                    isMulti
                    id="downloadType"
                  />
                  {
                    downloadType.length > 0 &&
                    <p className="expression">
                      <span>Download Type: </span>
                      <span>
                        { createConstraint.downloadType }
                      </span>
                    </p>
                  }
                </FormGroup>
              </Col>
              <Col sm={{offset: 1}}></Col>
              <Col xs="5">
                <FormGroup>
                  <Label for="metricSource">Metric Source: </Label>
                  <span> (field:testField,value:testValue)</span>
                  <AutoSuggestion
                    autoSuggestData={autoSuggestData}
                    autoSuggestKey={autoSuggestKey}
                    handleInputChange={this.handleMetricChange}
                    renderSuggestionItem={this._renderMetricSuggestionItem}
                    onUpdateValueToField={this.onSelectMetricSuggestion}
                    onFocus={this.onMetricFocus}
                    searchKeys={searchKeys}
                    suggestionHeader={false}
                    querySeparator=":"
                    expressionSeparator=","
                    value={createConstraint.metricSource}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="5">
                <FormGroup>
                  <Label for="startDateInterval">Start Date Interval:</Label>
                  <Input
                    type="text"
                    value={createConstraint.startDateInterval}
                    readOnly
                    id="startDateInterval"
                  />
                </FormGroup>
              </Col>
              <Col sm={{offset: 1}}></Col>
              <Col xs="5">
                <FormGroup>
                  <Label for="endDateInterval">End Date Interval:</Label>
                  <Row className="align-items-center no-gutters">
                    <Col xs="2">
                      <span className="font-weight-bold">
                        <span>TODAY</span>
                        <span className="minus-sign"></span>
                      </span>
                    </Col>
                    <Col xs="10">
                      <Input
                        type="select"
                        value={endInterval}
                        name="endDateInterval"
                        id="endDateInterval"
                        onChange={this.onChangeInterval}
                      >
                        {
                          this.getEndDateIntervals()
                        }
                      </Input>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="5">
                <FormGroup>
                  <Label for="expression">Expression:</Label>
                  <AutoSuggestion
                    autoSuggestData={autoSuggestData}
                    autoSuggestKey={autoSuggestKey}
                    handleInputChange={this.handleExpressionChange}
                    renderSuggestionItem={this._renderExpressionSuggestionItem}
                    onUpdateValueToField={this.onSelectExpressionSuggestion}
                    onFocus={this.onExpressionFocus}
                    searchKeys={searchKeys}
                    suggestionHeader={false}
                    value={createConstraint.expression}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="11">
                <FormGroup>
                  <Label for="notes">Notes:</Label>
                  <Input
                    type="textarea"
                    id="notes"
                    value={createConstraint.notes}
                    onChange={this.onChangeNotes}
                  />
                </FormGroup>
              </Col>
            </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={this.isSaveDisabled()} onClick={this.onSaveConstraint}>Save</Button>
              <Button color="primary" onClick={this.cancelConstraint}>Cancel</Button>
            </ModalFooter>
          </Modal>
        }
      </Col>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MlsDataConstraintsScreen);
