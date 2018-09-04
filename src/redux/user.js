// @flow

// state def

export type UserState = {
  email: string,
  timestamp: number,
  loggedIn: boolean
}

const defaultState: UserState = {
  email: '',
  timestamp: 0,
  loggedIn: false
}

export type SET_CREDENTIALS = {
  type: 'SET_CREDENTIALS',
  payload: {email: string, timestamp: string}
}

// actions
type Action =
  SET_CREDENTIALS

// reducer

export default (state: UserState = defaultState, action: Action) => {
  switch (action.type) {
    case 'SET_CREDENTIALS': {
      return {
        ...state,
        ...action.payload,
        loggedIn: true
      }
    }
    case 'LOGGED_OUT': {
      return {
        ...defaultState
      }
    }
    default:
      return state
  }
}

// action creators

export const setCredentials = (email: string, timestamp: number) => ({
  type: 'SET_CREDENTIALS',
  payload: {email, timestamp}
})

export const logout = () => ({
  type: 'LOGOUT'
})
