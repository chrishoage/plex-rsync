import {UPDATE_DEST, REQUEST_DEST, RECIVE_DEST} from 'constants/ActionTypes'
import {createAction} from 'redux-actions'
import axios from 'axios'

export const updateDest = createAction(UPDATE_DEST)


export const requestDest = createAction(REQUEST_DEST)
export const reciveDest = createAction(RECIVE_DEST)

export function fetchDest({ path }) {
  return (dispatch) => {
    dispatch(requestDest())
    return axios.get(`/api/fs/${path}`).then((res) => dispatch(reciveDest(res.data)))
  }
}
