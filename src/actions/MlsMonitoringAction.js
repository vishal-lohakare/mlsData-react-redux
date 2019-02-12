// @flow

import { API } from 'utils/API';
import {
  POST_MLS_VIEW_MONITOR_REQUEST,
  POST_MLS_VIEW_MONITOR_SUCCESS,
  POST_MLS_VIEW_MONITOR_FAILURE,
  GET_PAUSE_JOB_REQUEST,
  GET_PAUSE_JOB_SUCCESS,
  GET_PAUSE_JOB_FAILURE,
  GET_RESUME_JOB_REQUEST,
  GET_RESUME_JOB_SUCCESS,
  GET_RESUME_JOB_FAILURE,
  GET_STOP_JOB_REQUEST,
  GET_STOP_JOB_SUCCESS,
  GET_STOP_JOB_FAILURE,
  SET_PLAY_ON_DEMAND_SOURCE
} from 'constants/action.js'

import type { Dispatch } from 'react-redux';

export const GetMonitoringData = (data: Object = {}) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_VIEW_MONITOR_REQUEST, POST_MLS_VIEW_MONITOR_SUCCESS, POST_MLS_VIEW_MONITOR_FAILURE],
      callAPI: () => new API().post('/mls-view/monitor', false, JSON.stringify(data))
  })
 }
}

export const pauseJob = (downloadId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_PAUSE_JOB_REQUEST, GET_PAUSE_JOB_SUCCESS, GET_PAUSE_JOB_FAILURE],
      callAPI: () => new API().get(`/mls-nifi-event/pause/${downloadId}`, false)
    })
  }
}

export const resumeJob = (downloadId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_RESUME_JOB_REQUEST, GET_RESUME_JOB_SUCCESS, GET_RESUME_JOB_FAILURE],
      callAPI: () => new API().get(`/mls-nifi-event/resume/${downloadId}`, false)
    })
  }
}

export const stopJob = (downloadId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_STOP_JOB_REQUEST, GET_STOP_JOB_SUCCESS, GET_STOP_JOB_FAILURE],
      callAPI: () => new API().get(`/mls-nifi-event/stop/${downloadId}`, false)
    })
  }
}

export const clearJobPlayOnDemand = () => {
  return(dispatch: Dispatch) => {
    dispatch(filterJobPlayOnDemand(-1, ''));
  }
}

export const filterJobPlayOnDemand = (mlsId: number, downloadType: string) => ({
      type: SET_PLAY_ON_DEMAND_SOURCE,
      mlsId,
      downloadType
});
