// @flow

import {
  bathroomTheme,
  doorsTheme,
  floorsAndWallsTheme,
  generalTheme,
  kitchenTheme,
  gardensTheme,
  othersTheme
} from '../constants/styleGuide'
import type { ISpaceHotspot } from '../entities'
import type { IHotspotsProgress } from '../redux/preferences'

export const mapTheme = (theme: string) => {
  switch (theme) {
    case 'kitchen':
      return kitchenTheme
    case 'bathroom':
      return bathroomTheme
    case 'doors':
      return doorsTheme
    case 'garden':
      return gardensTheme
    case 'floors-and-walls':
      return floorsAndWallsTheme
    case 'lightning':
    case 'extra':
    case 'living-plus':
    case 'window-decoration':
      return othersTheme
    default:
      return generalTheme
  }
}

export const calculateSpaceProgress = (
  hotspots: Array<ISpaceHotspot>,
  hotspotsProgress: IHotspotsProgress
) => {
  const hotspotsInSpace = hotspots.map(hotspot => {
    return hotspotsProgress[hotspot.id]
  })
  const doneHotspots = hotspotsInSpace.reduce(
    (total, hotspot) => (hotspot ? total + 1 : total),
    0
  )
  return doneHotspots > 0 ? doneHotspots / hotspotsInSpace.length : 0
}
