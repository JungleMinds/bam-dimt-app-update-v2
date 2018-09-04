// @flow

import React from 'react'
import {
  PanResponder,
  Dimensions,
  Animated,
  Easing
} from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../constants/styleGuide'
import { shakeAnimation } from '../constants/animations'

type SliderProps = {
  label: string,
  index: 0 | 1 | 2,
  onIndexChanged: (index: 0 | 1 | 2) => void,
  padding: number,
  sliderNumero: number
}

type SliderState = {
  initialized: boolean,
  draggableZoneBounds: number,
  index: 0 | 1 | 2,
  x: number,
  buttonPressed: boolean,
  swipeHintAnimation: any,
  swipeHintOpacity: any,
  sliderOpacity: any
}

type GestureEventType = {
  stateID: number,
  dx: number,
  dy: number,
  moveX: number,
  moveY: number,
  vx: number,
  vy: number,
  x0: number,
  y0: number,
  numberActiveTouches: number
}

export type LayoutEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number
    }
  }
}

class Slider extends React.Component<SliderProps, SliderState> {
  pan = new Animated.ValueXY()
  moveX = 0
  springAnimation = null

  state = {
    initialized: false,
    draggableZoneBounds: 0,
    index: this.props.index,
    x: 0,
    buttonPressed: false,
    swipeHintAnimation: new Animated.Value(0),
    swipeHintOpacity: new Animated.Value(0),
    sliderOpacity: new Animated.Value(0)
  }

  elementWidth = 0
  sliderWidth = 0
  sliderHeight = 0
  leftPadding = 0
  draggable = null

  swipeHintAnimation () {
    Animated.sequence([
      Animated.timing(
        this.state.swipeHintOpacity,
        {
          toValue: 1,
          duration: 500,
          delay: 3000,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.swipeHintAnimation,
        {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear(),
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.swipeHintOpacity,
        {
          toValue: 0,
          duration: 700,
          useNativeDriver: true
        }
      )
    ]).start(() => {
      if (this.props.swipeHint) {
        this.state.swipeHintAnimation.setValue(0)
        this.swipeHintAnimation()
      }
    })
  }

  componentDidMount () {
    if (this.props.swipeHint) {
      this.swipeHintAnimation()
    }
  }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.setState({buttonPressed: true})
      if (this.springAnimation) {
        this.springAnimation.stop()
      }
      if (this.props.swipeHintOpacity) {
        this.state.swipeHintOpacity.stopAnimation()
        Animated.timing(
          this.state.swipeHintOpacity,
          {
            toValue: 0,
            duration: 700,
            delay: 0,
            useNativeDriver: true
          }
        ).start()
      }
    },
    onPanResponderMove: (e, gesture: GestureEventType) => {
      this.pan.setValue({x: this.state.x + gesture.dx, y: 0})
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (e, gesture: GestureEventType) => {
      const {x, index} = this.calculateIndex(gesture)
      if (Number(index) !== Number(this.state.index)) {
        this.props.onIndexChanged(index)
      }

      this.setState({
        buttonPressed: false,
        x,
        index
      }, () => {
        this.springAnimation = Animated.spring(
          this.pan,
          {
            toValue: {
              x: this.state.x,
              y: 0
            },
            useNativeDrive: true
          }
        ).start()
      })
    }
  })

  calculateIndex = (gesture: GestureEventType): {x: number, index: 0 | 1 | 2} => {
    if (this.draggable) {
      const width = this.elementWidth
      const draggableWidth = this.state.draggableZoneBounds
      const { moveX, x0 } = gesture
      const moveXInElement = (moveX || x0) - this.leftPadding
      if (moveXInElement / width > 0.66) {
        return {
          x: (width - draggableWidth),
          index: 2
        }
      } else if (moveXInElement / width > 0.33) {
        return {
          x: (width / 2) - (draggableWidth / 2),
          index: 1
        }
      }
    }
    return {
      x: 0,
      index: 0
    }
  }

  setDraggableLayout = (event: LayoutEvent) => {
    if (!this.state.initialized) {
      this.elementWidth = event.nativeEvent.layout.width - (2 * this.props.padding)
      this.leftPadding = ((Dimensions.get('window').width - this.elementWidth) / 2) + this.props.padding
      const width = this.elementWidth
      const draggableWidth = this.sliderWidth
      const position = this.props.index * ((width / 2) - (draggableWidth / 2))
      this.pan = new Animated.ValueXY({ x: position, y: 0 })
      this.setState({
        draggableZoneBounds: this.sliderWidth,
        x: position,
        initialized: true,
        index: this.props.index
      }, () => {
        Animated.timing(this.state.sliderOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          delay: this.props.sliderNumero * 50,
          nativeDriver: true
        }).start()
      })
      return true
    }
  }

  measureSlider = (event: LayoutEvent) => {
    if (!this.state.initialized) {
      this.sliderWidth = event.nativeEvent.layout.width
      this.sliderHeight = event.nativeEvent.layout.height
    }
  }

  render () {
    return (
      <Container isFirst={this.props.sliderNumero === 0} onLayout={this.setDraggableLayout} horizontalPadding={this.props.padding}>
        <Track horizontalPadding={this.props.padding} height={this.sliderHeight} />
        <TrackDivider source={require('../assets/images/slider-track-divider.png')} />
        {this.props.swipeHint && (
          <SwipeHint
            style={{
              opacity: this.state.swipeHintOpacity,
              transform: [{
                translateX: this.state.swipeHintAnimation.interpolate({
                  inputRange: shakeAnimation.map(inputOutputArray => inputOutputArray[0]),
                  outputRange: shakeAnimation.map(inputOutputArray => inputOutputArray[1])
                })
              }]
            }}
            source={require('../assets/images/swipe-hint.png')}
            resizeMode={'contain'}
          />
        )}
        <SlidingLabel
          onLayout={this.measureSlider}
          ref={draggable => { this.draggable = draggable }}
          style={[this.pan.getLayout(), {opacity: this.state.sliderOpacity}]}
          {...this.panResponder.panHandlers}
        >
          <Label
            pointerEvents={'none'}
            buttonPressed={this.state.buttonPressed}
            style={{elevation: this.state.buttonPressed ? 2 : 0}}
          >
            <LabelText>{this.props.label || 'no label'}</LabelText>
          </Label>
        </SlidingLabel>
      </Container>
    )
  }
}

export default Slider

const Container = styled.View`
  width: 100%;
  position: relative;
  ${props => !props.isFirst && 'border-top-width: 12'}
  border-color: #ffffff;
  padding: 0 ${props => props.horizontalPadding}px;
  justify-content: center;
`

const Track = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: ${props => `${props.height}px` || '40px'};
  background-color: #F5F3F2;
  margin: 0 ${props => props.horizontalPadding}px;
  border-radius: 30px;
`

const TrackDivider = styled.Image`
  position: absolute;
  top: 0;
  height: 40px;
  align-self: center;
`

const SlidingLabel = Animated.createAnimatedComponent(styled.View`
  align-self: flex-start;
  position: relative;
`)

const Label = styled.View`
  background-color: ${props => props.buttonPressed ? colors.blueDark : colors.blueMedium};
  border-radius: 25px;
  padding: 9px;
  width: 188px;
`

const LabelText = styled.Text`
  fontFamily: 'foco-bold';
  paddingHorizontal: 10px;
  font-size: 16px;
  line-height: 22px;
  color: white;
  text-align: center;
`

const SwipeHint = Animated.createAnimatedComponent(styled.Image`
  position: absolute;
  width: 250px;
  align-self: center;
`)
