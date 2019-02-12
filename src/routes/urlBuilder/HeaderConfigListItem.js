// @flow

import React, { Component } from 'react';
import {
  Row,
  Col,
  FormGroup,
  CustomInput,
  Input,
  Button
} from 'reactstrap';
import _ from 'lodash';

type Props = {
  headerData: {
    headerKey: string,
    headerValue: string,
    isSelected: boolean,
    isEdit: boolean,
  },
  handleHeaderSave: Function,
  handleDelete: Function,
  index: number,
  cardIndex: number,
  origionalData: Object,
};

type State = {
  initialHeaderData: {
    headerKey: string,
    headerValue: string,
    isSelected: boolean,
    isEdit: boolean,
  }
};

export class HeaderConfigListItem extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const { headerData: {headerKey, headerValue, isSelected, isEdit}} = this.props;
    this.state = {
      initialHeaderData: {
        headerKey: headerKey,
        headerValue: headerValue,
        isSelected: isSelected,
        isHeaderUpdated: false,
        isNewHeader: false,
        isEdit: isEdit,
      },
      isUpdated: false,
    };

    (this:any)._handleInputChange = this._handleInputChange.bind(this);
    (this:any)._handleHeaderSave = this._handleHeaderSave.bind(this);
    (this:any)._handleHeaderDelete = this._handleHeaderDelete.bind(this);
    (this:any)._handleChangeCheckbox = this._handleChangeCheckbox.bind(this);

  }

  componentDidUpdate(prevProps: Props){
    if(!_.isEqual(prevProps.headerData, this.props.headerData)){
      const { headerData: {headerKey, headerValue, isSelected, isEdit}} = this.props;
      this.setState({
        initialHeaderData: {
          headerKey: headerKey,
          headerValue: headerValue,
          isSelected: isSelected,
          isEdit: isEdit,
        }
      });
    }
  }

  _handleHeaderSave() {

    const { initialHeaderData } = this.state;
    const { headerKey, headerValue, isSelected } = initialHeaderData;
    const newState = _.cloneDeep(this.state);
    if(headerKey.trim() !== '' && headerValue.trim() !== '') {
      if(initialHeaderData.isEdit) {
        newState.initialHeaderData.isEdit = false;
        const { handleHeaderSave, index, cardIndex, origionalData } = this.props;
        let isUpdated = false;
        if(!_.isEmpty(origionalData)) {
          if(origionalData.headerKey !== headerKey ||
             origionalData.headerValue!== headerValue ||
             origionalData.isSelected!== isSelected) {
            isUpdated = true;
          }
        } else {
          newState.initialHeaderData.isNewHeader = true;
        }
        newState.initialHeaderData.isHeaderUpdated = isUpdated;
        handleHeaderSave({...newState.initialHeaderData}, index, cardIndex);
      }
      else {
        newState.initialHeaderData.isEdit = true;
      }
  
      this.setState({...newState});
    }
  }

  _handleHeaderDelete() {
    const { handleDelete, origionalData, cardIndex } = this.props;

    handleDelete(_.isUndefined(origionalData) ? 'NA' : origionalData.headerId, cardIndex, "Header", this.props.index);
  }

  _handleChangeCheckbox(event: Object) {
    const { handleHeaderSave, index, cardIndex } = this.props;
    const newState = _.cloneDeep(this.state);
    newState.initialHeaderData.isSelected = event.target.checked;
    let isUpdated = false;
    if(!_.isEmpty(this.props.origionalData)) {
      if(this.props.origionalData.isSelected!== event.target.checked) {
        isUpdated = true;
      }
    } else {
      newState.initialHeaderData.isNewHeader = true;
    }
    newState.initialHeaderData.isHeaderUpdated = isUpdated;
    if(!newState.initialHeaderData.isEdit) {
      handleHeaderSave({...newState.initialHeaderData}, index, cardIndex);
    }
    this.setState({...newState});
  }

  _handleInputChange(event: Object) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    const newState = _.cloneDeep(this.state);
    newState.initialHeaderData[fieldName] = fieldValue;
    let isUpdated = true;
    if(this.props.headerData[fieldName] ===  fieldValue) {
      isUpdated = false;
    }

    newState.isUpdated = isUpdated;

    this.setState({...newState});
  }

  render() {
    const { initialHeaderData } = this.state;
    const buttonText = initialHeaderData.isEdit ? 'Save' : 'Edit';
    return (
      <Row>
        <Col xs="1" md="1" lg="1">
          <FormGroup className="custom-checkbox-wrapper">
            <CustomInput type="checkbox" id={`${this.props.index}${this.props.cardIndex}`} onChange={this._handleChangeCheckbox} checked={initialHeaderData.isSelected}/>
          </FormGroup>
        </Col>
        <Col xs="3" md="3" lg="3">
          {initialHeaderData.isEdit ?
            <FormGroup>
              <Input
                id="headerKey"
                name="headerKey"
                placeholder="Key"
                onChange={this._handleInputChange}
                value={initialHeaderData.headerKey}
              />
            </FormGroup>
            :
            <p>{initialHeaderData.headerKey}</p>
          }
        </Col>
        <Col xs="4" md="4" lg="4">
          {initialHeaderData.isEdit ?
            <FormGroup>
              <Input
                id="headerValue"
                name="headerValue"
                placeholder="Value"
                onChange={this._handleInputChange}
                defaultValue={initialHeaderData.headerValue}
              />
            </FormGroup>
            :
            <p>{initialHeaderData.headerValue}</p>
          }
        </Col>
        <Col xs="2" md="2" lg="2">
          <Button color="link" onClick={this._handleHeaderSave}>{buttonText}</Button>
        </Col>
        { initialHeaderData.headerKey !== "" && initialHeaderData.headerValue !== "" && buttonText === "Edit" &&
          <Col xs="2" md="2" lg="2">
            <Button color="link" onClick={this._handleHeaderDelete}>Delete</Button>
          </Col>
        }
      </Row>
    );
  }
}
