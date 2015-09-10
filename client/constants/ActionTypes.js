import createActionTypes from 'utils/createActionTypes'
export default createActionTypes([
  // Dest Actions
  'REQUEST_DEST',
  'RECIVE_DEST',
  'UPDATE_DEST',
  // Library Actions
  'REQUEST_LIBRARY',
  'REQUEST_SECTION',
  'REQUEST_METADATA',
  'RECIVE_LIBRARY',
  'RECIVE_SECTION',
  'RECIVE_METADATA',
  'ADD_MEDIA',
  'REMOVE_MEDIA',
  'CLEAR_MEDIA',
  // Sync Actions
  'REQUEST_JOBS',
  'RECIVE_JOBS',
  'REQUEST_REMOVE_JOB',
  'RECIVE_REMOVE_JOB',
  'PROGRESS_UPDATE',
  'REQUEST_START_JOB',
  'RECIVE_START_JOB'

])
