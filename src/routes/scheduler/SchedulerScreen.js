// @flow

import React, { Component, Fragment } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import BigCalendar from 'react-big-calendar';
import { CustomCalendar } from 'components';
import SchedulerListView from './SchedulerListView';

import SchedulerToolbar from './SchedulerToolbar';
import { getSessionData } from 'utils/session';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './SchedulerScreen.scss';
import * as MlsSchedulerActions from 'actions/MlsSchedulerAction';
import * as MlsUrlBuilderAction from 'actions/MlsUrlBuilderAction';

type Props = {
  MlsSchedulerActions: typeof MlsSchedulerActions,
  MlsUrlBuilderAction: typeof MlsUrlBuilderAction,
  MlsSchedulerEventsData: Array<Object>,
  MlsSchedulerEventDetails: {
    isResponseSuccess: boolean,
    isLoading: boolean,
    payload: Object
  },
  MlsSchedulerDeleteEvent: {
    isResponseSuccess: boolean,
    isLoading: boolean
  },
  MlsSchedulerUpdateEvent: {
    isResponseSuccess: boolean,
    isLoading: boolean
  },
  MlsSchedulerCreateEvent: {
    isResponseSuccess: boolean,
    isLoading: boolean,
    payload: Object,
    isFail: boolean,
    error: Object,
  },
  MlsUrlData: Object,
  MlsConfigureData: Object,
  MlsSchedulerEvents: {
    isResponseSuccess: boolean,
  },
  MlsListingEventStatus: Object,
  MlsListingEventStatusData: boolean,
};

type State = {
  eventData: Array<Object>,
  isOpenEventModal: boolean,
  msgModal: {
    header: string,
    message: string,
    isOpen: boolean,
    isConfirm: boolean
  },
  view: string,
  dropdownView: string,
  isGrid: boolean,
  isEdit: boolean,
  isPastEvent: boolean,
  isNewEvent: boolean,
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
    status: string
  },
  selectedDate: Date,
  urlValue: string,
  disableStartHour: number,
  source: string,
  mlsId: number,
  selectedDownloadType: string,
  dowloadTypesListData: Array<string>,
  isListingEventAvailable: boolean,
  showListingPhotoWarning: boolean,
};

const mapDispatchToProps = (dispatch) => ({
  MlsSchedulerActions: bindActionCreators(MlsSchedulerActions, dispatch),
  MlsUrlBuilderAction: bindActionCreators(MlsUrlBuilderAction, dispatch)
});

const mapStateToProps = state => {
  return {
    MlsSchedulerEvents: _.get(state.MlsSchedulerData, 'MlsSchedulerEvents', {}),
    MlsSchedulerEventsData: _.get(state.MlsSchedulerData, 'MlsSchedulerEvents.payload', []),
    MlsSchedulerEventDetails: _.get(state.MlsSchedulerData, 'MlsSchedulerEventDetails', {}),
    MlsSchedulerDeleteEvent: _.get(state.MlsSchedulerData, 'MlsSchedulerDeleteEvent', {}),
    MlsSchedulerUpdateEvent: _.get(state.MlsSchedulerData, 'MlsSchedulerUpdateEvent', {}),
    MlsSchedulerCreateEvent: _.get(state.MlsSchedulerData, 'MlsSchedulerCreateEvent', {}),
    MlsUrlData: _.get(state.MLSUrlBuilderData, 'UrlData', {}),
    MlsConfigureData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsListingEventStatus: _.get(state.MlsSchedulerData, 'MlsListingEventStatus', {}),
    MlsListingEventStatusData: _.get(state.MlsSchedulerData, 'MlsListingEventStatus.payload', {}),
  }
}

class SchedulerScreen extends Component<Props, State> {

  localizer: any;
  timeArray: Array<number>;
  uniqueUrls: Array<number>;

