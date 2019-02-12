// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as MlsZapPanelAction from 'actions/MlsZapPanelAction';
import _ from 'lodash';
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Table,
  Alert,
  FormGroup,
  Label,
  Input
} from 'reactstrap';

import './UrlBuilderScreen.scss';
import UrlBuilderCardItem from './UrlBuilderCardItem';
import * as MlsUrlBuilderAction from 'actions/MlsUrlBuilderAction';
import * as MlsCanonicalActions from 'actions/MlsCanonicalMappingAction';
import * as MlsContextVariableAction from 'actions/MlsContextVariableAction';
import * as MlsSchedulerActions from 'actions/MlsSchedulerAction';
import { ContextDataPanel } from 'components';
import { getSessionData, setSessionData } from 'utils/session';
import { CustomCalendar } from 'components';
import moment from 'moment-timezone';

type Props = {
  MlsUrlBuilderAction: typeof MlsUrlBuilderAction,
  MlsContextVariableAction: typeof MlsContextVariableAction,
  MlsZapPanelAction: typeof MlsZapPanelAction,
  MlsUrlData: Object,
  MlsConfigureData: Object,
  MlsGetUrlData: {
    isResponseSuccess: boolean,
  },
  MlsSavedUrl: {
    isResponseSuccess: boolean,
  },
  MlsContextData: Array<Object>,
  MlsDowloadTypesList: {
    isResponseSuccess: boolean,
  },
  PreviewRawData: {
    isResponseSuccess: boolean,
    isLoading: boolean,
    isFail: boolean,
    payload: Object,
    error: Object,
    status: number,
    statusText: string
  },
  MlsDowloadTypesListData: Array<Object>,
  MlsCanonicalActions: typeof MlsCanonicalActions,
  MlsPlaceHolderValues: {
    isResponseSuccess: boolean
  },
  MlsPlaceHolderValuesData: Array<string>,
  MlsUrlTemplates: Array<Object>,
  MlsSchedulerCreateEvent: Object,
  MlsSchedulerActions: Object,
  MlsListingEventStatus: Object,
  MlsListingEventStatusData: boolean,
};

type State = {
  initialHeaderData: {
    isSelected: boolean,
    isEdit: boolean,
  },
  UrlData: Array<Object>,
  modelOpen: boolean,
  modalText: string,
  deleteUrlId: number,
  deleteHeaderId: number,
  cardIndex: number,
  headerIndex: number,
  MlsDowloadTypesListData: Array<Object>,
  previewModalOpen: boolean,
  previewData: Object,
  source: string,
  id: number,
  previewDownloadType: string,
  newCardExist: boolean,
  placeholderValues: Array<string>,
  actualUrlValue: string,
  isOpenEventModal: boolean,
  msgModal: {
    header: string,
    message: string,
    isOpen: boolean,
    isConfirm: boolean
  },
  currentEvent: {
    title: string,
    group: string,
    urlId: number,
    startDate: string,
    scheduleType: string,
    hour: number,
    min: number,
    jobId: string,
    everyMinuteJobDescriptor: {
      everyMinute: number,
      endHour: number,
      endMinutes: number,
    },
    status: string,
    downloadType: string,
  },
  isListingEventAvailable: boolean,
  isValidDate : boolean,
  disableStartHour: number,
};

const mapDispatchToProps = (dispatch) => ({
  MlsUrlBuilderAction: bindActionCreators(MlsUrlBuilderAction, dispatch),
  MlsContextVariableAction: bindActionCreators(MlsContextVariableAction, dispatch),
  MlsZapPanelAction: bindActionCreators(MlsZapPanelAction, dispatch),
  MlsCanonicalActions: bindActionCreators(MlsCanonicalActions, dispatch),
  MlsSchedulerActions: bindActionCreators(MlsSchedulerActions, dispatch),
})

