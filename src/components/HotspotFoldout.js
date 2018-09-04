// @flow

import * as React from 'react'
import { Animated, Easing, View } from 'react-native'
import styled from 'styled-components/native'
import { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'

// types
import type { ISpace, ISpaceHotspot } from '../entities'
import { type MapStateToProps } from 'react-redux'

// utils
import { mapTheme } from '../services/utils'
import { colors } from '../constants/styleGuide'

// components
import { Column, Row } from './PreferencesOverview'
import HotspotListItem from './HotspotListItem'
import type { IHotspotsProgress } from '../redux/preferences'

type HotspotFoldoutProps = {
  space: ISpace,
  onPressItem: (id: ISpaceHotspot) => void,
  onMeasureHeight: (maxHeight: number) => void,
  selectedSpace: number,
  hotspotsProgress: IHotspotsProgress
}

type HotspotFoldoutState = {
  initialized: boolean,
  maxHeight: number,
  animatedHeight: Object,
  animatedTranslateY: Object
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  selectedSpace: state.hotspot.selectedSpace,
  hotspotsProgress: state.preferences.hotspotsProgress
})

class HotspotFoldout extends React.Component<
  HotspotFoldoutProps,
  HotspotFoldoutState
> {
  state = {
    initialized: false,
    maxHeight: 0,
    animatedTranslateY: new Animated.Value(0),
    animatedHeight: new Animated.Value()
  }

  measureHeight = (event: Object) => {
    if (!this.state.initialized) {
      this.setState(
        {
          initialized: true,
          maxHeight: event.nativeEvent.layout.height
        },
        () => {
          this.props.onMeasureHeight(this.state.maxHeight)
          this.state.animatedHeight.setValue(0)
        }
      )
    }
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    const id = this.props.space.id
    if (newProps.selectedSpace === id && this.props.selectedSpace !== id) {
      Animated.timing(this.state.animatedTranslateY, {
        toValue: 0,
        duration: 400,
        delay: this.props.selectedSpace === 0 ? 200 : 600,
        easing: Easing.out(Easing.cubic),
        nativeDriver: true
      }).start()
      Animated.timing(this.state.animatedHeight, {
        toValue: this.state.maxHeight,
        duration: 1
      }).start()
    }
    if (newProps.selectedSpace !== id && this.props.selectedSpace === id) {
      Animated.timing(this.state.animatedTranslateY, {
        toValue: -this.state.maxHeight,
        duration: 400,
        nativeDriver: true
      }).start()
      Animated.timing(this.state.animatedHeight, {
        toValue: 0,
        delay: 400,
        duration: 1
      }).start()
    }
  }

  hotspotButton (hotspot: ISpaceHotspot) {
    return (
      <HotspotListItem
        hotspot={hotspot}
        key={hotspot.id}
        onPressItem={hotspot => this.props.onPressItem(hotspot)}
        done={this.props.hotspotsProgress[hotspot.id]}
      />
    )
  }

  render () {
    const { space } = this.props
    return (
      <ThemeProvider theme={mapTheme(space.theme.slug)}>
        <Animated.View style={{ height: this.state.animatedHeight }}>
          <FoldoutWrapper>
            <Foldout
              style={{
                transform: [{ translateY: this.state.animatedTranslateY }]
              }}
            >
              <View onLayout={this.measureHeight}>
                <Inner>
                  <Row>
                    <Column>
                      {space.hotspots
                        .slice(0, Math.ceil(space.hotspots.length / 2))
                        .map(hotspot => this.hotspotButton(hotspot))}
                    </Column>
                    <Column>
                      {space.hotspots
                        .slice(Math.ceil(space.hotspots.length / 2))
                        .map(hotspot => this.hotspotButton(hotspot))}
                    </Column>
                  </Row>
                </Inner>
              </View>
            </Foldout>
          </FoldoutWrapper>
        </Animated.View>
      </ThemeProvider>
    )
  }
}

const FoldoutWrapper = styled.View`
 overflow: hidden;
 background-color: transparent;
`

const Foldout = Animated.createAnimatedComponent(styled.View`
  background-color: ${props => props.theme.color || colors.orange};
  margin: 0 40px;
`)

const Inner = styled.View`
  padding: 20px 0 35px 0;
  border-bottom-width: 10;
  border-bottom-color: white;
`

export default connect(mapStateToProps)(HotspotFoldout)
