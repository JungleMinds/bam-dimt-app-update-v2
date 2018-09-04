// @flow
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'

// types
import type { MapStateToProps } from "react-redux"

// utils
import { DangerZone } from 'expo'
let { Lottie } = DangerZone

type Props = {
  inRange: boolean,
  onPress: () => void,
  done: boolean,
  theme: string,
  hotspotsToggled: boolean
}

type State = {
  inRange: Object,
  hotspot: Object,
  readyForDone: boolean,
  labelWidth: number,
  labelHeight: number
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  hotspotsToggled: state.hotspot.hotspotsToggled
})

const themedHotspots = {
  kitchen: require('../assets/lottie/hotspot/hotspot_kitchen.json'),
  bathroom: require('../assets/lottie/hotspot/hotspot_bathroom.json'),
  doors: require('../assets/lottie/hotspot/hotspot_doors.json'),
  others: require('../assets/lottie/hotspot/hotspot_extra.json'),
  floorsandwalls: require('../assets/lottie/hotspot/hotspot_floorsandwalls.json'),
  default: require('../assets/lottie/hotspot/hotspot_default.json')
}

const HOTSPOT_SIZE = 156

class Hotspot extends React.Component<Props, State> {
  state = {
    inRange: new Animated.Value(0),
    hotspot: new Animated.Value(0),
    readyForDone: false,
    labelWidth: 0,
    labelHeight: 0
  }

  getLottieSource (theme: string) {
    switch (theme) {
      case 'kitchen':
        return themedHotspots.kitchen
      case 'bathroom':
        return themedHotspots.bathroom
      case 'doors':
        return themedHotspots.doors
      case 'floors-and-walls':
        return themedHotspots.floorsandwalls
      case 'lightning':
      case 'living-plus':
      case 'window-decoration':
        return themedHotspots.others
      default:
        return themedHotspots.default
    }
  }

  componentDidMount () {
    if (this.props.done) {
      this.endAnimation(1, 0.1)
    }

    if (this.props.inRange) {
      this.animateLabel(this.props.inRange)

      if (!this.props.done) {
        this.loopStartAnimation(0.5, 1000, this.props.done, this.props.inRange)
      }
    }
  }

  UNSAFE_componentWillReceiveProps (newProps: Props) {
    // Lottie animation: 0 - 0.5 = 'breathing' animation, 0.6 - 1 = checked animation
    if (
      !newProps.hotspotsToggled &&
      this.props.hotspotsToggled &&
      this.state.readyForDone
    ) {
      // Start checked animation when user closes Preferences modal after swipe
      this.endAnimation(1, 1000)
      this.setState({ readyForDone: false })
    } else if (newProps.done && !this.props.done) {
      // Set hotspot animation to beginning of checked animation when done gets updated (user swiped) from Preferences screen
      this.state.hotspot.stopAnimation()
      this.state.hotspot.setValue(0.6)
      this.setState({ readyForDone: true })
    } else if (newProps.inRange && !this.props.inRange && !newProps.done) {
      // Show 'breathing' hotspot when user is inRange and hotspot is not done yet
      this.loopStartAnimation(0.5, 1000, newProps.done, newProps.inRange)
    } else if (!newProps.inRange && this.props.inRange && !newProps.done) {
      // Stop 'breathing' when user is out of range
      this.state.hotspot.stopAnimation()
      this.endAnimation(0, 1000)
    }

    // Show label when user is in range, hide it when he is out of range
    if (newProps.inRange !== this.props.inRange) {
      this.animateLabel(newProps.inRange)
    }
  }

  animateLabel (inRange: boolean) {
    Animated.timing(this.state.inRange, {
      toValue: inRange ? 1 : 0,
      duration: 300,
      nativeDriver: true
    }).start()
  }

  loopStartAnimation (
    value: number,
    duration: number,
    done?: boolean,
    inRange?: boolean
  ) {
    Animated.timing(this.state.hotspot, {
      toValue: value,
      duration: duration,
      nativeDriver: true
    }).start(({ finished }) => {
      !done &&
        inRange &&
        finished &&
        this.loopStartAnimation(
          value === 0.5 ? 0.2 : 0.5,
          duration,
          this.props.done,
          this.props.inRange
        )
    })
  }

  endAnimation (value: number, duration: number) {
    Animated.timing(this.state.hotspot, {
      toValue: value,
      duration: duration,
      nativeDriver: true
    }).start()
  }

  render () {
    return (
      <HotspotWrapper pointerEvents={'box-none'}>
        <Lottie
          pointerEvents={'none'}
          style={{
            width: HOTSPOT_SIZE,
            height: HOTSPOT_SIZE
          }}
          loop
          source={this.getLottieSource(this.props.theme)}
          progress={this.state.hotspot}
        />
      </HotspotWrapper>
    )
  }
}

export default connect(mapStateToProps)(Hotspot)

const HotspotWrapper = styled.View`
  width: ${HOTSPOT_SIZE}px;
  height: ${HOTSPOT_SIZE}px;
  position: relative;
  align-items: center;
  justify-content: center;
`
