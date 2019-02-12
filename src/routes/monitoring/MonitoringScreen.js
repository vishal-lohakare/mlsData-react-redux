// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Col,
  Button,
  Table,
  Input,
  Label,
  FormGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert
} from 'reactstrap';

import _ from 'lodash';
import moment from 'moment';
import * as MlsMonitoringActions from 'actions/MlsMonitoringAction';
import { CustomCalendar } from 'components';
import { showLoader, hideLoader } from 'utils/loader';
import classnames from 'classnames';
import './MonitoringScreen.scss';

const mapDispatchToProps = (dispatch) => ({
  MlsMonitoringActions: bindActionCreators(MlsMonitoringActions, dispatch),
});

const mapStateToProps = state => {
  return {
    MlsMonitoringInfo: _.get(state.MLSMonitoringData, 'MlsMonitoringInfo', {}),
    MlsMonitoringData: _.get(state.MLSMonitoringData, 'MlsMonitoringInfo.payload', {}),
    MlsMonitoringJobAction: _.get(state.MLSMonitoringData, 'MlsMonitoringAction', {}),
    MlsPlayOnDemand: _.get(state.MLSMonitoringData, 'MlsPlayOnDemand', {})
  }
};

type Props = {
  MlsMonitoringActions: typeof MlsMonitoringActions,
  MlsPlayOnDemand: {
    downloadType: string,
    mlsId: number
  },
  MlsMonitoringInfo: {
    isResponseSuccess: boolean,
    isFail: boolean,
  },
  MlsMonitoringJobAction: {
    isResponseSuccess: boolean
  },
  MlsMonitoringData: Array<Object>
};

type State = {
  dropdownOpen: boolean,
  searchText: string,
  allMlsData: Array<Object>,
  filteredMlsNames: Array<string>,
  allMlsNames: Array<string>,
  allDownloadTypes: Array<string>,
  allStatus: Array<string>,
  selectedMlsFilter: string,
  downloadType: string,
  status: string,
  selectedDate: Array<Date>,
  actionTrigged: boolean,
  isMonitoringDataPresent: boolean
};

class MonitoringScreen extends Component<Props, State> {

  state = {
    dropdownOpen: false,
    searchText: '',
    allMlsData: [],
    filteredMlsNames: [],
    allMlsNames: [],
    allDownloadTypes: [],
    allStatus: [],
    selectedMlsFilter: 'All',
    downloadType: 'All',
    status: 'All',
    selectedDate: [
      new Date(moment(new Date()).startOf('week')),
      new Date(moment(new Date()).endOf('week'))
    ],
    actionTrigged: false,
    isMonitoringDataPresent: true
  };

  componentDidMount() {
    this.getMonitoringData();
  }

  getMonitoringData = () => {
    const { MlsMonitoringActions } = this.props;
    const startDate = moment(new Date()).startOf('week').format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(new Date()).endOf('week').format("YYYY-MM-DD HH:mm:ss");
    let dataToSend = {};
    dataToSend['DATE_RANGE'] = [startDate, endDate];
    MlsMonitoringActions.GetMonitoringData(dataToSend);
  }

  componentDidUpdate(prevProps: Props) {
    const { MlsMonitoringInfo } = this.props;
    if(prevProps.MlsMonitoringInfo.isResponseSuccess !== MlsMonitoringInfo.isResponseSuccess
      && MlsMonitoringInfo.isResponseSuccess) {
      let { MlsMonitoringData, MlsPlayOnDemand: { mlsId, downloadType }  } = this.props;
      const allMlsNames = ['All', ...new Set(this.getSelectedType('source'))];
      const allDownloadTypes = ['All', ...new Set(this.getSelectedType('resourceType'))];
      const allStatus = ['All', ...new Set(this.getSelectedType('status'))];
      const allMlsData = this.getFilteredData(MlsMonitoringData);
      const selectedMlsFilter = this.geNameFromMonitoringData(mlsId);
      this.setState({
        selectedMlsFilter,
        allMlsData,
        filteredMlsNames: allMlsNames,
        allMlsNames,
        allDownloadTypes,
        allStatus,
        downloadType: downloadType !== '' ? downloadType: 'All',
        isMonitoringDataPresent: allMlsData.length > 0
      }, () => this.applyFilters());
    }


    if(prevProps.MlsMonitoringInfo.isFail !== MlsMonitoringInfo.isFail
      && MlsMonitoringInfo.isFail) {
        this.setState({
          isMonitoringDataPresent: false
        });
    }
  }

  geNameFromMonitoringData = (mlsId: number) => {
    const { MlsMonitoringData } = this.props;
    const job = MlsMonitoringData.find( item => item.mlsId === mlsId ) || { source: 'All' };
    return job.source;
  }

