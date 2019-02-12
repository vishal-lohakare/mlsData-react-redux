// @flow

import React, { Component, Fragment } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  FormGroup,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  CardFooter,
  Alert,
  Label
} from 'reactstrap';
import _ from 'lodash';
import classnames  from 'classnames';
import { connect } from 'react-redux';

import { HeaderConfigListItem } from './HeaderConfigListItem';
import './UrlBuilderScreen.scss';

const mapStateToProps = state => {
  return {
    MlsContextVariables: _.get(state.MlsContextVariablesData, 'MlsContextVariables', {}),
    MlsContextVariablesData: _.get(state.MlsContextVariablesData, 'MlsContextVariables.payload', []),
  }
}

type Props = {
  itemData: {
    isUpdated: boolean,
    updatedEntry: boolean,
    newEntry: boolean,
    urlname: string,
    urlvalue: string,
    bodyText: string,
    isNewUrl: boolean,
    UrlDetails: Object,
    HeaderDetails: Object
  },
  handleUrlSave: Function,
  handleHeaderSave: Function,
  handleUrlBlur: Function,
  addNewHeaderEntry: Function,
  isCardUpdated: Function,
  origionalData: Object,
  cardIndex: number,
  updateUrl: Function,
  onAddNewContextVariable: Function,
  autoSuggestData: Array<Object>,
  handleDelete: Function,
  MlsDowloadTypesListData: Array<Object>,
  MlsContextVariables: {
    isResponseSuccess: boolean
  },
  MlsContextVariablesData: Array<Object>,
  toogleContextVariableModal: Function,
  previewRawData: Function,
  placeholderValues: Array<string>,
  urlTemplates: Array<Object>,
  scheduleEventClick: Function,
};

type State = {
  contextVariables: Array<Object>,
  showOptions: boolean,
  lastSelectionStart: number,
  activeTab: string,
  urlname: string,
  urlvalue: string,
  bodyTextValue: string,
  clientError: boolean,
  updatedFlags: {
    urlname: boolean,
    urlvalue: boolean,
    headerValue: boolean,
  },
  downloadType: string,
  isCardOpen: boolean,
  undefinedContextVariablesInUrl: Array<string>,
  selectedVariableToAdd: string
};

