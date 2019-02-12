// @flow

import React, { Component } from 'react';
import {
  FormGroup,
  Input
} from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import classnames  from 'classnames';
import { bindActionCreators } from 'redux';

import './AutoComplete.scss';

import * as MlsCanonicalActions from 'actions/MlsCanonicalMappingAction';


const mapDispatchToProps = (dispatch) => ({
  MlsCanonicalActions: bindActionCreators(MlsCanonicalActions, dispatch),
});

const mapStateToProps = state => {
  return {
    MlsGetAutoCompleteOptionsData: _.get(state.MLSCanonicalData, 'MlsAutoCompleteOptions', {}),
  }
}

type Props = {
  MlsCanonicalActions: typeof MlsCanonicalActions,
  MlsGetAutoCompleteOptionsData: Object,
  onChange: Function,
  value: string,
  udfs: Array<Object>,
  selectedFields: Array<Object>,
};

type State = {
  tempItem: Object,
  showAutoCompleteOptionInfo: boolean,
  showAutoCompleteContainer: boolean,
  autoCompleteSuggestions: Array<Object>,
  filteredSuggestions: Array<Object>,
  cursorPosition: number,
};

export class AutoComplete extends Component<Props, State> {

  autocompleteInput: ?HTMLInputElement;
  autocompleteInnerInput: ?HTMLInputElement;

  constructor(props: Props) {
    super(props);
    const autoCompleteSuggestions = this.getAutoCompleteSuggestions();
    this.state = {
      tempItem: {},
      showAutoCompleteOptionInfo: false,
      showAutoCompleteContainer: false,
      autoCompleteSuggestions: autoCompleteSuggestions,
      filteredSuggestions: autoCompleteSuggestions,
      cursorPosition: 0,
    }
  }

