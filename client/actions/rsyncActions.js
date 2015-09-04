import {
  REQUEST_JOBS,
  RECIVE_JOBS,
  REQUEST_START_JOB,
  RECIVE_START_JOB,
  REQUEST_REMOVE_JOB,
  RECIVE_REMOVE_JOB
} from 'constants/ActionTypes'
import {createAction} from 'redux-actions'
import * as WebAPI from 'utils/WebAPI'
import { copyPartsListSelector } from 'selectors'

export const requestSync = createAction(REQUEST_START_JOB)
export const reciveSync = createAction(RECIVE_START_JOB)
export function startJob() {
  return (dispatch, getState) => {
    const state = getState()
    const partsList = copyPartsListSelector(state).map((p) => {
      console.log('file', p.get('file'))
      return p.get('file')
    }).toJS()
    const { dest: { path: destPath } } = state
    console.log('partsList', partsList, destPath)
    dispatch(requestSync({partsList, destPath}))
    return WebAPI.startJob(partsList, destPath).then((data) => dispatch(reciveSync(data)))
  }
}

export const requestJobs = createAction(REQUEST_JOBS)
export const reciveJobs = createAction(RECIVE_JOBS)
export function fetchJobs() {
  return (dispatch) => {
    dispatch(requestJobs())
    return WebAPI.fetchJobs().then((data) => dispatch(reciveJobs(data)))
  }
}

export const reqestRemoveJob = createAction(REQUEST_REMOVE_JOB)
export const receiveRemoveJob = createAction(RECIVE_REMOVE_JOB)

export function removeJob(jobId) {
  return (dispatch) => {
    dispatch(reqestRemoveJob(jobId))
    return WebAPI.removeJob(jobId).then(() => dispatch(receiveRemoveJob(jobId)))
  }
}
