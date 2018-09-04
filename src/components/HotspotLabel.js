// @flow
import React from 'react'
import { Animated, Image, type NativeEvent } from 'react-native'
import styled from 'styled-components/native'

// utils
import { colors } from '../constants/styleGuide'

// components
import Animator from './ContentFader'

type Props = {
  inRange: boolean,
  title: string,
  onPress: () => void
}

type State = {
  width: number
}

class HotspotLabel extends React.Component<Props, State> {
  state = {
    width: 0
  }

  handleLayout ({ nativeEvent }: NativeEvent) {
    this.setState(state => ({
      width: nativeEvent.layout.width
    }))
  }

  render () {
    return (
      <Animator
        visible={this.props.inRange}
        render={(animated) => (
          <LabelWrapper
            onPress={() => this.props.onPress()}
            style={{
              opacity: animated,
              transform: [
                {
                  translateY: animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10]
                  })
                },
                {
                  translateX: (144 - this.state.width) / 2
                }
              ]
            }}
            onLayout={(event) => this.handleLayout(event)}
          >
            <LabelArrow elevation={2} />
            <LabelContent elevation={2}>
              <Label>{this.props.title.toUpperCase()}</Label>
              <Image source={require('../assets/images/arrow-right-inverted.png')} />
            </LabelContent>
          </LabelWrapper>
        )}
      />
    )
  }
}

const LabelWrapper = Animated.createAnimatedComponent(styled.TouchableOpacity`
  align-items: center;
  flex-direction: column-reverse;
`)

const LabelContent = styled.View`
  background-color: ${colors.blueMedium};
  flex-direction: row;
  align-items: center;
  padding: 5px 15px;
`

const Label = styled.Text`
  color: white;
  font-family: 'foco-bold';
  font-size: 15px;
  text-align: center;
  max-width: 148px;
`

const LabelArrow = styled.View`
  width: 12px;
  height: 12px;
  background-color: ${colors.blueMedium};
  transform: translateY(-10px) rotate(45deg);
`
export default HotspotLabel
