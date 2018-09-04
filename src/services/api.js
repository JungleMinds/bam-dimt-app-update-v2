// @flow

import { loginUrl, logoutUrl } from '../constants/apiUrls'

const createFetch = (url, method = 'GET', body) => {
  const config = {
    headers: {
      'X-BAM-ECW-App': '1',
      ...((body && {'Content-Type': 'application/json'}) || {})
    },
    credentials: 'include',
    method,
    ...((method === 'POST' && {body: JSON.stringify(body)}) || {})
  }
  console.log('Executing request:', url)
  return fetch(url, config)
}

export default {
  login: (email: string, password: string) => createFetch(loginUrl, 'POST', {email, password}),
  logout: () => createFetch(logoutUrl)
}
