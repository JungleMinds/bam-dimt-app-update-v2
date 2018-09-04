// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { Image, View, Animated, Easing } from 'react-native'
import { withNavigation } from 'react-navigation'

// types
import type {
  NavigationRoute,
  NavigationScreenProp,
  NavigationAction
} from 'react-navigation'
import type { Theme } from '../constants/styleGuide'
import { BackButton } from './ui/Buttons'

// utils
import { colors } from '../constants/styleGuide'

type LayoverProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  children: React.Node,
  noPaddingTop?: boolean,
  centerComponent: React.Node,
  closeModal: boolean,
  baseTheme: Theme,
  secondaryTheme: Theme,
  noCloseButton: boolean
}

type LayoverState = {
  fadeBackground: any,
  scaleContainer: any,
  fadeContainer: any,
  switchAnimation: any,
  backgroundColor: string,
  buttonColor: string,
  bottomTriangleColor: string
}

class Layover extends React.Component<LayoverProps, LayoverState> {
  state = {
    fadeBackground: new Animated.Value(0),
    scaleContainer: new Animated.Value(0.9),
    fadeContainer: new Animated.Value(0),
    switchAnimation: new Animated.Value(0),
    backgroundColor: '',
    buttonColor: '',
    bottomTriangleColor: ''
  }

  componentWillReceiveProps (newProps: LayoverProps) {
    if (newProps.closeModal && !this.props.closeModal) {
      this.closeModal()
    }

    if (
      newProps.secondaryTheme &&
      (!this.props.secondaryTheme ||
        this.props.secondaryTheme.color !== newProps.secondaryTheme.color)
    ) {
      this.setState(
        {
          backgroundColor: newProps.secondaryTheme.translucentColor,
          buttonColor: newProps.secondaryTheme.colorMedium,
          bottomTriangleColor: newProps.secondaryTheme.color
        },
        () => {
          Animated.timing(this.state.switchAnimation, {
            toValue: 1,
            duration: 600
          }).start()
        }
      )
    } else if (!newProps.secondaryTheme && this.props.secondaryTheme) {
      Animated.timing(this.state.switchAnimation, {
        toValue: 0,
        duration: 600
      }).start()
    }
  }

  componentDidMount () {
    Animated.parallel([
      Animated.timing(this.state.fadeBackground, {
        toValue: 1,
        duration: 300
      }),
      Animated.timing(this.state.scaleContainer, {
        toValue: 1,
        duration: 250,
        delay: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(this.state.fadeContainer, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: true
      })
    ]).start()
  }

  closeModal () {
    Animated.parallel([
      Animated.timing(this.state.fadeBackground, {
        toValue: 0,
        duration: 300,
        delay: 100
      }),
      Animated.timing(this.state.scaleContainer, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(this.state.fadeContainer, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      this.props.navigation.goBack()
    })
  }

  render () {
    const backgroundColor =
      this.state.backgroundColor &&
      this.state.switchAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.baseTheme.translucentColor,
          this.state.backgroundColor
        ]
      })
    const buttonColor =
      this.state.buttonColor &&
      this.state.switchAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.baseTheme.colorMedium, this.state.buttonColor]
      })
    const bottomTriangleColor =
      this.state.bottomTriangleColor &&
      this.state.switchAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          this.props.baseTheme.color,
          this.state.bottomTriangleColor
        ]
      })

    return (
      <View style={{ flex: 1 }}>
        <Background
          style={{
            opacity: this.state.fadeBackground,
            ...(backgroundColor ? { backgroundColor } : {})
          }}
        />
        <Container
          needsOffscreenAlphaCompositing
          style={{
            transform: [{ scale: this.state.scaleContainer }],
            opacity: this.state.fadeContainer
          }}
        >
          {this.props.backButton && (
            <BackButtonWrap style={{ opacity: this.state.switchAnimation }}>
              <BackButton
                buttonColor={buttonColor}
                bottomTriangleColor={bottomTriangleColor}
                onPress={this.props.backButton}
              />
            </BackButtonWrap>
          )}
          <CloseButtonWrapper hide={this.props.noCloseButton}>
            <CloseButton
              onPress={() => this.closeModal()}
              activeOpacity={0.8}
              disabled={this.props.noCloseButton}
            >
              <CloseText>SLUIT</CloseText>
              <CloseIcon
                style={buttonColor ? { backgroundColor: buttonColor } : {}}
              >
                <Image source={require('../assets/images/close.png')} />
              </CloseIcon>
            </CloseButton>
          </CloseButtonWrapper>
          <Content noPaddingTop={this.props.noPaddingTop}>
            {this.props.children}
          </Content>
          {this.props.centerComponent && (
            <CenterComponentBorder>
              {this.props.centerComponent}
            </CenterComponentBorder>
          )}
        </Container>
      </View>
    )
  }
}

const Background = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${props =>
    props.theme.translucentColor || colors.orangeTranslucent};
`)

const Container = Animated.createAnimatedComponent(styled.View`
  flex: 1;
  padding: 30px 60px 60px 60px;
`)

const CenterComponentBorder = styled.View`
  width: 164px;
  height: 164px;
  padding: 3px;
  background: white;
  border-radius: 82px;
  align-self: center;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 56px;
  elevation: 2;
`

const CloseButtonWrapper = styled.View`
  align-self: flex-end;
  height: 70px;
  flex-direction: row;
  opacity: ${props => (props.hide === true ? 0 : 1)};
`

const CloseButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 20px 0 20px 20px;
`

const CloseText = styled.Text`
  font-family: 'foco-bold';
  color: white;
  font-size: 16px;
`

const CloseIcon = Animated.createAnimatedComponent(styled.View`
  height: 30px;
  width: 30px;
  padding: 9px;
  margin-left: 10px;
  border-top-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: ${props => props.theme.colorMedium || colors.orangeMedium};
`)

const Content = styled.View`
  background-color: #fff;
  padding-top: ${props => (props.noPaddingTop ? '0' : '60px')};
  flex: 1;
  elevation: 2;
`

const BackButtonWrap = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  top: 30px;
  left: 60px;
`)

export default withNavigation(Layover)
