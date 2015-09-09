import Promise from 'bluebird'
import path from 'path'
import fs from 'fs'
import df from 'node-df'

Promise.promisifyAll(fs)

const dfAsync = Promise.promisify(df)

const dfNormalize = (mount, paramsPath, folderPath = '') => {
  const {size: total} = mount
  paramsPath = paramsPath.replace(mount.mount, '')
  folderPath = folderPath === '' ? mount.mount : path.join(mount.mount, paramsPath, folderPath)
  return {
    ...mount,
    total,
    path: folderPath,
    size: undefined,
    filesystem: undefined
  }
}

export function get({params}, res) {
  const paramsPath = Object.keys(params).map((key) => params[key]).join('/') || ''
  const hasPath = paramsPath !== ''
  const dfOpts = {
    file: hasPath ? `"${paramsPath}"` : ''
  }
  dfAsync(dfOpts).then((localMounts) => {
    if (!hasPath) {
      return localMounts.filter((mnt) => mnt.size > 200).map((mnt) => dfNormalize(mnt, paramsPath))
    }
    const [stats] = localMounts
    return dfNormalize(stats, paramsPath)
  }).then((data) => {
    if (hasPath) {
      return fs.readdirAsync(paramsPath).then((dirlist) => {
          return Promise.filter(dirlist, (item) => {
            if (item.startsWith('.')) return false
            return fs.statAsync(path.join(paramsPath, item))
                     .then((stat) => stat.isDirectory())
          }).then((folders) => {
            const results = folders.map((f) => dfNormalize(data, paramsPath, f))
            return res.json({results})
          })
        })

    } else {
      return res.json({results: data})
    }

  })

}