  getSelectedType = (type: string) => {
    const { MlsMonitoringData } = this.props;
    return MlsMonitoringData.map(item => item[type]);
  };

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  onMlsNameChange = (event: Object) => {
    const { allMlsNames } = this.state;
    const value = event.target.value.trim().toLowerCase();
    let filteredMlsNames;
    if(value !== '') {
      filteredMlsNames = allMlsNames.filter(item => item.toLowerCase().indexOf(value) > -1);
    } else {
      filteredMlsNames = allMlsNames;
    }
    this.setState({ searchText: value, filteredMlsNames });
  };

  onSelectMLS = (mlsName: string) => {
    this.setState({ selectedMlsFilter: mlsName });
  };

  onFilterChange = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    newState[event.target.name] = event.target.value;
    this.setState({...newState});
  };

  getConvertedDate = (milliseconds) => moment(milliseconds).format('MM/DD/YYYY');

  getConvertedDateTime = (milliseconds) => moment(milliseconds).format('MM/DD/YYYY HH:mm:ss');

  getFilteredData = (data: Array<Object>) => {
    const { selectedMlsFilter, status: selectedStatus, downloadType } = this.state;
    return data.filter(item => {
      const { source = '', status = '', resourceType = '' } = item;
      return (selectedMlsFilter !== 'All' ? source === selectedMlsFilter: true) &&
             (selectedStatus !== 'All' ? status === selectedStatus: true) &&
             (downloadType !== 'All' ? resourceType === downloadType: true);
    });
  }

  applyFilters = () => {
    showLoader();
    const filteredData = this.getFilteredData(this.props.MlsMonitoringData);
    this.setState({ allMlsData: filteredData }, () => hideLoader());
  };

  onToggleRows = (id: number) => {
    this.setState((prevState) => ({
      allMlsData: prevState.allMlsData.map((item, index) => {
        if(index === id) return { ...item, isRowExpanded: !_.isUndefined(item.isRowExpanded) ? !item.isRowExpanded: true  };
        return item;
      })
    }));
  };

  getStageData = (event: Object, row: number, column: number) => {
    const { allMlsData } = this.state;
    const { eventStageName, startDate, endDate, status } = event;
    const shouldHide = (_.isUndefined(allMlsData[row].isRowExpanded) || !allMlsData[row].isRowExpanded)  && column !== 0 ? 'hide' : '';
    return (
      <tr key={`${row}_${column}_${eventStageName}`}
        className={classnames(`eventRows ${shouldHide}`,{
          progressStatus: status === 'In Progress',
          successStatus: status === 'Success',
          failedStatus: status === 'Failed'
        })}
        >
        <td>{eventStageName}</td>
        <td>{this.getConvertedDateTime(startDate)}</td>
        <td>{endDate ? this.getConvertedDateTime(endDate) : 'Progress'}</td>
        <td>{status}</td>
        <td>{endDate ? `${moment(endDate - startDate).format('m')}m ${moment(endDate - startDate).format('s')}s`: 'Progress'}</td>
      </tr>
    );
  };

  onChangeDate = (date: Array<Date>) => {
    this.setState({ selectedDate: date });
    const startDate = moment(date[0]).format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(date[1]).format("YYYY-MM-DD HH:mm:ss");
    const dataToSend = {};
    dataToSend['DATE_RANGE'] = [startDate, endDate];
    const { MlsMonitoringActions } = this.props;
    MlsMonitoringActions.GetMonitoringData(dataToSend);
  };

  getFormattedDateRange = (date: Array<Date>) => {
    const startDate = this.getConvertedDate(date[0].getTime());
    const endDate = this.getConvertedDate(date[1].getTime());
    return `${startDate} - ${endDate}`;
  };

  handleJobAction = (downloadId: number, action: string) => {
    const { MlsMonitoringActions } = this.props;
    switch(action) {
      case 'Pause':
        MlsMonitoringActions.pauseJob(downloadId);
        break;
      case 'Resume':
        MlsMonitoringActions.resumeJob(downloadId);
        break;
      case 'Stop':
        MlsMonitoringActions.stopJob(downloadId);
        break;
    }
    this.setState({ actionTrigged: true });
  };

  clearFilters = () => {
    this.setState({
      selectedMlsFilter: 'All',
      downloadType: 'All',
      status: 'All'
    }, () => {
      this.applyFilters()
      this.props.MlsMonitoringActions.clearJobPlayOnDemand();
    });
  };

  render() {
    const {
            allMlsData,
            searchText,
            filteredMlsNames,
            selectedMlsFilter,
            allDownloadTypes,
            allStatus,
            selectedDate,
            dropdownOpen,
            actionTrigged,
            status,
            downloadType,
            isMonitoringDataPresent
          } = this.state;
    const { MlsMonitoringJobAction } = this.props;
    return (
      <Col xs="6" md="11">
        <h2 className="viewTitle marginLeft">Monitoring Screen</h2>
        <div className="contentWrapper monitoringContainer">
        <FormGroup className="dateRangeSelector">
          <div className="dates">
            <Label>Select Date Range: </Label>
              <CustomCalendar
                onChangeDate={this.onChangeDate}
                selectedDate={selectedDate}
                selectRange={true}
              />
          </div>
        </FormGroup>
        <FormGroup>
          <div>
            { actionTrigged && MlsMonitoringJobAction.isResponseSuccess && <Alert color="success">
                Action triggered successfully.
              </Alert>
            }
          </div>
        </FormGroup>
        <FormGroup>
          <div className="filters">
            <div className="mlsName">
                <Label>MLS Name:</Label>
                <ButtonDropdown className="mlsNameFilter" isOpen={dropdownOpen} toggle={this.toggleDropdown}>
                  <DropdownToggle caret>
                    { selectedMlsFilter }
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>
                      <Input
                        type="search"
                        name="mlsSearch"
                        placeholder="Search"
                        onChange={this.onMlsNameChange}
                        value={searchText}/>
                    </DropdownItem>
                    <DropdownItem divider />
                    <div className="mlsList">
                      { filteredMlsNames.map(item => (
                          <DropdownItem
                            key={item}
                            onClick={() => this.onSelectMLS(item)}>{item}</DropdownItem>
                          )
                        )
                      }
                    </div>
                  </DropdownMenu>
                </ButtonDropdown>
            </div>
            <div>
              <Label>Download Type:</Label>
              <Input
                type="select"
                className="downloadTypeFilter"
                name="downloadType"
                onChange={this.onFilterChange}
                value={downloadType}
              >
                { allDownloadTypes.map(type => <option key={type}>{type}</option>)}
              </Input>
            </div>
            <div>
              <Label>Status:</Label>
              <Input
                type="select"
                className="statusFilter"
                name="status"
                onChange={this.onFilterChange}
                value={status}
              >
              { allStatus.map(status => <option key={status}>{status}</option>)}
              </Input>
            </div>
            <div>
              <Button color="primary" onClick={this.applyFilters}>Apply filters</Button>
              <Button
                color="secondary"
                onClick={this.clearFilters}
                className="clearFilters"
                disabled={selectedMlsFilter === 'All' && downloadType === 'All' && status === 'All'}
              >
                Clear filters
              </Button>
              <Button color="primary" className="clearFilters" onClick={this.getMonitoringData}>Reload</Button>
            </div>
          </div>
        </FormGroup>
        <Table className="monitoringTable">
          <thead>
            <tr>
              <th>MLS Name</th>
              <th>Download Type</th>
              <th>Overall Status</th>
              <th>Job Action</th>
              <th>
                <span>Stage</span>
                <span>Start Date</span>
                <span>End Date</span>
                <span>Status</span>
                <span>Duration</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {  !_.isEmpty(allMlsData) && allMlsData.map((mls, id) => {
                const { downloadId, mlsId, source, resourceType, status, action, mlsEventStageDtoList = [] } = mls;
                let rows, actions = '';
                const eventsLength = mlsEventStageDtoList.length;
                switch(status) {
                  case 'In Progress':
                    actions = 'Pause,Stop';
                    break;
                  case 'Paused':
                    actions = 'Resume,Stop';
                }
                const sorted = mlsEventStageDtoList.sort((a, b) => {
                  if(a.startDate > b.startDate) {
                    return -1;
                  }
                  if(a.startDate < b.startDate) {
                    return 1;
                  }
                  return 0;
                });

                rows = sorted.map((event, index) => this.getStageData(event, id, index));
                const dropdownIcon = (_.isUndefined(allMlsData[id].isRowExpanded) || !allMlsData[id].isRowExpanded);

                return (
                  <tr key={`${id}_${mlsId}`}>
                    <td onClick={(event) => {
                      event.stopPropagation();
                      return this.onToggleRows(id);
                      }}>
                      <span className="dropdownIcon">
                        { eventsLength > 1 && (
                          <i
                            className={`fa faIcon ${dropdownIcon ? 'fa-angle-down' : 'fa-angle-up'}`}
                          ></i>
                        )}{' '}</span>{source}

                    </td>
                    <td>{resourceType}</td>
                    <td>{status}</td>
                    <td className="action" title={action}>
                      {actions.split(",").map(actionName =>
                        <a
                          href="javascript:void(0);"
                          className="actionName"
                          key={actionName}
                          onClick={() => this.handleJobAction(downloadId, actionName)}>{actionName}</a>
                      )}
                    </td>
                    {rows}
                  </tr>
                );
            })
          }

          {
            !isMonitoringDataPresent && <tr className="noRecords"><td colSpan="2">No records found within selected date range.</td></tr>
          }
          </tbody>
        </Table>
        </div>
      </Col>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitoringScreen);
