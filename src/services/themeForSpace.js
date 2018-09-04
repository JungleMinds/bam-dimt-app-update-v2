// @flow

import type { ISpace } from '../entities'
import {
  generalTheme, bathroomTheme, kitchenTheme
} from '../constants/styleGuide'

const getThemeForSpace = (space: ISpace) => {
  if (space) {
    switch (space.id) {
      case '6J7Gd84MiA04wUKgS6a2a6':
        return bathroomTheme
      case '5e93kLraVyugoCuQ6yuCCm':
        return kitchenTheme
      default:
        return generalTheme
    }
  } else {
    return generalTheme
  }
}

export default getThemeForSpace
