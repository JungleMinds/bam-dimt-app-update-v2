// @flow
import type { IPoint } from '../entities'
// state def

export type SettingsState = {
  tagId: string,
  tabletWallDimensions: {
    rows: number,
    cols: number
  },
  tabletWallIndex: IPoint
}

export const defaultSettingsState: SettingsState = {
  tagId: '1',
  tabletWallDimensions: {
    rows: 0,
    cols: 0
  },
  tabletWallIndex: {
    x: 0,
    y: 0
  }
}

export type SET_TAG_ID = {
  type: 'SET_TAG_ID',
  payload: string
}

export type SET_TABLET_WALL_INDEX = {
  type: 'SET_TABLET_WALL_INDEX',
  payload: IPoint
}

export type SET_TABLET_WALL_DIMENSIONS = {
  type: 'SET_TABLET_WALL_DIMENSIONS',
  payload: {
    rows: number,
    cols: number
  }
}

// actions
type Action = SET_TAG_ID | SET_TABLET_WALL_INDEX

// reducer
export default (state: SettingsState = defaultSettingsState, action: Action) => {
  switch (action.type) {
    case 'SET_TAG_ID' : {
      return {
        ...state,
        tagId: action.payload
      }
    }
    case 'SET_TABLET_WALL_INDEX': {
      return {
        ...state,
        tabletWallIndex: action.payload
      }
    }
    case 'SET_TABLET_WALL_DIMENSIONS': {
      return {
        ...state,
        tabletWallDimensions: action.payload
      }
    }
    default:
      return state
  }
}

// action creators
export const setTagId = (tagId: string) => ({
  type: 'SET_TAG_ID',
  payload: tagId
})

export const setTabletWallIndex = (wallIndex: IPoint) => ({
  type: 'SET_TABLET_WALL_INDEX',
  payload: wallIndex
})

export const setTabletWallDimensions = (Dimensions: {
  rows: number,
  cols: number
}) => ({
  type: 'SET_TABLET_WALL_DIMENSIONS',
  payload: Dimensions
})
