// @flow
import { type IPoint } from '../../entities'

const isValid = (value?: string): boolean => {
  return (typeof value === 'number' || (typeof value === 'string' && value.indexOf('nan') === -1))
}

const parseLocation = (locationData: string, prevLocation: IPoint) => JSON.parse(locationData).body.datastreams.reduce((accum, item) => {
  let val = null
  if (accum && item.id === 'posX') {
    val = item.current_value
    let x = isValid(val) ? Math.floor(parseFloat(val) * 100) : 0
    accum.x = (x < 0 && prevLocation && prevLocation.x) ? prevLocation.x : x
  } else if (accum && item.id === 'posY') {
    val = item.current_value
    let y = isValid(val) ? Math.floor(parseFloat(val) * 100) : 0
    accum.y = (y < 0 && prevLocation && prevLocation.y) ? prevLocation.y : y
  }

  return accum
}, prevLocation)

export default parseLocation
