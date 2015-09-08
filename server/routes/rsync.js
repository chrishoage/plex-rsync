import Promise from 'bluebird'
import Rsync from 'rsync'
import path from 'path'
import df from 'node-df'

const jobs = new Map()
const jobObjects = new Map()

const dfAsync = Promise.promisify(df)

// signal handler function
const quitting = function() {
  jobs.forEach((job) => {
    if (job.status !== 'COMPLETED') {
      const jobObject = jobObjects.get(job.pid)
      if (jobObject) jobObject.kill()
    }
  })
  process.exit()
}
process.on('SIGINT', quitting) // run signal handler on CTRL-C
process.on('SIGTERM', quitting) // run signal handler on SIGTERM
process.on('exit', quitting) // run signal handler when main process exits


const BASE_PATH = '/Volumes'

function saveEmitUpdate(id, job, io) {
  jobs.set(id, job)
  io.emit('message', {
    type: 'PROGRESS_UPDATE',
    payload: job
  })
}

function startJob(opts, io) {
  const rsync = Rsync.build(opts)
  const rsyncCommand = rsync.command()

  const rsyncJob = rsync.execute((error) => {
    const job = jobs.get(id)
    if (job.status !== 'ERROR') {
      job.status = 'COMPLETED'
    }
    if (jobObjects.has(pid)) jobObjects.delete(pid)
    saveEmitUpdate(id, job, io)
  }, (stdout) => {
    const job = jobs.get(id)
    const line = new Buffer(stdout).toString()
    console.log(line)
    job.output += line
    if (job.status === 'PREPARING') {
      job.status = 'TRANSFERING'
    }
    saveEmitUpdate(id, job, io)
  }, (stderr) => {
    const job = jobs.get(id)
    const line = new Buffer(stderr).toString()
    console.log(line)
    job.status = 'ERROR'
    job.output += line
    if (jobObjects.has(pid)) jobObjects.delete(pid)
    saveEmitUpdate(id, job, io)
  })

  const { pid } = rsyncJob
  const id = jobs.size
  const job = {
    id,
    pid,
    status: 'PREPARING',
    output: ''
  }
  jobs.set(id, job)
  jobObjects.set(pid, rsyncJob)
  return job
}

export function get(req, res) {
  res.json({
    jobs: Array.from(jobs.values())
  })
}

// TODO: remove df from parts list reduce. Only call df once
// and figure out common root path programmatically
export function create({body, app}, res) {
  const { partsList, destPath } = body

  Promise.reduce(partsList, (opts, val) => {
    const dfOpts = {
      file: `"${val}"`
    }
    return dfAsync(dfOpts).then(([{mount}]) => {
      opts.source = Array.isArray(opts.source) ? opts.source : []
      opts.include = Array.isArray(opts.include) ? opts.include : []
      const fixedMount = mount + '/'
      const source = fixedMount
      if (!opts.source.includes(source)) {
        opts.source.push(source)
      }
      opts.include.push(val.replace(fixedMount, ''))
      return opts
    })
  }, {}).then((rsyncOpts) => {
    rsyncOpts.include = ['*/', ...rsyncOpts.include]
    rsyncOpts.exclude = ['*']
    rsyncOpts.flags = ['a', 'v', 'z', 'm', 'stats', 'progress'] // dry 'n',
    rsyncOpts.destination = path.join(BASE_PATH, destPath)
    const job = startJob(rsyncOpts, app.get('socketio'))
    res.json(job)
  })

}

export function remove({params: { id }}, res) {

  id = parseInt(id, 10)
  if (!jobs.has(id)) return res.status(404)
  const job = jobs.get(id)

  if (jobObjects.has(job.pid)) {
    const jobObject = jobObjects.get(job.pid)
    jobObject.on('close', () => {
      jobObjects.delete(job.pid)
      jobs.delete(id)
      res.status(201)
      console.log('remove and kill job', id, job.pid)
    })
    jobObject.kill()

  } else {
    jobs.delete(id)
    res.status(201)
    console.log('remove job', id, job.pid)
  }


}
