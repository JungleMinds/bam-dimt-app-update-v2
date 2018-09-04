// @flow

// state def

import type { ISpaceHotspot } from '../entities'

export type HotspotState = {
  isLoading: boolean,
  error: string,
  current?: ISpaceHotspot,
  pressedHotspot?: string,
  selectedSpace?: number,
  hotspotsToggled: boolean
}

const defaultState: HotspotState = {
  isLoading: false,
  error: '',
  current: undefined,
  pressedHotspot: undefined,
  selectedSpace: undefined,
  hotspotsToggled: false
}

export type SET_HOTSPOT = {
  type: 'SET_HOTSPOT',
  payload: ISpaceHotspot
}

export type UNSET_HOTSPOT = {
  type: 'UNSET_HOTSPOT',
  payload: ISpaceHotspot
}

export type TOGGLE_HOTSPOT = {
  type: 'TOGGLE_HOTSPOT',
  payload: boolean
}

// actions
type Action = SET_HOTSPOT | UNSET_HOTSPOT

// reducer

export default (state: HotspotState = defaultState, action: Action) => {
  switch (action.type) {
    case 'SET_HOTSPOT': {
      return {
        ...state,
        current: action.payload
      }
    }
    case 'UNSET_HOTSPOT': {
      return {
        ...state,
        current: undefined
      }
    }
    case 'SET_SELECTED_SPACE': {
      return {
        ...state,
        selectedSpace: action.payload
      }
    }
    case 'TOGGLE_HOTSPOT': {
      return {
        ...state,
        hotspotsToggled: action.payload
      }
    }
    default:
      return state
  }
}

// action creators

export const setHotspot = (hotspot: ISpaceHotspot) => ({
  type: 'SET_HOTSPOT',
  payload: hotspot
})

export const unsetHotspot = () => ({
  type: 'UNSET_HOTSPOT'
})

export const setSelectedSpace = (spaceId: number) => ({
  type: 'SET_SELECTED_SPACE',
  payload: spaceId
})

export const toggleHotspots = (open: boolean) => ({
  type: 'TOGGLE_HOTSPOT',
  payload: open
})