const mapStateToProps = state => {
  return {
    MlsUrlData: _.get(state.MLSUrlBuilderData, 'UrlData', {}),
    MlsGetUrlData: _.get(state.MLSUrlBuilderData, 'GetUrlData', {}),
    MlsSavedUrl: _.get(state.MLSUrlBuilderData, 'UrlSavedData', {}),
    MlsConfigureData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsContextData: _.get(state.MlsContextVariablesData, 'MlsContextVariables.payload', {}),
    MlsDowloadTypesList: _.get(state.MLSCanonicalData, 'MlsDowloadTypesList', {}),
    MlsDowloadTypesListData: _.get(state.MLSCanonicalData, 'MlsDowloadTypesList.payload', []),
    PreviewRawData: _.get(state.MLSUrlBuilderData, 'PreviewRawData', {}),
    MlsPlaceHolderValues: _.get(state.MLSUrlBuilderData, 'MlsPlaceHolderValues', {}),
    MlsPlaceHolderValuesData: _.get(state.MLSUrlBuilderData, 'MlsPlaceHolderValues.payload', []),
    MlsUrlTemplates: _.get(state.MLSUrlBuilderData, 'MlsUrlTemplates.payload', []),
    MlsSchedulerCreateEvent: _.get(state.MlsSchedulerData, 'MlsSchedulerCreateEvent', {}),
    MlsListingEventStatus: _.get(state.MlsSchedulerData, 'MlsListingEventStatus', {}),
    MlsListingEventStatusData: _.get(state.MlsSchedulerData, 'MlsListingEventStatus.payload', {}),
  };
}

class UrlBuilderScreen extends Component<Props, State> {

  timeArray: Array<number>;

  constructor(props) {
    super(props);

    this.state = {
      initialHeaderData: {
        headerKey: '',
        headerValue: '',
        isSelected: false,
        isEdit: true,
      },
      msgModal: {
        header: '',
        message: '',
        isOpen: false,
        isConfirm: false
      },
      UrlData: [],
      modelOpen: false,
      modalText: "",
      deleteUrlId: -1,
      deleteHeaderId: -1,
      cardIndex: -1,
      headerIndex: -1,
      MlsDowloadTypesListData: [],
      previewModalOpen: false,
      previewData: {},
      source: this.props.MlsConfigureData.source ? this.props.MlsConfigureData.source : getSessionData('MlsName'),
      id: this.props.MlsConfigureData.id ? this.props.MlsConfigureData.id : getSessionData('MlsID'),
      previewDownloadType: '',
      newCardExist: false,
      placeholderValues: [],
      actualUrlValue: '',
      isOpenEventModal: false,
      currentEvent: {
        title: '',
        group: '',
        urlId: 0,
        startDate: new Date().toISOString(),
        scheduleType: "DAILY",
        hour: 0,
        min: 0,
        jobId: '',
        everyMinuteJobDescriptor: {
          everyMinute: 0,
          endHour: 0,
          endMinutes: 0,
          endDate: new Date().toISOString()
        },
        status: "enabled",
        downloadType: '',
      },
      isListingEventAvailable: true,
      disableStartHour: -1,
      isValidDate: true,
    };

    (this:any)._handleHeaderSave = this._handleHeaderSave.bind(this);
    (this:any)._handleDelete = this._handleDelete.bind(this);
    (this:any)._addNewHeaderEntry = this._addNewHeaderEntry.bind(this);
    (this:any)._handleUrlSave = this._handleUrlSave.bind(this);
    (this:any)._addNewEmptyCard = this._addNewEmptyCard.bind(this);
    (this:any)._isCardUpdated = this._isCardUpdated.bind(this);
    (this:any)._handleUrlBlur = this._handleUrlBlur.bind(this);
    (this:any)._onUrlUpdate = this._onUrlUpdate.bind(this);
    (this:any)._handleModelCancel = this._handleModelCancel.bind(this);
    (this:any)._handleModelConfirm = this._handleModelConfirm.bind(this);
    (this:any)._toogleContextVariableModal = this._toogleContextVariableModal.bind(this);
    (this:any).timeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  }

  componentDidMount() {
    const { MlsUrlBuilderAction, MlsCanonicalActions } = this.props;
    MlsUrlBuilderAction.getMlsUrl(this.state.id);
    MlsCanonicalActions.getDownloadTypeList();
    MlsUrlBuilderAction.getMlsUrlPlaceHolderValues();
    MlsUrlBuilderAction.getMlsUrlTemplates();
  }

