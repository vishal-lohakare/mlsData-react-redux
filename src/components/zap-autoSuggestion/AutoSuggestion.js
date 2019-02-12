// @flow

import React, { Component } from 'react';
import {
  Row,
  Col,
  ListGroupItem,
  ListGroup,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import _ from 'lodash';
import './AutoSuggestion.scss';

type Props = {
  autoSuggestData: Array<Object>,
  autoSuggestKey: string,
  handleInputChange: Function,
  renderSuggestionItem: Function,
  onUpdateValueToField: Function,
  searchKeys: Array<string>,
  suggestionHeader: boolean,
  renderSuggestionHeader: Function,
  onFocus: Function,
  querySeparator?: string,
  expressionSeparator?: string,
  value: string
};

type State = {
  autoSuggestData: Array<Object>,
  selectedEntryList: Array<Object>,
  cursorPosition: number,
  showAutoSuggestionList: boolean,
  currentQueryIndex: number,
  searchQuery: string,
};

export default class AutoSuggestion extends Component<Props, State> {

  autoSuggestInputRef: HTMLInputElement;
  autoSuggestListRef: ?HTMLDivElement;
  selectedValueIds: Array<string>;
  parentIds: Array<mixed>;

  static defaultProps = {
    suggestionHeader: false,
    renderSuggestionHeader: () => {},
    renderSuggestionItem:  () => {},
    onFocus: () => {}
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      autoSuggestData: this.props.autoSuggestData,
      selectedEntryList: [],
      cursorPosition: 0,
      showAutoSuggestionList: false,
      currentQueryIndex: -1,
      searchQuery: '',
    }
    this.selectedValueIds = [''];
    this.parentIds = [''];
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escapeKeyPressed);
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeKeyPressed);
    document.removeEventListener('click', this.handleClickOutside);
  }

  componentDidUpdate(prevProps: Props){
    if(!_.isEqual(this.props.autoSuggestData, prevProps.autoSuggestData)) {
      this.setState({
        autoSuggestData: this.onSearch(this.state.searchQuery)
      });
    }
  }

  escapeKeyPressed = (event: Object) => {
    const key = event.keyCode || event.which;
    if(key === 27 && this.state.showAutoSuggestionList){
      this.setState({
        showAutoSuggestionList: false
      });
    }
  }

  handleClickOutside = (event: Object) => {
    if( this.state.showAutoSuggestionList &&
        this.autoSuggestInputRef && !this.autoSuggestInputRef.contains(event.target) &&
        this.autoSuggestListRef && !this.autoSuggestListRef.contains(event.target)
      ) {
      this.setState({
        showAutoSuggestionList: false
      });
    }
  }

  getExpressionSeparatorIndexes = (inputValue: string) => {
    const semiColonIndexes = [];
    _.map(inputValue, (char, charIndex) => {
      if(char === this.props.expressionSeparator) {
        semiColonIndexes.push(charIndex);
      }
    });
    return semiColonIndexes;
  }

  getCurrentQuery = (cursorPosition: number, inputValue: string) => {
    const { expressionSeparator } = this.props;
    if(_.isEmpty(expressionSeparator)){
      return({
        expression: "",
        startIndex: 0,
        endIndex: 0,
        expressionIndex: 0
      });
    }
    let semiColonIndexes = this.getExpressionSeparatorIndexes(inputValue);
    let expression = "", startIndex = 0, endIndex = 0, expressionIndex = 0;
    const splittedExpressions = inputValue.split(expressionSeparator),
          semiColonIndexesLength = semiColonIndexes.length,
          inputValueLength = inputValue.length,
          splittedExpressionsLength = splittedExpressions.length;
    if(semiColonIndexesLength > 0) {
      for(let i = 0; i < semiColonIndexesLength; i++){
        if(cursorPosition <= semiColonIndexes[i]) {
          expression = splittedExpressions[i];
          startIndex = (i == 0) ? 0 : semiColonIndexes[i-1] + 1;
          endIndex = (i == semiColonIndexesLength - 1) ? inputValueLength - 1 : semiColonIndexes[i] - 1;
          expressionIndex = i;
          break;
        }
        else {
          expression = splittedExpressions[splittedExpressionsLength - 1];
          startIndex =  semiColonIndexes[i] + 1;
          endIndex = (i == semiColonIndexesLength -1) ? inputValueLength - 1 : semiColonIndexes[i] - 1;
          expressionIndex = splittedExpressionsLength - 1;
        }
      }
    } else {
      expression = inputValue;
      endIndex = inputValue.length;
    }
    return({
      expression,
      startIndex,
      endIndex,
      expressionIndex
    });
  }

  getSelectedEntryList = (inputValue: string, cursorPosition: number) => {
    const entryList = [];
    const { querySeparator, expressionSeparator } = this.props;
    if(cursorPosition !== -1) {
      inputValue = inputValue.substring(0, cursorPosition);
    }
    const splittedExpressions = inputValue.split(expressionSeparator);
    splittedExpressions.map((expression, index) => {
      const entryListData = {
        selectedText: '',
        selectedKey: '',
        selectedValue: '',
        selectedValueId: this.selectedValueIds[index],
        parentId: this.parentIds[index],
      };
      if(expression && querySeparator !== undefined) {
        if(expression.indexOf(querySeparator) > -1) {
          const splittedExpression = expression.split(querySeparator);
          entryListData.selectedKey = splittedExpression[0];
          entryListData.selectedValue = splittedExpression[1];
        } else {
          entryListData.selectedText = expression;
        }
        entryList.push(entryListData);
      }
    });
    return entryList;
  }

  handleInputChange = (event: Object) => {
    const newState = _.cloneDeep(this.state);
    const { handleInputChange, onUpdateValueToField, querySeparator } = this.props;
    const { currentQueryIndex, selectedEntryList } = this.state;
    const { value, selectionStart } = event.target;
    const { expression: currentQuery, endIndex, startIndex } = this.getCurrentQuery(selectionStart, value);
    const selectedEntry = {
      selectedText: '',
      selectedKey: '',
      selectedValue: '',
      selectedValueId: '',
      parentId: '',
    };
    let searchQuery = "";
    newState.cursorPosition = selectionStart;
    newState.selectedEntryList = this.getSelectedEntryList(value, selectionStart);
    if(value.length == 0) {
      newState.selectedEntryList = [selectedEntry];
      _.isFunction(onUpdateValueToField) && onUpdateValueToField(newState.selectedEntryList, true, true, value);
    } else if(querySeparator !== undefined && currentQuery.indexOf(querySeparator) !== -1) {
        if(selectionStart <= (startIndex + currentQuery.indexOf(querySeparator))) {
          newState.selectedEntryList.pop();
          if(newState.selectedEntryList.length == 0) {
            newState.selectedEntryList = [selectedEntry];
          }
          if(currentQueryIndex !== startIndex) {
            _.isFunction(onUpdateValueToField) && onUpdateValueToField(newState.selectedEntryList, true, false, value);
          }
          searchQuery = currentQuery.split(querySeparator)[0];
        } else {
          const leftQuery = currentQuery.split(querySeparator)[0];
          const rightQuery = currentQuery.split(querySeparator)[1];
          _.isFunction(handleInputChange) && handleInputChange(leftQuery, rightQuery, selectedEntryList, value);
          searchQuery = rightQuery;
          if(currentQueryIndex !== startIndex) {
            _.isFunction(onUpdateValueToField) && onUpdateValueToField(newState.selectedEntryList, false, true, value);
          }
        }
    } else {
      _.isFunction(handleInputChange) && handleInputChange("", "", newState.selectedEntryList, value);
      if(currentQueryIndex !== startIndex || (selectionStart === value.length && currentQueryIndex !== startIndex)){
        _.isFunction(onUpdateValueToField) && onUpdateValueToField(newState.selectedEntryList, true, false, value);
      }
      searchQuery = currentQuery;
    }
    newState.searchQuery = searchQuery;
    newState.currentQueryIndex = startIndex;
    newState.showAutoSuggestionList = true;
    newState.autoSuggestData = this.onSearch(searchQuery);
    this.setState(newState);
  }

  handleInputKeyup = (event: Object) => {
    const key = event.keyCode || event.which;
    switch(key) {
      case 32:
        if(event.ctrlKey) {
          this.setState({
            showAutoSuggestionList: true
          });
        }
        break;

      case 40:
        const { autoSuggestData, showAutoSuggestionList } = this.state;
        if(autoSuggestData.length > 0 && showAutoSuggestionList) {
          const autoSuggestListItem = document.getElementsByClassName('autoSuggestListItem');
          const firstEleIndex = this.props.suggestionHeader ? 1 : 0;
          autoSuggestListItem[firstEleIndex].tabIndex = -1;
          autoSuggestListItem[firstEleIndex].focus();
        }
        break;
    }
  }

  handleInputKeyPress = (event: Object) => {
    const key = event.keyCode || event.which;
    const charCode = String.fromCharCode(key);
    if(charCode === this.props.expressionSeparator){
      this.updateContextVariableValue();
    }
  }

  handleKeyDownListItem = (event: Object, index: number) => {
    const key = event.keyCode || event.which;
    event.preventDefault();
    const { suggestionHeader } = this.props;
    switch(key) {
      case 40:
        const { nextSibling, parentNode: { firstChild } } = event.target;
        const firstChildElement = suggestionHeader ? firstChild.nextSibling : firstChild;
        if(nextSibling) {
          nextSibling.tabIndex = -1;
          nextSibling.focus();
        } else {
          firstChildElement.tabIndex = -1;
          firstChildElement.focus();
        }
        break;

    case 38:
      const { parentNode: { firstChild: firstChildEle, lastChild }, previousSibling } = event.target;
      const prevSibling = suggestionHeader && firstChildEle.nextSibling === event.target ? false : previousSibling;
      if(prevSibling) {
        prevSibling.tabIndex = -1;
        prevSibling.focus();
      } else {
        lastChild.tabIndex = -1;
        lastChild.focus();
      }
      break;

    case 13:
      this.onSelectValue(this.state.autoSuggestData[index]);
      break;
    }
  }

  handleInputFocus = () => {
    this.props.onFocus();
  }

  createSearchExpression = (searchQuery: string, searchKeys: Array<string>) => {
    let exp = '';
    searchKeys.map((key, index) => {
      index === searchKeys.length - 1 ? exp += `item.${key}` : exp += `item.${key}+`;
    });
    return exp;
  }

  onSearch = (searchQuery: string) => {
    const { autoSuggestData, searchKeys } = this.props;
    if(autoSuggestData.length > 0) {
      const searchExpression = this.createSearchExpression(searchQuery, searchKeys);
      return autoSuggestData.filter((item) => {
        return eval(searchExpression).toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
      });
    } else {
      return [];
    }
  }

  onSelectValue = (item: Object) => {
    const newState = _.cloneDeep(this.state);
    const { cursorPosition } = this.state;
    const { autoSuggestKey, onUpdateValueToField, querySeparator, expressionSeparator, value: textValue } = this.props;
    const { expression, startIndex, endIndex, expressionIndex } = this.getCurrentQuery(cursorPosition, textValue);
    let finalExpression = "", toValueUpdate = false, finalValue = "";
    let splitExpression = textValue.split("");
    if(querySeparator === undefined || expressionSeparator === undefined){
      splitExpression.splice(cursorPosition, 0, item[autoSuggestKey]);
      finalValue = splitExpression.join("");
      _.isFunction(onUpdateValueToField) && onUpdateValueToField([], false, false, finalValue);
    } else {
      if(expression.indexOf(querySeparator) !== -1) {
        if(cursorPosition <= (startIndex + expression.indexOf(querySeparator))) {
          finalExpression = `${item[autoSuggestKey]}${querySeparator}${expression.split(querySeparator)[1]}`;
          this.parentIds[expressionIndex] = item.id ? item.id : '';
        } else {
          finalExpression = `${expression.split(querySeparator)[0]}${querySeparator}${item[autoSuggestKey]}`;
          newState.selectedValueId = item.id ? item.id : '';
          toValueUpdate = true;
          this.selectedValueIds[expressionIndex] = item.id ? item.id : '';
        }
      } else {
        finalExpression = item[autoSuggestKey];
        newState.parentId = item.id ? item.id : -1;
        this.parentIds[expressionIndex] = item.id ? item.id : '';
      }
      //splitExpression.splice(startIndex, endIndex - startIndex + 1, finalExpression);
      splitExpression.splice(startIndex, textValue.length, finalExpression);
      finalValue = splitExpression.length > 0 ? splitExpression.join("") : finalExpression;
      newState.selectedEntryList = this.getSelectedEntryList(finalValue, -1);
      _.isFunction(onUpdateValueToField) && onUpdateValueToField(newState.selectedEntryList, false, toValueUpdate, finalValue);
    }
    newState.showAutoSuggestionList = false;
    this.setState(newState);
    !_.isEmpty(this.autoSuggestInputRef) && this.autoSuggestInputRef.focus();
  }

  updateContextVariableValue = () => {
    const { onUpdateValueToField, value } = this.props;
    _.isFunction(onUpdateValueToField) && onUpdateValueToField(this.state.selectedEntryList, true, true, value);
    this.setState({
      showAutoSuggestionList: false
    });
  }

  render() {
    const {
      autoSuggestData,
      showAutoSuggestionList
    } = this.state;
    const { suggestionHeader, renderSuggestionHeader, renderSuggestionItem, value } = this.props;
    return (
      <div>
        <Row>
          <Col xs="12">
            <FormGroup className="autoSuggestInput">
              <Input
                onChange={this.handleInputChange}
                onKeyUp={this.handleInputKeyup}
                onKeyPress={this.handleInputKeyPress}
                onFocus={this.handleInputFocus}
                value={value}
                id="autoComplete"
                innerRef={(ref) => this.autoSuggestInputRef = ref }
                autoComplete="off"
              />
            </FormGroup>
            { showAutoSuggestionList &&
              <div ref={(ref) => this.autoSuggestListRef = ref}>
                <ListGroup flush role="list" className="autoSuggestList">
                  {
                    suggestionHeader && !_.isEmpty(autoSuggestData)  &&
                    <ListGroupItem className='autoSuggestListItem'>
                      {
                        _.isFunction(renderSuggestionHeader) && renderSuggestionHeader(autoSuggestData[0])
                      }
                    </ListGroupItem>
                  }
                  {
                    _.map(autoSuggestData, (item, index) => {
                      return <ListGroupItem
                          key={index}
                          onClick={() => {
                              this.onSelectValue(item)
                          }}
                          onKeyDown={(event) => this.handleKeyDownListItem(event, index)}
                          className='autoSuggestListItem'
                        >
                        {
                          renderSuggestionItem(item)
                        }
                        </ListGroupItem>
                    })
                  }
                </ListGroup>
              </div>
            }
          </Col>
        </Row>
      </div>
    );
  }
}
