// @flow
import React, { type Node } from 'react'
import { Animated, type AnimatedValue } from 'react-native'

type ContentSwitchProps = {
  visible: boolean,
  delay?: number,
  duration?: number,
  render: (fade: AnimatedValue) => Node
}

type ContentFaderState = {
  fade: AnimatedValue
}

class ContentFader extends React.Component<ContentSwitchProps, ContentFaderState> {
  state = {
    fade: new Animated.Value(0)
  }

  componentDidMount () {
    const value = this.props.visible ? 1 : 0
    this.animate(value)
  }

  componentDidUpdate (prevProps: ContentSwitchProps) {
    if (this.props.visible !== prevProps.visible) {
      const value = this.props.visible ? 1 : 0
      this.animate(value)
    }
  }

  animate (toValue: number) {
    Animated.timing(this.state.fade, {
      toValue,
      delay: this.props.delay || 0,
      duration: this.props.duration || 300,
      useNativeDriver: true
    }).start()
  }

  render () {
    return (
      this.props.render(this.state.fade)
    )
  }
}

export default ContentFader
