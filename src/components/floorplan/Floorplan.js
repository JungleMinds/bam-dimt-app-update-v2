// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Animated, Dimensions, Image } from 'react-native'
import styled, { ThemeProvider } from 'styled-components/native'
import { getResultData, performApiRequest } from 'react-api-data'

// types
import type { Dispatch } from 'redux'
import type { IContent, IPoint, ISpace, ISpaceHotspot } from '../../entities'
import type { SpaceOffset } from '../../services/floorplanOffset'
import type { IHotspotsProgress } from '../../redux/preferences'

// utils
import { mapTheme } from '../../services/utils'
import { floorplanOffsets } from '../../services/floorplanOffset'
import { getCurrentSpaces } from '../../services/getCurrentSpaces'
import { setHotspot } from '../../redux/hotspot'
import { updatePreferenceTheme } from '../../redux/preferences'
import getIsHotspotInRange from '../../services/hotspotsInRange'

// components
import { Label } from '../ui/Label'
import Hotspot from '../Hotspot'
import HotspotLabel from '../HotspotLabel'
import FloorplanSwitcher from './FloorplanSwitcher'
import UserMarker from './UserMarker'
import ContentFader from '../ContentFader'

type Props = {
  content?: IContent,
  tagPosition: IPoint,
  hotspotsInRange: Array<ISpaceHotspot>,
  currentSpaces: Array<ISpace>,
  updatePreferenceTheme: (theme: string) => void,
  setHotspot: (setHotspot: ISpaceHotspot) => void,
  navigate: string => void,
  hotspotsProgress: IHotspotsProgress,
  onGetHotspot: (setHotspot: ISpaceHotspot) => void
}

type State = {
  width: number,
  height: number,
  isFading: boolean,
  nextActiveSpace?: ISpace,
  activeSpace?: ISpace,
  alternateSpaces?: Array<ISpace>,
  opacity: Object
}

