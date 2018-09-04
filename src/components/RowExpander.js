// flow
import React from 'react'
import { Animated, Easing } from 'react-native'
// import styled from 'styled-components/native'

type RowExpanderProps = {
  translate: number,
  expand: number
}

type RowExpanderState = {
  translate: Object
}

class RowExpander extends React.Component<RowExpanderProps, RowExpanderState> {
  state = {
    translateAnimation: new Animated.Value(0)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.translate !== this.state.translate) {
      Animated.timing(this.state.translateAnimation, {
        toValue: newProps.translate,
        duration: 600,
        easing: Easing.out(Easing.exp),
        nativeDriver: true
      }).start()
    }
  }

  render () {
    return (
      <Animated.View
        style={{
          flex: -1,
          position: 'absolute',
          height: 190 + this.props.expand,
          top: this.props.index / 2 * 180,
          transform: [
            {
              translateY: this.state.translateAnimation
            }
          ]
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

export default RowExpander
