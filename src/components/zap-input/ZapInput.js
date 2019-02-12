// @flow

import React, { Component } from 'react';
import { InputGroup, Input } from 'reactstrap';
import _ from 'lodash';

import './ZapInput.scss';

type Props = {
  type: string,
  name: string,
  label?: any,
  handleChange?: Function,
  handleBlur?: Function,
  placeholder?: string,
  errorMessage?: any,
  maxLength?: number,
  minLength?: number,
  errorState?: boolean,
  disabled?: boolean,
  defaultValue?: any,
  value?: any
};

type State = {};

export default class ZapInput extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    (this:any).handleChange = this.handleChange.bind(this);
    (this:any).handleBlur = this.handleBlur.bind(this);
  }

  handleChange(event: Object) {
    const { handleChange } = this.props;
    if(handleChange ) {
      _.isFunction(handleChange) && handleChange(event);
    }
  }

  handleBlur(event: Object) {
    const { handleBlur } = this.props;
    if(handleBlur ) {
      _.isFunction(handleBlur) && handleBlur(event);
    }
  }

  render () {
    const { label, placeholder, type, name, maxLength, errorState, defaultValue, errorMessage, minLength, disabled, value } = this.props;
    let labelElement, className = '';

    if (label) {
      labelElement = (
        <label>
          {label}
        </label>
      );
    }

    if(errorState) {
      className = "inputError";
    }

    return (
      <div>
        {labelElement}
        <InputGroup>
          <Input
            type={type}
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            maxLength={maxLength}
            minLength={minLength}
            disabled={disabled}
            value={value}
            className={className}
          />
        </InputGroup>
        {
          errorState &&
          <p className="errorMessageText">{errorMessage}</p>
        }
      </div>
    );
  }
}
