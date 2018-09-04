// @flow
import React, { Component } from 'react'
import { kitchenTheme, bathroomTheme, doorsTheme, othersTheme, floorsAndWallsTheme } from '../../constants/styleGuide'
import { DangerZone } from 'expo'
let { Lottie } = DangerZone

type Props = {
  direction: string,
  theme: Object,
  register: (ref: ?Object) => void
}

const sources = {
  upkitchenTheme: require('../../assets/lottie/thumb_up/thumb_up_kitchen.json'),
  upBathroomTheme: require('../../assets/lottie/thumb_up/thumb_up_bathroom.json'),
  upDoorsTheme: require('../../assets/lottie/thumb_up/thumb_up_doors.json'),
  upOthersTheme: require('../../assets/lottie/thumb_up/thumb_up_extra.json'),
  upFloorsAndWallsTheme: require('../../assets/lottie/thumb_up/thumb_up_floorsandwalls.json'),
  upDefault: require('../../assets/lottie/thumb_up/thumb_up_default.json'),
  downkitchenTheme: require('../../assets/lottie/thumb_down/thumb_down_kitchen.json'),
  downBathroomTheme: require('../../assets/lottie/thumb_down/thumb_down_bathroom.json'),
  downDoorsTheme: require('../../assets/lottie/thumb_down/thumb_down_doors.json'),
  downOthersTheme: require('../../assets/lottie/thumb_down/thumb_down_extra.json'),
  downFloorsAndWallsTheme: require('../../assets/lottie/thumb_down/thumb_down_floorsandwalls.json'),
  downDefault: require('../../assets/lottie/thumb_down/thumb_down_default.json')
}

class ThumbsAnimations extends Component<Props> {
  getLottieSource (direction: string, theme: Object) {
    if (direction === 'up') {
      switch (theme) {
        case kitchenTheme:
          return sources.upkitchenTheme
        case bathroomTheme:
          return sources.upBathroomTheme
        case doorsTheme:
          return sources.upDoorsTheme
        case othersTheme:
          return sources.upOthersTheme
        case floorsAndWallsTheme:
          return sources.upFloorsAndWallsTheme
        default:
          return sources.upDefault
      }
    } else if (direction === 'down') {
      switch (theme) {
        case kitchenTheme:
          return sources.downkitchenTheme
        case bathroomTheme:
          return sources.downBathroomTheme
        case doorsTheme:
          return sources.downDoorsTheme
        case othersTheme:
          return sources.downOthersTheme
        case floorsAndWallsTheme:
          return sources.downFloorsAndWallsTheme
        default:
          return sources.downDefault
      }
    }
  }

  getThumb (direction: string, theme: Object) {
    return (
      <Lottie
        style={{
          width: 26,
          height: 26
        }}
        source={this.getLottieSource(direction, theme)}
        ref={(ref) => { this.props.register(ref) }}
      />
    )
  }
  render () {
    return this.getThumb(this.props.direction, this.props.theme)
  }
}

export default ThumbsAnimations
