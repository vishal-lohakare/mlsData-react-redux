// @flow

import React, { Component } from 'react';
import {
  Button,
} from 'reactstrap';
import Calendar from 'react-calendar';
import moment from 'moment';
import _ from 'lodash';
import './CustomCalendar.scss';

type Props = {
  selectedDate: Date,
  onChangeDate: Function,
  minDate: Date,
  canChange: boolean,
  selectRange: boolean
};

type State = {
  isCalendarOpen: boolean
};

class CustomCalendar extends Component<Props, State> {

  calendarWrapperRef: ?HTMLDivElement;
  calendarButtonRef: ?HTMLButtonElement;

  state = {
    isCalendarOpen: false
  };

  componentDidMount(){
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  getFormattedDate = (milliseconds: number) => moment(milliseconds).format('MM/DD/YYYY');

  getFormattedDateRange = (date: Array<Date>) => {
    const startMilliseconds = date[0] ? date[0].getTime() : new Date().getTime();
    const endMilliseconds = date[1] ? date[1].getTime() : new Date().getTime();
    const startDate = this.getFormattedDate(startMilliseconds);
    const endDate = this.getFormattedDate(endMilliseconds);
    return `${startDate} - ${endDate}`;
  }

  getDisplayDate = (dateObj: any) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", " Sat"];
    if(this.props.selectRange) {
      return this.getFormattedDateRange(dateObj);
    } else {
      const month = dateObj.getMonth(),
      dateDay = dateObj.getDate(),
      year = dateObj.getFullYear(),
      day = dateObj.getDay();
      return `${weekday[day]}, ${dateDay} ${months[month]} ${year}`;
    }
  }

  onChangeDate = (date: Date) => {
    if(!this.props.selectRange){
      this.closeCalendar();
    } else {
      if(_.isArray(date)) this.closeCalendar();
    }
    this.props.onChangeDate(date);
  }

  toggleCalendar = () => {
    this.setState({
      isCalendarOpen: !this.state.isCalendarOpen
    });
  }

  onDocumentClick = (event: Object) => {
    if (this.state.isCalendarOpen &&
        this.calendarWrapperRef && !this.calendarWrapperRef.contains(event.target) &&
        this.calendarButtonRef && !this.calendarButtonRef.contains(event.target)) {
      this.closeCalendar();
    }
  }

  closeCalendar = () => {
    this.setState({
      isCalendarOpen: false
    });
  }

  render() {
    const { selectedDate, canChange = true, minDate, selectRange = false } = this.props;
    return (
      <div className="customCalendarWrapper">
        <div className="leftDateContent">
          <span>{this.getDisplayDate(selectedDate)}</span>
          { canChange &&
            <Button
              className={`fa fa-calendar calendarButton ${this.state.isCalendarOpen ? "selected" : ""}`}
              onClick={this.toggleCalendar}
              innerRef={(ref) => this.calendarButtonRef = ref}
            >
            </Button>
          }
        </div>
        {
          this.state.isCalendarOpen &&
          <div className="calendarWrapper" ref={(ref) => this.calendarWrapperRef = ref}>
            <Calendar
              onChange={this.onChangeDate}
              value={selectedDate}
              minDate={minDate ? minDate : new Date(1970, 0, 1)}
              calendarType="US"
              selectRange={selectRange}
            />
          </div>
        }
      </div>
    );
  }
}
export default CustomCalendar;
