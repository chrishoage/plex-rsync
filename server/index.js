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

// if (process.env.NODE_ENV !== 'production') {
//   const webpack = require('webpack')
//   const WebpackDevServer = require('webpack-dev-server')
//   const webpackConfig = require('../webpack.config')

//   new WebpackDevServer(webpack(webpackConfig), {
//     publicPath: '/public/',
//     contentBase:'/public/',
//     inline: true,
//     hot: true,
//     stats: true,
//     historyApiFallback: true,
//     headers: {
//       'Access-Control-Allow-Origin': `http://${host}:${port}`,
//       'Access-Control-Allow-Headers': 'X-Requested-With'
//     }
//   }).listen(3000, 'localhost', (err) => {
//     if (err) {
//       console.log(err)
//     }

//     console.log('webpack dev server listening on localhost:3000')
//   })
// }
