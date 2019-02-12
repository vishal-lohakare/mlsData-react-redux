// @flow

import React, { Component } from 'react';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Label,
  Button,
  Alert,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as MlsCanonicalActions from 'actions/MlsCanonicalMappingAction';
import * as MlsUrlBuilderAction from 'actions/MlsUrlBuilderAction';
import {
  CustomPagination,
  MappedFields,
  ZapPreview
} from 'components';
import { showLoader } from 'utils/loader';
import { getSessionData } from 'utils/session';
import './CanonicalMappingScreen.scss';
import classnames  from 'classnames';

const mapDispatchToProps = (dispatch) => ({
  MlsCanonicalActions: bindActionCreators(MlsCanonicalActions, dispatch),
  MlsUrlBuilderAction: bindActionCreators(MlsUrlBuilderAction, dispatch)
});

const mapStateToProps = state => {

  return {
    MlsCanonical: _.get(state.MLSCanonicalData, 'MlsCanonical', {}),
    MlsCanonicalData: _.get(state.MLSCanonicalData, 'MlsCanonical.payload', []),
    MlsMappedField: _.get(state.MLSCanonicalData, 'MlsMappedField', {}),
    MlsUpdateMappedField: _.get(state.MLSCanonicalData, 'MlsUpdateMappedField', {}),
    MlsUpdateMappedFieldData: _.get(state.MLSCanonicalData, 'MlsUpdateMappedField.payload', {}),
    MlsMappedFieldData: _.get(state.MLSCanonicalData, 'MlsMappedField.payload', {}),
    MlsCanonicalFunctionsData: _.get(state.MLSCanonicalData, 'MlsCanonicalFunctions', {}),
    MlsConfigureData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsAutoCompleteFunctionsData: _.get(state.MLSCanonicalData, 'MlsAutoCompleteFunctions', {}),
    MlsTransformationPreview: _.get(state.MLSCanonicalData, 'MlsTransformationPreview', {}),
    MlsTransformationPreviewData: _.get(state.MLSCanonicalData, 'MlsTransformationPreview.payload', {}),
    MlsUuid: _.get(state.MLSCanonicalData, 'MlsUuid', {}),
    MlsUuidData: _.get(state.MLSCanonicalData, 'MlsUuid.payload', {}),
    MlsDowloadTypesList: _.get(state.MLSCanonicalData, 'MlsDowloadTypesList', {}),
    MlsDowloadTypesListData: _.get(state.MLSCanonicalData, 'MlsDowloadTypesList.payload', []),
    MlsUrlData: _.get(state.MLSUrlBuilderData, 'UrlData', {}),
    MlsUrl: _.get(state.MLSUrlBuilderData, 'GetUrlData', {}),
    MlsDeleteMapping: _.get(state.MLSCanonicalData, 'MlsDeleteMapping', {}),
    MlsExistingMappedFields: _.get(state.MLSCanonicalData, 'MlsExistingMappedFields', {}),
    MlsExistingMappedFieldsData: _.get(state.MLSCanonicalData, 'MlsExistingMappedFields.payload', []),
    MlsAutoMap: _.get(state.MLSCanonicalData, 'MlsAutoMap', []),
    MlsAutoMapData: _.get(state.MLSCanonicalData, 'MlsAutoMap.payload', []),
    saveMlsAutoMapping: _.get(state.MLSCanonicalData, 'saveMlsAutoMapping', []),
  }
}

type Props = {
  MlsCanonicalActions: typeof MlsCanonicalActions,
  MlsMappedFieldData: Object,
  MlsUpdateMappedField: {
    isResponseSuccess: boolean
  },
  MlsMappedField: {
    isResponseSuccess: boolean,
  },
  MlsCanonicalFunctionsData: {
    isResponseSuccess: boolean
  },
  MlsCanonicalData: Object,
  MlsCanonical: {
    isResponseSuccess: boolean
  },
  MlsConfigureData: Object,
  MlsAutoCompleteFunctionsData: Object,
  MlsTransformationPreview: {
    isResponseSuccess: boolean,
    isFail: boolean
  },
  MlsTransformationPreviewData: Object,
  MlsUuid: {
    isResponseSuccess: boolean
  },
  saveMlsAutoMapping: {
    isResponseSuccess: boolean
  },
  MlsUuidData: Object,
  MlsDowloadTypesList: {
    isResponseSuccess: boolean
  },
  MlsAutoMap: {
    isResponseSuccess: boolean,
    isLoading: boolean,
    payload: Array<Object>
  },
  MlsAutoMapData: Array<Object>,
  MlsExistingMappedFieldsData: Object,
  MlsExistingMappedFields: Object,
  MlsDowloadTypesListData: Array<Object>,
  MlsUrlData: Object,
  MlsUrl: Object,
  MlsUpdateMappedFieldData: Object,
  MlsDeleteMapping: Object,
  MlsUrlBuilderAction: typeof MlsUrlBuilderAction
};

