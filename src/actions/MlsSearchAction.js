// @flow

import { API } from 'utils/API';
import {
  GET_MLS_DETAILS_REQUEST,
  GET_MLS_DETAILS_SUCCESS,
  GET_MLS_DETAILS_FAILURE,
  UPDATE_MLS_STATE_REQUEST,
  UPDATE_MLS_STATE_SUCCESS,
  UPDATE_MLS_STATE_FAILURE,
  POST_MLS_PLAY_AGENT_REQUEST,
  POST_MLS_PLAY_AGENT_SUCCESS,
  POST_MLS_PLAY_AGENT_FAILURE,
  POST_MLS_PLAY_LISTING_REQUEST,
  POST_MLS_PLAY_LISTING_SUCCESS,
  POST_MLS_PLAY_LISTING_FAILURE,
  POST_MLS_PLAY_OFFICE_REQUEST,
  POST_MLS_PLAY_OFFICE_SUCCESS,
  POST_MLS_PLAY_OFFICE_FAILURE,
  POST_MLS_PLAY_OPEN_HOUSE_REQUEST,
  POST_MLS_PLAY_OPEN_HOUSE_SUCCESS,
  POST_MLS_PLAY_OPEN_HOUSE_FAILURE,
  POST_MLS_PLAY_PHOTO_REQUEST,
  POST_MLS_PLAY_PHOTO_SUCCESS,
  POST_MLS_PLAY_PHOTO_FAILURE,
  GET_CURRENT_DOWNLOAD_STATUS_REQUEST,
  GET_CURRENT_DOWNLOAD_STATUS_SUCCESS,
  GET_CURRENT_DOWNLOAD_STATUS_FAILURE,
} from 'constants/action.js'
import { filterJobPlayOnDemand } from 'actions/MlsMonitoringAction';
import type { Dispatch } from 'react-redux';
import moment from 'moment';

export const getListOfMls = () => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [GET_MLS_DETAILS_REQUEST, GET_MLS_DETAILS_SUCCESS, GET_MLS_DETAILS_FAILURE],
      callAPI: () => new API().get(`/mls-view`, false)
  })
 }
}

export const updateMLS = (source: string, isActive: boolean) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [UPDATE_MLS_STATE_REQUEST, UPDATE_MLS_STATE_SUCCESS, UPDATE_MLS_STATE_FAILURE],
      callAPI: () => new API().put(`/mls-info/change-mls-state?source=${source}&isActive=${isActive.toString()}`, false),
      handleSuccess: function() {
        dispatch(getListOfMls());
      }
    })
  }
}

export const PlayMlsAgentDownload = (urlId: number, mlsInfoId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_PLAY_AGENT_REQUEST, POST_MLS_PLAY_AGENT_SUCCESS, POST_MLS_PLAY_AGENT_FAILURE],
      callAPI: () => new API().post(`/mls-agent-download/request/${urlId}`, false),
      handleSuccess: function() {
        dispatch(filterJobPlayOnDemand(mlsInfoId, 'agent'))
      }
  })
 }
}

export const PlayMlsListingDownload = (urlId: number, mlsInfoId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_PLAY_LISTING_REQUEST, POST_MLS_PLAY_LISTING_SUCCESS, POST_MLS_PLAY_LISTING_FAILURE],
      callAPI: () => new API().post(`/mls-listing-download/request/${urlId}`, false),
      handleSuccess: function() {
        dispatch(filterJobPlayOnDemand(mlsInfoId, 'listing'))
      }
  })
 }
}

export const PlayMlsOfficeDownload = (urlId: number, mlsInfoId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_PLAY_OFFICE_REQUEST, POST_MLS_PLAY_OFFICE_SUCCESS, POST_MLS_PLAY_OFFICE_FAILURE],
      callAPI: () => new API().post(`/mls-office-download/request/${urlId}`, false),
      handleSuccess: function() {
        dispatch(filterJobPlayOnDemand(mlsInfoId, 'office'))
      }
  })
 }
}

export const PlayMlsOpenHouseDownload = (urlId: number, startDate: string, endDate: string, mlsInfoId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_PLAY_OPEN_HOUSE_REQUEST, POST_MLS_PLAY_OPEN_HOUSE_SUCCESS, POST_MLS_PLAY_OPEN_HOUSE_FAILURE],
      callAPI: () => new API().post(`/mls-open-house-download/request/${urlId}?startDate=${startDate}&endDate=${endDate}`, false),
      handleSuccess: function() {
        dispatch(filterJobPlayOnDemand(mlsInfoId, 'openhouse'))
      }
  })
 }
}

export const PlayMlsPhotoDownload = (urlId: number, mlsInfoId: number) => {
  return(dispatch: Dispatch) => {
    dispatch({
      types: [POST_MLS_PLAY_PHOTO_REQUEST, POST_MLS_PLAY_PHOTO_SUCCESS, POST_MLS_PLAY_PHOTO_FAILURE],
      callAPI: () => new API().post(`/mls-photo-download/request/${urlId}`, false),
      handleSuccess: function() {
        dispatch(filterJobPlayOnDemand(mlsInfoId, 'photo'))
      }
  })
 }
}

export const checkPlayOnDemand = (mlsInfoId: number, downloadType: string, ) => {
  return {
    types: [GET_CURRENT_DOWNLOAD_STATUS_REQUEST,GET_CURRENT_DOWNLOAD_STATUS_SUCCESS,GET_CURRENT_DOWNLOAD_STATUS_FAILURE,],
    callAPI: () => new API().get(`/schedule/download/checkplayOnDemand/${mlsInfoId}/${downloadType}/${moment().utc().format("YYYY-MM-DD HH:mm:00")}`, false),
 }
}