  componentDidUpdate(prevProps) {
    const newState = _.cloneDeep(this.state);
    const { isResponseSuccess, isLoading, isFail } = this.props.PreviewRawData;

    if(prevProps.MlsGetUrlData.isResponseSuccess !== this.props.MlsGetUrlData.isResponseSuccess && this.props.MlsGetUrlData.isResponseSuccess) {
      newState.UrlData = this.props.MlsUrlData;
      if(this.props.MlsUrlData.length){
        setSessionData('MlsStages',['/scheduler','/standardValue', '/monitoring']);
        this.props.MlsZapPanelAction.updateLinkStatus(['/scheduler','/standardValue', '/monitoring']);
      }
      this.setState({...newState});
    }

    if(prevProps.MlsUrlData.length !== this.props.MlsUrlData.length) {
      if(this.props.MlsUrlData.length === 0){
        newState.newCardExist = false;
      }
      newState.UrlData = this.props.MlsUrlData;
      this.setState({...newState});
    }

    if(prevProps.MlsSavedUrl.isResponseSuccess !== this.props.MlsSavedUrl.isResponseSuccess && this.props.MlsSavedUrl.isResponseSuccess) {
      newState.UrlData = this.props.MlsUrlData;
      newState.newCardExist = false;
      this.setState({...newState});
    }

    if(prevProps.MlsDowloadTypesList.isResponseSuccess !== this.props.MlsDowloadTypesList.isResponseSuccess && this.props.MlsDowloadTypesList.isResponseSuccess) {
      newState.MlsDowloadTypesListData = this.props.MlsDowloadTypesListData;
      this.setState({...newState});
    }

    if((prevProps.PreviewRawData.isResponseSuccess !== isResponseSuccess && isResponseSuccess && !isLoading) || (prevProps.PreviewRawData.isFail !== isFail && isFail && !isLoading)) {
      this.setState({
        previewModalOpen: true,
      });
    }
    if(prevProps.MlsPlaceHolderValues.isResponseSuccess !== this.props.MlsPlaceHolderValues.isResponseSuccess && this.props.MlsPlaceHolderValues.isResponseSuccess) {
      this.setState({
        placeholderValues: this.props.MlsPlaceHolderValuesData
      });
    }

    const { isResponseSuccess: createSuccess, isLoading: createLoad, payload:newlyCreatedEvent, createFail, error } = this.props.MlsSchedulerCreateEvent;
    if(createSuccess && (createSuccess != prevProps.MlsSchedulerCreateEvent.isResponseSuccess) && !createLoad){
      this.setState({
        isOpenEventModal: false,
        msgModal: {
          header: 'Success!',
          message: `Successfully created the job named: ${newlyCreatedEvent.title}.`,
          isOpen: true,
          isConfirm: false
        }
      });
    }

    if(createFail && (createFail != prevProps.MlsSchedulerCreateEvent.isFail) && !createLoad) {
      this.setState({
        isOpenEventModal: false,
        msgModal: {
          header: 'Error!',
          message: error.errorMessage,
          isOpen: true,
          isConfirm: false
        }
      });
    }

    const { MlsListingEventStatus: {isResponseSuccess: listingExistSuccess}, MlsListingEventStatusData } = this.props;
    if(prevProps.MlsListingEventStatus.isResponseSuccess !== listingExistSuccess && listingExistSuccess) {

      this.setState({
        isListingEventAvailable: MlsListingEventStatusData
      });
    }

  }

  _getCardStatus(cardData) {
    let finalStatus = false;
    if(this._isHeaderDataUpdated(cardData.HeaderDetails) !== undefined) {
      finalStatus = this._isHeaderDataUpdated(cardData.HeaderDetails);
    }

    if(!_.isUndefined(cardData.UrlDetails.isUrlUpdated)) {
      finalStatus = finalStatus || cardData.UrlDetails.isUrlUpdated;
    }
    return finalStatus;
  }

  _isCardUpdated(isUrlDataUpdated, cardIndex) {
    const newState = _.cloneDeep(this.state);
    newState.UrlData[cardIndex].UrlDetails.isUrlUpdated = isUrlDataUpdated;
    newState.UrlData[cardIndex].isUpdated = this._getCardStatus(newState.UrlData[cardIndex]);
    this.setState({...newState});
  }