  constructor(props:Props) {
    super(props);
    const { source, id } = this.props.MlsConfigureData;
    this.state = {
      eventData: [],
      isOpenEventModal: false,
      msgModal: {
        header: '',
        message: '',
        isOpen: false,
        isConfirm: false
      },
      view: 'week',
      dropdownView: 'week',
      isGrid: true,
      isEdit: false,
      isPastEvent: false,
      isNewEvent: false,
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
        status: "enabled"
      },
      selectedDate: new Date(),
      urlValue: "",
      disableStartHour: -1,
      source: source ? source : getSessionData('MlsName'),
      mlsId: id ? id : getSessionData('MlsID'),
      selectedDownloadType: 'All',
      dowloadTypesListData: [],
      isListingEventAvailable: true,
      showListingPhotoWarning: false,
    };
    (this:any).localizer = BigCalendar.momentLocalizer(moment);
    (this:any).timeArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    (this:any).uniqueUrls = [];
  }

  componentDidMount() {
    this.getEvents();
    const { MlsUrlBuilderAction } = this.props;
    const { mlsId } = this.state;
    MlsUrlBuilderAction.getMlsUrl(mlsId);
  }

  componentDidUpdate(prevProps: Props){
    const { isResponseSuccess, isLoading, payload } = this.props.MlsSchedulerEventDetails;
    if(isResponseSuccess && (isResponseSuccess != prevProps.MlsSchedulerEventDetails.isResponseSuccess) && !isLoading){
      const eventData = _.cloneDeep(payload);
      if(!payload.everyMinuteJobDescriptor){
        eventData.everyMinuteJobDescriptor = {
          everyMinute: 0,
          endHour: 0,
          endMinutes: 0,
          endDate: new Date().toISOString()
        }
      } else {
        const date = new Date(eventData.everyMinuteJobDescriptor.endDate);
        eventData.everyMinuteJobDescriptor.endHour = date.getHours();
        eventData.everyMinuteJobDescriptor.endMinutes = date.getMinutes();
      }
      const { hours: startHour, mins: startMin } = this.getLocalTime(eventData.hour, eventData.min);
      eventData.hour = startHour;
      eventData.min = startMin;
      this.setState({
        currentEvent: eventData,
        isOpenEventModal: true,
        urlValue: this.getURLDetails(eventData.urlId).urlValue
      });
    }

    const { isResponseSuccess: success, isLoading: load } = this.props.MlsSchedulerDeleteEvent;
    if(success && (success != prevProps.MlsSchedulerDeleteEvent.isResponseSuccess) && !load){
      this.getEvents();
      this.setState({
        isOpenEventModal: false,
        msgModal: {
          header: 'Success!',
          message: `Successfully deleted the job: ${this.state.currentEvent.title}.`,
          isOpen: true,
          isConfirm: false
        }
      });
    }

    const { isResponseSuccess: updateSuccess, isLoading: updateLoad } = this.props.MlsSchedulerUpdateEvent;
    if(updateSuccess && (updateSuccess != prevProps.MlsSchedulerUpdateEvent.isResponseSuccess) && !updateLoad){
      this.getEvents();
      this.setState({
        isOpenEventModal: false,
        isEdit: false,
        msgModal: {
          header: 'Success!',
          message: `Successfully updated the job: ${this.state.currentEvent.title}.`,
          isOpen: true,
          isConfirm: false
        }
      });
    }

    const { isResponseSuccess: createSuccess, isLoading: createLoad, payload:newlyCreatedEvent, isFail, error } = this.props.MlsSchedulerCreateEvent;
    if(createSuccess && (createSuccess != prevProps.MlsSchedulerCreateEvent.isResponseSuccess) && !createLoad){
      this.getEvents();
      this.setState({
        isOpenEventModal: false,
        isEdit: false,
        isNewEvent: false,
        msgModal: {
          header: 'Success!',
          message: `Successfully created the job named: ${newlyCreatedEvent.title}.`,
          isOpen: true,
          isConfirm: false
        }
      });
    }

    if(isFail && (isFail != prevProps.MlsSchedulerCreateEvent.isFail) && !createLoad) {
      this.setState({
        isOpenEventModal: false,
        isEdit: false,
        isNewEvent: false,
        msgModal: {
          header: 'Error!',
          message: error.errorMessage,
          isOpen: true,
          isConfirm: false
        }
      });
    }

    const { MlsSchedulerEvents: {isResponseSuccess: getEventSuccess}, MlsSchedulerEventsData } = this.props;
    if(prevProps.MlsSchedulerEvents.isResponseSuccess !== getEventSuccess && getEventSuccess) {

      this.setState({
        dowloadTypesListData: this._getDownloadType(MlsSchedulerEventsData),
        eventData: MlsSchedulerEventsData,
        selectedDownloadType: 'All',
        showListingPhotoWarning: _.includes(this._getDownloadType(MlsSchedulerEventsData), 'Photo'),
      })
    }

    const { MlsListingEventStatus: {isResponseSuccess: listingExistSuccess}, MlsListingEventStatusData } = this.props;
    if(prevProps.MlsListingEventStatus.isResponseSuccess !== listingExistSuccess && listingExistSuccess) {

      this.setState({
        isListingEventAvailable: MlsListingEventStatusData
      });
    }

  }

  _getDownloadType = (scheduleEventData) => {
    let uniqDownloadType = ['All'];
    _.map(scheduleEventData, (item) => {
      uniqDownloadType.push(item.downloadType);
    })
    return _.uniq(uniqDownloadType);
  }

  getWeekRange = (date: Date) => {
    const startDate = moment(date).startOf('week');
    const endDate = moment(date).endOf('week');
    return {
      startDate,
      endDate
    }
  }

  getLocalTime = (hours: number = 0, mins: number = 0) => {
    const dateObj = new Date();
    dateObj.setUTCHours(hours, mins);
    return {
      hours: dateObj.getHours(),
      mins: dateObj.getMinutes()
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

  getEvents = () => {
    const { startDate, endDate } = this.getWeekRange(this.state.selectedDate);
    const { MlsSchedulerActions } = this.props;
    const { mlsId } = this.state;
    const query = {
      mlsInfoId: mlsId,
      startDate: moment.utc(startDate).format("YYYY-MM-DD HH:mm:ss"),
      endDate: `${moment.utc(endDate).format("YYYY-MM-DD HH:mm:ss")}`
    }
    MlsSchedulerActions.getSchedulerEvents(query);
    this.uniqueUrls = [];
  }

  onChangeDate = (selectedDate: Date) => {
    this.setState({
      selectedDate,
      selectedDownloadType: 'All'
    }, () => {
      this.getEvents();
    });
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

  getURLDetails = (urlId) => {
    const url = _.find(this.props.MlsUrlData, (url) => url.UrlDetails.id === urlId);
    const { urlvalue, downloadType  } = url.UrlDetails;
    return {
      urlValue: urlvalue,
      downloadType
    };
  }

  checkListingEventStatus = (currentEventData: Object) => {
    const { mlsId } = this.state;
    const { urlId, hour, min, startDate } = currentEventData;
    const { downloadType } = this.getURLDetails(parseInt(urlId))
    const startDateValue = new Date(startDate);
    startDateValue.setHours(hour, min);
    if(downloadType === "photo") {
      this.props.MlsSchedulerActions.isListingScheduleExist({mlsId, startDate: startDateValue.toISOString().replace('T', ' ').replace('Z','')});
    }
  }

  onEventParamsChange = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const newCurrentEvent = newState.currentEvent;
    const { name, value } = event.target;
    newState.isListingEventAvailable = true;

    switch(name){
      case "urlId":
        {
          const { urlValue } = this.getURLDetails(parseInt(value));
          newState.urlValue = urlValue;
          newCurrentEvent.urlId = parseInt(value);
          break;
        }

      case "hour":
      case "min":
        newCurrentEvent[name] = parseInt(value);
        break;

      case "everyMinute":
        if(newCurrentEvent.everyMinuteJobDescriptor.everyMinute == 0){
          newCurrentEvent.everyMinuteJobDescriptor.endHour = newCurrentEvent.hour + 1;
        }
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

  toggleEventModal = () => {
    const { isOpenEventModal, currentEvent, isNewEvent } = this.state;
    this.setState({
      isOpenEventModal: !isOpenEventModal,
      isEdit: false,
      currentEvent: isNewEvent ? currentEvent: this.props.MlsSchedulerEventDetails.payload,
      isNewEvent: false,
      isListingEventAvailable: true,
    });
  }

  setCurrentView = (view: string) => {
    this.setState({ view });
  }

  createEvent = (obj: Object) => {
    const { start } = obj;
    const { MlsUrlData } = this.props;
    const { mlsId } = this.state;
    const today = new Date();
    if(start < today) {
      this.setState({
        msgModal: {
          header: "Message",
          message: "Cannot create an event for past date and/or time.",
          isOpen: true,
          isConfirm: false
        }
      });
      return;
    }
    this.setState({
      isOpenEventModal: true,
      isNewEvent: true,
      isEdit: true,
      currentEvent: {
        title: '',
        group: '',
        urlId: MlsUrlData[0].UrlDetails.id,
        mlsInfoId: mlsId,
        startDate: start.toISOString(),
        scheduleType: "DAILY",
        hour: start.getHours(),
        min: start.getMinutes(),
        jobId: '',
        everyMinuteJobDescriptor: {
          everyMinute: 0,
          endHour: start.getHours() + 1,
          endDate: start.toISOString(),
          endMinutes: 0,
        },
        status: "enabled"
      },
      urlValue: MlsUrlData[0].UrlDetails.urlvalue
    }, () => {
      this.checkListingEventStatus(this.state.currentEvent);
    });
  }

  onSaveEvent = () => {
    const { createSchedulerEvent, updateSchedulerEvent } = this.props.MlsSchedulerActions;
    const { currentEvent, isNewEvent } = this.state;
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
    if(postEventObj.everyMinuteJobDescriptor.everyMinute == 0){
      delete postEventObj.everyMinuteJobDescriptor;
    }
    isNewEvent ? createSchedulerEvent(postEventObj) : updateSchedulerEvent(postEventObj);
  }

  onSelectEvent = (eventObj: Object) => {
    const { eventStatus, startDate } = eventObj;
    const { isPastEvent, isEdit, mlsId } = this.state;
    const { MlsSchedulerActions } = this.props;
    const query = {
      mlsInfoId: mlsId,
      jobId: eventObj.jobId
    }
    this.setState({
      isPastEvent: !eventStatus == "FUTURE" || eventStatus == "RUNNING" || eventStatus == "COMPLETED" || (startDate < new Date()),
      isEdit: isPastEvent ? false : isEdit
    });
    MlsSchedulerActions.getSchedulerEventDetails(query);
  }

  onCalendarNavigation = (selectedDate: Date) => {
    this.setState({
      selectedDate
    });
  }

  changeDropdownView = (view: string) => {
    this.setState({
      view: this.state.isGrid ? view : 'agenda',
      dropdownView: view
    });
  }

  switchToGridView = () => {
    this.setState({
      isGrid: true,
      view: this.state.dropdownView
    });
  }

  switchToListView = () => {
    this.setState({
      isGrid: false,
      view: 'agenda'
    });
  }

  hasEventModified = () => {
    return _.isEqual(this.state.currentEvent, this.props.MlsSchedulerEventDetails.payload);
  }

  onEditEvent = () => {
    this.setState({
      isEdit: true
    });
  }

  onCancelEvent = () => {
    const { isNewEvent, isOpenEventModal, currentEvent } = this.state;
    const { payload } = this.props.MlsSchedulerEventDetails;
    this.setState({
      isEdit: false,
      currentEvent: isNewEvent ? currentEvent : {...currentEvent, payload },
      isNewEvent: false,
      isOpenEventModal: isNewEvent ? false : isOpenEventModal,
      isListingEventAvailable: true,
    });
  }

  onDeleteEvent = () => {
    this.setState({
      msgModal: {
        header: "Confirmation",
        message: `Are you sure you want to delete ${this.state.currentEvent.title}?`,
        isOpen: true,
        isConfirm: true
      }
    });
  }

  onModalConfirm = () => {
    const { MlsSchedulerActions } = this.props;
    const { mlsId } = this.state;
    const deleteEventQuery = {
      mlsInfoId: mlsId,
      jobId: this.state.currentEvent.jobId
    }
    MlsSchedulerActions.deleteSchedulerEvent(deleteEventQuery);
  }

  toggleMsgModal = () => {
    const newMsgModal = _.cloneDeep(this.state.msgModal);
    newMsgModal.isOpen = !newMsgModal.isOpen;
    this.setState({
      msgModal: newMsgModal
    });
  }

  onSelectDownloadType = (event: Object) => {
    const downloadType = event.target.value;
    const { MlsSchedulerEventsData } = this.props;
    const filteredEventData = downloadType === 'All' ? MlsSchedulerEventsData : _.filter(MlsSchedulerEventsData, {downloadType: downloadType})
    this.setState({ eventData: filteredEventData, selectedDownloadType: downloadType});
  };

  render() {
    const {
      isOpenEventModal,
      msgModal,
      currentEvent,
      isGrid,
      dropdownView,
      selectedDate,
      view,
      isEdit,
      isNewEvent,
      isPastEvent,
      urlValue,
      disableStartHour,
      source,
      selectedDownloadType,
      dowloadTypesListData,
      eventData,
      isListingEventAvailable,
      showListingPhotoWarning,
    } = this.state;
    const { MlsUrlData } = this.props;

    return (
      <Col xs="6" md="10">

        <h2 className="viewTitle">
          Scheduler URL Updates - Source: {source}
        </h2>

        {
          showListingPhotoWarning && <Alert color="info">
            Photo download will be based on your last listing scheduled.
          </Alert>
        }

        <div className="customScheduler contentWrapper">

          <SchedulerToolbar
            onViewChange={this.changeDropdownView}
            currentView={dropdownView}
            isGrid={isGrid}
            onGridClick={this.switchToGridView}
            onListClick={this.switchToListView}
            selectedDate={selectedDate}
            onChangeDate={this.onChangeDate}
            dowloadTypesListData={dowloadTypesListData}
            selectedDownloadType={selectedDownloadType}
            onSelectDownloadType={this.onSelectDownloadType}
          />

          <BigCalendar
            selectable={'ignoreEvents'}
            showMultiDayTimes={false}
            step={15}
            timeslots={4}
            popup={true}
            toolbar={false}
            date={selectedDate}
            onNavigate={this.onCalendarNavigation}
            onSelectSlot={this.createEvent}
            onSelectEvent={this.onSelectEvent}
            onSelecting={() => false}
            localizer={this.localizer}
            events={eventData}
            views={{ week: true, day: true, agenda: SchedulerListView }}
            defaultView={BigCalendar.Views.WEEK}
            defaultDate={new Date()}
            onView={this.setCurrentView}
            view={view}
            startAccessor={(event: Object) => {
              return new Date(event.startDate);
            }}
            endAccessor={(event: Object) => {
              if(event.endDate === null) {
                return  moment(event.startDate).add(30, 'm').toDate();
              }
              else {
                return new Date(event.endDate);
              }
            }}
            eventPropGetter={(event: Object) => {
              const index = this.uniqueUrls.indexOf(event.urlId);
              if(index == -1) this.uniqueUrls.push(event.urlId);
              return {
                style: {
                  borderLeft: `6px solid hsla(${(this.uniqueUrls.indexOf(event.urlId) + 1) * 30}, 100%, 50%, 1)`
                }
              }
            }}
            getNow={() => new Date(selectedDate)}
            customView={dropdownView}
          />

          { isOpenEventModal &&
            <Modal isOpen={isOpenEventModal} toggle={this.toggleEventModal}>
              <ModalHeader toggle={this.toggleEventModal}>{currentEvent.title}</ModalHeader>
              <ModalBody>
                { !isListingEventAvailable && <Alert color="danger">
                 Cannot schedule photo download unless listing download is scheduled at least once prior to this.
                </Alert>}
                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="urlId">URL Name</Label>
                      <Input
                        type="select"
                        name="urlId"
                        id="urlId"
                        value={currentEvent.urlId}
                        onChange={this.onEventParamsChange}
                        disabled={!isNewEvent || (isEdit && !isNewEvent)}
                      >
                        {
                          _.map(MlsUrlData, (item ,index) => <option key={item.UrlDetails.id} value={item.UrlDetails.id}>{item.UrlDetails.urlname}</option>)
                        }
                      </Input>
                    </FormGroup>
                  </Col>
                  { (!isPastEvent && !isNewEvent) &&
                    <Col xs="6" className="eventActions">
                      <Button color="link" onClick={this.onEditEvent} disabled={isEdit}>
                        <span className="fa fa-pencil"></span>
                        <span>Edit</span>
                      </Button>
                      <Button color="link" onClick={this.onDeleteEvent} disabled={isEdit}>
                        <span className="fa fa-trash"></span>
                        <span>Delete</span>
                      </Button>
                    </Col>
                  }
                </Row>
                <Row>
                  <Col xs="12">
                    <Label>URL Value</Label>
                    <p className="urlValue">{urlValue}</p>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="startDate">Start Date</Label>
                      <CustomCalendar
                        selectedDate={new Date(currentEvent.startDate)}
                        onChangeDate={this.onChangeDateModal}
                        minDate={new Date()}
                        canChange={isEdit}
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
                      { isPastEvent ?
                        <span> {currentEvent.hour} </span> :
                        <Input
                          type="select"
                          name="hour"
                          id="hour"
                          value={currentEvent.hour.toString()}
                          disabled={!isEdit}
                          onChange={this.onEventParamsChange}
                          className="timeDropdown"
                        >
                          {
                            this.timeArray.map((item) => (
                              <option key={item} value={item} disabled={disableStartHour >= item}>{item}</option>
                            ))
                          }
                        </Input>
                      }
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="min">Minutes: </Label>
                      { isPastEvent ?
                        <span>{currentEvent.min}</span> :
                        <Input
                          type="select"
                          name="min"
                          id="min"
                          value={currentEvent.min.toString()}
                          disabled={!isEdit}
                          onChange={this.onEventParamsChange}
                        >
                          <option value="0">00</option>
                          <option value="15">15</option>
                          <option value="30">30</option>
                          <option value="45">45</option>
                        </Input>
                      }
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
                        disabled={!isEdit}
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
                        disabled={!isEdit}
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
                              disabled={!isEdit}
                              onChange={this.onEventParamsChange}
                              className="timeDropdown"
                            >
                              {
                                this.timeArray.map((item) =>(
                                  <option key={item} value={item} disabled={item <= currentEvent.hour}>{item}</option>
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
                              disabled={!isEdit}
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
                { isEdit && !isNewEvent &&
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <Input
                      type="select"
                      name="status"
                      id="status"
                      value={currentEvent.status}
                      disabled={!isEdit}
                      onChange={this.onEventParamsChange}
                    >
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </Input>
                  </FormGroup>
                }
              </ModalBody>
              { isEdit &&
                <ModalFooter>
                  <Button color="primary" disabled={this.hasEventModified() || !isListingEventAvailable} onClick={this.onSaveEvent}>Save</Button>
                  <Button color="primary" onClick={this.onCancelEvent}>Cancel</Button>
                </ModalFooter>
              }
            </Modal>
          }

          <Modal isOpen={msgModal.isOpen} toggle={this.toggleMsgModal} className="customModal">
            <ModalHeader toggle={this.toggleMsgModal}>{msgModal.header}</ModalHeader>
            <ModalBody>
              {msgModal.message}
            </ModalBody>
            <ModalFooter>
              { msgModal.isConfirm &&
                <Button color="primary" onClick={this.onModalConfirm}>Confirm</Button>
              }
              <Button color="primary" onClick={this.toggleMsgModal}>
                { msgModal.isConfirm ? "Cancel" : "Close" }
              </Button>
            </ModalFooter>
          </Modal>

        </div>
      </Col>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerScreen);
