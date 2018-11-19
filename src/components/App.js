// @flow

import React, { Component } from 'react'
import { StatusBar, Text } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'

import Sentry from 'sentry-expo'
import { Font, ScreenOrientation } from 'expo'

import createStore from '../createStore'
import ContentProvider from './ContentProvider'
import DockScreen from './DockScreen'

// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = false

// Hot reloading doesn't work that well with Sentry, uncomment when to production
// Sentry.config('https://246f1ded205a4f36b675840b2f4cfa89@sentry.io/1196069').install()

const { persistor, store } = createStore()

type AppState = {
  loaded: boolean
}

export default class App extends Component<null, AppState> {
  state = {
    loaded: false
  }

  componentDidMount() {
    // the tablet is held upside-down
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_DOWN)
    this.loadAssetsAndUpdate()
  }

  loadAssetsAndUpdate = async () => {
    await Font.loadAsync({
      'foco-regular': require('../assets/fonts/Foco_A_Rg.ttf'),
      'foco-bold': require('../assets/fonts/Foco_A_Bd.ttf'),
      'foco-italic': require('../assets/fonts/Foco_A_It.ttf')
    })

    this.setState({ loaded: true })
    store.dispatch({ type: 'LOGOUT' })
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Text>Loading</Text>}>
          <StatusBar hidden />
          {this.state.loaded && <ContentProvider />}
          {this.state.loaded && <DockScreen />}
        </PersistGate>
      </Provider>
    )
  }
}