  _isHeaderDataUpdated(headerArray) {
    let headerStatus  = false;
    _.map(headerArray, (item) => {
      headerStatus = headerStatus || item.isHeaderUpdated || item.isNewHeader;
    });

    return headerStatus;
  }

  _addNewHeaderEntry(cardIndex) {
    const newState = _.cloneDeep(this.state);
    const { initialHeaderData } = this.state;
    newState.UrlData[cardIndex].HeaderDetails.push(initialHeaderData);
    this.setState({...newState});
  }

  _handleHeaderSave(data, index, cardIndex) {
    const newState = _.cloneDeep(this.state);
    newState.UrlData[cardIndex].HeaderDetails[index] = _.merge(newState.UrlData[cardIndex].HeaderDetails[index], data);
    newState.UrlData[cardIndex].isUpdated = this._getCardStatus(newState.UrlData[cardIndex]);
    this.setState({...newState});
  }

  _handleDelete(deleteContentId, cardIndex, modalText, headerIndex) {
    const newState = _.cloneDeep(this.state);
    newState.modelOpen = true;
    newState.modalText = modalText;
    newState.cardIndex = cardIndex;
    if(modalText === "Header") {
      newState.deleteHeaderId = deleteContentId;
      newState.headerIndex = headerIndex;
    } else {
      newState.deleteUrlId = deleteContentId
    }
    this.setState({...newState})
  }

  _handleModelCancel() {
    this.setState(() => ({modelOpen: false}));
  }

  _handleModelConfirm() {
    const {modalText, deleteHeaderId, UrlData, cardIndex, headerIndex, deleteUrlId} = this.state;
    const { MlsUrlBuilderAction } = this.props;
    const { id }  = this.state;
    const newState = _.cloneDeep(this.state);
    if(modalText === "Header") {
      if(deleteHeaderId === "NA") {
        const headerData = _.filter(UrlData[cardIndex].HeaderDetails, (value, key) => {
          return key !== headerIndex })
        newState.UrlData[cardIndex].HeaderDetails =  headerData;
      } else {
        MlsUrlBuilderAction.deleteMlsUrlHeader(deleteHeaderId, id);
      }
    } else if (modalText === "MLS URL") {
      if(deleteUrlId === "NA") {
        MlsUrlBuilderAction.deleteNewlyAddedCard(cardIndex);
      } else {
        MlsUrlBuilderAction.deleteMlsUrl(deleteUrlId, id);
      }
    }
    newState.cardIndex = -1;
    newState.modelOpen = false;
    newState.modalText = '';
    this.setState({...newState});
  }

  _handleUrlBlur(data, cardIndex, isUrlDataUpdated) {
    const newState = _.cloneDeep(this.state);
    const {  MlsUrlData } = this.props;
    if(MlsUrlData[cardIndex].UrlDetails[data.fieldName] === data.fieldValue) {
      isUrlDataUpdated = false;
    } else {
      isUrlDataUpdated = true;
    }
    newState.UrlData[cardIndex].UrlDetails[data.fieldName] = data.fieldValue;
    if(!_.isUndefined(isUrlDataUpdated)) {
      newState.UrlData[cardIndex].UrlDetails.isUrlUpdated = isUrlDataUpdated;
    }
    newState.UrlData[cardIndex].isUpdated = this._getCardStatus(newState.UrlData[cardIndex]);
    this.setState({...newState});
  }

  _onUrlUpdate(data, cardIndex, isUrlDataUpdated) {
    const newState = _.cloneDeep(this.state);
    newState.UrlData[cardIndex].UrlDetails['urlvalue'] = data;
    newState.UrlData[cardIndex].UrlDetails.isUrlUpdated = isUrlDataUpdated;
    newState.UrlData[cardIndex].isUpdated = this._getCardStatus(newState.UrlData[cardIndex]);
    this.setState({...newState});
  }

  _handleUrlSave(data, cardIndex) {
    const newState = _.cloneDeep(this.state);
    const { UrlData } = newState;
    newState.UrlData[cardIndex].UrlDetails['urlvalue'] = data.urlvalue;
    const { MlsUrlBuilderAction } = this.props;
    const {id } = this.state;
    if(UrlData[cardIndex].isNewUrl) {
      MlsUrlBuilderAction.saveUrlData(UrlData[cardIndex], id);
    } else {
      MlsUrlBuilderAction.updateUrlData(UrlData[cardIndex], id);
    }
  }

