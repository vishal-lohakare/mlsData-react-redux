// @flow

import { API } from 'utils/API';
import {
  GET_MLS_SCHEDULER_EVENTS_REQUEST,
  GET_MLS_SCHEDULER_EVENTS_SUCCESS,
  GET_MLS_SCHEDULER_EVENTS_FAILURE,
  GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST,
  GET_MLS_SCHEDULER_EVENT_DETAILS_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_DETAILS_FAILURE,
  GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST,
  GET_MLS_SCHEDULER_EVENT_DELETE_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_DELETE_FAILURE,
  GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST,
  GET_MLS_SCHEDULER_EVENT_UPDATE_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_UPDATE_FAILURE,
  GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST,
  GET_MLS_SCHEDULER_EVENT_CREATE_SUCCESS,
  GET_MLS_SCHEDULER_EVENT_CREATE_FAILURE,
  GET_LISTING_SCHEDULE_EXIST_REQUEST,
  GET_LISTING_SCHEDULE_EXIST_SUCCESS,
  GET_LISTING_SCHEDULE_EXIST_FAILURE,
} from 'constants/action';

export const getSchedulerEvents = (query: Object) => {
  const { mlsInfoId, startDate, endDate } = query;
  return {
    types: [GET_MLS_SCHEDULER_EVENTS_REQUEST, GET_MLS_SCHEDULER_EVENTS_SUCCESS, GET_MLS_SCHEDULER_EVENTS_FAILURE],
    callAPI: () => new API().get(`/schedule/download/${mlsInfoId}/calendar?startDate=${startDate}&endDate=${endDate}`)
  }
}

export const getSchedulerEventDetails = (query: Object) => {
  const { mlsInfoId, jobId } = query;
  return {
    types: [GET_MLS_SCHEDULER_EVENT_DETAILS_REQUEST, GET_MLS_SCHEDULER_EVENT_DETAILS_SUCCESS, GET_MLS_SCHEDULER_EVENT_DETAILS_FAILURE],
    callAPI: () => new API().get(`/schedule/download/${mlsInfoId}/${jobId}`)
  }
}

export const deleteSchedulerEvent = (deleteEventQuery: Object) => {
  const { mlsInfoId, jobId } = deleteEventQuery;
  return {
    types: [GET_MLS_SCHEDULER_EVENT_DELETE_REQUEST, GET_MLS_SCHEDULER_EVENT_DELETE_SUCCESS, GET_MLS_SCHEDULER_EVENT_DELETE_FAILURE],
    callAPI: () => new API().delete(`/schedule/download/${mlsInfoId}/${jobId}`)
  }
}

export const updateSchedulerEvent = (query: Object) => {
  return {
    types: [GET_MLS_SCHEDULER_EVENT_UPDATE_REQUEST, GET_MLS_SCHEDULER_EVENT_UPDATE_SUCCESS, GET_MLS_SCHEDULER_EVENT_UPDATE_FAILURE],
    callAPI: () => new API().put("/schedule/download/update", false, JSON.stringify(query))
  }
}

export const createSchedulerEvent = (query: Object) => {
  return {
    types: [GET_MLS_SCHEDULER_EVENT_CREATE_REQUEST, GET_MLS_SCHEDULER_EVENT_CREATE_SUCCESS, GET_MLS_SCHEDULER_EVENT_CREATE_FAILURE],
    callAPI: () => new API().post("/schedule/download", false, JSON.stringify(query))
  }
}

export const isListingScheduleExist = (query: Object) => {
  const { mlsId, startDate } = query;
  return {
    types: [GET_LISTING_SCHEDULE_EXIST_REQUEST,GET_LISTING_SCHEDULE_EXIST_SUCCESS,GET_LISTING_SCHEDULE_EXIST_FAILURE,],
    callAPI: () => new API().get(`/schedule/download/checkListingSchedule/${mlsId}/${startDate}`, false)
  }
}
