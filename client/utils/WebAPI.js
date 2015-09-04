import axios from 'axios'
import { merge } from 'lodash'
import * as normalizers from './normalizers'

export function fetchJobs() {
  return axios.get('/api/rsync').then((res) => normalizers.jobs(res.data))
}

export function startJob(partsList, destPath) {
  return axios.post('/api/rsync', {
    partsList,
    destPath
  }).then((res) =>  normalizers.job(res.data))
}

export function removeJob(jobId) {
  return axios.delete(`/api/rsync/${jobId}`).then(() => jobId)
}

export function fetchLibrary() {
  return axios.get(`/api/plex/library/sections`).then((res) => normalizers.library(res.data))
}

export function fetchSection(section) {
  return axios.get(`/api/plex/library/sections/${section}/all`).then((res) => normalizers.mediaContainer(res.data))
}

export function fetchMetadataChildren(id) {
  return axios.get(`/api/plex/library/metadata/${id}/children`)
              .then((res) => res.data)
              .then((data) => {
                if (data.directories) {
                  data.directories = data.directories.filter((dir) => dir.ratingKey !== undefined)
                }

                return data
              })
              .then((data) => normalizers.mediaContainer(data))
}

export function fetchMetadata(id) {
  return axios.get(`/api/plex/library/metadata/${id}`)
              .then((res) => normalizers.mediaContainer(res.data))
              .then((parentData) => {
                if (parentData.result.directories) {
                  return fetchMetadataChildren(id).then((childrenData) => {
                    const { key } = childrenData.result
                    const parentEntity = parentData.entities.directories[key]
                    const mergedParentEntity = merge({}, parentEntity, childrenData.result)
                    parentData.entities.directories[key] = mergedParentEntity
                    const entities = merge({}, parentData.entities, childrenData.entities)
                    return {
                      entities,
                      result: childrenData.result
                    }
                  })
                }

                return parentData
              })
}

export function fetchFullMetadata(id, videoType) {
  const subRoute = videoType === 'show' ? 'allLeaves' : 'children'
  return axios.get(`/api/plex/library/metadata/${id}/${subRoute}`)
              .then((res) => res.data)
              .then((data) => {
                const promises = data.videos.map(({ratingKey}) => fetchMetadata(ratingKey))
                return Promise.all(promises).then((results) => {
                  return results.reduce((coll, res) => {
                    return merge(coll, res, (a, b) => {
                      if (Array.isArray(a)) return a.concat(b)
                    })
                  }, {})
                })
              })
}
