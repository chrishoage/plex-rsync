import * as MediaTypes from 'constants/MediaTypes'
import {createAction} from 'redux-actions'
import axios from 'axios'
import { fromJS } from 'immutable'
import * as WebAPI from 'utils/WebAPI'
import {
          ADD_MEDIA,
          REMOVE_MEDIA,
          REQUEST_LIBRARY,
          REQUEST_SECTION,
          REQUEST_METADATA,
          RECIVE_LIBRARY,
          RECIVE_SECTION,
          RECIVE_METADATA
        } from 'constants/ActionTypes'


export const requestLibrary = createAction(REQUEST_LIBRARY)
export const reciveLibrary = createAction(RECIVE_LIBRARY)

export function fetchLibrary() {
  return (dispatch) => {
    dispatch(requestLibrary())
    return WebAPI.fetchLibrary().then((data) => dispatch(reciveLibrary(data)))
  }
}

export const requestSection = createAction(REQUEST_SECTION)
export const reciveSection = createAction(RECIVE_SECTION)

export function fetchSection(section) {
  return (dispatch) => {
    dispatch(requestSection(section))
    return WebAPI.fetchSection(section).then((data) => dispatch(reciveSection(data)))
  }
}

export const requestMetadata = createAction(REQUEST_METADATA)
export const reciveMetadata = createAction(RECIVE_METADATA)

export function fetchMetadata(id) {
  return (dispatch) => {
    dispatch(requestMetadata())
    return WebAPI.fetchMetadata(id).then((data) => dispatch(reciveMetadata(data)))
  }
}


const videoKeyType = (videoType) => {
  switch (videoType) {
    case MediaTypes.SHOW:
      return 'grandparentRatingKey'
    case MediaTypes.SEASON:
      return 'parentRatingKey'
      break
    case MediaTypes.EPISODE:
    case MediaTypes.MOVIE:
      return 'ratingKey'
      break
    default:
      return 'key'
  }
}

const pickKeys = (videos, metadataId, videoType) => {
  if (!videos) return []
  return videos.filter((video) => {
    return video.get(videoKeyType(videoType)) === metadataId
  }).map((video) => video.get('ratingKey')).toArray()
}

export const addMedia = createAction(ADD_MEDIA)

export function addAllMedia(metadataId) {

  return (dispatch, getState) => {
    const state = getState()
    const { entities } = state
    const videoType = entities.getIn(['videos', metadataId, 'type'],
                      entities.getIn(['directories', metadataId, 'type'], ''))
    const hasGrandparentId = entities.hasIn(['videos', metadataId, 'grandparentRatingKey'])

    if (videoType === MediaTypes.MOVIE || (videoType === MediaTypes.EPISODE && hasGrandparentId)) {
      return dispatch(addMedia({
        keys: [metadataId]
      }))
    }

    if (videoType === MediaTypes.EPISODE) {
      return WebAPI.fetchMetadata(metadataId).then((data) => dispatch(addMedia({
        entities: data.entities,
        keys: data.result.videos
      })))
    }

    const videos = entities.get('videos')
    const addKeys = pickKeys(videos, metadataId, videoType)

    if (addKeys.length) {
      return dispatch(addMedia({
        keys: addKeys
      }))
    }

    return WebAPI.fetchFullMetadata(metadataId, videoType).then((data) => {
      const { entities, result: { videos } } = data
      dispatch(addMedia({
        entities,
        keys: videos
      }))
    })

  }
}

export const removeMedia = createAction(REMOVE_MEDIA)

export function removeAllMedia(metadataId) {
  return (dispatch, getState) => {
    const state = getState()
    const { entities } = state
    const videoType = entities.getIn(['videos', metadataId, 'type'],
                      entities.getIn(['directories', metadataId, 'type'], ''))

    const videos = entities.get('videos')

    const removeKeys = pickKeys(videos, metadataId, videoType)

    dispatch(removeMedia({
      keys: removeKeys
    }))

  }
}
