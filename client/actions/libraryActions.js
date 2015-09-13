import * as MediaTypes from 'constants/MediaTypes'
import {createAction} from 'redux-actions'
import axios from 'axios'
import { fromJS } from 'immutable'
import * as WebAPI from 'utils/WebAPI'
import { isDefined } from 'utils/functions'
import {
          ADD_MEDIA,
          REMOVE_MEDIA,
          REQUEST_LIBRARY,
          REQUEST_SECTION,
          REQUEST_METADATA,
          RECIVE_LIBRARY,
          RECIVE_SECTION,
          RECIVE_METADATA,
          CLEAR_MEDIA
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

export const addMediaKeys = createAction(ADD_MEDIA)

// Add Videos with media/parts to stage for copy
// The Plex API does not include grandparent and parent key's on the season listing
// so we have to fetch each individual metadata to get full information.
// This could be simplified if the Plex API were consistent in the data it return
export function addMedia(metadataId) {

  return (dispatch, getState) => {
    const state = getState()
    const { entities } = state
    const videoType = entities.getIn(['videos', metadataId, 'type'],
                      entities.getIn(['directories', metadataId, 'type'], ''))
    const hasGrandparentId = entities.hasIn(['videos', metadataId, 'grandparentRatingKey'])

    if (videoType === MediaTypes.MOVIE || (videoType === MediaTypes.EPISODE && hasGrandparentId)) {
      return dispatch(addMediaKeys({
        keys: [metadataId]
      }))
    }

    if (videoType === MediaTypes.EPISODE) {
      return WebAPI.fetchMetadata(metadataId).then((data) => dispatch(addMediaKeys({
        entities: data.entities,
        keys: data.result.videos
      })))
    }

    const videos = entities.get('videos')
    const addKeys = pickKeys(videos, metadataId, videoType)

    if (addKeys.length) {
      return dispatch(addMediaKeys({
        keys: addKeys
      }))
    }

    return WebAPI.fetchFullMetadata(metadataId, videoType).then((data) => {
      const { entities, result: { videos } } = data
      dispatch(addMediaKeys({
        entities,
        keys: videos
      }))
    })

  }
}

export function addAllMedia(metadataIds = []) {
  return (dispatch, getState) => {
    const { entities } = getState()
    const isMovies = metadataIds.map((metadataId) =>
                                             entities.getIn(['videos', metadataId],
                                             entities.getIn(['directories', metadataId]))
                                )
                                .every((video) => video.get('type') === MediaTypes.MOVIE)


    if (isMovies) {
      return dispatch(addMediaKeys({
        keys: metadataIds
      }))
    }

    return metadataIds.forEach((metadataId) => dispatch(addMedia(metadataId)))
  }
}


export const removeMediaKeys = createAction(REMOVE_MEDIA)

export function removeMedia(metadataId) {
  return (dispatch, getState) => {
    const state = getState()
    const { entities } = state
    const videoType = entities.getIn(['videos', metadataId, 'type'],
                      entities.getIn(['directories', metadataId, 'type'], ''))

    const videos = entities.get('videos')

    const removeKeys = pickKeys(videos, metadataId, videoType)

    dispatch(removeMediaKeys({
      keys: removeKeys
    }))

  }
}

export const removeAllMedia = createAction(CLEAR_MEDIA)
