// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Alert,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';
import _ from 'lodash';

import {
  MappedUnmapped,
  CustomPagination
} from 'components';
import * as MlsStandardValueAction from 'actions/MlsStandardValueAction';
import { getSessionData } from 'utils/session';
import { STANDARDVALUESLIMIT, UNMAPPEDVALUESLIMIT, MAPPEDVALUESLIMIT } from 'constants/global';
const mapDispatchToProps = (dispatch) => ({
  MlsStandardValueAction: bindActionCreators(MlsStandardValueAction, dispatch)
})

const mapStateToProps = state => {
  return {
    MlsStandardValue: _.get(state.MLSStandardValueData, 'MlsStandardValue', {}),
    MlsStandardValueData: _.get(state.MLSStandardValueData, 'MlsStandardValue.payload', []),
    MlsMappedValue: _.get(state.MLSStandardValueData, 'MlsMappedValue', {}),
    MlsUnmappedValue: _.get(state.MLSStandardValueData, 'MlsUnmappedValue', {}),
    MlsConfigureData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsInfoSource: _.get(state.MLSStandardValueData, 'MlsInfoSourceResult', {}),
    MlsInfoSourceData: _.get(state.MLSStandardValueData, 'MlsInfoSourceResult.payload', {}),
    MlsCanonicalFields: _.get(state.MLSStandardValueData, 'MlsCananicalFields', {}),
    MlsCanonicalFieldsData: _.get(state.MLSStandardValueData, 'MlsCananicalFields.payload', {}),
    MlsMappedUnammped: _.get(state.MLSStandardValueData, 'MlsMappedUnammped', {}),
    MlsNewStandardValue: _.get(state.MLSStandardValueData, 'MlsNewStandardValue', {}),
  }
}

type Props = {
  MlsStandardValueAction: typeof MlsStandardValueAction,
  MlsConfigureData: {
    source: string,
  },
  MlsStandardValue: {
    isResponseSuccess: boolean,
    payload: {
      mlsStandardValueDtos: Array<Object>,
      totalRecords: number
    }
  },
  MlsStandardValueData: Object,
  MlsMappedValue: {
    isResponseSuccess: boolean,
    payload: Object
  },
  MlsUnmappedValue: {
    isResponseSuccess: boolean,
    payload: Object
  },
  MlsInfoSource: {
    isResponseSuccess: boolean,
  },
  MlsInfoSourceData: Object,
  MlsCanonicalFields: {
    isResponseSuccess: boolean,
  },
  MlsCanonicalFieldsData: Object,
  MlsMappedUnammped: {
    isResponseSuccess: Object,
  },
  MlsNewStandardValue: {
    isResponseSuccess: boolean,
  }
};

type State = {
  isModalOpen: boolean,
  showAddNewModal: boolean,
  fieldTypeData: Array<Object>,
  mlsSourceData: Array<Object>,
  fieldTypeValue: string,
  selectedStandardValue: Object,
  disableUnmapped: boolean,
  source: string,
  newStandardValue: string,
  clientError: boolean,
  isStandardizable: boolean,
  showAlert: boolean,
  resetPagination: boolean,
  clearMappedData: boolean,
  standardValueSearchText: string
};