type State = {
  selectedCanonicalField: string,
  selectedDownloadType: string,
  selectedSampleFile: string,
  source: string,
  id: number,
  uuid: string,
  previewTableData: Array<Object>,
  previewTableHeader: Array<string>,
  showTable: boolean,
  checkedFields: Array<string>,
  expression: string,
  MlsDowloadTypesListData: Array<Object>,
  sampleFileList: Array<string>,
  resetPagination: boolean,
  showAlert: boolean,
  isFieldMapped: boolean,
  successMessage: string,
  isOpenAutomapModal: boolean,
  editedAutoMapField: number,
  resetAutoMappedData: boolean,
  selectedAutoMapFields: Array<Object>,
  downloadTypeAutoMap: string,
  autoMapList: Array<Object>
};

class CanonicalMappingScreen extends Component<Props, State> {
  isResizing: boolean = false;
  state = {
    selectedCanonicalField: '',
    selectedDownloadType: '',
    selectedSampleFile: '',
    source: this.props.MlsConfigureData.source ? this.props.MlsConfigureData.source : getSessionData('MlsName'),
    id: _.isUndefined(this.props.MlsConfigureData.id) ? getSessionData('MlsID') : this.props.MlsConfigureData.id,
    uuid: '',
    transformationPreviewData: {},
    previewTableData: [],
    showTable: false,
    expression: '',
    checkedFields: [],
    previewTableHeader: [],
    MlsDowloadTypesListData: [],
    sampleFileList: [],
    resetPagination: false,
    showAlert: false,
    isFieldMapped: false,
    successMessage: '',
    isOpenAutomapModal: false,
    selectedAutoMapFields: [],
    downloadTypeAutoMap: '',
    editedAutoMapField: -1,
    resetAutoMappedData: false,
    autoMapList: []
  };

