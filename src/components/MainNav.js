// @flow
import React from 'react'
import { Image, Animated } from 'react-native'
import styled from 'styled-components/native'

// utils
import { StyledSubTitle } from '../constants/styledText'
import { colors } from '../constants/styleGuide'

// components
import { RoundButton } from './ui/Buttons'
import Avatar from './Avatar'

type State = {
  expand: boolean,
  animateOpacity: Object,
  animateTransform: Object
}

type Props = {
  navigate: string => void
}

class MainNav extends React.Component<Props, State> {
  state = {
    expand: false,
    animateOpacity: new Animated.Value(0),
    animateTransform: new Animated.Value(1)
  }

  toggle () {
    this.setState({ expand: !this.state.expand }, () => {
      Animated.parallel([
        Animated.spring(this.state.animateTransform, {
          toValue: this.state.expand ? 0 : 1,
          duration: 500,
          bounceiness: 16,
          speed: 10,
          useNativeDriver: true
        }),
        Animated.timing(this.state.animateOpacity, {
          toValue: this.state.expand ? 1 : 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start()
    })
  }

  render () {
    const { navigate } = this.props
    return (
      <ActionButtons>
        <Avatar disabled={this.state.expand} navigate={navigate} />

        <NavButton
          style={{
            transform: [
              {
                translateX: this.state.animateTransform.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 110]
                })
              },
              {
                scale: this.state.animateTransform.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.6]
                })
              }
            ]
          }}
        >
          <Label
            disabled={!this.state.expand}
            onPress={() => {
              this.toggle()
              navigate('PreferencesOverview')
            }}
            style={{
              opacity: this.state.animateOpacity
            }}
          >
            INTERESSES
          </Label>
          <RoundButton
            onPress={() => {
              this.toggle()
              navigate('PreferencesOverview')
            }}
            icon={<Image source={require('../assets/images/interests.png')} />}
          />
        </NavButton>

        <TriggerButtonContainer
          onPress={() => {
            this.toggle()
          }}
          activeOpacity={1}
        >
          <TriggerButton
            extendBtn
            style={{
              transform: [
                {
                  rotate: this.state.animateTransform.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['135deg', '0deg']
                  })
                },
                {
                  scale: this.state.animateTransform.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1]
                  })
                }
              ]
            }}
          >
            <TriggerIcon expanded={this.state.expand} expandBtn={'true'} style={{ elevation: 2 }} >
              <Image source={require('../assets/images/plus.png')} />
            </TriggerIcon>
          </TriggerButton>
        </TriggerButtonContainer>

        <NavButton
          leftAlign
          style={{
            transform: [
              {
                translateX: this.state.animateTransform.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -110]
                })
              },
              {
                scale: this.state.animateTransform.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.6]
                })
              }
            ]
          }}
        >
          <RoundButton
            onPress={() => {
              this.toggle()
              navigate('Floorplan')
            }}
            icon={
              <FloorPlanIcon
                source={require('../assets/images/floor-plan.png')}
              />
            }
          />
          <Label
            disabled={!this.state.expand}
            onPress={() => {
              this.toggle()
              navigate('FloorPlan')
            }}
            right
            style={{
              opacity: this.state.animateOpacity
            }}
          >
            WEGWIJZER
          </Label>
        </NavButton>
      </ActionButtons>
    )
  }
}

const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100px;
  left: 0;
  right: 0;
  bottom: 40px;
`

const NavButton = Animated.createAnimatedComponent(styled.View`
  z-index: ${props => (props.extendBtn ? '2' : '1')}
  padding: 10px;
  height: 100px;
  width: 200px;
  flex-direction: row;
  justify-content: ${props => (props.leftAlign ? 'flex-start' : 'flex-end')};
  align-items: center;
`)

const TriggerButtonContainer = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  z-index: 2;
`

const TriggerButton = Animated.createAnimatedComponent(styled.View`
  z-index: ${props => (props.extendBtn ? '2' : '1')}
  padding: 10px;
  height: 100px;
  width: 100px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`)

const FloorPlanIcon = styled.Image`
  margin-left: 7px;
`

const Label = Animated.createAnimatedComponent(StyledSubTitle.extend`
  color: ${colors.blueMedium};
  padding: 25px 16px 25px 16px;
`)

const TriggerIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${props =>
    props.expanded && props.expandBtn ? colors.blueDark : colors.blueMedium};
  justify-content: center;
  align-items: center;
`

export default MainNav
