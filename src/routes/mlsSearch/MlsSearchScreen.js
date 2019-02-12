// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  FormGroup,
  Input,
  Row,
  Col,
  Table,
  Button,
  Label,
  Pagination,
  PaginationLink,
  PaginationItem,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import * as MlsConfigureAction from 'actions/MlsConfigureAction';
import * as MlsZapPanelAction from 'actions/MlsZapPanelAction';
import * as MlsSearchAction from 'actions/MlsSearchAction';
import * as MlsUrlBuilderAction from 'actions/MlsUrlBuilderAction';
import { clearSessionData, setSessionData } from 'utils/session';
import history from 'utils/history';
import './MlsSearchScreen.scss';

const mapDispatchToProps = (dispatch) => ({
  MlsConfigureAction: bindActionCreators(MlsConfigureAction, dispatch),
  MlsSearchAction: bindActionCreators(MlsSearchAction, dispatch),
  MlsZapPanelAction: bindActionCreators(MlsZapPanelAction, dispatch),
  MlsUrlBuilderAction: bindActionCreators(MlsUrlBuilderAction, dispatch)
});

const mapStateToProps = state => {
  return {
    MlsDetailsInfo: _.get(state.MLSSearchData, 'MlsDetailsInfo', {}),
    MlsUpdateInfo: _.get(state.MLSSearchData, 'MlsUpdateInfo', {}),
    MlsDetailsInfoData: _.get(state.MLSSearchData, 'MlsDetailsInfo.payload', {}),
    MlsUrlData: _.get(state.MLSUrlBuilderData, 'UrlData', {}),
    GetUrlData: _.get(state.MLSUrlBuilderData, 'GetUrlData', {}),
    MlsPlayInfo: _.get(state.MLSSearchData, 'MlsPlayInfo', {}),
    MlsPlayInfoData: _.get(state.MLSSearchData, 'MlsPlayInfo.payload', {}),
    MlsPlayOnDemandCheck: _.get(state.MLSSearchData, 'MlsPlayOnDemandCheck', {}),
    MlsPlayOnDemandCheckData: _.get(state.MLSSearchData, 'MlsPlayOnDemandCheck.payload', {}),
  }
};

type Props = {
  MlsUrlBuilderAction: typeof MlsUrlBuilderAction,
  MlsConfigureAction: typeof MlsConfigureAction,
  MlsZapPanelAction: typeof MlsZapPanelAction,
  MlsSearchAction: typeof MlsSearchAction,
  MlsDetailsInfo: Object,
  MlsUpdateInfo: Object,
  MlsDetailsInfoData: Array<Object>,
  GetUrlData: Object,
  MlsUrlData: Object,
  MlsPlayInfo: Object,
  MlsPlayOnDemandCheck: Object,
  MlsPlayOnDemandCheckData: Object,
};

type State = {
  mlsSourceData: Array<Object>,
  numberOfEntriesPerPage: number,
  pageNumber: number,
  disablePrevious: boolean,
  disableNext: boolean,
  sortOrderClass: Object,
  updatedMlsName: string,
  searchQuery: string,
  playModal: boolean,
  selectedUrl: Object,
  showPlayOnDemandError: boolean
};

class MlsSearchScreen extends Component<Props, State> {

  sortPreferences: Array<string> = [];
  sortOrders: Array<string> = [];

  state = {
    mlsSourceData: [],
    numberOfEntriesPerPage: 5,
    pageNumber: 1,
    disablePrevious: true,
    disableNext: false,
    sortOrderClass: {
      mlsName: 'fa-caret-down inactive',
      currentStatus: 'fa-caret-down inactive',
      lastExecution: 'fa-caret-down inactive',
      lastExecutionStatus: 'fa-caret-down inactive',
      avgTime: 'fa-caret-down inactive',
      avgDownloadRecords:  'fa-caret-down inactive',
      noOfDownloadsInDay: 'fa-caret-down inactive',
    },
    updatedMlsName: '',
    searchQuery: '',
    playModal: false,
    selectedUrl: { downloadType: '', value: '', id: -1, mlsInfoId: -1},
    showPlayOnDemandError: false,
  };

  componentDidMount() {
    this.props.MlsSearchAction.getListOfMls();
  }

