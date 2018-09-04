// @flow

/*
 * contains reducer, actions, action creators and selectors for all user location related data
 */

export type DockDataLoadedAction = {
  type: 'DOCK_DATA_LOADED',
  payload: {
    docks: any,
    tabletwallImages: Array<string>,
    serverTime: number
  }
}

export type DockDockAction = {
  type: 'DOCK_TABLET_DOCKED',
  payload: {
    isDocked: boolean
  }
}

export type IDock = {
   id: string,
   type: string
}

type Action = DockDataLoadedAction

export type DockState = {
  isDocked: boolean,
  docks: Array<any>,
  tabletwallImages: Array<any>,
  currentDock: ?IDock,
  prevDock: ?IDock,
  serverTime: ?number
}

export const defaultDockState: DockState = {
  isDocked: false,
  docks: [],
  tabletwallImages: [],
  currentDock: null,
  prevDock: null,
  serverTime: null
}

// action creators
const reducer = (
  state: DockState = defaultDockState,
  action: Action
): DockState => {
  switch (action.type) {
    case 'DOCK_DATA_LOADED':
    case 'DOCK_TABLET_DOCKED':
      return {
        ...state,
        ...action.payload
      }
    case 'DOCK_UNDOCK':
      return {
        ...state,
        prevDock: state.currentDock,
        currentDock: null
      }
    case 'DOCK_DOCK':
      return {
        ...state,
        currentDock: action.dock
      }
    default:
      return state
  }
}

export const dockDataLoaded = (payload: any) => ({
  type: 'DOCK_DATA_LOADED',
  payload
})

export const dockTabletDocked = (payload: {isDocked: boolean}) => ({
  type: 'DOCK_TABLET_DOCKED',
  payload
})

export const dockDataLoadedError = (payload: Object) => ({
  type: 'DOCK_ON_CONNECT_ERROR',
  payload
})

export const dockUndock = () => ({
  type: 'DOCK_UNDOCK'
})

export const dockDock = (dock: IDock) => ({
  type: 'DOCK_DOCK',
  dock
})

export default reducer
