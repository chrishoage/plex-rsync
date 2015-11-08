import 'babel-core/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import { Provider } from 'react-redux'
import configureStore from 'store/configureStore'
import routes from './routes'
import * as normalizers from 'utils/normalizers'

const store = configureStore()

const socket = io()

socket.on('message', (message) => {
  message.payload = normalizers.job(message.payload)
  store.dispatch(message)
})

ReactDOM.render(
  <Provider store={store}>
  {routes}
  </Provider>,
  document.getElementById('app'))
