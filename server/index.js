import { Server } from 'http'
import express from 'express'
import SocketIO from 'socket.io'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
import * as routes from './routes'

const staticFiles = serveStatic('public')

const app = express()

const server = Server(app)

const io = SocketIO(server)

app.set('socketio', io)
app.set('server', server)

app.use(bodyParser.json())

app.use(staticFiles)

app.get('/api/plex/*', routes.plex.get)

app.get('/api/rsync', routes.rsync.get)
app.post('/api/rsync', routes.rsync.create)
app.delete('/api/rsync/:id', routes.rsync.remove)

app.get('/api/fs/*', routes.fs.get)

const {
  HOST: host = '0.0.0.0',
  PORT: port = 8888
} = process.env

server.listen(port, host, () => {
  console.log('Api listening at http://%s:%s', host, port)
})