  componentDidMount() {
    const { MlsCanonicalActions, MlsUrlBuilderAction, MlsUrlData } = this.props;
    const { id } = this.state;
    MlsCanonicalActions.getDownloadTypeList();
    if ((_.isUndefined(MlsUrlData) || MlsUrlData.length === 0 || id !== MlsUrlData[0].UrlDetails.sourceId)) {
      MlsUrlBuilderAction.getMlsUrl(id);
    } else {
      this.setState(() => ({ sampleFileList: this.prepareSampleFileDropdown(MlsUrlData) }));
    }
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate(prevProps) {
    const {
      MlsUpdateMappedField,
      MlsDeleteMapping,
      MlsMappedField,
      MlsMappedFieldData,
      MlsAutoMap,
    } = this.props;
    const newState = _.cloneDeep(this.state);
    if (prevProps.MlsCanonical.isResponseSuccess !== this.props.MlsCanonical.isResponseSuccess && this.props.MlsCanonical.isResponseSuccess) {
      newState.resetPagination = false;
      this.setState({ ...newState });
    }
    if (prevProps.MlsTransformationPreview.isResponseSuccess !== this.props.MlsTransformationPreview.isResponseSuccess &&
      this.props.MlsTransformationPreview.isResponseSuccess) {
      newState.transformationPreviewData = this.props.MlsTransformationPreviewData;
      this.setState({ ...newState });
      this.convertPreviewData(this.props.MlsTransformationPreviewData, this.state.checkedFields, this.state.selectedCanonicalField);
    }
    if (prevProps.MlsTransformationPreview.isFail !== this.props.MlsTransformationPreview.isFail &&
      this.props.MlsTransformationPreview.isFail) {
      newState.transformationPreviewData = [];
      this.setState({ ...newState });
      this.convertPreviewData(undefined, this.state.checkedFields, this.state.selectedCanonicalField);
    }
    if (prevProps.MlsUuid.isResponseSuccess !== this.props.MlsUuid.isResponseSuccess && this.props.MlsUuid.isResponseSuccess) {
      newState.uuid = this.props.MlsUuidData.mlsPrimaryPhotoUrl;
      this.setState({ ...newState });
    }
    if (prevProps.saveMlsAutoMapping.isResponseSuccess !== this.props.saveMlsAutoMapping.isResponseSuccess && this.props.saveMlsAutoMapping.isResponseSuccess) {
      const { selectedDownloadType, source, id } = this.state;
      const { getCanonicalFields, getCanonicalMappings, clearMappedFields } = this.props.MlsCanonicalActions;
      getCanonicalFields(selectedDownloadType, id);
      this.setState({
        isOpenAutomapModal: false,
        showAlert: true,
        successMessage: "AutoMappings Saved Successfully."
      });
      clearMappedFields();
      getCanonicalMappings(source, selectedDownloadType);
    }
    if(prevProps.MlsDowloadTypesList.isResponseSuccess !== this.props.MlsDowloadTypesList.isResponseSuccess && this.props.MlsDowloadTypesList.isResponseSuccess) {
      const { id, source } = this.state;
      newState.MlsDowloadTypesListData = this.props.MlsDowloadTypesListData;
      newState.selectedDownloadType = this.props.MlsDowloadTypesListData[0].key;
      newState.downloadTypeAutoMap = this.props.MlsDowloadTypesListData[0].key;
      this.props.MlsCanonicalActions.getCanonicalFields(newState.selectedDownloadType, id);
      this.props.MlsCanonicalActions.postUuid(newState.source, newState.selectedDownloadType);
      this.props.MlsCanonicalActions.getCanonicalMappings(source, newState.selectedDownloadType);
      this.setState({ ...newState }, () => {
        this.setSelectedSampleFile(newState.selectedDownloadType);
      });
    }

    if (prevProps.MlsUrl.isResponseSuccess !== this.props.MlsUrl.isResponseSuccess) {
      newState.sampleFileList = this.prepareSampleFileDropdown(this.props.MlsUrlData);
      this.setState({ ...newState }, () => {
        this.setSelectedSampleFile(newState.selectedDownloadType);
      });
    }

    if (prevProps.MlsUpdateMappedField.isResponseSuccess !== MlsUpdateMappedField.isResponseSuccess && MlsUpdateMappedField.isResponseSuccess) {
      this.setState({ showAlert: true, isFieldMapped: true, successMessage: 'Mapping saved successfully!' });
    }

    if (prevProps.MlsDeleteMapping.isResponseSuccess !== MlsDeleteMapping.isResponseSuccess && MlsDeleteMapping.isResponseSuccess) {
      this.setState({ showAlert: true, isFieldMapped: false, successMessage: 'Mapping deleted successfully!' });
    }

    if (prevProps.MlsAutoMap.isResponseSuccess !== MlsAutoMap.isResponseSuccess && MlsAutoMap.isResponseSuccess) {
      this.setState({
        autoMapList: MlsAutoMap.payload
      });
    }
  }

  onMouseMove = (event: Object) => {
    if(!this.isResizing) {
      return;
    }
    const container = document.getElementsByClassName("autoMapContainer")[0];
    const leftContainer = document.getElementsByClassName("autoMapList")[0];
    const rightContainer = document.getElementsByClassName("mappedFieldContainer")[0];
    const offsetRight = container.offsetWidth - event.clientX;
    leftContainer.style.width = `${container.offsetWidth - offsetRight}px`;
    rightContainer.style.width = `${offsetRight}px`;
  }

  onMouseUp = () => {
    this.isResizing = false;
  }

  onDragMouseDown = () => {
    this.isResizing = true;
  }

  prepareSampleFileDropdown = (urlData: Object) => {
    let sampleFilesType = [];
    _.map(urlData, (url) => {
      sampleFilesType.push(url.UrlDetails.downloadType);
    })
    sampleFilesType.push('No File');
    sampleFilesType = _.uniq(sampleFilesType);
    return sampleFilesType;
  }

  setSelectedSampleFile = (currentDownloadType: string) => {
    const { sampleFileList } = this.state;
    const index = _.indexOf(sampleFileList, currentDownloadType);
    const _selectedSampleFile = (index !== -1) ? sampleFileList[index] : 'No File';
    this.setState({ selectedSampleFile: _selectedSampleFile });
  }

  getSampleFileData = (rawField: string) => {
    const { source, selectedSampleFile } = this.state;
    const { MlsCanonicalActions } = this.props;
    MlsCanonicalActions.getSampleData(source, selectedSampleFile, rawField);
  }

  onCanonicalItemClick = (selectedCanonicalField) => {
    showLoader();
    const { source, selectedDownloadType } = this.state;
    const { name, mapped } = selectedCanonicalField;
    this.setState({
      selectedCanonicalField: name,
      showAlert: false,
      isFieldMapped: mapped,
      resetPagination: false
    });
    this.props.MlsCanonicalActions.getMappedFields(source, name, selectedDownloadType);
  }

  onSelectDownloadType = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const downloadType = event.target.value;
    const { source, id } = this.state;
    const { MlsCanonicalActions } = this.props;
    MlsCanonicalActions.getCanonicalFields(downloadType, id);
    MlsCanonicalActions.postUuid(source, downloadType);
    newState.selectedDownloadType = downloadType;
    newState.selectedCanonicalField = '';
    newState.resetPagination = true;
    newState.showAlert = false;
    MlsCanonicalActions.getCanonicalMappings(source, downloadType);
    this.setState({ ...newState }, () => {
      this.setSelectedSampleFile(downloadType);
    });

  };

