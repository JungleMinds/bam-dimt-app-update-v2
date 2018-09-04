// @flow

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore } from 'redux-persist'
import { configureApiData } from 'react-api-data'

import { endpointConfig } from './redux/apiData'
import rootReducer from './redux/index'

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const setHeaders = () => ({
  'X-BAM-ECW-App': '1'
})

export default () => {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  )

  const persistor = persistStore(store, {}, () => {
    store.dispatch(configureApiData({setHeaders, setRequestProperties: () => ({credentials: 'include'})}, endpointConfig))
  })

  return { persistor, store }
}