  getAutoCompleteSuggestions = () => {
    /*
      As part of approach to be implemented to suggest variables should be have
      the same information like functions as following show:
      {
        doc: "Computes the absolute value."
        name: "abs"
        origin: "apache-spark-functions"
        type: "fn(e: Column) -> Column"
      }

      ActualData
      {
        active: true
        id: "yqbLF6gYIcBsCl1DvOCv"
        longName: "Office Phone"
        lookupName: "null"
        relevance: "NaN"
        shortName: "OfficePhone"
        standardName: "OfficePhone"
        tableSystemName: "MEMBER_5"
      }
     */
    let autoCompleteSuggestions = [];
    const { selectedFields, udfs, MlsGetAutoCompleteOptionsData: { payload: functions = [] } } = this.props;
    _.map(selectedFields, item => {
      autoCompleteSuggestions.push({
        doc: `variables ${item.longName} from fields\n${item.lookupName || ''} ${item.standardName || ''}`,
        name: `${item.tableSystemName}`,
        origin: 'Current Mapped Fields',
        type: 'Mapped Fields',
        originalItem: item,
        suggestionType: 'variable'
      });
    });
    _.map(udfs, item => {
      const enumValue = item.enumValue.toLowerCase();
      if(enumValue !== 'custom' && enumValue !== 'default'){
        autoCompleteSuggestions.push({
          name: item.enumValue,
          originalItem: item,
          suggestionType: 'udf'
        });
      }
    });
    autoCompleteSuggestions = [...autoCompleteSuggestions, ...functions];
    return autoCompleteSuggestions;
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutsideAutoComplete);
    this.props.MlsCanonicalActions.getAutoCompleteOptions('');
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutsideAutoComplete);
  }

  componentDidUpdate(prevProps: Props) {
    if(!_.isEqual(this.props.selectedFields, prevProps.selectedFields) || !_.isEqual(this.props.udfs, prevProps.udfs)){
      const suggestions = this.getAutoCompleteSuggestions();
      this.setState({
        autoCompleteSuggestions: suggestions,
        filteredSuggestions: suggestions
      });
    }
  }

  onClickOutsideAutoComplete = (event: Object) => {
    if(this.state.showAutoCompleteContainer && this.autocompleteInnerInput && !this.autocompleteInnerInput.contains(event.target)) {
      this.setState({
        showAutoCompleteContainer: false,
        showAutoCompleteOptionInfo: false,
      });
    }
  }

  handleInputChange = (event: Object) => {
    const { value, selectionStart } = event.target;
    const { onChange } = this.props;
    const checkedString = value.substring(0, selectionStart);
    const stringToTryingSuggest = checkedString.substring(0, selectionStart);
    const special = stringToTryingSuggest.match(/([+-,()%$&/=!*><^|~])/g) || [];
    const startAtNewSuggestion = stringToTryingSuggest.lastIndexOf(special[special.length - 1]);
    const look = stringToTryingSuggest.substring(startAtNewSuggestion + 1, selectionStart);
    const filteredSuggestions = _.filter(this.state.autoCompleteSuggestions, suggestion => {
      return suggestion.name.toLowerCase().includes(look.trim().toLowerCase());
    });
    onChange(value);
    this.setState({
      filteredSuggestions,
      showAutoCompleteContainer: true,
      cursorPosition: selectionStart
    });
  }

  completeFunction = (item: Object) => {
    const autocompleteInput = document.getElementById('autocomplete');
    if(autocompleteInput instanceof HTMLInputElement){
      const { cursorPosition } = this.state;
      const stringToTryingSuggest = autocompleteInput.value.substring(0, autocompleteInput.selectionStart);
      const special = stringToTryingSuggest.match(/([+-,()%$&/=!*><^|~])/g) || [];
      const startAtNewSuggestion = stringToTryingSuggest.lastIndexOf(special[special.length - 1]);
      const leftValue = stringToTryingSuggest.substring(0, startAtNewSuggestion + 1);
      const rightValue = autocompleteInput.value.substring(autocompleteInput.selectionStart);
      const autocomplete = leftValue.concat(item.name, rightValue);
      this.props.onChange(autocomplete);
      this.setState({
        showAutoCompleteContainer: false
      }, () => {
        const newCursorPosition = cursorPosition + item.name.length;
        autocompleteInput.selectionStart = newCursorPosition;
        autocompleteInput.focus();
        autocompleteInput.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }
  }

  handleKeyDown = (event: Object) => {
    const autocompleteContainer = document.getElementById('listBox');
    const firstChildElement = autocompleteContainer && autocompleteContainer.firstChild;
    const lastChildElement = autocompleteContainer && autocompleteContainer.lastChild;
    const newState = _.cloneDeep(this.state);
    let { showAutoCompleteContainer } = newState;
    switch (event.keyCode) {
      case 32:
        if(event.ctrlKey){
          this.setState({
            showAutoCompleteContainer: true
          });
        }
        break;
      case 40: // arrow down
        event.preventDefault();
        if (!_.isEmpty(firstChildElement) && firstChildElement instanceof HTMLElement) {
          firstChildElement.focus();
        }
        break;
      case 38: //arrow up
        event.preventDefault();
        if (!_.isEmpty(lastChildElement) && lastChildElement instanceof HTMLElement) {
          lastChildElement.focus();
        }
        break;
      case 27: //escape key
        showAutoCompleteContainer = false;
        break;
      default:
        break;
    }
    if(event.keyCode <= 90 && event.keyCode >= 65) {
      showAutoCompleteContainer = true;
    }
    if(
      event.keyCode === 40||
      event.keyCode === 38||
      event.keyCode === 27 ||
      (event.keyCode <= 90 && event.keyCode >= 65)
      ) {
      this.setState({
        showAutoCompleteContainer
      });
      return;
    }
  }

  handleKeyDownOption = (index: number, item: Object,event: Object) => {
    let showAutoCompleteContainer = this.state.showAutoCompleteContainer;
    const autocompleteInput = this.autocompleteInput;
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
        target.parentNode.classList.remove('show');
        showAutoCompleteContainer = false;
        if (autocompleteInput != null && autocompleteInput instanceof HTMLInputElement) {
          autocompleteInput.focus();
        }
        break;
      case 13: // enter key select option
        event.preventDefault();
        this.completeFunction(item);
        break;
      default:
        return;
    }
    if (event.keyCode === 40 || event.keyCode === 38 || event.keyCode === 27) {
      this.setState({
        showAutoCompleteContainer
      });
      return;
    }
  }

  onFocusElement = (item: Object) => {
    if(item.suggestionType !== 'udf'){
      this.setState({
        tempItem: item,
        showAutoCompleteOptionInfo: true
      });
    } else {
      this.setState({
        showAutoCompleteOptionInfo: false
      });
    }
  }

  onFocusAutoComplete = () => {
    if(this.state.showAutoCompleteOptionInfo){
      this.setState({
        showAutoCompleteOptionInfo: false
      });
    }
  }

  render() {
    const {
      tempItem,
      showAutoCompleteContainer,
      showAutoCompleteOptionInfo,
      filteredSuggestions
    } = this.state;
    return (
      <FormGroup className="position-relative">
        <Input
          type="text"
          ref={ input => {this.autocompleteInput = input}}
          innerRef={input => {this.autocompleteInnerInput = input}}
          name="autocomplete"
          className="form-control"
          id="autocomplete"
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.onFocusAutoComplete}
          value={this.props.value}
          autoComplete="off"
          />
          <ul
            className={classnames('autocomplete__container', {'show': showAutoCompleteContainer})}
            id="listBox"
            role="listbox"
            >
            {
              _.map(filteredSuggestions, (item, index) => {
                return(
                  <li
                    key={index}
                    tabIndex="-1"
                    role="option"
                    onClick={() => this.completeFunction(item)}
                    onKeyDown={(event) => this.handleKeyDownOption(index, item, event)}
                    onFocus={() => this.onFocusElement(item)}
                    className={`autocomplete__option ${item.suggestionType ? item.suggestionType : 'function'}`}>
                    { item.name }
                  </li>
                )
              })
            }
        </ul>

        <div className={classnames('autocomplete__option__info', {'show': showAutoCompleteOptionInfo,})} >
          <span className='autocomplete__option__info--type'>
            {tempItem.type}
          </span>
          <span className='autocomplete__option__info--doc'>
            {tempItem.doc}
          </span>
        </div>
      </FormGroup>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoComplete);
