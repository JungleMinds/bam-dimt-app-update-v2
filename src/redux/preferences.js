// @flow
import type { IContent } from '../entities'
// state def

export type IHotspotsProgress = {
   [number]: boolean
}

export type PreferencesState = {
  theme?: string,
  swipedAtLeastOnce: boolean,
  hotspotsProgress: IHotspotsProgress
}

const defaultState: PreferencesState = {
  theme: undefined,
  swipedAtLeastOnce: false,
  hotspotsProgress: {}
}
// actions

type RegisterAction = {
  type: 'REGISTER_FIRST_SWIPE'
}

type UpdatePreferenceThemeAction = {
  type: 'UPDATE_PREFERENCE_THEME',
  payload: string
}

type UnsetPreferenceThemeAction = {
  type: 'UNSET_PREFERENCE_THEME'
}

type SaveProgressAction = {
  type: 'SAVE_PROGRESS',
  payload: {
    hotspotsProgress: IHotspotsProgress,
    swipedAtLeastOnce: boolean
  }
}

type UpdateProgressAction = {
  type: 'UPDATE_PROGRESS',
  payload: {id: number}
}

export type Action =
  | RegisterAction
  | UpdatePreferenceThemeAction
  | UnsetPreferenceThemeAction
  | SaveProgressAction
  | UpdateProgressAction

// reducer

export default (
  state: PreferencesState = defaultState,
  action: Action
): PreferencesState => {
  switch (action.type) {
    case 'REGISTER_FIRST_SWIPE': {
      return {
        ...state,
        swipedAtLeastOnce: true
      }
    }
    case 'UPDATE_PREFERENCE_THEME': {
      return {
        ...state,
        theme: action.payload
      }
    }
    case 'UNSET_PREFERENCE_THEME': {
      return {
        ...state,
        theme: undefined
      }
    }
    case 'SAVE_PROGRESS': {
      return {
        ...state,
        ...action.payload
      }
    }
    case 'UPDATE_PROGRESS': {
      if (state.hotspotsProgress[action.payload.id]) {
        return state
      }

      return {
        ...state,
        hotspotsProgress: {
          ...state.hotspotsProgress,
          [action.payload.id]: true
        }
      }
    }
    default:
      return state
  }
}

// action creators

export const registerFirstSwipe = (): RegisterAction => ({
  type: 'REGISTER_FIRST_SWIPE'
})

export const updatePreferenceTheme = (theme: string): UpdatePreferenceThemeAction => ({
  type: 'UPDATE_PREFERENCE_THEME',
  payload: theme
})

export const unsetPreferenceTheme = (): UnsetPreferenceThemeAction => ({
  type: 'UNSET_PREFERENCE_THEME'
})

export const saveProgess = (floorplan: IContent) => {
  let hotspotsProgress = {}
  floorplan.forEach(studio => {
    studio.spaces.forEach(space => {
      space.hotspots.forEach(hotspot => {
        hotspotsProgress[hotspot.id] = hotspot.hasRating
      })
    })
  })

  const hasHotspotWithRating = !!Object.keys(hotspotsProgress).find(key => hotspotsProgress[key])

  return {
    type: 'SAVE_PROGRESS',
    payload: {
      hotspotsProgress,
      swipedAtLeastOnce: hasHotspotWithRating
    }
  }
}

export const updateProgress = (id: number): UpdateProgressAction => ({
  type: 'UPDATE_PROGRESS',
  payload: {id}
})