  onSelectSampleFile = (event: Object) => {
    const sampleFile = event.target.value;
    this.setState({ selectedSampleFile: sampleFile });
  };

  saveMappedData = (data) => {
    const { source, selectedCanonicalField, id, selectedDownloadType } = this.state;
    this.props.MlsCanonicalActions.postMappedFields(source, selectedCanonicalField, data, selectedDownloadType, id);
  }

  updateMappedData = (data) => {
    const { source, selectedCanonicalField, id, selectedDownloadType } = this.state;
    this.props.MlsCanonicalActions.updateMappedFields(source, selectedCanonicalField, data, selectedDownloadType, id);
  }

  resetMapping = (mappingId) => {
    const { id, source, selectedDownloadType, selectedCanonicalField } = this.state;
    this.props.MlsCanonicalActions.deleteMapping(mappingId, selectedDownloadType, id, source, selectedCanonicalField);
  }

  getCanonicalFunctions = () => {
    this.props.MlsCanonicalActions.getAvailableFunctions(this.state.source);
  }

  getAutoCompleteFunctions = () => {
    this.props.MlsCanonicalActions.getAutoCompleteFunctions();
  }

  transformPreviewData = (checkedFields, expression) => {
    const { selectedCanonicalField, uuid } = this.state;
    if (!_.isUndefined(selectedCanonicalField) && selectedCanonicalField) {
      this.props.MlsCanonicalActions.postTransformationPreview(uuid, expression, selectedCanonicalField);
    }
    this.setState(() => ({ checkedFields: checkedFields, expression: expression }))
  }

  convertPreviewData = (preivewData, checkedFields, selectedCanonicalField) => {
    const selectedColumns = [...checkedFields, selectedCanonicalField];
    let filteredArray = []
    if (preivewData) {
      for (let index = 0; index < 10; index++) {
        let result = {};
        _.forEach(selectedColumns, value => {
          result[value] = preivewData.dataFrame[index][value]
        });
        filteredArray.push(result);
      }
    }
    this.setState(() => ({ previewTableData: filteredArray, previewTableHeader: selectedColumns, showTable: true }))
  }

  modalClose = () => {
    this.setState(() => ({ showTable: false }));
  }

  renderMappedFields = () => {
    return (
      _.map(this.props.MlsExistingMappedFieldsData, (item, index) => {
        let mappedFields = '';
        _.map(item.sourceFields, (field) => {
          mappedFields = `${mappedFields === '' ? field.sourceFieldName : `${mappedFields}, ${field.sourceFieldName}`}`;
        });
       return  <tr key={index}>
          <td>{item.canonicalFieldName}</td>
          <td className="expressionContent">{item.customTransformationExpression}</td>
          <td className="expressionContent">{mappedFields}</td>
          <td className="expressionContent">{item.className}</td>
          <td className="expressionContent">{item.classDesc}</td>
        </tr>
      })
    )
  }

