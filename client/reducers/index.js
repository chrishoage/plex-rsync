import * as ActionTypes from 'constants/ActionTypes'
import { Record, Set, Map, List } from 'immutable'
import fromJSMapped from 'utils/fromJSMapped'

const Entities = Record({
  writers: new Map(),
  parts: new Map(),
  media: new Map(),
  directors: new Map(),
  directories: new Map(),
  countries: new Map(),
  genres: new Map(),
  streams: new Map(),
  videos: new Map(),
  libraries: new Map(),
  roles: new Map(),
  locations: new Map(),
  jobs: new Map()
})

export function entities(state = new Entities(), {payload}) {
  if (payload && payload.entities) {
    return state.mergeDeep(fromJSMapped(payload.entities))
  }

  return state
}

export function jobs(state = new Set(), {type, payload}) {
  switch (type) {
    case ActionTypes.RECIVE_JOBS:
      return Set.of(...payload.result.jobs)
    case ActionTypes.REQEST_REMOVE_JOB:
      const deleteIndex = state.find((job) => job === payload)
      return deleteIndex > -1 ? state.delete(deleteIndex) : state
    default:
      return state
  }
}

export function library(state = new Map(), {type, payload}) {
  switch (type) {
    case ActionTypes.REQUEST_LIBRARY:
    case ActionTypes.REQUEST_SECTION:
    case ActionTypes.REQUEST_METADATA:
      return state.clear()
    case ActionTypes.RECIVE_LIBRARY:
    case ActionTypes.RECIVE_SECTION:
    case ActionTypes.RECIVE_METADATA:
      return state.mergeDeep(fromJSMapped(payload.result))
    default:
      return state
  }
}

export function copyKeys(state = new Set(), {type, payload}) {
  switch (type) {
    case ActionTypes.ADD_MEDIA:
      return state.union(payload.keys)
    case ActionTypes.REMOVE_MEDIA:
      return state.subtract(payload.keys)
    case ActionTypes.RECIVE_START_JOB:
      return state.clear()
    default:
      return state
  }
}

const Dest/*ination*/ = Record({
  path: '/',
  total: 0,
  used: 0,
  available: 0,
  capacity: 0,
  confirmed: false,
  results: new List()
})

export function dest(state = new Dest(), {type, payload}) {
  switch (type) {
    case ActionTypes.UPDATE_DEST:
      return Object.keys(payload).reduce((state, key) => state.set(key, payload[key]), state)
    case ActionTypes.RECIVE_DEST:
      return state.set('results', new List(payload.results))
    default:
      return state
  }
}
