// @flow
import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

// types
import type { ISpace, IPoint } from '../../entities'

// utils
import { colors } from '../../constants/styleGuide'

// components
import ContentFader from '../ContentFader'
import { StyledBodySmall } from '../../constants/styledText'

type Props = {
  alternateSpaces: Array<ISpace>,
  location: IPoint,
  onPress: (space: ISpace) => void
}

type State = {
  opacity: Object,
  animateIn: boolean
}

const getPolygonCenter = (polygon): IPoint => {
  const minX: number = polygon.length
    ? Math.min(...polygon.map(point => point[0]))
    : 0
  const maxX: number = polygon.length
    ? Math.max(...polygon.map(point => point[0]))
    : 0
  const minY: number = polygon.length
    ? Math.min(...polygon.map(point => point[1]))
    : 0
  const maxY: number = polygon.length
    ? Math.max(...polygon.map(point => point[1]))
    : 0

  return {
    x: minX + ((maxX - minX) / 2),
    y: minY + ((maxY - minY) / 2)
  }
}

class FloorplanSwitcher extends React.Component<Props, State> {
  _interval = undefined
  state = {
    opacity: new Animated.Value(0),
    animateIn: false
  }

  componentDidMount () {
    this._interval = setInterval(() => {
      this.setState({
        animateIn: !this.state.animateIn
      })
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this._interval)
  }

  componentWillReceiveProps (newProps: Props) {
    if (newProps.alternateSpaces.length !== this.props.alternateSpaces.length) {
      Animated.timing(this.state.opacity, {
        toValue: newProps.alternateSpaces.length ? 1 : 0,
        duration: 300,
        useNativeDriver: true
      }).start()
    }
  }

  render () {
    return (
      <Container style={{ opacity: this.state.opacity }}>
        <Text>Je staat heel dicht bij een andere zone</Text>
        {this.props.alternateSpaces.map((space: ISpace, index: number) => (
          <Link key={space.id} onPress={() => this.props.onPress(space)}>
            {space.area && getPolygonCenter(space.area).x <
              this.props.location.x && (
                <ContentFader
                  visible={this.state.animateIn}
                  duration={1000}
                  render={
                    (animation) => (
                      <Arrow
                        style={{
                          transform: [{
                            translateX: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -10]
                            })}]
                        }}
                        source={require('../../assets/images/arrow-left-blue.png')}
                      />
                    )
                  }
                />
              )}
            <LinkLabel>Wil je naar `{space.title}`?</LinkLabel>
            {space.area && getPolygonCenter(space.area).x >=
              this.props.location.x && (
                <ContentFader
                  visible={this.state.animateIn}
                  duration={1000}
                  render={
                    (animation) => (
                      <Arrow
                        style={{
                          transform: [{
                            translateX: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 10]
                            })
                          },
                          {
                            rotateY: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['180deg', '180deg']
                            })
                          }]
                        }}
                        source={require('../../assets/images/arrow-left-blue.png')}
                      />
                    )
                  }
                />
              )}
          </Link>
        ))}
      </Container>
    )
  }
}

const Container = Animated.createAnimatedComponent(styled.View`
  flex: 1;
  align-items: center;
  position: absolute;
  top: 88;
  left: 0;
  right: 0;
`)

const Link = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  paddingHorizontal: 30px;
`

const Text = styled(StyledBodySmall)`
  font-size: 18px;
  line-height: 26px;
`

const Arrow = Animated.createAnimatedComponent(styled.Image`
  margin-top: 3px;
`)

const LinkLabel = styled(Text)`
  margin-horizontal: 10px;
  color: ${colors.blueMedium};
`

export default FloorplanSwitcher