  toggleAutoMapModal = () => {
    this.setState({
      isOpenAutomapModal: !this.state.isOpenAutomapModal,
      selectedCanonicalField: "",
      resetPagination: true,
      resetAutoMappedData: false,
      editedAutoMapField: -1
    });
    this.props.MlsCanonicalActions.clearMappedFields();
  }

  onSelectDownloadTypeAutoMap = (event: Object) => {
    const downloadTypeAutoMap = event.target.value;
    this.props.MlsCanonicalActions.getAutoMappings(this.state.id, downloadTypeAutoMap);
    this.setState({
      downloadTypeAutoMap,
      editedAutoMapField: -1
    });
  }

  onSelectAutoMapField = (canonicalFieldId: string) => {
    const { selectedAutoMapFields } = this.state;
    const newSelectedAutoMapFields = _.cloneDeep(selectedAutoMapFields);
    const fieldIndex = selectedAutoMapFields.indexOf(canonicalFieldId);
    fieldIndex === -1 ? newSelectedAutoMapFields.push(canonicalFieldId) : newSelectedAutoMapFields.splice(fieldIndex, 1);
    this.setState({
      selectedAutoMapFields: newSelectedAutoMapFields
    });
  }

  onEditAutoMapField = (item:Object, index: number) => {
    const { source, downloadTypeAutoMap } = this.state;
    this.setState({
      editedAutoMapField: index,
      resetAutoMappedData: true
    });
    this.props.MlsCanonicalActions.getMappedFields(source, item.canonicalFieldName , downloadTypeAutoMap);
  }

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

  onSelectFieldToMap = (selectedField: Object) => {
    const { editedAutoMapField, autoMapList } = this.state;
    const newAutoMapList = _.cloneDeep(autoMapList);
    const targetField = newAutoMapList[editedAutoMapField];
    const originalField = this.props.MlsAutoMapData[editedAutoMapField];
    targetField.recommendedFieldName = selectedField ? selectedField.tableSystemName : originalField.recommendedFieldName;
    targetField.desc = selectedField ? this.getMappedFieldDescription(selectedField) : originalField.desc;
    targetField.recommendedFieldIndexId = selectedField ? selectedField.id : originalField.recommendedFieldIndexId;
    targetField.className = selectedField ? selectedField.className : originalField.className;
    targetField.classDescription = selectedField ? selectedField.classDescription : originalField.classDescription;
    this.setState({
      autoMapList: newAutoMapList
    });
  }

  onAutoMapSave = () => {
    const { selectedAutoMapFields, autoMapList, id } = this.state;
    const { saveAutoMappings, clearMappedFields } = this.props.MlsCanonicalActions;
    const mappingsToSave = _.filter(autoMapList, (item) => {
      return selectedAutoMapFields.indexOf(item.canonicalFieldId) !== -1
    });
    saveAutoMappings(id, mappingsToSave);
    clearMappedFields();
  }

  onAutoMapModalOpen = () => {
    const { id, downloadTypeAutoMap } = this.state;
    this.props.MlsCanonicalActions.getAutoMappings(id, downloadTypeAutoMap);
    this.setState({
      resetAutoMappedData: false,
      resetPagination: false
    });
  }

