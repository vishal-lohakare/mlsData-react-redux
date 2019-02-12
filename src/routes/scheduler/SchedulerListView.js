// @flow

import React, { Component } from 'react';
import moment from 'moment';
import dates from 'react-big-calendar/lib/utils/dates';
import { inRange } from 'react-big-calendar/lib/utils/eventLevels';
import { isSelected } from 'react-big-calendar/lib/utils/selection';
import { Table } from 'reactstrap';
import _ from 'lodash';

function getStartAndEndDates(date: Date, customView: string){
  if(customView == 'day'){
    return {
      startDate: dates.startOf(date, 'day'),
      endDate: dates.endOf(date, 'day')
    }
  }
  const startDate = moment(date).startOf('week');
  const endDate = moment(date).endOf('week');
  return {
    startDate,
    endDate
  }
}

type Props = {
  date: Date,
  events: Array<Object>,
  accessors: Object,
  localizer: Object,
  components: Object,
  getters: Object,
  customView: string,
  selected: Object
};

class CustomAgenda extends Component<Props> {
  static navigate: Function;
  static range: Function;
  static title: Function;

  constructor(props: Props){
    super(props);
  }

  renderDay = (day: Date, events: Array<Object>, dayKey: number, startDate: Date, endDate: Date) => {
    const {
      selected,
      getters,
      accessors,
      localizer,
      components: { event: Event, date: AgendaDate },
    } = this.props;
    const newEvents = events.filter(e =>
      inRange(e, dates.startOf(day, 'day'), dates.endOf(day, 'day'), accessors)
    )

    return _.map(newEvents, (event: Object, index: number) => {
      const title = accessors.title(event)
      const end = endDate;
      const start = startDate;
      const userProps = getters.eventProp(
        event,
        start,
        end,
        isSelected(event, selected)
      )

      let dateLabel = index === 0 && localizer.format(day, 'agendaDateFormat')
      let first =
        index === 0 ? (
          <td rowSpan={newEvents.length} className="rbc-agenda-date-cell">
            {AgendaDate ? (
              <AgendaDate day={day} label={dateLabel} />
            ) : (
              dateLabel
            )}
          </td>
        ) : (
          false
        );

      return (
        <tr
          key={dayKey + '_' + index}
          className={userProps.className}
        >
          {first}
          <td className="rbc-agenda-time-cell" style={{width: '20%'}}>
            {this.timeRangeLabel(day, event)}
          </td>
          <td className="rbc-agenda-event-cell" style={{width: '40%'}}>
            {Event ? <Event event={event} title={title} /> : title}
          </td>
          <td className="rbc-agenda-event-cell agenda-event-status-cell" style={{width: '20%'}}>
            { event.eventStatus && <span className="agendaEventStatus">{event.eventStatus}</span> }
          </td>
          <td className="rbc-agenda-event-cell" style={{width: '20%'}}>
            {event.scheduleType}
          </td>
        </tr>
      )
    }, []);
  }

  timeRangeLabel = (day: Date, event: Object) => {
    const { accessors, localizer, components } = this.props;

    let labelClass = '', label = localizer.messages.allDay;
    const TimeComponent = components.time;

    const end = accessors.end(event);
    const start = accessors.start(event);

    if (!accessors.allDay(event)) {
      if (dates.eq(start, end, 'day')) {
        label = localizer.format({ start, end }, 'agendaTimeRangeFormat')
      } else if (dates.eq(day, start, 'day')) {
        label = localizer.format(start, 'agendaTimeFormat')
      } else if (dates.eq(day, end, 'day')) {
        label = localizer.format(end, 'agendaTimeFormat')
      }
    }

    if (dates.gt(day, start, 'day')) labelClass = 'rbc-continues-prior'
    if (dates.lt(day, end, 'day')) labelClass += ' rbc-continues-after'

    return (
      <span className={labelClass.trim()}>
        {TimeComponent ? (
          <TimeComponent event={event} day={day} label={label} />
        ) : (
          label
        )}
      </span>
    )
  }

  render() {
    const { date, events, accessors, localizer, customView } = this.props;
    const { messages } = localizer;
    const { startDate, endDate } = getStartAndEndDates(date, customView);
    const range = dates.range(startDate, endDate, 'day');
    const newEvents = events.filter(event => inRange(event, startDate, endDate, accessors));
    newEvents.sort((a, b) => +accessors.start(a) - +accessors.start(b));
    return (
      <div className="rbc-agenda-view">
        {newEvents.length !== 0 ? (
          <React.Fragment>
            <Table bordered className="rbc-agenda-table">
              <thead>
                <tr>
                  <th className="rbc-header" ref="dateCol">
                    {messages.date}
                  </th>
                  <th className="rbc-header" ref="timeCol">
                    {messages.time}
                  </th>
                  <th className="rbc-header">URL</th>
                  <th className="rbc-header">Current Status</th>
                  <th className="rbc-header">Recurrence</th>
                </tr>
              </thead>
              <tbody ref="tbody">
                {range.map((day, index) => this.renderDay(day, newEvents, index, startDate, endDate))}
              </tbody>
            </Table>
          </React.Fragment>
        ) : (
          <span className="rbc-agenda-empty">{messages.noEventsInRange}</span>
        )}
      </div>
    )
  }
}

CustomAgenda.range = (start: Date) => {
  const { startDate, endDate } = getStartAndEndDates(start, 'week');
  return { start: startDate, end: endDate }
}

CustomAgenda.navigate = (date: Date, action: string, event: Object) => {
  const { startDate, endDate } = getStartAndEndDates(date, 'week');
  switch (action) {
    case "PREV":
      return dates.add(startDate, -6, 'day');

    case "NEXT":
      return dates.add(startDate, 6, 'day');

    default:
      return date
  }
}

CustomAgenda.title = (start: Date, { length, localizer }: Object) => {
  const { startDate, endDate } = getStartAndEndDates(start, 'week');
  return localizer.format({ start: startDate, end: endDate }, 'agendaHeaderFormat')
}

export default CustomAgenda;
