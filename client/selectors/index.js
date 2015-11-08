import { createSelector } from 'reselect'
import { isDefined } from 'utils/functions'

export const destSelector = (state) => state.dest
export const jobsSelector = (state) => state.jobs
export const entitiesSelector = (state, props) => state.entities
export const librarySelector = (state) => state.library
export const copyKeysSelector = (state) => state.copyKeys

export const jobListSelector = createSelector(
  [entitiesSelector, jobsSelector],
  (entities, jobs) => {
    const bag = entities.get('jobs')
    return jobs.map((jobId) => bag.get(jobId))
  }
)

export const runningJobsCountSelector = createSelector(
  [jobListSelector],
  (jobList) => {
    return jobList.filter((job) => job.get('status') !== 'COMPLETED').size
  }
)

export const runningJobsSelector = createSelector(
  [jobListSelector, runningJobsCountSelector],
  (jobList, runningJobsCount) => {
    return {
      jobList,
      runningJobsCount
    }
  }
)

export const copyPartsListSelector = createSelector(
  [copyKeysSelector, entitiesSelector],
  (copyKeys, entities) => {
    const videos = entities.get('videos')
    const media = entities.get('media')
    const parts = entities.get('parts')

    return copyKeys.map((key) => {
      const mediaKey = videos.getIn([key, 'media']).first()
      const partsKey = media.getIn([mediaKey, 'parts']).first()
      const part = parts.get(partsKey)
      return part
    })
  }
)

export const spaceUsedSelector = createSelector(
  [entitiesSelector, copyKeysSelector],
  (entities, copyKeys) => {
    const parts = entities.get('parts')
    const media = entities.get('media')
    const videos = entities.get('videos')
    if (!parts || !media || !videos) return 0
    return copyKeys.reduce((addedUsed, key) => {
      const mediaKey = videos.getIn([key, 'media']).first()
      const partsKey = media.getIn([mediaKey, 'parts']).first()
      const mediaSize = parts.getIn([partsKey, 'size'])
      return addedUsed + mediaSize
    }, 0)
  }
)

export const destInfoSelector = createSelector(
  [destSelector, spaceUsedSelector],
  (dest, addedUsed) => {
    return {
      dest,
      addedUsed
    }
  }
)

export const copyListSelector = createSelector(
  [entitiesSelector, copyKeysSelector],
  (entities, copyKeys) => {

    const videos = entities.get('videos')
    const copyVideos = copyKeys.map((key) => videos.get(key))
    const copyList = copyVideos.reduce((coll, key, val) => {
      const possibleKeys = [val.get('ratingKey'), val.get('parentRatingKey'), val.get('grandparentRatingKey')]
      const keys = possibleKeys.filter(isDefined)
      return coll.concat(...keys)
    }, [])

    return copyList
  }
)

export const libraryResultsSelector = createSelector(
  [entitiesSelector, librarySelector, copyListSelector],
  (entities, library, copyList) => {
    const entityKey = library.has('directories') ? 'directories' : 'videos'
    const bag = entities.get(entityKey)
    const resultList = library.get(entityKey)
    if (!bag || !resultList) return {}

    const list = resultList.map((key) => bag.get(key)).filter(isDefined)

    return {
      list,
      copyList
    }
  }
)

export const librarySectionsSelector = createSelector(
  [entitiesSelector, librarySelector],
  (entities, library) => {
    const bag = entities.get('libraries')
    const results = library.get('directories')
    if (!bag || !results) return {}
    const list = results.map((key) => bag.get(key)).filter(isDefined)
    console.log('librarySectionsSelector', bag, results, list)
    return {
      list
    }
  }
)