  componentDidUpdate(prevProps: Props) {
    const { MlsDetailsInfo, MlsUpdateInfo, MlsUrlData, GetUrlData, MlsPlayInfo, MlsPlayOnDemandCheck, MlsPlayOnDemandCheckData } = this.props;
    if(prevProps.MlsDetailsInfo.isResponseSuccess !== MlsDetailsInfo.isResponseSuccess
      && MlsDetailsInfo.isResponseSuccess) {
        this.setState(() => ({ mlsSourceData: this.props.MlsDetailsInfoData }));
    }

    if(prevProps.MlsUpdateInfo.isResponseSuccess !== MlsUpdateInfo.isResponseSuccess
      && MlsUpdateInfo.isResponseSuccess) {
        this.setState({ searchQuery: '' });
    }
    if(prevProps.GetUrlData.isResponseSuccess !== GetUrlData.isResponseSuccess
      && GetUrlData.isResponseSuccess) {
        if(!_.isEmpty(MlsUrlData)) {
          const { downloadType, urlvalue, id, sourceId } = MlsUrlData[0].UrlDetails;
          this.setState((prevState) => ({
            selectedUrl: {...prevState.selectedUrl, downloadType, value: urlvalue, id, mlsInfoId: sourceId }
          }));
        } else {
          this.setState((prevState) => ({
            selectedUrl: {...prevState.selectedUrl, downloadType: '', value: '', id: -1, mlsInfoId: -1 }
          }));
        }
    }
    if(prevProps.MlsPlayInfo.isResponseSuccess !== MlsPlayInfo.isResponseSuccess
      && MlsPlayInfo.isResponseSuccess) {
      this.modalToggle();
      history.push('/monitoring');
    }

    if(prevProps.MlsPlayOnDemandCheck.isResponseSuccess !== MlsPlayOnDemandCheck.isResponseSuccess
      && MlsPlayOnDemandCheck.isResponseSuccess) {
        let showPlayOnDemandError = true;
        if(!MlsPlayOnDemandCheckData){
          showPlayOnDemandError = false;
          this.startPlayOnDemand();
        }
        this.setState({showPlayOnDemandError})
    }
  }

  modalToggle = () => {
    this.setState({ playModal: !this.state.playModal });
  };

  handlePlay = (id: number) => {
    const { MlsUrlBuilderAction } = this.props;
    MlsUrlBuilderAction.getMlsUrl(id);
    this.modalToggle();
  }

  onSearchText = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const { MlsDetailsInfoData } = this.props;

