import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import persistState, { mergePersistedState } from 'redux-localstorage'
import fromJSMapped from 'utils/fromJSMapped'
import * as reducers from 'reducers'

const logger = createLogger({
  level: 'info',
  collapsed: false,
  transformer(state) {
    return Object.keys(state).reduce((obj, key) => {
      obj[key] = state[key].toJSON()
      return obj
    }, {})
  }
})
const rootReducer = combineReducers(reducers)
const finalReducer = compose(
  mergePersistedState((initialState, persistedState) => {
    return Object.keys(persistedState).reduce((obj, key) => {
      obj[key] = initialState[key].mergeDeep(fromJSMapped(persistedState[key]))
      return obj
    }, {})
  })
)(rootReducer)

const finalCreateStore = compose(
  applyMiddleware(thunk, logger),
  persistState()
)(createStore)

export default function configureStore(initialState) {
  const store = finalCreateStore(finalReducer, initialState)
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      const nextRootReducer = require('reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