class StandardValueScreen extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const { MlsConfigureData } = this.props;
    this.state = {
      isModalOpen: false,
      showAddNewModal: false,
      fieldTypeData: [],
      mlsSourceData: [],
      fieldTypeValue: 'FieldType',
      selectedStandardValue: {},
      disableUnmapped: true,
      source: MlsConfigureData.source ? MlsConfigureData.source : getSessionData('MlsName'),
      newStandardValue: '',
      clientError: false,
      isStandardizable: true,
      showAlert: false,
      resetPagination: false,
      clearMappedData: false,
      standardValueSearchText: ""
    }
  }

  componentDidMount() {
    const { MlsStandardValueAction } = this.props;
    MlsStandardValueAction.getMlsInfoSource();
    MlsStandardValueAction.getMlsCananicalFields(true);
  }

  componentDidUpdate(prevProps) {
    const newState = _.cloneDeep(this.state);

    if(prevProps.MlsStandardValue.isResponseSuccess !== this.props.MlsStandardValue.isResponseSuccess && this.props.MlsStandardValue.isResponseSuccess) {
      newState.resetPagination = false;
      newState.clearMappedData = false;
      this.setState({...newState});
      setTimeout(() => {
        newState.showAlert = false;
        this.setState({...newState});
      }, 1000);
    }

    if(prevProps.MlsInfoSource.isResponseSuccess !== this.props.MlsInfoSource.isResponseSuccess && this.props.MlsInfoSource.isResponseSuccess) {
      newState.mlsSourceData = this.props.MlsInfoSourceData;
      this.setState({...newState});
    }

    if(prevProps.MlsCanonicalFields.isResponseSuccess !== this.props.MlsCanonicalFields.isResponseSuccess && this.props.MlsCanonicalFields.isResponseSuccess) {
      newState.fieldTypeData = this.props.MlsCanonicalFieldsData;
      this.setState({...newState});
    }

    if(prevProps.MlsMappedUnammped.isResponseSuccess !== this.props.MlsMappedUnammped.isResponseSuccess && this.props.MlsMappedUnammped.isResponseSuccess) {
      newState.isModalOpen = this.props.MlsCanonicalFields.isResponseSuccess;
      this.setState({...newState});
    }

    if(prevProps.MlsNewStandardValue.isResponseSuccess !== this.props.MlsNewStandardValue.isResponseSuccess && this.props.MlsNewStandardValue.isResponseSuccess) {
      newState.showAddNewModal = !this.props.MlsNewStandardValue.isResponseSuccess;
      newState.showAlert = true;
      this.setState({...newState});
    }

  }

  onMappedNavigation = (pageNumber: number) => {
    const { source , fieldTypeValue, selectedStandardValue: { id } } = this.state;
    const { MlsStandardValueAction } = this.props;
    MlsStandardValueAction.getMappedValues(id, source, fieldTypeValue, pageNumber);
  }

  onUnMappedNavigation = (pageNumber: number) => {
    const { source , fieldTypeValue } = this.state;
    const { MlsStandardValueAction } = this.props;
    MlsStandardValueAction.getUnmappedValues(fieldTypeValue, source, pageNumber);
  }

  onStandardValueClick = (selectedStandardValue) => {
    const {source , fieldTypeValue} = this.state;
    const { MlsStandardValueAction } = this.props;

    this.setState({selectedStandardValue, disableUnmapped: false, isModalOpen: false});

    MlsStandardValueAction.getMlsInfoSource();
    MlsStandardValueAction.getMappedValues(selectedStandardValue.id, source, fieldTypeValue, 0);
    MlsStandardValueAction.getUnmappedValues(fieldTypeValue, source, 0);
  }

  moveToUnmapped = (selectedMappedData) => {
    const {source , fieldTypeValue, selectedStandardValue : {id}} = this.state;
    this.setState(() => ({  isModalOpen : false}));
    this.props.MlsStandardValueAction.postUnmappedValues(selectedMappedData, fieldTypeValue, source, id);

  }

  moveToMapped = (selectedUnmappedData) => {
    const {source , fieldTypeValue, selectedStandardValue : {id}} = this.state;
    this.setState(() => ({  isModalOpen : false}));
    this.props.MlsStandardValueAction.postMappedValues(selectedUnmappedData, fieldTypeValue, source, id);
  }

  onChangeFieldType = (event) => {
    const newState = _.cloneDeep(this.state);
    const {target : {value}} = event;
    const { MlsStandardValueAction} = this.props;

    newState.fieldTypeValue = value;
    newState.mappedValuesData = [];
    newState.clearMappedData = true;
    newState.selectedStandardValue = '';
    newState.disableUnmapped = true;
    newState.resetPagination = true;

    if (value !== "FieldType") {
      MlsStandardValueAction.getStandardValues(value, 0);
      MlsStandardValueAction.getUnmappedValues(value, this.state.source, 0);
    }

    this.setState({...newState});

  }

  onAddNewClick = () => {
    const { newStandardValue, fieldTypeValue } = this.state;
    if(newStandardValue !== '' ) {
      this.props.MlsStandardValueAction.postStandardValue(newStandardValue, fieldTypeValue);
    } else {
      this.setState(() => ({  clientError: true}));
    }
  }

  standardValueModalToggle = () => {
    this.setState(() => ({  showAddNewModal: !this.state.showAddNewModal}));
  }

  handleInputChange = (event) => {
    const newState = _.cloneDeep(this.state);
    newState.newStandardValue = event.target.value;
    if(newState.newStandardValue === '') {
      newState.clientError = true;
    } else {
      newState.clientError = false;
    }
    this.setState({...newState});
  }

  onSearchStandardValues = (standardValueSearchText: string) => {
    const { fieldTypeValue } = this.state;
    const { searchStandardValues, getStandardValues } = this.props.MlsStandardValueAction;
    this.setState({
      standardValueSearchText
    });
    if(fieldTypeValue !== "FieldType"){
      standardValueSearchText.length !== 0 ? searchStandardValues(fieldTypeValue, standardValueSearchText) : getStandardValues(fieldTypeValue, 0);
    }
  }

  onStandardValueNavigation = (pageNumber: number) => {
    this.props.MlsStandardValueAction.getStandardValues(this.state.fieldTypeValue, pageNumber);
  }

  onSearchMappedValues = (searchQuery: string) => {
    const { source , fieldTypeValue, selectedStandardValue: { id } } = this.state;
    const { MlsStandardValueAction } = this.props;
    if(fieldTypeValue !== "FieldType"){
      MlsStandardValueAction.searchMappedValues(id, source, fieldTypeValue, 0, searchQuery);
    }
  }

  onSearchUnMappedValues = (searchQuery: string) => {
    const { source , fieldTypeValue } = this.state;
    const { MlsStandardValueAction } = this.props;
    if(fieldTypeValue !== "FieldType"){
      MlsStandardValueAction.searchUnmappedValues(fieldTypeValue, source, 0, searchQuery);
    }
  }

  render() {
    const {
      fieldTypeData,
      disableUnmapped,
      source,
      fieldTypeValue,
      isModalOpen,
      newStandardValue,
      showAddNewModal,
      clientError,
      showAlert,
      resetPagination,
      clearMappedData,
      standardValueSearchText
    } = this.state;

    const { MlsStandardValue, MlsUnmappedValue, MlsMappedValue } = this.props;
    return (
      <Col xs="6" md="11" className="StandardValueScreen">
        <h2 className="viewTitle">
          Standardizing Values - MLS Source: {source}
        </h2>
        {
          showAlert &&
          <Alert color="success">
            Variable was saved successfully
          </Alert>
        }

        {
          isModalOpen &&
          <Alert color="success">
            Data saved successfully.
          </Alert>
        }
        <Row className="contentWrapper">
          <Col xs="12" md="4" lg="4">
            <FormGroup>
              <Label for="MlsFieldType">Field Type</Label>
              <Input type="select" name="MlsFieldType" id="MlsFieldType" onChange={this.onChangeFieldType} value={fieldTypeValue}>
                <option value="FieldType">Field Type</option>
                {_.map(fieldTypeData, (item, index) => <option key={index} value={item.name}>{item.name}</option>) }
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="4" lg="4">
              <CustomPagination
                headerText="Standard Value"
                numberOfEntriesPerPage={STANDARDVALUESLIMIT}
                onItemClick={this.onStandardValueClick}
                pageContent={fieldTypeValue !== 'FieldType' ? {...MlsStandardValue, payload: _.sortBy(MlsStandardValue.payload.mlsStandardValueDtos, data => data.value)} : '' }
                keyName="value"
                showAddNewSection={fieldTypeValue !== 'FieldType'}
                addNewValue={this.standardValueModalToggle}
                resetPagination={resetPagination}
                isServerPagination={true}
                onNextClick={this.onStandardValueNavigation}
                onPreviousClick={this.onStandardValueNavigation}
                totalEntries={MlsStandardValue.payload.totalRecords}
                onSearch={this.onSearchStandardValues}
              />
          </Col>
          <Col xs="12" md="8" lg="8">
            <MappedUnmapped
              mappedData={MlsMappedValue}
              unMappedData={MlsUnmappedValue}
              moveToUnmapped={this.moveToUnmapped}
              moveToMapped={this.moveToMapped}
              disable={disableUnmapped}
              clearMappedData={clearMappedData}
              onMappedNextClick={this.onMappedNavigation}
              onMappedPreviousClick={this.onMappedNavigation}
              onUnMappedNextClick={this.onUnMappedNavigation}
              onUnMappedPreviousClick={this.onUnMappedNavigation}
              totalEntriesMapped={MlsMappedValue.payload.totalRecords}
              totalEntriesUnMapped={MlsUnmappedValue.payload.totalRecords}
              numberOfEntriesPerPageMapped={MAPPEDVALUESLIMIT}
              numberOfEntriesPerPageUnMapped={UNMAPPEDVALUESLIMIT}
              onSearchMappedValues={this.onSearchMappedValues}
              onSearchUnMappedValues={this.onSearchUnMappedValues}
            />
          </Col>
        </Row>

        <Modal isOpen={showAddNewModal} className="customModal">
          <ModalHeader toggle={this.standardValueModalToggle}>Add New Standard Value</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="standardValue">Standard Value Name</Label>
              <Input
                id="standardValue"
                name="standardValue"
                onChange={(event) => {
                  this.handleInputChange(event)
                }}
                invalid={clientError}
                value={newStandardValue}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onAddNewClick}>Save</Button>
          </ModalFooter>
        </Modal>
      </Col>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StandardValueScreen);
