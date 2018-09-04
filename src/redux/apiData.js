import { hotspotOptionsUrl, layoutUrl, loginUrl, logoutUrl, optionsRatingUrl, profileUrl } from '../constants/apiUrls'
import { schema } from 'normalizr'

const theme = new schema.Entity('theme')

const hotspot = new schema.Entity('hotspot')

const space = new schema.Entity('space', {
  theme: theme,
  hotspots: [hotspot]
})

const studio = new schema.Entity('studio', {
  spaces: [space]
})

const layoutSchema = new schema.Array(studio)

export const endpointConfig = {
  postLogin: {
    url: loginUrl,
    method: 'POST'
  },
  doLogout: {
    url: logoutUrl,
    method: 'GET',
    cacheDuration: 0
  },
  getFloorplan: {
    url: layoutUrl,
    method: 'GET',
    responseSchema: layoutSchema
  },
  getHotspotOptions: {
    url: hotspotOptionsUrl,
    method: 'GET',
    cacheDuration: 0
  },
  updateOptions: {
    url: optionsRatingUrl,
    method: 'PATCH'
  },
  getProfile: {
    url: profileUrl,
    method: 'GET'
  }
}
