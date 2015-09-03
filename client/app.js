import 'babel-core/polyfill'
import React from 'react'
import io from 'socket.io-client'
import HashHistory from 'react-router/lib/HashHistory'
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

React.render(
  <Provider store={store}>
  {routes.bind(null, new HashHistory())}
  </Provider>,
  document.getElementById('app'))