class UrlBuilderCardItem extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { itemData: {UrlDetails}, MlsContextVariablesData } = this.props;
    const { urlname = '', urlvalue = '', downloadType = 'Select Download Type', bodyTextValue = '' } = UrlDetails;
    this.state = {
      contextVariables: MlsContextVariablesData || [],
      undefinedContextVariablesInUrl: [],
      showOptions: false,
      lastSelectionStart: 0,
      activeTab: '1',
      urlname: urlname,
      urlvalue: urlvalue,
      bodyTextValue: bodyTextValue,
      clientError: false,
      updatedFlags: {
        urlname: false,
        urlvalue: false,
        headerValue: false,
        bodyTextValue:  false
      },
      isCardOpen: false,
      downloadType: downloadType,
      selectedVariableToAdd: ''
    };

    (this:any).toggle = this.toggle.bind(this);
    (this:any)._handleInputChange = this._handleInputChange.bind(this);
    (this:any)._handleUrlSave = this._handleUrlSave.bind(this);
    (this:any)._handleUrlBlur = this._handleUrlBlur.bind(this);
    (this:any)._handleUrlDelete = this._handleUrlDelete.bind(this);
    (this:any)._handleBodyClear = this._handleBodyClear.bind(this);
    (this:any)._handleCardClick = this._handleCardClick.bind(this);
  }

  componentDidUpdate(prevProps: Props) {
    const newState = _.cloneDeep(this.state);
    const { itemData: {UrlDetails}, MlsContextVariablesData, MlsContextVariables } = this.props;

    if(UrlDetails.urlvalue !== prevProps.itemData.UrlDetails.urlvalue || UrlDetails.urlname !== prevProps.itemData.UrlDetails.urlname) {
      newState.urlname = UrlDetails.urlname,
      newState.urlvalue = UrlDetails.urlvalue,
      newState.bodyTextValue = UrlDetails.bodyTextValue,
      this.setState({...newState})
    }
    if(prevProps.MlsContextVariables.isResponseSuccess !== MlsContextVariables.isResponseSuccess && MlsContextVariables.isResponseSuccess) {
      newState.contextVariables = MlsContextVariablesData;
      this.setState({...newState});
      this.updateVariablesList();
    }
  }

  _handleCardClick(event: Object){
    event.preventDefault();
    const { isCardOpen } = this.state;
    this.setState({
      isCardOpen: !isCardOpen
    });
  }

  _handleUrlDelete() {
    const { handleDelete, itemData, cardIndex} = this.props;
    handleDelete(_.isUndefined(itemData.UrlDetails.id) ? "NA" : itemData.UrlDetails.id, cardIndex, "MLS URL");
  }

  toggle(tab: string) {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

  _handlePreviewRawData = () => {
    const { previewRawData, cardIndex } = this.props;
    const { urlvalue } = this.state;
    previewRawData(cardIndex, urlvalue);
  }

  _handleUrlSave() {
    const { urlname, urlvalue } = this.state;
    if(this.validateCardDetails()) {
      this.props.handleUrlSave(
        {
          urlname: urlname,
          urlvalue: urlvalue
        },
        this.props.cardIndex
      );
    } else {
      const newState = _.cloneDeep(this.state);
      newState.clientError = true;
      this.setState({...newState});
    }
  }

  _handleBodyClear() {
    const { cardIndex, handleUrlBlur } = this.props;
    const newState = _.cloneDeep(this.state);
    newState.bodyTextValue = "";
    newState.clientError = !this.validateCardDetails();
    newState.updatedFlags['bodyTextValue'] = true;
    this.setState({...newState});
    handleUrlBlur({fieldName: "bodyTextValue", fieldValue: ""}, cardIndex, true)
  }

  updateUrl = (urlValue: string) => {
    const newState = _.cloneDeep(this.state);
    const { origionalData, cardIndex, updateUrl } = this.props;
    newState.urlvalue = urlValue;
    let isDataupdated = true;
    if(origionalData.UrlDetails.urlvalue === newState.urlvalue ) {
      isDataupdated = false;
    }
    newState.updatedFlags.urlvalue = isDataupdated;
    updateUrl(
      newState.urlvalue,
      cardIndex,
      (newState.updatedFlags.urlname || newState.updatedFlags.urlvalue || newState.updatedFlags.bodyTextValue)
    );
    this.setState({...newState});
  }

  validateCardDetails() {
    const { urlname, urlvalue, downloadType } = this.state;
    if(urlname === '' || urlvalue === '' || downloadType === 'Select Download Type') {
      return false;
    }
    return true;
  }

  _handleInputChange(event: Object) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const newState = _.cloneDeep(this.state);
    const { isCardUpdated, origionalData, cardIndex } = this.props;
    let isDataupdated = true;
    if(origionalData.UrlDetails[fieldName] === fieldValue ) {
      isDataupdated = false;
    }

    newState.updatedFlags[fieldName] = isDataupdated;
    isCardUpdated((newState.updatedFlags.urlname || newState.updatedFlags.urlvalue || newState.updatedFlags.bodyTextValue), cardIndex);
    newState[fieldName] = fieldValue;
    this.setState({...newState});
  }

  handleInputUrlValueChange = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const urlValue = event.target.value.trim();
    const { MlsContextVariablesData } = this.props;
    newState.showOptions = true;
    const checkedString = urlValue.substring(0, event.target.selectionStart);
    const stringToTryingSuggest = checkedString.substring(0, event.target.selectionStart);
    const specialVariablesInUrl = stringToTryingSuggest.match(/([+-,[{\]%/!*><^|~])/g) || [];
    const startAtNewSuggestion = stringToTryingSuggest.lastIndexOf(specialVariablesInUrl[specialVariablesInUrl.length - 1]);
    const searchIntoContextVariables = stringToTryingSuggest.substring(startAtNewSuggestion + 1, event.target.selectionStart);
    newState.contextVariables = _.filter(MlsContextVariablesData, (cvb) => {
      return cvb.key.includes(searchIntoContextVariables);
    });
    newState.undefinedContextVariablesInUrl = this.checkUndefinedVariablesInUrl(urlValue);
    newState.urlvalue = urlValue;
    newState.lastSelectionStart = event.target.selectionStart;
    this.setState(newState, () => this.updateUrl(urlValue));
  }

  updateVariablesList = () => {
    const { selectedVariableToAdd, undefinedContextVariablesInUrl } = this.state;
    if(selectedVariableToAdd) {
      this.setState({
        undefinedContextVariablesInUrl: undefinedContextVariablesInUrl.filter(item => item !== selectedVariableToAdd)
      });
    }
  };

  checkUndefinedVariablesInUrl(textValue: string) {
    const { MlsContextVariablesData, placeholderValues } = this.props;
    let undefinedContextVariablesInUrl = [];
    if(textValue !== '') {
      const variablesInUrl = textValue.match(/{[A-z0-9]*}/g);
      _.forEach(variablesInUrl, viu => {
        let definedVariableInUrl = viu.replace(/{|}/g,'');
        if (definedVariableInUrl &&
            _.isUndefined(_.find(MlsContextVariablesData, cvb => cvb.key === definedVariableInUrl)) &&
            _.isUndefined(_.find(placeholderValues, phv => phv === definedVariableInUrl))) {
          undefinedContextVariablesInUrl.push(definedVariableInUrl);
        }
      });
    }
    return  undefinedContextVariablesInUrl;
  }

  handleOnBlur = (event: Object) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const newState = _.cloneDeep(this.state);
    const { handleUrlBlur, cardIndex } = this.props;
    newState.undefinedContextVariablesInUrl = this.checkUndefinedVariablesInUrl(fieldValue);
    newState.showOptions = false;
    this.setState(newState);
    handleUrlBlur({fieldName: fieldName, fieldValue: fieldValue}, cardIndex)
  }

  addToUrlBuilder = (item: Object, type: string) => {
    const startCharacters = ['[','{'];
    const endCharacters = [']','}'];
    const newState = _.cloneDeep(this.state);
    const urlvalueInput = document.getElementById("urlvalue"+this.props.cardIndex);

    const lastSelectionStart = newState.lastSelectionStart;
    let leftValue, listItemClicked = false;
    if (!_.isEmpty(urlvalueInput) && urlvalueInput instanceof HTMLInputElement) {
      let stringToTryingSuggest = urlvalueInput.value.substring(0, urlvalueInput.selectionStart);
      if (stringToTryingSuggest === urlvalueInput.value && type === 'onEnter') {
        stringToTryingSuggest = urlvalueInput.value.substring(0, lastSelectionStart);
        leftValue = stringToTryingSuggest.substring(0, lastSelectionStart + 1);
      } else {
        listItemClicked = true;
        leftValue = stringToTryingSuggest.substring(0, lastSelectionStart);
      }
      const rightValue = urlvalueInput.value.substring(lastSelectionStart);
      const pattern = stringToTryingSuggest.match(/([+-,[{\]%/!*><^|~])/g) || [];
      const lastCharacter = pattern[pattern.length - 1];
      const lastIndex = leftValue.lastIndexOf(lastCharacter);
      const stringToReplace = leftValue.substring(lastIndex+ 1);
      if(stringToReplace && !listItemClicked) {
        leftValue = leftValue.substring(0, lastIndex + 1);
      }
      const replaceValue = item.key;
      let endCharacter = '';
      startCharacters.some((item, index) => {
        if(item === lastCharacter && rightValue === '') {
          endCharacter = endCharacters[index];
        }
      });
      newState.urlvalue = `${leftValue.concat(replaceValue, rightValue)}${endCharacter}`;
      newState.showOptions = false;

      this.setState(newState, () => {
        if(rightValue.trim() === '') {
          urlvalueInput.scrollLeft = urlvalueInput.scrollWidth;
        }
        urlvalueInput.selectionStart = lastSelectionStart;
        urlvalueInput.focus();
        urlvalueInput.setSelectionRange(lastSelectionStart, lastSelectionStart);
      });
    }
  }

  handleKeyUpContainer = (event: Object) => {
    const suggestListContainer = document.getElementById('suggestListContainer-'+this.props.cardIndex);
    const urlvalueInput = document.getElementById('urlvalue'+this.props.cardIndex);
    if (
      !_.isEmpty(suggestListContainer) &&
      suggestListContainer instanceof HTMLElement &&
      !_.isEmpty(urlvalueInput) &&
      urlvalueInput instanceof HTMLInputElement
      ) {
      const firstChildElement = suggestListContainer.firstChild;
      const lastChildElement = suggestListContainer.lastChild;
      let showOptions = true;

      switch (event.keyCode) {
        case 40: // arrow down
          event.preventDefault();
          if (!_.isEmpty(firstChildElement) &&
            firstChildElement instanceof HTMLElement) {
            firstChildElement.focus();
          }
          break;
        case 38: //arrow up
          event.preventDefault();
          if (!_.isEmpty(lastChildElement) &&
            lastChildElement instanceof HTMLElement) {
            lastChildElement.focus();
          }
          break;
        case 27: //escape key
          showOptions = false;
          urlvalueInput.focus();
          break;
        default:
          break;
      }
      if(
        event.keyCode === 40||
        event.keyCode === 38||
        event.keyCode === 27 ||
        (event.keyCode <= 90 && event.keyCode >= 65)
        ) {
        this.setState({ showOptions });
        return;
      }
    }
  }

  handleKeyDownOption = (item: Object, event: Object) => {
    const newState = _.cloneDeep(this.state);
    let { showOptions } = newState;
    const target = event.target;
    switch (event.keyCode) {
      case 40: // arrow down
        event.preventDefault();
        if(target.nextSibling) {
          target.nextSibling.focus();
        } else {
          target.parentNode.firstChild.focus();
        }
        break;
      case 38: //arrow up
        event.preventDefault();
        if (target.previousSibling) {
          target.previousSibling.focus();
        } else {
          target.parentNode.lastChild.focus();
        }
        break;
      case 27: // escape keyp
        event.preventDefault();
        showOptions = false;
        break;
      case 13: // enter key select option
        event.preventDefault();
        this.addToUrlBuilder(item, 'onEnter')
        break;
      default:
        return;
    }

    if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 27) {
      this.setState(() => ({
        ...newState,
        showOptions
      }));
      return;
    }
  }

  _scheduleEventClick = () => {
    const { scheduleEventClick, cardIndex } = this.props;
    scheduleEventClick(cardIndex);
  }

  onSelectDownloadType = (event: Object) => {
    const { name, value } = event.target;
    const { urlvalue: url } = this.state;
    let templateURL = url;
    let undefinedContextVariablesInUrl;
    const { origionalData: { UrlDetails: { downloadType, id, urlvalue } }, cardIndex, urlTemplates } = this.props;
    this.props.handleUrlBlur({ fieldName: name, fieldValue: value }, cardIndex, true);
    if(value !== "Select Download Type") {
      templateURL = _.find(urlTemplates, (item) => {
        return item.downloadType.toLowerCase() === value.toLowerCase()
      }).urlTemplate;
    }
    if(id && downloadType.toLowerCase() === value.toLowerCase()){
      templateURL = urlvalue;
    }
    undefinedContextVariablesInUrl = this.checkUndefinedVariablesInUrl(templateURL);
    this.setState({
      downloadType: value,
      urlvalue: templateURL,
      undefinedContextVariablesInUrl
    }, () => {
      this.updateUrl(templateURL);
    });
  };

  onAddNewVariableClick = (name: string) => {
    this.setState({ selectedVariableToAdd: name });
    this.props.toogleContextVariableModal(name);
  }

  _handleUrlBlur(event: Object) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const { handleUrlBlur, cardIndex } = this.props;
    const newState = _.cloneDeep(this.state);
    this.setState({...newState});
    handleUrlBlur({fieldName: fieldName, fieldValue: fieldValue}, cardIndex)
  }

  _renderSuggestionItem(item: Object){
    return (
      <Fragment>
        <a href="javascript: void(0);">{`${item.key} = ${item.value}`}</a>
      </Fragment>
    );
  }

  renderHeaderConfig() {
    const { itemData, cardIndex, handleHeaderSave, handleDelete, addNewHeaderEntry } = this.props;
    const { activeTab, bodyTextValue } = this.state;
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Header
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Body
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Card className="custom-card">
                  <CardBody>
                    { !_.isUndefined(this.props.origionalData) &&
                      itemData.HeaderDetails.length > 0 && _.map(itemData.HeaderDetails, (item, index) => {
                        return <HeaderConfigListItem
                                  headerData={item}
                                  key={index}
                                  index={index}
                                  cardIndex={cardIndex}
                                  handleHeaderSave={handleHeaderSave}
                                  handleDelete={handleDelete}
                                  origionalData={this.props.origionalData.HeaderDetails[index]}
                                />
                      })
                    }
                    <div>
                      <Button
                        className="zapButton"
                        onClick={() => {
                          addNewHeaderEntry(cardIndex);
                        }}
                      >Add</Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <Card className="custom-card">
                <Button className="text-right" color="link" onClick={this._handleBodyClear}>Clear</Button>
                <CardBody>
                  <FormGroup>
                    <Input
                      type="textarea"
                      name="bodyTextValue"
                      style={{minHeight: 150}}
                      value={bodyTextValue}
                      onChange={this._handleInputChange}
                      onBlur={this._handleUrlBlur}
                    />
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          </TabPane>
        </TabContent>
      </div>
    )
  }

  render() {
    const { urlname,
            showOptions,
            urlvalue,
            clientError,
            downloadType,
            isCardOpen,
            contextVariables,
            undefinedContextVariablesInUrl
          } = this.state;
    const { itemData, cardIndex, MlsDowloadTypesListData } = this.props;
    const buttonText = itemData.isNewUrl ? 'Save' : 'Update';
    return (

      <Card className="urlBuilderCard">
        <CardHeader>
          <Row className="align-items-center">
            <Col xs="6" md="10">
              <div className="p-3 expandCollapseWrapper" onClick={this._handleCardClick}>
                <i className={`expandCollapse ${(isCardOpen ? 'fa fa-angle-up' : 'fa fa-angle-down')}`} ></i>
              </div>
            </Col>
            <Col xs="6" md="2" className="iconWrapper">
              <i color="primary" className={`fa fa-calendar ${itemData.UrlDetails.id ? '' : 'disabled'}`} title="getSchedulerEvents" onClick={this._scheduleEventClick}></i>
              <i color="primary" className={`fa fa-eye ${itemData.UrlDetails.id ? '' : 'disabled'}`} title="Preview" onClick={this._handlePreviewRawData}></i>
              <i color="primary" className="fa fa-trash" onClick={this._handleUrlDelete}></i>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          {isCardOpen && <div>
            {
               itemData.updatedEntry && <Alert color="success">
                You have successfully updated url data.
              </Alert>
            }
            {
               itemData.newEntry && <Alert color="success">
                You have successfully saved url data.
              </Alert>
            }
            {
               clientError && <Alert color="danger">
                Please enter below details.
              </Alert>
            }
          </div>}

          <FormGroup>
            <Label for={"urlname"+cardIndex}>URL Name</Label>
            <Input
              id={"urlname"+cardIndex}
              name="urlname"
              placeholder="URL Name"
              onChange={this._handleInputChange}
              value={urlname}
              onBlur={this._handleUrlBlur}
              invalid={clientError && urlname === ''}
            />
          </FormGroup>
          {isCardOpen && <div>
          <FormGroup>
            <Label>Resource / Entity</Label>
            <Input
              className="form-control functionSelect"
              type="select"
              name="downloadType"
              onChange={this.onSelectDownloadType}
              value={downloadType}
              invalid={clientError && downloadType === 'Select Download Type'}
              >
              <option value='Select Download Type' key='0'>Select Download Type</option>
              {
                _.map(MlsDowloadTypesListData, (dt, index) => {
                  return <option value={dt.key} key={index}>{dt.value}</option>
                })
              }
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="urlname">URL</Label>
            <Input
              type="text"
              id={"urlvalue"+cardIndex}
              name="urlvalue"
              placeholder="URL"
              value={urlvalue}
              className="inputurlValue"
              onKeyUp={this.handleKeyUpContainer}
              onChange={this.handleInputUrlValueChange}
              onBlur={this.handleOnBlur}
              invalid={isCardOpen && clientError && urlvalue === ''}
            />
          </FormGroup>
          <div className="position-relative">
              { !_.isEmpty(contextVariables) && (
                  <ul
                    role="listbox"
                    id={'suggestListContainer-'+cardIndex}
                    className={classnames('suggestContainer', {'d-block': showOptions})}>
                    {
                      _.map(contextVariables, (cv, index) =>
                        <li
                          key={index}
                          tabIndex="-1"
                          onClick={() => this.addToUrlBuilder(cv, 'onClick')}
                          onKeyDown={(event) => this.handleKeyDownOption(cv, event)}
                          >
                          <span>{cv.key}</span> {'->'}
                          <span>{cv.value}</span>
                        </li>
                      )
                    }
                  </ul>
                )
              }
              {(_.size(undefinedContextVariablesInUrl) != 0) && <span>Undefined context variables: </span>}
              {
                _.map(undefinedContextVariablesInUrl, (uv, index) =>
                  <div key={index} className="undefinedVariablesContainer">
                    <span>{uv}</span>
                    <Button
                      outline color="primary"
                      onClick={() => this.onAddNewVariableClick(uv) }
                    >Add new</Button>
                  </div>
                  )
              }
          </div>
          {this.renderHeaderConfig()}
          </div>}
        </CardBody>

        {
          isCardOpen && <CardFooter className="text-right">
          <Button
            className="zapButton"
            onClick={this._handleUrlSave}
            disabled={!itemData.isUpdated}>{buttonText}</Button>
          </CardFooter>
        }
      </Card>
    );
  }
}

export default connect(mapStateToProps, null)(UrlBuilderCardItem);
