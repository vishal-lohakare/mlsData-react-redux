// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import './HomeScreen.scss'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Col,
  Row,
  Button,
  Input,
  Label,
  FormGroup,
  CustomInput,
  Collapse,
  Alert,
  Tooltip,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import * as MlsConfigureAction from 'actions/MlsConfigureAction';
import * as MlsZapPanelAction from 'actions/MlsZapPanelAction';
import * as MlsUrlBuilderAction from 'actions/MlsUrlBuilderAction';
import DownloadFile from './DownloadFile';
import { hideLoader } from 'utils/loader';
import { ContextDataPanel } from 'components';
import { getSessionData, setSessionData } from 'utils/session';

const mapDispatchToProps = (dispatch) => ({
  MlsUrlBuilderAction: bindActionCreators(MlsUrlBuilderAction, dispatch),
  MlsConfigureAction: bindActionCreators(MlsConfigureAction, dispatch),
  MlsZapPanelAction: bindActionCreators(MlsZapPanelAction, dispatch)
})

const mapStateToProps = state => {
  return {
    MlsConfig: _.get(state.MLSConfigureData, 'MlsConfigureResult', {}),
    MlsDownloadUpdatedFiles: _.get(state.MLSConfigureData, 'MlsDownloadUpdatedFiles', {}),
    MlsConfigData: _.get(state.MLSConfigureData, 'MlsConfigureResult.payload[0]', {}),
    MlsDownloadFiles: _.get(state.MLSConfigureData, 'MlsDownloadFiles', {}),
    MlsDownloadFilesData: _.get(state.MLSConfigureData, 'MlsDownloadFiles.payload', []),
    MlsUrlData: _.get(state.MLSUrlBuilderData, 'UrlData', {}),
    MlsGetUrlData: _.get(state.MLSUrlBuilderData, 'GetUrlData', {}),
    MlsSavedUrl: _.get(state.MLSUrlBuilderData, 'UrlSavedData', {}),
  }
}

type Props = {
  MlsUrlBuilderAction: typeof MlsUrlBuilderAction,
  MlsConfigureAction: typeof MlsConfigureAction,
  MlsZapPanelAction: typeof MlsZapPanelAction,
  MlsUrlData: Object,
  MlsGetUrlData: {
    isResponseSuccess: boolean,
  },
  MlsConfigData: {
    source: string,
    collapse: boolean,
    loginId: string,
    password: string,
    loginUrl: string,
    userAgentId: string,
    userAgentPassword: string,
    retsVersion: string,
    id: string
  },
  MlsConfig: {
    isResponseSuccess: boolean,
    isAddUpdateSuccess: boolean,
    isSearchSuccess: boolean,
    payload: Object,
    error: Object
  },
  MlsDownloadUpdatedFiles: Object,
  MlsDownloadFiles: Object,
  MlsDownloadFilesData: Array<string>,
  history: Object,
  location: {
    state: Object
  }
};

type State = {
  source: string,
  username: string,
  password: string,
  loginURL: string,
  userAgent: string,
  userAgentPassword: string,
  retsVersion: string,
  basicAuth: string,
  collapse: boolean,
  clientError: boolean,
  tooltipOpen: boolean,
  dataChange: boolean,
  isFirst: boolean,
  isAddUpdateSuccess: boolean,
  propUpdated: boolean,
  isSearchSuccess: boolean,
  showFileDownload: boolean,
  listOfFiles: Array<string>,
  configButtonClicked: boolean,
  downloadUpdatedClicked: boolean,
  hideError: boolean
};

