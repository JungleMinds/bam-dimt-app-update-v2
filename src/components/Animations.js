// @flow
import React, { Component } from 'react'
import styled from 'styled-components/native'
import { Animated } from 'react-native'
import { DangerZone } from 'expo'
let { Lottie } = DangerZone

type Props = {}

type State = {
  hotspot: Object
}

type IAnimation = {
  play: () => void
} | null

// =================================================================================================================================
// This page only shows examples of animations!!! This page will not be used in the final version of the application!
// ==================================================================================================================================

class Animations extends Component<Props, State> {
  animation: IAnimation

  constructor (props: Props) {
    super(props)
    this.state = {
      hotspot: new Animated.Value(0)
    }
  }

  loopAnimation (value: number) {
    Animated.timing(this.state.hotspot, {
      toValue: value,
      duration: 500,
      nativeDriver: true
    }).start(() => {
      this.loopAnimation(value === 1 ? 0.4 : 1)
    })
  }

  componentDidMount () {
    this.loopAnimation(1)
    this.animation && this.animation.play()
  }

  render () {
    return (
      <LottieContainer>
        <Hotspot
          source={require('../assets/lottie/activatie-button-begin-badkamer.json')}
          progress={this.state.hotspot}
        />
        <Lottie
          style={{
            width: 200,
            height: 200
          }}
          source={require('../assets/lottie/thumbs-down-bathroom.json')}
          ref={(ref) => { this.animation = ref }}
        />
      </LottieContainer>
    )
  }
}

const LottieContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const Hotspot = styled(Lottie)`
  width: 500px;
  height: 500px;
`

export default Animations
