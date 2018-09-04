// @flow
import type { IPoint } from '../entities'
import parseLocation from '../services/location/parseLocation'

/*
 * contains reducer, actions, action creators and selectors for all user location related data
 */

export type LocationState = {
  connected: boolean,
  tagPosition: IPoint,
  errors: Array<string>
}

type ConnectAction = {
  type: 'SOCKET_ON_CONNECT',
  payload: Object
}

type ConnectErrorAction = {
  type: 'SOCKET_ON_CONNECT_ERROR',
  payload: {
    message: string
  }
}

type MessageAction = {
  type: 'SOCKET_ON_MESSAGE',
  payload: string
}

type Action =
  | ConnectAction
  | MessageAction
  | ConnectErrorAction

export const defaultLocationState: LocationState = {
  connected: false,
  errors: [],
  tagPosition: {
    x: 0,
    y: 0
  }
}

// action creators
const reducer = (
  state: LocationState = defaultLocationState,
  action: Action
): LocationState => {
  switch (action.type) {
    case 'SOCKET_ON_CONNECT':
      return {
        ...state,
        connected: true
      }
    case 'SOCKET_ON_CONNECT_ERROR':
      return {
        ...state,
        errors: [
          ...state.errors.slice(-10),
          action.payload.message
        ]
      }
    case 'SOCKET_ON_MESSAGE':
      const tagPosition = parseLocation(action.payload, {...state.tagPosition})
      return {
        ...state,
        tagPosition
      }
    case 'SET_TAG_ID':
      return {
        ...state,
        tagPosition: defaultLocationState.tagPosition
      }
    default:
      return state
  }
}

export const socketOnConnect = (payload: boolean) => ({
  type: 'SOCKET_ON_CONNECT',
  payload
})

export const socketOnMessage = (payload: string) => ({
  type: 'SOCKET_ON_MESSAGE',
  payload
})

export const socketOnConnectError = (payload: Object) => ({
  type: 'SOCKET_ON_CONNECT_ERROR',
  payload
})

export default reducer