class HomeScreen extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      source: '',
      username: '',
      password: '',
      loginURL: '',
      userAgent: '',
      userAgentPassword: '',
      retsVersion: '',
      basicAuth: 'no',
      collapse: false,
      clientError: false,
      tooltipOpen: false,
      propUpdated: false,
      isFirst: true,
      dataChange: false,
      isAddUpdateSuccess: false,
      isSearchSuccess: false,
      showFileDownload: false,
      listOfFiles: [],
      configButtonClicked: false,
      downloadUpdatedClicked: false,
      hideError: true
    };

    (this:any).handleLoginClick = this.handleLoginClick.bind(this);
    (this:any).handleInputBlur = this.handleInputBlur.bind(this);
    (this:any).handleAuthChange = this.handleAuthChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    const source = _.isUndefined(state) || _.isUndefined(state.source) ? getSessionData('MlsName') : state.source;
    if (source) {
      this.props.MlsConfigureAction.searchMLSExist(source);
    } else {
      this.setState({ showFileDownload: false })
    }
  }

  componentDidUpdate(prevProps) {
    const { MlsConfig, MlsConfigureAction, MlsDownloadFiles, MlsDownloadFilesData, MlsConfigData, MlsDownloadUpdatedFiles, MlsUrlBuilderAction } = this.props;
    let newState = {};
    const mlsStages = ['/home', '/urlBuilder', '/canonicalMappings', '/monitoring', '/dataConstraints'];
    
    if (prevProps.MlsConfig.isResponseSuccess !== MlsConfig.isResponseSuccess && MlsConfig.isResponseSuccess) {

      const { loginId, password, loginUrl, userAgentId, userAgentPassword, retsVersion, source, id } = MlsConfigData;

      newState = {
        username: loginId,
        password: password,
        source: source,
        loginURL: loginUrl,
        userAgent: userAgentId,
        userAgentPassword: userAgentPassword,
        retsVersion: retsVersion,
        clientError: false,
        tooltipOpen: false,
        propUpdated: true,
        isFirst: false,
        dataChange: false,
        isAddUpdateSuccess: false,
        isSearchSuccess: false,
      }
      if (MlsConfig.isAddUpdateSuccess) {
        newState.isAddUpdateSuccess = MlsConfig.isAddUpdateSuccess;
        MlsConfigureAction.downloadUpdatedMetadata(this.state.source);
      }
      if (MlsConfig.isSearchSuccess) {
        if (!_.isEmpty(MlsConfig.payload)) {
          newState.isSearchSuccess = MlsConfig.isSearchSuccess;
          MlsConfigureAction.downloadMetadata(source);
        } else {
          hideLoader();
          newState = {
            isFirst: true,
            loginURL: '',
            username: '',
            password: '',
            userAgent: '',
            userAgentPassword: ''
          }
        }
      }
      MlsUrlBuilderAction.getMlsUrl(Number(id));
      setSessionData('MlsName', source);
      setSessionData('MlsID', id);
      this.setState({ ...newState });
    }

    if (prevProps.MlsDownloadFiles.isResponseSuccess !== MlsDownloadFiles.isResponseSuccess && MlsDownloadFiles.isResponseSuccess) {
      newState = {
        showFileDownload: true,
        listOfFiles: MlsDownloadFilesData,
      }

      if (newState.listOfFiles.length != 0) {
        setSessionData('MlsStages', mlsStages);
        this.props.MlsZapPanelAction.updateLinkStatus(mlsStages);
      } else {
        let stages = ['/mlsSearch', '/home', '/dataConstraints'];
        setSessionData('MlsStages', stages);
      }


      this.setState({ ...newState });
    }

    if (prevProps.MlsDownloadUpdatedFiles.isResponseSuccess !== MlsDownloadUpdatedFiles.isResponseSuccess &&
      MlsDownloadUpdatedFiles.isResponseSuccess) {
      this.setState({ hideError: false });
    }

    if(prevProps.MlsGetUrlData.isResponseSuccess !== this.props.MlsGetUrlData.isResponseSuccess && this.props.MlsGetUrlData.isResponseSuccess) {
      let linksEnableList = ['/home', '/urlBuilder', '/canonicalMappings']
      const linkEnable = this.props.MlsUrlData.length ? [...linksEnableList, '/scheduler','/standardValue', '/monitoring'] : linksEnableList ;

      setSessionData('MlsStages', linkEnable);
      this.props.MlsZapPanelAction.updateLinkStatus(linkEnable);
    }
  }


  validateMLSInfo() {
    const { source, loginURL, username, password } = this.state;
    if (source === '' || loginURL === '' || username === '' || password === '') {
      return false;
    }
    return true;
  }

  handleLoginClick() {
    const newState = _.cloneDeep(this.state);
    newState.configButtonClicked = true;
    if (this.validateMLSInfo()) {
      const { id } = Array.isArray(this.props.MlsConfigData) ? _.get(this.props, 'MlsConfigData[0]', []) : this.props.MlsConfigData;
      const { loginURL, username, password, userAgent, userAgentPassword, retsVersion, basicAuth, source } = this.state;
      newState.clientError = false;
      this.props.MlsConfigureAction.postMLSInfo({
        id: id,
        source: source,
        loginURL: loginURL,
        username: username,
        password: password,
        userAgent: userAgent,
        userAgentPassword: userAgentPassword,
        retsVersion: retsVersion,
        basicAuth: basicAuth
      });
    } else {
      newState.clientError = true;
    }
    this.setState({...newState});
  }

  newMlsRecord() {
    const newState = _.cloneDeep(this.state);
    if (newState.source !== '' && newState.loginURL !== '' && newState.username !== '' && newState.password !== '') {
      return true;
    }
    return false;
  }

  handleInputBlur(event) {
    const newState = _.cloneDeep(this.state);
    const inputValue = event.target.value;
    const inputName = event.target.name;
    newState[inputName] = inputValue;
    newState.tooltipOpen = false;

    this.setState({ ...newState }, () => {
      if (this.validateMLSInfo()) {
        newState.clientError = false;
        this.setState({ ...newState });
      }
    });
  }

  handleInputChange(event) {
    const newState = _.cloneDeep(this.state);
    const { value, name } = event.target;
    newState[name] = value;
    newState.dataChange = true;
    this.setState({ ...newState });
  }

  handleAuthChange(event) {
    const newState = _.cloneDeep(this.state);
    const inputValue = event.target.value;
    newState.basicAuth = inputValue;
    this.setState({ ...newState });
  }

  validateMLSName = (event) => {
    const { value, name } = event.target;
    const newState = _.cloneDeep(this.state);
    const regex = /^[_0-9A-Z]*$/;
    const isMLSNameValid = regex.test(value);
    newState.tooltipOpen = !isMLSNameValid;
    if(isMLSNameValid) {
      newState[name] = value;
      newState.dataChange = true;
    }
    this.setState(newState);
  }

  getUpdatedMetadataFiles = () => {
    this.setState(() => ({
      downloadUpdatedClicked: true
    }));
    this.props.MlsConfigureAction.downloadUpdatedMetadata(this.state.source);
  }

  renderMLSLoginForm() {

    const {
      collapse,
      basicAuth,
      clientError,
      source,
      loginURL,
      username,
      password,
      userAgent,
      userAgentPassword,
      retsVersion,
      dataChange,
      isFirst,
      isAddUpdateSuccess,
      showFileDownload,
      listOfFiles,
      configButtonClicked,
      tooltipOpen,
      downloadUpdatedClicked,
      hideError
    } = this.state;

    const { location, MlsConfig, MlsConfigData, MlsDownloadUpdatedFiles } = this.props;
    const { isFail, error, status: statusCode, statusText } = MlsDownloadUpdatedFiles;
    const { error: addMlsError } = MlsConfig;
    let showError, success = true, operation = '', status = '';
    showError = downloadUpdatedClicked;
    if(!isFail) {
      const { payload } = MlsDownloadUpdatedFiles;
      if(payload) {
        success = payload.success;
        operation = payload.operation;
        status = payload.status;
      }
    }


    return (
      <Col xs="12">
      <h2 className="viewTitle">
        Configure MLS - Source: {source}
      </h2>
      <Row>
      <Col xs="6" md="6" lg="7">
        { addMlsError && configButtonClicked && (
          <div className="errorMessageText">
            <p>{addMlsError.errorMessage}</p>
          </div>
        )
        }
        <div className="homeScreen contentWrapper">
          {( _.size(MlsConfigData) > 0) && <ContextDataPanel location={location}></ContextDataPanel>}
          <Card>
            <CardHeader className="text-left">Fields marked with <span className="text-danger">*</span> are mandatory</CardHeader>
            <CardBody>
              {clientError && <Alert color="danger">
                Please fill valid MLS Name, Login URL, Username, Password.
            </Alert>
              }
              {configButtonClicked && isAddUpdateSuccess && <Alert color="success">
                You have succcessfully added data.
            </Alert>
              }
              <FormGroup>
                <Label for="mlsname">MLS Name <span className="text-danger">*</span></Label>
                <Input
                  id="source"
                  name="source"
                  onBlur={(event) => {
                    this.handleInputBlur(event);
                  }}
                  value={source}
                  onChange={this.validateMLSName}
                  invalid={(clientError && source === '')}
                />
                <Tooltip
                  placement="top"
                  isOpen={tooltipOpen}
                  target="source">
                    MLS Name should be uppercase and separated by &#95;. Space and special character like &#8208; are NOT allowed.
                </Tooltip>
              </FormGroup>
              <FormGroup>
                <Label for="url">Login URL <span className="text-danger">*</span></Label>
                <Input
                  id="url"
                  name="loginURL"
                  onBlur={(event) => {
                    this.handleInputBlur(event)
                  }}
                  onChange={(event) => {
                    this.handleInputChange(event)
                  }}
                  invalid={clientError && loginURL === ''}
                  value={loginURL}
                />
              </FormGroup>
              <Row>
                <Col xs="6">
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      onBlur={(event) => {
                        this.handleInputBlur(event)
                      }}
                      onChange={(event) => {
                        this.handleInputChange(event)
                      }}
                      invalid={clientError && username === ''}
                      value={username}
                    />
                  </FormGroup>
                </Col>
                <Col xs="6">
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      onBlur={(event) => {
                        this.handleInputBlur(event)
                      }}
                      onChange={(event) => {
                        this.handleInputChange(event)
                      }}
                      invalid={clientError && password === ''}
                      value={password}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Collapse isOpen={collapse}>
                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="useragent">User-Agent</Label>
                      <Input
                        id="useragent"
                        name="userAgent"
                        onBlur={(event) => {
                          this.handleInputBlur(event)
                        }}
                        onChange={(event) => {
                          this.handleInputChange(event)
                        }}
                        defaultValue={userAgent}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="useragent-password">User-Agent Password</Label>
                      <Input
                        type="password"
                        name="userAgentPassword"
                        id="useragent-password"
                        onBlur={(event) => {
                          this.handleInputBlur(event)
                        }}
                        onChange={(event) => {
                          this.handleInputChange(event)
                        }}
                        defaultValue={userAgentPassword}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="retsversion">RETS Version</Label>
                      <Input
                        type="text"
                        id="retsversion"
                        name="retsVersion"
                        onBlur={(event) => {
                          this.handleInputBlur(event)
                        }}
                        onChange={(event) => {
                          this.handleInputChange(event)
                        }}
                        defaultValue={retsVersion}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="6">
                    <FormGroup>
                      <Label for="exampleCheckbox">Force Basic Auth</Label>
                      <div>
                        <CustomInput
                          type="radio"
                          id="exampleCustomRadio"
                          name="forceAuth"
                          label="Yes"
                          inline
                          value="yes"
                          onChange={this.handleAuthChange}
                          checked={basicAuth === 'yes'}
                        />
                        <CustomInput
                          type="radio"
                          id="exampleCustomRadio2"
                          name="forceAuth"
                          label="No"
                          inline
                          value="no"
                          onChange={this.handleAuthChange}
                          checked={basicAuth === 'no'}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Collapse>
              <div className="text-center showMoreOptions">
                <Button
                  color="link" onClick={() => {
                  this.setState({
                    collapse: !collapse,
                  })
                }}>
                  <div>
                    <i className={collapse ? "fa fa-chevron-up zapIcon mainColor": "fa fa-chevron-down zapIcon mainColor"} aria-hidden="true"></i>
                  </div>
                  {collapse ? 'Hide' : 'Show'} Extra Options
                </Button>
              </div>
            </CardBody>
            <CardFooter className="text-right">
              <Button
                className="download-files zapButton"
                onClick={this.getUpdatedMetadataFiles}
              >
              Download Updated Metadata
              </Button>

              <Button disabled={!dataChange} onClick={this.handleLoginClick} className="zapButton">
                {isFirst? 'Add Configure MLS' : 'Update Configure MLS'}</Button>

              {isFirst && <Button tag={Link} color="link" className="download-files" to="/mlsSearch">Cancel</Button> }

            </CardFooter>
          </Card>
        </div>
      </Col>
      <Col xs="6" md="6" lg="5">
        {
          showFileDownload &&
          <DownloadFile
            fileList={listOfFiles}
            source={source}
            showError={!showError}
          />
        }
        { isFail ? (
            <div className="errorMessageText">
              <p>{ `Error ${statusCode}: ${statusText}` }</p>
              <p>{ error.message }</p>
            </div>
          ) : ((!success && downloadUpdatedClicked && !hideError) &&
            <div className="errorMessageText">
              <p>{ `Error ${statusCode}: ${operation}` }</p>
              <p>{ status }</p>
            </div>
          )
        }
      </Col>
      </Row>
      </Col>
    );
  }

  render() {
    return (
      <Col xs="6" md="10">
        <Row>
          {this.renderMLSLoginForm()}
        </Row>
      </Col>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
