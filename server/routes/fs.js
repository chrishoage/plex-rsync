import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'
import df from 'node-df'

Promise.promisifyAll(fs)

const dfAsync = Promise.promisify(df)

const BASE_PATH = '/Volumes'
// TODO: Modify df module to take custom flags. Pass -l to limit to local disks.
// Remove df call for each item in the folder
export function get({params}, res) {
  const paramsPath = Object.keys(params).map((key) => params[key]).join('/') || ''
  const fsPath = path.join(BASE_PATH, paramsPath)
  fs.readdirAsync(fsPath).then((dirlist) => {
    return Promise.filter(dirlist, (item) => {
      if (item.startsWith('.')) return false
      return fs.statAsync(path.join(fsPath, item))
               .then((stat) => stat.isDirectory())
    }).map((dir) => {
      const dfOpts = {
        file: `"${path.join(fsPath, dir)}"`,
        //prefixMultiplier: 'GB',
        //isDisplayPrefixMultiplier: true,
        precision: 2
      }
      return dfAsync(dfOpts).then(([stats]) => {
        const {size: total} = stats
        const overrides = {
          path: `/${path.join(paramsPath, dir)}`,
          total,
          size: undefined,
          filesystem: undefined,
          mount: undefined
        }
        return Object.assign({}, stats, overrides)
      })
    })
  }).then((results) => {
    res.json({results})
  })
}
