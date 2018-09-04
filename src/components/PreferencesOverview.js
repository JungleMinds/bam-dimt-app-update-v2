// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { View, Animated, Easing, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { getResultData, performApiRequest } from 'react-api-data'
import { ThemeProvider } from 'styled-components'

// types
import { type Dispatch } from 'redux'
import type { ISpaceHotspot, IStudio } from '../entities'
import type { LayoutEvent } from './Slider'

// components
import Layover from './Layover'
import { StyledH1 } from '../constants/styledText'
import HotspotFoldout from './HotspotFoldout'
import SpaceBlock from './SpaceBlock'
import Preferences from './Preferences'
import RowExpander from './RowExpander'

// utils
import { setHotspot, setSelectedSpace } from '../redux/hotspot'
import { generalTheme } from '../constants/styleGuide'
import { calculateSpaceProgress, mapTheme } from '../services/utils'
import {
  unsetPreferenceTheme,
  updatePreferenceTheme
} from '../redux/preferences'
import type { IHotspotsProgress } from '../redux/preferences'

type PreferencesOverviewProps = {
  onSelectSpace: (id: number) => void,
  onSetHotspot: (hotspot: ISpaceHotspot) => void,
  onGetHotspot: (hotspot: ISpaceHotspot) => void,
  floorplan: Array<IStudio>,
  selectedSpace: number,
  onUpdateTheme: (theme: string) => void,
  onLeavePreferences: () => void,
  preferencesTheme?: string,
  hotspotsProgress: IHotspotsProgress
}

type PreferencesOverviewState = {
  switchAnimation: any,
  screenWidth: number,
  showsOverview: boolean,
  activeRowIndex: number,
  expandHeights: {
    [spaceId: number]: number
  }
}

const mapStateToProps = state => ({
  selectedSpace: state.hotspot.selectedSpace,
  floorplan: getResultData(state.apiData, 'getFloorplan'),
  preferencesTheme: state.preferences.theme,
  hotspotsProgress: state.preferences.hotspotsProgress
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onSelectSpace: id => dispatch(setSelectedSpace(id)),
  onUpdateTheme: theme => dispatch(updatePreferenceTheme(theme)),
  onLeavePreferences: () => dispatch(unsetPreferenceTheme()),
  onSetHotspot: hotspot => {
    dispatch(setHotspot(hotspot))
  },
  onGetHotspot: hotspot => {
    dispatch(performApiRequest('getHotspotOptions', { id: hotspot.id }))
  }
})

class PreferencesOverview extends React.Component<
  PreferencesOverviewProps,
  PreferencesOverviewState
> {
  state = {
    switchAnimation: new Animated.Value(0),
    screenWidth: 0,
    showsOverview: true,
    expandHeights: {},
    activeRowIndex: -1
  }

  switchScreen (value) {
    Animated.timing(this.state.switchAnimation, {
      toValue: value,
      duration: 600,
      easing: Easing.out(Easing.exp),
      nativeDriver: true
    }).start()
  }

  onSwitchHotspot (hotspot, theme) {
    this.props.onUpdateTheme(theme)
    this.props.onSetHotspot(hotspot)
    setTimeout(() => {
      this.props.onGetHotspot(hotspot)
    }, 1200)
    this.switchScreen(-1 * this.state.screenWidth)
    this.setState({
      showsOverview: false
    })
  }

  switchBack () {
    this.switchScreen(0)
    this.props.onLeavePreferences()
    this.setState({
      showsOverview: true
    })
  }

  measureScreenWidth (event: LayoutEvent) {
    const screenWidth = event.nativeEvent.layout.width
    this.setState({ screenWidth })
  }

  getExpand (rowIndex, translate) {
    const { selectedSpace } = this.props
    const { activeRowIndex, expandHeights } = this.state

    if (
      selectedSpace &&
      ((translate && rowIndex > activeRowIndex) ||
      (!translate && rowIndex === activeRowIndex)) &&
      expandHeights[selectedSpace]
    ) {
      return expandHeights[selectedSpace]
    } else {
      return 0
    }
  }

  render () {
    const spaces =
      this.props.floorplan &&
      this.props.floorplan.length > 0 &&
      this.props.floorplan[0].spaces
    const preferencesTheme = this.props.preferencesTheme
      ? mapTheme(this.props.preferencesTheme)
      : undefined

    return (
      <Layover
        baseTheme={generalTheme}
        secondaryTheme={preferencesTheme}
        backButton={() => this.switchBack()}
        noCloseButton={!this.state.showsOverview}
      >
        <SwitchView
          style={{
            transform: [
              {
                translateX: this.state.switchAnimation
              }
            ]
          }}
        >
          <Screen onLayout={event => this.measureScreenWidth(event)}>
            <Title>Mijn interesses</Title>
            <View style={{ position: 'relative' }}>
              <ScrollView removeClippedSubviews={false}>
                <RowsWrapper>
                  {spaces &&
                    spaces.map(
                      (row, i) =>
                        i % 2 === 0 && (
                          <RowExpander
                            key={'row' + row.id}
                            index={i}
                            expand={this.getExpand(i, false)}
                            translate={this.getExpand(i, true)}
                          >
                            <Row>
                              {spaces.slice(i, i + 2).map(space => (
                                <Column key={space.id}>
                                  <SpaceBlock
                                    space={space}
                                    onPress={isActive =>
                                      this.setState({
                                        activeRowIndex: isActive ? i : -1
                                      })
                                    }
                                    progress={calculateSpaceProgress(
                                      space.hotspots,
                                      this.props.hotspotsProgress
                                    )}
                                  />
                                </Column>
                              ))}
                            </Row>
                            {spaces.slice(i, i + 2).map(space => (
                              <HotspotFoldout
                                key={space.id}
                                space={space}
                                onMeasureHeight={(height: number) =>
                                  this.setState({
                                    expandHeights: {
                                      ...this.state.expandHeights,
                                      [space.id]: height
                                    }
                                  })
                                }
                                onPressItem={hotspot =>
                                  this.onSwitchHotspot(
                                    hotspot,
                                    space.theme.slug
                                  )
                                }
                              />
                            ))}
                          </RowExpander>
                        )
                    )}
                </RowsWrapper>
              </ScrollView>
            </View>
          </Screen>
          <Screen>
            {preferencesTheme && (
              <ThemeProvider theme={preferencesTheme}>
                <Preferences />
              </ThemeProvider>
            )}
          </Screen>
        </SwitchView>
      </Layover>
    )
  }

  componentWillUnmount () {
    this.props.onSelectSpace(0)
  }
}

const SwitchView = Animated.createAnimatedComponent(styled.View`
  flex-direction: row;
  width: 200%;
`)

const Screen = styled.View`
  flex: 1;
`

export const RowsWrapper = styled.View`
  position: relative;
  flex: -1;
  height: 980;
  width: 680;
`

export const Row = styled.View`
  flex-direction: row;
  padding: 0 30px;
`

export const Column = styled.View`
  width: 50%;
`

const Title = StyledH1.extend`
  text-align: center;
  padding: 0 40px 30px 40px;
`

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesOverview)
