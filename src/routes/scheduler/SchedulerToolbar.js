// @flow

import React, { Component } from 'react';
import {
  Button,
  Row,
  Col,
  Input
} from 'reactstrap';
import { CustomCalendar } from 'components';
import './SchedulerScreen.scss';
import _ from 'lodash';

type Props = {
  currentView: string,
  isGrid: boolean,
  onGridClick: Function,
  onListClick: Function,
  selectedDate: Date,
  onChangeDate: Function,
  onViewChange: Function,
  onSelectDownloadType: Function,
  dowloadTypesListData: Array<string>,
  selectedDownloadType: string
};

type State = {
  isGridView: boolean
};

class SchedulerToolbar extends Component<Props, State> {

  constructor(props:Props) {
    super(props);
    this.state = {
      isGridView: true
    }
  }

  onViewChange = (event: Object) => {
    this.props.onViewChange(event.target.value);
  }

  render() {
    const {
      currentView,
      isGrid,
      onGridClick,
      onListClick,
      selectedDate,
      onChangeDate,
      onSelectDownloadType,
      dowloadTypesListData,
      selectedDownloadType
    } = this.props;

    return (
      <Row>
        <Col xs="6">
          <CustomCalendar
            selectedDate={selectedDate}
            onChangeDate={onChangeDate}
          />
        </Col>

        <Col className="customToolbarWrapper" xs="6">
          <Input type="select"
            name="downloadType"
            id="downloadType"
            className="calendarViewSelect"
            onChange={onSelectDownloadType}
            value={selectedDownloadType}
          >
            {
              _.map(dowloadTypesListData, (dt, index) => {
                return <option value={dt} key={index}>{dt}</option>
              })
            }
          </Input>
          <Input type="select" name="selectView" id="selectView" className="calendarViewSelect" value={currentView} onChange={this.onViewChange}>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </Input>
          <Button
          className={`fa fa-list-ul customFaButton ${!isGrid ? 'selected' : ''}`}
          onClick={onListClick}
          >
          </Button>
          <Button
            className={`fa fa-th customFaButton ${isGrid ? 'selected' : ''}`}
            onClick={onGridClick}
          >
          </Button>
        </Col>
      </Row>
    );
  }
}
export default SchedulerToolbar;
