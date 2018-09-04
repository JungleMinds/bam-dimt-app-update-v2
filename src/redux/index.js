// @flow
import { reducer } from 'react-api-data'
import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import content, { type ContentState } from './content'
import hotspot, { type HotspotState } from './hotspot'
import dock, { defaultDockState, type DockState } from './dock'
import settings, { defaultSettingsState, type SettingsState } from './settings'
import location, { defaultLocationState, type LocationState } from './location'
import preferences, { type PreferencesState } from './preferences'
import user, { type UserState } from './user'
import { endpointConfig } from './apiData'

export type AppState = ContentState &
  HotspotState &
  LocationState &
  PreferencesState &
  SettingsState &
  UserState &
  DockState

const config = {
  key: 'root',
  storage
}

const appReducers = persistCombineReducers(config, {
  content,
  hotspot,
  location,
  preferences,
  dock,
  settings,
  user,
  apiData: reducer
})

export default function rootReducer (state: any, action: any) {
  if (action.type === 'LOGOUT') {
    state = {
      _persist: state['_persist'],
      apiData: {
        globalConfig: {},
        endpointConfig: endpointConfig,
        requests: {},
        entities: {}
      },
      location: {
        ...defaultLocationState,
        tagPosition: state.location.tagPosition
      },
      dock: {
        ...defaultDockState,
        ...state.dock
      },
      settings: {
        ...defaultSettingsState,
        tagId: state.settings.tagId,
        tabletWallIndex: state.settings.tabletWallIndex
      }
    }
  }

  return appReducers(state, action)
}