  render() {
    const {
      previewTableData,
      previewTableHeader,
      showTable,
      selectedCanonicalField,
      MlsDowloadTypesListData,
      sampleFileList,
      selectedDownloadType,
      selectedSampleFile,
      expression,
      source,
      checkedFields,
      resetPagination,
      showAlert,
      isFieldMapped,
      successMessage,
      isOpenAutomapModal,
      downloadTypeAutoMap,
      autoMapList,
      selectedAutoMapFields,
      resetAutoMappedData,
      editedAutoMapField
    } = this.state;
    const {
      MlsCanonical,
      MlsUpdateMappedField,
      MlsMappedField,
      MlsCanonicalFunctionsData,
      MlsAutoCompleteFunctionsData,
      MlsExistingMappedFields,
      MlsExistingMappedFieldsData,
      MlsAutoMap: { isLoading: autoMappingsLoading}
    } = this.props;
    return (
      <Col xs="6" md="11">
        <Row className="align-items-center">
          <Col xs="9" className="p-0">
            <h2 className="viewTitle">
              Canonicalizing MLS - Source: {source}
            </h2>
          </Col>
          <Col xs="3" className="p-0 text-right">
            <Button color="primary" onClick={this.toggleAutoMapModal}>View AutoMappings</Button>
          </Col>
        </Row>
        { showAlert &&
          <Alert color="success">
            {successMessage}
          </Alert>
        }
        <Row className="contentWrapper canonicalMappingScreen">
          <Col xs="12" md="4" lg="4">
            <div className="downloadTypeDropdown">
              <FormGroup className="d-inline-block ml-3">
                <Label for="downloadType">Download Type</Label>
                <Input
                  id="downloadType"
                  name="downloadType"
                  className="form-control"
                  type="select"
                  onChange={this.onSelectDownloadType}
                  value={selectedDownloadType}
                >
                  {
                    _.map(MlsDowloadTypesListData, (dt, index) => {
                      return <option value={dt.key} key={index}>{dt.value}</option>
                    })
                  }
                </Input>
              </FormGroup>
            </div>
            <CustomPagination
              headerText="Canonical Fields"
              numberOfEntriesPerPage={15}
              pageContent={MlsCanonical}
              onItemClick={this.onCanonicalItemClick}
              keyName="name"
              resetPagination={resetPagination}
            />
          </Col>
          <Col xs="12" md="8" lg="8">
            <Row>
              <Col offset="4"></Col>
              <Col sm="4">
                { selectedSampleFile === 'No File' &&
                  <Alert color="warning">
                    No sample file available.
                  </Alert>
                }
              </Col>
              <Col sm="4">
                  { sampleFileList.length !== 0 &&
                    <div className="text-right">
                      <Label for="sampleFileType">Sample File</Label>
                      <FormGroup className="d-inline-block ml-3">
                        <Input
                          id="sampleFileType"
                          name="sampleFileType"
                          className="form-control"
                          type="select"
                          onChange={this.onSelectSampleFile}
                          value={selectedSampleFile}
                        >
                          {
                            _.map(sampleFileList, (dt, index) => {
                              return <option value={dt} key={index}>{dt}</option>
                            })
                          }
                        </Input>
                      </FormGroup>
                    </div>
                  }
              </Col>
            </Row>
              <MappedFields
                MlsMappedField={MlsMappedField}
                MlsUpdateMappedField={MlsUpdateMappedField}
                postMappedData={this.saveMappedData}
                updateMappedData={this.updateMappedData}
                MlsCanonicalFunctionsData={MlsCanonicalFunctionsData}
                getCanonicalFunctions={this.getCanonicalFunctions}
                MlsAutoCompleteFunctionsData={MlsAutoCompleteFunctionsData}
                getAutoCompleteFunctions={this.getAutoCompleteFunctions}
                transformPreviewData={this.transformPreviewData}
                selectedDownloadType={selectedDownloadType}
                checkedFields={checkedFields}
                getSampleFileData={this.getSampleFileData}
                resetMapping={this.resetMapping}
                resetMappedData={resetPagination}
                multiSelect={true}
                selectedCanonicalField={selectedCanonicalField}
              />

          </Col>
          { showTable &&
            <ZapPreview
              previewTableData={previewTableData}
              previewTableHeader={previewTableHeader}
              expression={expression}
              modalClose={this.modalClose}
            >
            </ZapPreview>
          }
        </Row>
        {MlsExistingMappedFields.isResponseSuccess && <Row className="canonicalMappingScreen">
          <Col sm={{ size: 12 }} md={{ size: 12 }}>
            <p className="h4 mt-2">Mapped Fields</p>
            {_.size(MlsExistingMappedFieldsData) > 0 ? <Table bordered>
              <thead>
                <tr>
                  <th>Canonical Field</th>
                  <th>Expression</th>
                  <th>Fields</th>
                  <th>Class</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.renderMappedFields()}
              </tbody>
            </Table> : <p>No mappings available</p>}
          </Col>
        </Row>}

        <Modal
          isOpen={isOpenAutomapModal}
          toggle={this.toggleAutoMapModal}
          onOpened={this.onAutoMapModalOpen}
          className="automapModal"
        >
          <ModalHeader toggle={this.toggleAutoMapModal}>Recommended One to One Mappings</ModalHeader>
          <ModalBody style={{minHeight: window.innerHeight - 110}}>

            <Row>
              <Col xs="3">
              <FormGroup>
                <Label for="downloadType">Download Type</Label>
                <Input
                  id="downloadTypeAutoMap"
                  name="downloadTypeAutoMap"
                  className="form-control"
                  type="select"
                  onChange={this.onSelectDownloadTypeAutoMap}
                  value={downloadTypeAutoMap}
                >
                  {
                    _.map(MlsDowloadTypesListData, (dt, index) => {
                      return <option value={dt.key} key={index}>{dt.value}</option>
                    })
                  }
                </Input>
              </FormGroup>
              </Col>
            </Row>

            <div className="autoMapContainer">
              <Row className="p-1">
                <div className="autoMapList" style={{width: editedAutoMapField !== -1 ? '50%' : '96%'}}>
                  <Card>
                    <CardHeader>
                      <span className="h5 d-inline-block">Recommended Mappings</span>
                    </CardHeader>
                    <CardBody className="pr-0">
                    { autoMapList.length > 0 ?
                      <div>
                        <Row className="autoMapRow autoMapRowHeader">
                          <Col xs="1">
                            <span className="font-weight-bold">Map</span>
                          </Col>
                          <Col xs="3">
                            <span className="font-weight-bold">Canonical Field</span>
                          </Col>
                          <Col xs="5">
                            <span className="font-weight-bold">Recommended Field</span>
                          </Col>
                          <Col xs="2">
                            <span className="font-weight-bold">Class: Description</span>
                          </Col>
                          <Col xs="1">
                            <span className="font-weight-bold">Edit</span>
                          </Col>
                        </Row>
                        <div className="autoMapBody">
                          {
                            _.map(autoMapList, (item, index) => {
                              return(
                                <Row key={item.canonicalFieldId} className={`autoMapRow ${editedAutoMapField === index ? "selected" : ""}`}>
                                  <Col xs="1">
                                    <FormGroup check>
                                      <Input
                                        type="checkbox"
                                        className="checkbox"
                                        data-index={index}
                                        checked = {selectedAutoMapFields.indexOf(item.canonicalFieldId) !== -1}
                                        onChange={ () => {
                                          this.onSelectAutoMapField(item.canonicalFieldId);
                                        }
                                        }
                                        id={`checkbox_${index}`}
                                        value={item.canonicalFieldId}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col xs="3" className="fieldName">
                                    {item.canonicalFieldName}
                                  </Col>
                                  <Col xs="5" className="fieldName">
                                    <span>{item.recommendedFieldName} </span>
                                    <span> {item.desc && `(${item.desc})`}</span>
                                  </Col>
                                  <Col xs="2" className="fieldName">
                                    {`${item.className}: ${item.classDescription}`}
                                  </Col>
                                  <Col xs="1">
                                    <a href="javascript:void(0)" onClick={() => this.onEditAutoMapField(item, index)}>Edit</a>
                                  </Col>
                                </Row>
                              )
                            })
                          }
                        </div>
                      </div>
                      :
                      <p>{ !autoMappingsLoading && "No recommendations available for mappings."}</p>
                    }
                    </CardBody>
                  </Card>
                </div>
                <div
                  className="dragBar"
                  onMouseDown={this.onDragMouseDown}>
                </div>
                <div style={{width: editedAutoMapField !== -1 ? "47%" : 0}} className="mappedFieldContainer">
                  { editedAutoMapField !== -1 &&
                    <MappedFields
                      MlsMappedField={MlsMappedField}
                      selectedDownloadType={downloadTypeAutoMap}
                      getSampleFileData={this.getSampleFileData}
                      resetMapping={this.resetMapping}
                      isAutoMap={true}
                      resetMappedData={resetAutoMappedData}
                      multiSelect={false}
                      onSelectFieldToMap={this.onSelectFieldToMap}
                    />
                  }
                </div>
              </Row>
            </div>

          </ModalBody>

          <ModalFooter>
              <Button
                color="primary"
                onClick={this.onAutoMapSave}
                disabled={selectedAutoMapFields.length === 0}
              >
                Save Mappings
              </Button>
          </ModalFooter>

        </Modal>
      </Col>

    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanonicalMappingScreen);
