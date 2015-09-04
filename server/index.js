import { Server } from 'http'
import express from 'express'
import SocketIO from 'socket.io'
import bodyParser from 'body-parser'
import * as routes from './routes'

const {
  HOST = '0.0.0.0',
  PORT = 8888,
  WEBPACK_PORT = PORT,
  NODE_ENV = 'production'
} = process.env

const app = express()

const server = Server(app)

const io = SocketIO(server)

app.set('socketio', io)
app.set('server', server)

app.use(bodyParser.json())

app.use(express.static('dist'))

const bundleSrc = NODE_ENV === 'development' ? `http://${HOST}:${WEBPACK_PORT}` : ''
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Plex Compare</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
</head>
<body>
  <div id="app"></div>
  <script src="${bundleSrc}/public/bundle.js"></script>
</body>
</html>
`

app.get('/', (req, res) => {
  res.send(indexHtml)
})

app.get('/api/plex/*', routes.plex.get)

app.get('/api/rsync', routes.rsync.get)
app.post('/api/rsync', routes.rsync.create)
app.delete('/api/rsync/:id', routes.rsync.remove)

app.get('/api/fs/*', routes.fs.get)

server.listen(PORT, HOST, () => {
  console.log('Api listening at http://%s:%s', HOST, PORT)
})
