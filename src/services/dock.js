// @flow
import {
  // settingsUrl,
  // tabletWallUrl,
  dockedEventUrl
} from '../constants/apiUrls'

export default (docked: boolean, dock: {id: string}) => {
  if (__DEV__) {
    console.log('dock endpoint: ', dockedEventUrl, 'withBody: ', {
      docked,
      exhibitId: dock.id
    })
  }
  if (dock) {
    return fetch(dockedEventUrl, {
      method: 'POST',
      body: JSON.stringify({
        docked,
        exhibitId: dock.id
      })
    })
      .then(response => {
        return response.json()
      })
      .then(result => {
        if (__DEV__) {
          console.log('dock response external: ', result)
        }
        // check for result.status_code 401
        if (result.destination && result.data) {
          fetch(result.destination, {
            headers: {
              'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(result.data)
          })
            .then(response => {
              if (!response.ok) {
                if (__DEV__) {
                  console.log('interactive error: ', response.statusText)
                }
              }
            })
            .catch(e => {
              if (__DEV__) {
                console.log('interactive error: ', e)
              }
            })
        }
      })
      .catch(error => {
        if (__DEV__) {
          console.log('dock error: ', error)
        }
      })
  }
}
