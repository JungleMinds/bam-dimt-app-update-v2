// @flow
import React from 'react'
import { Animated, type AnimatedValue, type AnimatedValueXY } from 'react-native'
import styled from 'styled-components/native'

// types
import type { IPoint } from '../../entities'

type Props = {
  position: IPoint
}

type State = {
  position: AnimatedValueXY,
  ripple: AnimatedValue
}

class UserMarker extends React.Component<Props, State> {
  state = {
    position: new Animated.ValueXY(),
    ripple: new Animated.Value(0)
  }
  _markerAnimation = undefined

  componentDidMount () {
    this.state.position.setValue(this.props.position)
  }

  componentDidUpdate () {
    Animated.timing(this.state.position, {
      toValue: this.props.position,
      duration: 100,
      useNativeDriver: true
    }).start()
  }

  render () {
    return (
      <Marker
        style={{ transform: this.state.position.getTranslateTransform() }}
      >
        <Dot />
        <Ripple delay={0} />
        <Ripple delay={1400} />
      </Marker>
    )
  }
}

type RippleProp = {
  delay?: number
}

type RippleState = {
  ripple: AnimatedValue
}
class Ripple extends React.Component<RippleProp, RippleState> {
  state = {
    ripple: new Animated.Value(0)
  }

  componentDidMount () {
    const animation = Animated.timing(this.state.ripple, {
      toValue: 1,
      duration: 2000,
      delay: this.props.delay || 0,
      isInteraction: false,
      useNativeDriver: true
    })

    Animated.loop(animation).start()
  }

  render () {
    return (
      <RippleLine style={{
        transform: [
          {
            scale: this.state.ripple.interpolate({
              inputRange: [0, 0.9],
              outputRange: [0, 1]
            })
          }
        ],
        opacity: this.state.ripple.interpolate({
          inputRange: [0, 0.5, 0.9],
          outputRange: [0, 0.7, 0.1]
        })
      }} />
    )
  }
}

const Marker = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 30px;
`)

const Dot = styled.View`
  position: absolute;
  left: 20px;
  top: 20px;
  background-color: #E65063;
  width: 20px;
  height: 20px;
  border-radius: 30px;
`

const RippleLine = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  border-width: 1px;
  border-color: #E65063;
  border-radius: 30px;
`)

export default UserMarker