    const searchQuery = event.target.value.trim();
    if(searchQuery !== '') {
      newState.mlsSourceData = MlsDetailsInfoData.filter((item) => {
        return item.mlsName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      });
    } else {
      newState.mlsSourceData = MlsDetailsInfoData;
    }
    this.setState({...newState, pageNumber: 1, disablePrevious: true, disableNext: false, searchQuery});
  }

  getNumberOfPages = () => {
    const { mlsSourceData, numberOfEntriesPerPage } = this.state;
    return Math.ceil(mlsSourceData.length / numberOfEntriesPerPage);
  }

  onChangePageSize = (event: Object) => {
    this.setState({numberOfEntriesPerPage: event.target.value});
  }

  onPageNumberclick = (index: number) => {
    const newState = _.cloneDeep(this.state);

    newState.pageNumber = index;
    if(index === 1) {
      newState.disablePrevious = true;
      newState.disableNext = false;
    } else if(newState.pageNumber === this.getNumberOfPages()) {
      newState.disablePrevious = false;
      newState.disableNext = true;
    } else {
      newState.disablePrevious = false;
      newState.disableNext = false;
    }
    this.setState({...newState});
  }

  onNextClick = () => {
    const { pageNumber } = this.state;
    const newState = _.cloneDeep(this.state);
    const numberOfPages = this.getNumberOfPages();
    if(pageNumber < numberOfPages) {
      newState.pageNumber++;
      newState.disablePrevious = false;
    }
    if(newState.pageNumber === numberOfPages) {
      newState.disableNext = true;
    }
    this.setState({...newState});
  }

  onPreviousClick = () => {
    const newState = _.cloneDeep(this.state);
    if(newState.pageNumber > 1) {
      newState.pageNumber--;
      newState.disableNext = false;
    }
    if(newState.pageNumber === 1) {
      newState.disablePrevious = true;
    }
    this.setState({...newState});
  }

  onAddNewClick = () => {
     this.clearViewData();
     this.props.MlsConfigureAction.clearConfigResult();
  }

  clearViewData = () => {
    const mlsStages = ['/mlsSearch','/home', '/monitoring', '/dataConstraints'];

    clearSessionData('MlsName');
    clearSessionData('MlsID');
    clearSessionData('MlsStages');
    setSessionData('MlsStages', mlsStages);
    this.props.MlsZapPanelAction.updateLinkStatus(mlsStages);
  }

  renderSearchSection = () => {
    const { searchQuery } = this.state;
    return (
      <div>
        <FormGroup>
          <Input type="search" name="search" placeholder="Search" onChange={this.onSearchText} value={searchQuery}/>
        </FormGroup>
      </div>
    )
  }

  onSortMlsData = (sortType: string) => {
    const newState = _.clone(this.state);
    let { mlsSourceData, sortOrderClass } = newState;
    const index = this.sortPreferences.indexOf(sortType);
    sortOrderClass[sortType] = 'fa-caret-down';
    if(index === -1) {
      this.sortPreferences.push(sortType);
      this.sortOrders.push("asc");
    } else {
      if(this.sortOrders[index] === "asc") {
        this.sortOrders[index] = "desc";
        sortOrderClass[sortType] = 'fa-caret-up';
      } else {
        this.sortOrders[index] = "asc";
      }
    }
    mlsSourceData = _.orderBy(mlsSourceData, this.sortPreferences, this.sortOrders);
    this.setState({
      mlsSourceData,
      sortOrderClass
    });
  }

  updateMLS = (source: string, isActive: boolean) => {
    this.setState({ updatedMlsName: source });
    this.props.MlsSearchAction.updateMLS(source, !isActive);
  }

  renderMlsDetailsTable = () => {
    const { mlsSourceData, numberOfEntriesPerPage, pageNumber, sortOrderClass } = this.state;
    const startIndex = numberOfEntriesPerPage * (pageNumber - 1);
    let contentData = [];
    for(let i = startIndex; i < numberOfEntriesPerPage * pageNumber; i++) {
      const item = mlsSourceData[i];
      if(item) {
        const disabled = item.active === false;
        contentData.push(<tr key={i}>
          <td disabled={disabled}><Link to={{ pathname: '/home', state: { source: item.mlsName} }} onClick={this.clearViewData} >{item.mlsName}</Link></td>
          <td disabled={disabled}>{item.currentStatus ? item.currentStatus : 'Not Available'}</td>
          <td disabled={disabled}>{item.lastExecution ? moment(item.lastExecution).format('MM/DD/YYYY') : 'Not Available'}</td>
          <td disabled={disabled}>{item.lastExecutionStatus ? item.lastExecutionStatus : 'Not Available'}</td>
          <td disabled={disabled}>{item.avgTime ? `${item.avgTime}s` : 'Not Available'}</td>
          <td disabled={disabled}>{item.avgDownloadRecords ? item.avgDownloadRecords : 'Not Available'}</td>
          <td disabled={disabled}>{item.noOfDownloadsInDay ? item.noOfDownloadsInDay : 'Not Available'}</td>
          <td className="updateMLS">
            <a href="javascript:void(0);" onClick={() => this.updateMLS(item.mlsName, item.active)}>
              { item.active ? 'Disable' : 'Enable' }
            </a>
          </td>
          <td className="centered" disabled={disabled}>
            <a href="javascript:void(0);" onClick={() => this.handlePlay(item.mlsId)}>
             <i className="fa fa-play"></i>
            </a>
          </td>
        </tr>)
      }
    }

    return (
      <Table bordered className="mls-search-table">
        <thead>
          <tr>
            <th onClick={() => this.onSortMlsData('mlsName')}>
              <span>MLS Name</span>
              <i className={`fa ${sortOrderClass['mlsName']}`}></i>
            </th>
            <th onClick={() => this.onSortMlsData('currentStatus')}>
              <span>Status</span>
              <i className={`fa ${sortOrderClass['currentStatus']}`}></i>
            </th>
            <th onClick={() => this.onSortMlsData('lastExecution')}>
              <span>Last Execution</span>
              <i className={`fa ${sortOrderClass['lastExecution']}`}></i>
            </th>
            <th onClick={() => this.onSortMlsData('lastExecutionStatus')}>
              <span>Last Execution Status</span>
              <i className={`fa ${sortOrderClass['lastExecutionStatus']}`}></i>
            </th>
            <th onClick={() => this.onSortMlsData('avgTime')}>
              <span>Avg. Download Time</span>
              <i className={`fa ${sortOrderClass['avgTime']}`}></i>
            </th>
            <th onClick={() => this.onSortMlsData('avgDownloadRecords')}>
              <span>Avg. Download of Records</span>
              <i className={`fa ${sortOrderClass['avgDownloadRecords']}`}></i>
            </th>
            <th onClick={() => this.onSortMlsData('noOfDownloadsInDay')}>
              <span># of Downloads in a day</span>
              <i className={`fa ${sortOrderClass['noOfDownloadsInDay']}`}></i>
            </th>
            <th>
              <span>Enable/Disable MLS</span>
            </th>
            <th>Play</th>
          </tr>
        </thead>
        <tbody>
          {contentData}
        </tbody>
      </Table>
    )
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
            className={i+1 === pageNumber ? 'activePage' : '' }
          >
            {i+1}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pageArray;
  }

  getUrlData = (urlId: number) => {
    const url = this.props.MlsUrlData.find(url => url.UrlDetails.id === urlId);
    const { downloadType, urlvalue, sourceId } = url.UrlDetails;
    return { downloadType, urlvalue, sourceId };
  }

  setUrlValue = (event: Object) => {
    const { target } = event;
    const urlId = parseInt(target.value);
    const { downloadType, urlvalue, sourceId } = this.getUrlData(urlId);
    this.setState((prevState) => ({
      selectedUrl: {
        ...prevState.selectedUrl,
        downloadType: downloadType,
        value: urlvalue,
        mlsInfoId: sourceId,
        id: urlId
      }
    }));
  }

  onPlayClick = () => {
    const { selectedUrl: { mlsInfoId, downloadType } } = this.state;
    this.props.MlsSearchAction.checkPlayOnDemand(mlsInfoId, downloadType);
  }

  startPlayOnDemand =() => {
    const { MlsSearchAction } = this.props;
    const { selectedUrl: { downloadType, id, mlsInfoId }} = this.state;
    switch(downloadType) {
      case 'agent':
        MlsSearchAction.PlayMlsAgentDownload(id, mlsInfoId);
        break;
      case 'listing':
        MlsSearchAction.PlayMlsListingDownload(id, mlsInfoId);
        break;
      case 'office':
        MlsSearchAction.PlayMlsOfficeDownload(id, mlsInfoId);
        break;
      case 'openhouse':
        {
          const startDate = moment(new Date()).format('YYYY-MM-DD');
          const endDate = moment(new Date()).format('YYYY-MM-DD');
          MlsSearchAction.PlayMlsOpenHouseDownload(id, startDate, endDate, mlsInfoId);
          break;
        }
      case 'photo':
        MlsSearchAction.PlayMlsPhotoDownload(id, mlsInfoId);
        break;
    }
  }

  render() {
    const {
      numberOfEntriesPerPage,
      updatedMlsName,
      selectedUrl: { value: urlValue },
      playModal,
      showPlayOnDemandError
    } = this.state;
    const { MlsUpdateInfo, MlsUrlData } = this.props;

    return (
      <Col xs="8" md="11" className="mlsSearchScreen">
        <h2 className="viewTitle marginLeft">Searching MLS</h2>
        <Button
          color="primary"
          tag={Link}
          onClick={this.onAddNewClick}
          className="zapButton addNewButton text-right" to="/home">
          Add New
        </Button>
        <Row className="contentWrapper">
          <Col xs="12" md="6" lg="6" className="p-0">
            {this.renderSearchSection()}
          </Col>
          <Col xs="12" md="3" lg="3">
            <FormGroup row>
              <Label for="PageSize" sm="6">Page Size</Label>
              <Col sm="6">
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
          <Row>
          {
            MlsUpdateInfo.isResponseSuccess && updatedMlsName && <Alert color="success" className="successMsg">
              { updatedMlsName } is updated successfully.
            </Alert>
          }
          </Row>
          <Row className="contentWrapper">
            {this.renderMlsDetailsTable()}
          </Row>
          <Row>
            <Col sm="6" md={{ size: 4, offset: 4 }} lg={{ size: 4, offset: 4 }}>
              {this.renderPagination()}
            </Col>
          </Row>
          <Modal isOpen={playModal} className="customModal" toggle={this.modalToggle}>
            <ModalHeader toggle={this.modalToggle}></ModalHeader>
            <ModalBody>
              {showPlayOnDemandError && <Alert color="danger">Already playing same type of download</Alert>}
              <FormGroup>
                <Row>
                  <Col xs="6">
                    <Label for="urlId">URL Name:</Label>
                    <Input
                      type="select"
                      name="urlId"
                      id="urlId"
                      onChange={this.setUrlValue}
                    >
                      {
                        MlsUrlData.map(item => (
                          <option
                            key={item.UrlDetails.id}
                            value={item.UrlDetails.id}
                          >
                            {item.UrlDetails.urlname}
                          </option>
                          )
                        )
                      }
                    </Input>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label>URL Value:</Label>
                <p className="urlValue">{ urlValue }</p>
              </FormGroup>
              <FormGroup>
                <Button color="primary" onClick={this.onPlayClick} disabled={urlValue === ''}>Play</Button>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.modalToggle}>Close</Button>
            </ModalFooter>
          </Modal>
        </Col>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MlsSearchScreen);
