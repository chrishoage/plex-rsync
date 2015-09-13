import { Server } from 'http'
import express from 'express'
import SocketIO from 'socket.io'
import bodyParser from 'body-parser'
import * as routes from './routes'

const {
  HOST = 'localhost',
  PORT = 8888
} = process.env

const app = express()

const server = Server(app)

const io = SocketIO(server)

app.set('socketio', io)
app.set('server', server)

app.use(bodyParser.json({limit: '5mb'}))

app.use(express.static('dist'))

app.get('/', routes.index.get)

app.get('/api/plex/*', routes.plex.get)

app.get('/api/rsync', routes.rsync.get)
app.post('/api/rsync', routes.rsync.create)
app.delete('/api/rsync/:id', routes.rsync.remove)

app.get('/api/fs', routes.fs.get)
app.get('/api/fs/*', routes.fs.get)

server.listen(PORT, HOST, () => {
  console.log('Api listening at http://%s:%s', HOST, PORT)
})