  _toogleContextVariableModal = (variable) => {
    const { MlsContextVariableAction } = this.props;
    MlsContextVariableAction.toogleContextVariableModal(variable);
  }

  _addNewEmptyCard() {
    this.setState({ newCardExist: true });
    this.props.MlsUrlBuilderAction.addNewEmptyCard();
  }

  _onAddNewContextVariable = (contextData) => {
    const { MlsContextVariableAction, MlsConfigureData } = this.props;
    const { source } = this.state;
    MlsContextVariableAction.addNewContextVariable(MlsConfigureData.id, contextData, source);
  }

  _getActualUrlValue = (urlvalue: string) => {
    const { MlsContextData } = this.props;
    let actualUrl = urlvalue, currentMatch;
    const mlsContextDataValues = {};
    _.map(MlsContextData, (item) => {
      mlsContextDataValues[item.key] = item.value;
    });
    const regex = /{([^}]+)}/g;
    while((currentMatch = regex.exec(urlvalue))) {
      actualUrl = actualUrl.replace(`$${currentMatch[0]}`, mlsContextDataValues[currentMatch[1]]);
    }

    return actualUrl;
  }

  _previewRawData = (cardIndex: number, urlvalue: string) => {
    const { UrlData, source } = this.state;
    const { MlsUrlBuilderAction } = this.props;
    const urlDetails = UrlData[cardIndex].UrlDetails;
    const { id, downloadType } = urlDetails;
    const query = {
      source: source,
      urlId: id,
      urlvalue: urlvalue,
      downloadType: downloadType
    }
    downloadType === 'photo' ? MlsUrlBuilderAction.getMlsUrlPhotoPreview(query) : MlsUrlBuilderAction.getMlsUrlPreview(query);
    this.setState({ previewDownloadType: downloadType, actualUrlValue: this._getActualUrlValue(urlvalue) });
  }

  _handlePreviewModalCancel = () => {
    this.setState(() => ({previewModalOpen: !this.state.previewModalOpen}));
  }

  _scheduleEventClick = (cardIndex: number) => {
      const { MlsUrlData } = this.props;
      const { id, UrlData } = this.state;
      const today = new Date();
      const { downloadType, id: urlId } = UrlData[cardIndex].UrlDetails;

      this.setState({
        isOpenEventModal: true,
        currentEvent: {
          title: '',
          group: '',
          urlId,
          mlsInfoId: id,
          startDate: today.toISOString(),
          scheduleType: "DAILY",
          hour: today.getHours()+1,
          min: 0,
          jobId: '',
          everyMinuteJobDescriptor: {
            everyMinute: 0,
            endHour: today.getHours() + 1,
            endDate: today.toISOString(),
            endMinutes: 0,
          },
          status: "enabled",
          eventStatus: "Enabled",
          downloadType,
        },
        disableStartHour: today.getHours(),
      }, () => {
        this.checkListingEventStatus(this.state.currentEvent);
      });
  }

  onEventParamsChange = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const newCurrentEvent = newState.currentEvent;
    const { name, value } = event.target;
    newState.isListingEventAvailable = true;

    switch(name){
      case "hour":
      case "min":
        newCurrentEvent[name] = parseInt(value);
        break;

      case "everyMinute":
        const { startDate, hour, min } = this.state.currentEvent;
        const localStartDate = new Date(startDate);
        localStartDate.setHours(hour, min);
        const newStartDate = moment(localStartDate).add(value, 'minutes')
        newCurrentEvent.everyMinuteJobDescriptor.endHour = newStartDate.hours();
        newCurrentEvent.everyMinuteJobDescriptor.endMinutes = newStartDate.minute();
        newCurrentEvent.everyMinuteJobDescriptor.everyMinute = parseInt(value);
        break;

      case "endHour":
      case "endMinutes":
        newCurrentEvent.everyMinuteJobDescriptor[name] = parseInt(value);
        break;

      default:
        newCurrentEvent[name] = value;
        break;
    }
    this.checkListingEventStatus(newCurrentEvent);
    this.setState({
      ...newState
    });
  }

  checkListingEventStatus = (currentEventData: Object) => {
    const { id, currentEvent: { downloadType } } = this.state;
    const { urlId, hour, min, startDate } = currentEventData;
    const startDateValue = new Date(startDate);
    startDateValue.setHours(hour, min);
    if(downloadType === "photo") {
      this.props.MlsSchedulerActions.isListingScheduleExist({mlsId: id, startDate: startDateValue.toISOString().replace('T', ' ').replace('Z','')});
    }
  }

  getUTCTime = (hours: number = 0, mins: number = 0) => {
    const dateObj = new Date(this.state.currentEvent.startDate);
    dateObj.setHours(hours, mins);
    return {
      hours: dateObj.getUTCHours(),
      mins: dateObj.getUTCMinutes()
    }
  }

  onSaveEvent = () => {
    const { createSchedulerEvent } = this.props.MlsSchedulerActions;
    const { currentEvent } = this.state;
    const postEventObj = _.cloneDeep(currentEvent);
    const {
      startDate,
      hour,
      min,
      everyMinuteJobDescriptor: {
        endHour,
        endMinutes
      }
    } = currentEvent;
    const newStartDate = new Date(startDate);
    newStartDate.setHours(hour, min);
    const {hours: startHr, mins: startMin } = this.getUTCTime(postEventObj.hour, postEventObj.min);
    postEventObj.startDate = newStartDate.toISOString();
    postEventObj.hour = startHr;
    postEventObj.min = startMin;
    newStartDate.setHours(endHour, endMinutes);
    postEventObj.everyMinuteJobDescriptor.endDate = newStartDate.toISOString();
    postEventObj.timeZone = moment.tz(moment.tz.guess()).zoneAbbr();
    delete postEventObj.status;
    delete postEventObj.everyMinuteJobDescriptor.endMinutes;
    delete postEventObj.downloadType;
    if(postEventObj.everyMinuteJobDescriptor.everyMinute == 0){
      delete postEventObj.everyMinuteJobDescriptor;
    }
    if(currentEvent.everyMinuteJobDescriptor.everyMinute === 0 || this.checkValidEndTime()) {
      createSchedulerEvent(postEventObj)
    }

  }

  toggleMsgModal = () => {
    const newMsgModal = _.cloneDeep(this.state.msgModal);
    newMsgModal.isOpen = !newMsgModal.isOpen;
    this.setState({
      msgModal: newMsgModal
    });
  }

  checkValidEndTime = () => {
    const { currentEvent: {hour, min, everyMinuteJobDescriptor: {endHour, endMinutes}}} = this.state;
    let isValidDate = false;
    isValidDate = hour === endHour ?  min < endMinutes : hour < endHour;
    this.setState({ isValidDate });
    return isValidDate;
  }

  onChangeDateModal = (date: Date) => {
    const newCurrentEvent = _.cloneDeep(this.state.currentEvent);
    const today = new Date();
    const hours = today.getHours();
    newCurrentEvent.hour = hours + 1;
    newCurrentEvent.startDate = date.toISOString();
    this.checkListingEventStatus(newCurrentEvent);
    this.setState({
      currentEvent: newCurrentEvent,
      disableStartHour: moment(date).isSame(today, 'day') ? hours : -1,
    });
  }

  toggleEventModal = () => {
    const { isOpenEventModal, currentEvent } = this.state;
    this.setState({
      isOpenEventModal: !isOpenEventModal,
      currentEvent: currentEvent,
      isListingEventAvailable: true,
    });
  }

  renderRawDataPreview = (columns, rows) => {
    return (
      <Table bordered>
      <thead>
        <tr>
          {
            _.map(columns, (col, index) => (<th key={index}>{col}</th>))
          }
        </tr>
      </thead>
      <tbody>
        {
          _.map(rows, (row, index) => (
            <tr key={index}>
              {
                _.map(columns, (colName, index) => (<td key={index}>{row[colName]}</td>))
              }
            </tr>
          ))
        }
      </tbody>
    </Table>)
  }

  renderPhotoData = () => {
    const { PreviewRawData: { payload: { photosAsByteArray } } } = this.props;
    return _.map(photosAsByteArray, (image) => <img src={`data:image/png;base64,${image}`}/>);
  }

  onCancelEvent = () => {
    const { isOpenEventModal } = this.state;
    this.setState({
      isOpenEventModal: false,
      isListingEventAvailable: true,
    });
  }

  render() {
    const {
      UrlData,
      modelOpen,
      modalText,
      MlsDowloadTypesListData,
      previewModalOpen,
      source,
      placeholderValues,
      previewDownloadType,
      newCardExist,
      actualUrlValue,
      isOpenEventModal,
      currentEvent,
      isListingEventAvailable,
      disableStartHour,
      isValidDate,
      msgModal
    } = this.state;

    const {
      MlsUrlData,
      MlsContextData,
      PreviewRawData: {
        payload: PreviewRawData,
        isFail,
        error,
        status,
        statusText
      },
      MlsUrlTemplates
    } = this.props;
    const columns = _.isEmpty(PreviewRawData.Columns) ? '' : PreviewRawData.Columns.trim().split("\t");
    const rows = PreviewRawData.Data;

    return (
      <Col xs="6" md="10">
        <h2 className="viewTitle marginLeft">
          Building MLS - Source: {source}
        </h2>
        <Row className="contentWrapper">
        <ContextDataPanel></ContextDataPanel>
        <Col xs="12">
          {
            UrlData.length > 0 && _.map(UrlData, (item, index) => {
            return (
              <UrlBuilderCardItem
                handleHeaderSave={this._handleHeaderSave}
                handleDelete={this._handleDelete}
                addNewHeaderEntry={this._addNewHeaderEntry}
                handleUrlSave={this._handleUrlSave}
                itemData={item}
                key={index}
                cardIndex={index}
                origionalData={MlsUrlData[index]}
                isCardUpdated={this._isCardUpdated}
                handleUrlBlur={this._handleUrlBlur}
                autoSuggestData={MlsContextData}
                onAddNewContextVariable={this._onAddNewContextVariable}
                updateUrl={this._onUrlUpdate}
                MlsDowloadTypesListData={MlsDowloadTypesListData}
                toogleContextVariableModal={this._toogleContextVariableModal}
                previewRawData={this._previewRawData}
                placeholderValues={placeholderValues}
                urlTemplates={MlsUrlTemplates}
                scheduleEventClick={this._scheduleEventClick}
              />
            )
          })
        }
        </Col>
        <Col xs="12" className="text-center">
          <Button
            size="lg"
            className="zapButton"
            onClick={this._addNewEmptyCard}
            disabled={newCardExist}>Add URL</Button>
        </Col>
        </Row>
        <Modal isOpen={modelOpen} className="customModal">
          <ModalHeader >Delete confimation</ModalHeader>
          <ModalBody>
            Do you want to delete {modalText}?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this._handleModelConfirm}
            >Confirm</Button>
            <Button color="primary" onClick={this._handleModelCancel}
            >Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={previewModalOpen}
          className="customModal previewModal previewRawDataModal"
          toggle={this._handlePreviewModalCancel}
        >
          <ModalHeader toggle={this._handlePreviewModalCancel}>Preview Raw Data</ModalHeader>
          <ModalBody>
            <p>
              <span className="font-weight-bold">Actual URL: </span>
              {actualUrlValue}
            </p>
            { isFail ?
              <div className="errorMessageText">
                <p>{ `Error ${status}: ${statusText}` }</p>
                <p>{ error.message || error.errorMessage }</p>
              </div>
              :
              <Fragment>
              {
                previewDownloadType === 'photo' ?
                <div className="previewImages">
                  {
                    !_.isEmpty(PreviewRawData) && !_.isEmpty(PreviewRawData.photosAsByteArray)
                      ? this.renderPhotoData()
                      : <span className="errorMessageText">{ PreviewRawData && PreviewRawData.message }</span>
                  }
                </div>
                :
                <div>
                  {
                    !_.isEmpty(PreviewRawData) && !_.isEmpty(columns) && !_.isEmpty(rows)
                      ? this.renderRawDataPreview(columns, rows)
                      : <span className="errorMessageText">
                          {
                            !_.isEmpty(PreviewRawData["Response Msg"])
                              ? PreviewRawData["Response Msg"]
                              : "No data available for preview"
                          }
                        </span>
                  }
                </div>

              }
              </Fragment>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this._handlePreviewModalCancel}>Close</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={isOpenEventModal} toggle={this.toggleEventModal}>
          <ModalHeader toggle={this.toggleEventModal}>{currentEvent.title}</ModalHeader>
          <ModalBody>
            { !isListingEventAvailable &&
              <Alert color="danger">
                Cannot schedule photo download unless listing download is scheduled at least once prior to this.
              </Alert>
            }
            { !isValidDate &&
              <Alert color="danger">
                Please select valid end time after start time.
              </Alert>
            }
            <Row>
              <Col xs="6">
                <FormGroup>
                  <Label for="startDate">Start Date</Label>
                  <CustomCalendar
                    selectedDate={new Date(currentEvent.startDate)}
                    onChangeDate={this.onChangeDateModal}
                    minDate={new Date()}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <span>Start Time</span>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label for="hour">Hours: </Label>
                  <Input
                    type="select"
                    name="hour"
                    id="hour"
                    value={currentEvent.hour.toString()}
                    onChange={this.onEventParamsChange}
                    className="timeDropdown"
                  >
                    {
                      this.timeArray.map((item) => (
                        <option key={item} value={item} disabled={disableStartHour >= item}>{item}</option>
                      ))
                    }
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label for="min">Minutes: </Label>
                    <Input
                      type="select"
                      name="min"
                      id="min"
                      value={currentEvent.min.toString()}
                      onChange={this.onEventParamsChange}
                    >
                      <option value="0">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </Input>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label for="scheduleType">Frequency</Label>
                  <Input
                    type="select"
                    name="scheduleType"
                    id="scheduleType"
                    value={currentEvent.scheduleType}
                    onChange={this.onEventParamsChange}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            { currentEvent.scheduleType == "DAILY" &&
              <div>
                <FormGroup>
                  <Label for="everyMinute">Repeat {currentEvent.scheduleType.toLowerCase()} for</Label>
                  <Input
                    type="select"
                    name="everyMinute"
                    id="everyMinute"
                    value={currentEvent.everyMinuteJobDescriptor && currentEvent.everyMinuteJobDescriptor.everyMinute ? currentEvent.everyMinuteJobDescriptor.everyMinute.toString() : "0"}
                    onChange={this.onEventParamsChange}
                  >
                    <option value="0">Once</option>
                    <option value="15">Every 15 min</option>
                    <option value="30">Every 30 min</option>
                    <option value="45">Every 45 min</option>
                    <option value="60">Every hour</option>
                  </Input>
                </FormGroup>
                { currentEvent.everyMinuteJobDescriptor && currentEvent.everyMinuteJobDescriptor.everyMinute != 0 &&
                  <Fragment>
                    <Row>
                      <Col xs="12">
                        <span>End Time</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="6">
                        <FormGroup>
                        <Label for="endHour">Hours:</Label>
                        <Input
                          type="select"
                          name="endHour"
                          id="endHour"
                          value={currentEvent.everyMinuteJobDescriptor.endHour.toString()}
                          onChange={this.onEventParamsChange}
                          className="timeDropdown"
                        >
                          {
                            this.timeArray.map((item) =>(
                              <option key={item} value={item} disabled={item < currentEvent.hour}>{item}</option>
                            ))
                          }
                        </Input>
                        </FormGroup>
                      </Col>
                      <Col xs="6">
                        <FormGroup>
                        <Label for="hour">Minutes:</Label>
                        <Input
                          type="select"
                          name="endMinutes"
                          id="endMinutes"
                          value={currentEvent.everyMinuteJobDescriptor.endMinutes.toString()}
                          onChange={this.onEventParamsChange}
                        >
                          <option value="0">00</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Fragment>
                }
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={!isListingEventAvailable} onClick={this.onSaveEvent}>Save</Button>
            <Button color="primary" onClick={this.onCancelEvent}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={msgModal.isOpen} toggle={this.toggleMsgModal} className="customModal">
          <ModalHeader toggle={this.toggleMsgModal}>{msgModal.header}</ModalHeader>
          <ModalBody>
            {msgModal.message}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleMsgModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </Col>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UrlBuilderScreen);