const mapStateToProps = state => {
  const content = getResultData(state.apiData, 'getFloorplan')
  if (content && state.location) {
    return {
      content: content,
      tagPosition: state.location.tagPosition,
      currentSpaces: getCurrentSpaces(state.location.tagPosition, content),
      hotspotsProgress: state.preferences.hotspotsProgress
    }
  } else {
    return {
      content: undefined,
      tagPosition: undefined,
      currentSpaces: [],
      hotspotsProgress: state.preferences.hotspotsProgress
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  updatePreferenceTheme: theme => dispatch(updatePreferenceTheme(theme)),
  onGetHotspot: (hotspot: ISpaceHotspot) => {
    dispatch(setHotspot(hotspot))
    dispatch(performApiRequest('getHotspotOptions', { id: hotspot.id }))
  }
})

const ANIMATION_DURATION = 300

class Floorplan extends React.Component<Props, State> {
  _isMounted = true
  state = {
    width: 1200,
    height: 1920,
    isFading: false,
    nextActiveSpace: undefined,
    activeSpace: undefined,
    alternateSpaces: undefined,
    opacity: new Animated.Value(0)
  }

  componentDidMount () {
    const { width, height } = Dimensions.get('window')
    this.setState(
      {
        width,
        height,
        nextActiveSpace: this.props.currentSpaces.length
          ? this.props.currentSpaces[0]
          : undefined
      },
      () => {
        this.fadeOutDone()
      }
    )
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  getActiveSpace (currentSpaces: Array<ISpace>, activeSpace?: ISpace) {
    if (
      activeSpace &&
      currentSpaces.some(space => activeSpace && space.id === activeSpace.id)
    ) {
      return activeSpace
    } else if (currentSpaces.length) {
      return currentSpaces[0]
    }
  }

  getAlternateSpaces (newSpaces: Array<ISpace>, activeSpace: ISpace) {
    if (newSpaces.length && activeSpace) {
      return newSpaces.filter((space: ISpace) => space.id !== activeSpace.id)
    } else if (newSpaces.length) {
      return newSpaces
    } else {
      return []
    }
  }

  componentWillReceiveProps (newProps: Props) {
    if (this.props.currentSpaces !== newProps.currentSpaces) {
      // updates the activeSpace and nextActiveSpaces, and starts the transition animation
      const { activeSpace } = this.state
      let nextActiveSpace

      if (typeof this.state.nextActiveSpace === 'undefined') {
        nextActiveSpace = this.getActiveSpace(
          newProps.currentSpaces,
          activeSpace
        )
      } else {
        nextActiveSpace = this.state.nextActiveSpace
      }

      const shouldFade = nextActiveSpace !== activeSpace
      const alternateSpaces = nextActiveSpace
        ? this.getAlternateSpaces(newProps.currentSpaces, nextActiveSpace)
        : undefined

      this.setState({
        nextActiveSpace: nextActiveSpace !== this.state.activeSpace ? nextActiveSpace : undefined,
        alternateSpaces
      }, () => {
        if (shouldFade && !this.state.isFading) {
          this.fadeOut()
        }
      })
    }
  }

  fadeOut () {
    this.setState({
      isFading: true
    }, () => {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true
      }).start(() => this.fadeOutDone())
    })
  }

  fadeOutDone () {
    if (this._isMounted) {
      this.setState(
        {
          opacity: new Animated.Value(0),
          activeSpace: this.state.nextActiveSpace,
          isFading: false,
          nextActiveSpace: undefined
        },
        () => {
          this.state.activeSpace && this.fadeIn()
        }
      )
    }
  }

  fadeIn () {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start()
  }

  scalePosition (point: IPoint, offset: SpaceOffset): IPoint {
    const tabletXPadding = (this.state.width - offset.imageWidth) / 2
    const tabletYPadding = (this.state.height - offset.imageHeight) / 2
    const posX = (point.x - offset.x) * offset.imageScale + tabletXPadding
    const posY = (point.y - offset.y) * offset.imageScale + tabletYPadding
    return { x: posX, y: posY }
  }

  onHotspotClick (hotspot: ISpaceHotspot, theme: string) {
    this.props.updatePreferenceTheme(theme)
    this.props.onGetHotspot(hotspot)
    this.props.navigate('Preferences')
  }

  onSwitchFloorplan (nextActiveSpace: ISpace) {
    const alternateSpaces = this.getAlternateSpaces(
      this.props.currentSpaces,
      nextActiveSpace
    )
    this.setState({ nextActiveSpace, alternateSpaces }, () => {
      this.fadeOut()
    })
  }

  render () {
    if (
      !this.props.content ||
      !this.state.activeSpace ||
      !floorplanOffsets[this.state.activeSpace.theme.slug]
    ) {
      return null
    }

    const { activeSpace, alternateSpaces } = this.state
    const { tagPosition } = this.props
    const theme = mapTheme(activeSpace.theme.slug)
    const offset: SpaceOffset = floorplanOffsets[activeSpace.theme.slug]
    const scaledPosition = this.scalePosition(tagPosition, offset)

    return (
      <ThemeProvider theme={theme}>
        {activeSpace && (
          <MapContainer>
            {/* Themed location label */}
            <ContentFader
              visible={!!(!this.state.isFading && activeSpace)}
              delay={this.state.isFading ? 0 : ANIMATION_DURATION}
              render={
                (anim) =>
                  <Animatable style={{
                    transform: [{
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0]
                      })}]
                  }}>
                    <Label
                      type={'Top'}
                      subLabel={
                        (activeSpace.title !== 'KennisStudio' && activeSpace.title !== 'Wegwijzer')
                          ? '- KENNISSTUDIO -'
                          : '- HOMESTUDIOS -'
                      }
                    >
                      {activeSpace.title.toUpperCase()}
                    </Label>
                  </Animatable>
              }
            />

            {/* Themed Hotspots */}
            <ContentFader
              visible={!!(!this.state.isFading && activeSpace)}
              delay={this.state.isFading ? 0 : ANIMATION_DURATION}
              render={
                (anim) =>
                  <AnimatableContainer pointerEvents={'box-none'} style={{ opacity: anim }}>
                    {activeSpace &&
                      activeSpace.hotspots.map((hotspot: ISpaceHotspot) => {
                        const hotspotPos = this.scalePosition(
                          {
                            x: hotspot.locationX,
                            y: hotspot.locationY
                          },
                          offset
                        )
                        return (
                          <HotspotWrapper key={hotspot.id} {...hotspotPos} pointerEvents={'box-none'}>
                            <Hotspot
                              pointerEvents={'none'}
                              inRange={getIsHotspotInRange(tagPosition, hotspot)}
                              onPress={() =>
                                this.onHotspotClick(hotspot, activeSpace.theme.slug)
                              }
                              done={this.props.hotspotsProgress[hotspot.id]}
                              theme={activeSpace.theme.slug}
                            />
                          </HotspotWrapper>
                        )
                      })}
                  </AnimatableContainer>
              }
            />

            {/* Floorplan */}
            <AnimatableContainer pointerEvents={'none'} style={{
              opacity: this.state.opacity
            }}>
              <Image source={offset.imageSrc} />
            </AnimatableContainer>

            {/* UserMarker */}
            {tagPosition && <UserMarker position={scaledPosition} />}

            {/* Hotspot Labels */}
            <ContentFader
              visible={!!(!this.state.isFading && activeSpace)}
              delay={this.state.isFading ? 0 : ANIMATION_DURATION}
              render={
                (anim) =>
                  <AnimatableContainer pointerEvents={'box-none'} style={{ opacity: anim }}>
                    {activeSpace &&
                      activeSpace.hotspots
                        .filter((hotspot: ISpaceHotspot) => getIsHotspotInRange(tagPosition, hotspot))
                        .map((hotspot: ISpaceHotspot) => {
                          const hotspotPos = this.scalePosition(
                            {
                              x: hotspot.locationX,
                              y: hotspot.locationY
                            },
                            offset
                          )
                          return (
                            <LabelWrapper key={hotspot.id} {...hotspotPos}>
                              <HotspotLabel
                                title={hotspot.title}
                                inRange={getIsHotspotInRange(tagPosition, hotspot)}
                                onPress={() =>
                                  this.onHotspotClick(hotspot, activeSpace.theme.slug)
                                }
                              />
                            </LabelWrapper>
                          )
                        })
                    }
                  </AnimatableContainer>
              }
            />

            {
              activeSpace && activeSpace.hotspots.map(hotspot => {
                const hotspotPos = this.scalePosition(
                  {
                    x: hotspot.locationX,
                    y: hotspot.locationY
                  },
                  offset
                )
                return (
                  <HotspotButtonWrapper key={hotspot.id} {...hotspotPos}>
                    <HotspotButton
                      pointerEvents={'auto'}
                      onPress={() => this.onHotspotClick(hotspot, activeSpace.theme.slug)}
                    />
                  </HotspotButtonWrapper>
                )
              })
            }

            {/* Floorplan switch links */}
            {alternateSpaces && (
              <FloorplanSwitcher
                alternateSpaces={alternateSpaces}
                location={{ x: offset.x, y: offset.y }}
                onPress={(space: ISpace) => this.onSwitchFloorplan(space)}
              />
            )}
          </MapContainer>
        )}
      </ThemeProvider>
    )
  }
}
const MapContainer = styled.View`
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #f5f3f2;
`

const HotspotWrapper = styled.View`
  position: absolute;
  left: ${props => props.x - 58}px;
  top: ${props => props.y - 58}px;
  flex: 1;
`

const HotspotButtonWrapper = styled.View`
  position: absolute;
  left: ${props => props.x - 10}px;
  top: ${props => props.y - 10}px;
`

const HotspotButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  position: absolute;
  align-items: center;
  justify-content: center;
`

const LabelWrapper = styled.View`
  position: absolute;
  left: ${props => props.x - 58}px;
  top: ${props => props.y - 58}px;
`

const Animatable = Animated.createAnimatedComponent(styled.View``)

const AnimatableContainer = Animated.createAnimatedComponent(styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`)

export default connect(mapStateToProps, mapDispatchToProps)(Floorplan)
