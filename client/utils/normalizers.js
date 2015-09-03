import { normalize, Schema, arrayOf } from 'normalizr'

const jobSchema = new Schema('jobs', {idAttribute: 'id'})

const libraries = new Schema('libraries', {idAttribute: 'key'})
const videos = new Schema('videos', {idAttribute: 'ratingKey'})
const directories = new Schema('directories', {idAttribute: 'ratingKey'})

const media = new Schema('media')
const parts = new Schema('parts')
const streams = new Schema('streams')
const genres = new Schema('genres', {idAttribute: 'tag'})
const writers = new Schema('writers', {idAttribute: 'tag'})
const roles = new Schema('roles', {idAttribute: 'tag'})
const directors = new Schema('directors', {idAttribute: 'tag'})
const countries = new Schema('countries', {idAttribute: 'tag'})
const locations = new Schema('locations', {idAttribute: 'path'})

libraries.define({
  locations: arrayOf(locations)
})

directories.define({
  roles: arrayOf(roles),
  genres: arrayOf(genres),
  locations: arrayOf(locations)
})

videos.define({
  media: arrayOf(media),
  parts: arrayOf(parts),
  writers: arrayOf(writers),
  genres: arrayOf(genres),
  roles: arrayOf(roles),
  countries: arrayOf(countries),
  directors: arrayOf(directors)
})

media.define({
  parts: arrayOf(parts)
})

parts.define({
  streams: arrayOf(streams)
})

const mediaContainerSchema = {
  directories: arrayOf(directories),
  videos: arrayOf(videos)
}

const librarySchema = {
  directories: arrayOf(libraries)
}

const jobsSchema = {
  jobs: arrayOf(jobSchema)
}

export function job(data) {
  return normalize(data, jobSchema)
}

export function jobs(data) {
  return normalize(data, jobsSchema)
}

export function library(data) {
  return normalize(data, librarySchema)
}

export function mediaContainer(data) {
  return normalize(data, mediaContainerSchema)
}
