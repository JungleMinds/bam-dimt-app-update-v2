// @flow

// state def

import type { ISpaceHotspot, IContent } from '../entities'

export type ContentState = {
  isLoading: boolean,
  error: string,
  content?: IContent,
  hotspot?: ISpaceHotspot
}

const defaultState: ContentState = {
  isLoading: false,
  error: '',
  content: undefined,
  hotspot: undefined
}

export type FETCH_CONTENT = {
  type: 'FETCH_CONTENT'
}

export type FETCH_CONTENT_SUCCESS = {
  type: 'FETCH_CONTENT_SUCCESS',
  payload: {
    content: IContent
  }
}

export type FETCH_CONTENT_FAILED = {
  type: 'FETCH_CONTENT_FAILED',
  payload: {
    message: string
  }
}

// actions
type Action = FETCH_CONTENT | FETCH_CONTENT_SUCCESS | FETCH_CONTENT_FAILED

// reducer
export default (state: ContentState = defaultState, action: Action) => {
  switch (action.type) {
    case 'FETCH_CONTENT': {
      return {
        ...state,
        isLoading: true
      }
    }
    case 'FETCH_CONTENT_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        error: '',
        content: action.payload.content
      }
    }
    case 'FETCH_CONTENT_FAILED': {
      return {
        ...state,
        isLoading: false,
        error: action.payload.message
      }
    }
    default:
      return state
  }
}

// action creators
export const fetchContent = () => ({
  type: 'FETCH_CONTENT'
})
