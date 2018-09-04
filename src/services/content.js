// @flow
import type { IContent } from '../entities'

import {
  REACT_APP_CONTENTFUL_SPACE_ID,
  REACT_APP_CONTENTFUL_CONTENT_DELIVERY_API_AT
} from 'react-native-dotenv'
const { createClient } = require('contentful/dist/contentful.browser.min.js')

// setup contentful client sdk with the right credentials
const client = createClient({
  space: REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: REACT_APP_CONTENTFUL_CONTENT_DELIVERY_API_AT
})

// helper function to flatten contentful fields object
const fieldReducer = (fields, sys) => {
  return Object.keys(fields).reduce((fieldAcc, key) => {
    let val = fields[key]
    if (Array.isArray(val)) {
      val = val.map(child => fieldReducer(child.fields, child.sys))
    }

    return {
      ...fieldAcc,
      [key]: val,
      ...(sys && { id: sys.id })
    }
  }, {})
}

// formats the response from contentful to a usable object tree
// (strips all contentful system info etc.)
// TODO: define entities for /studio/space/hotspot/optiongroup/option
export const normalizeEntries = (content: Object): IContent => {
  const entries: IContent = content.items.map(item => ({
    ...fieldReducer(item.fields, item.sys)
  }))

  // console.log('normalized entries', entries)

  return entries
}

const parseError = error => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  } else if (error.request && error.request._response) {
    return error.request._response
  }

  return 'Er is een onbekende error opgetreden'
}

// the content api, currently only implements getEntries
// Retrieves all entries of type space and it's children's children until three levels deep
// which is all of our content form studio all the way down to option
const api = {
  getContent: () => {
    return client
      .getEntries({
        content_type: 'space',
        include: 3
      })
      .then(entries => {
        return normalizeEntries(entries)
      })
      .catch(error => {
        const response = parseError(error)
        throw new Error(response)
      })
  }
}
export default api
