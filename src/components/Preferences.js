// @flow

import React from 'react'
import { View, Animated } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { getResultData, performApiRequest } from 'react-api-data'

// types
import type { Dispatch } from 'redux'
import type { IOptionGroup, ISpaceHotspot } from '../entities'
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'

// utils
import { registerFirstSwipe, unsetPreferenceTheme, updateProgress } from '../redux/preferences'
import { colors } from '../constants/styleGuide'
import { unsetHotspot } from '../redux/hotspot'
import ThumbsAnimation from './lottie/ThumbsAnimation'

// components
import Slider from './Slider'
import { StyledH1, StyledHeaderTitle, StyledSubTitle } from '../constants/styledText'
import { mapTheme } from '../services/utils'

type PreferencesProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  onUpdatePreference: (optionRatings: {[key: number]: number}, hotspotId: number) => void,
  onPreferenceSwipe: () => void,
  swipedAtLeastOnce: boolean,
  hotspot: ISpaceHotspot,
  theme: Object,
  onLeaveHotspot: () => void,
  optionGroups: Array<IOptionGroup>,
  onLeavePreferences: () => void
}

type PreferencesState = {
  optionRatings: {[key: number]: number},
  thumbDownAnimated: boolean,
  animateLabelThumbDown: Object,
  thumbUpAnimated: boolean,
  animateLabelThumbUp: Object
}

const mapStateToProps = (state) => ({
  optionGroups: getResultData(state.apiData, 'getHotspotOptions', {id: state.hotspot.current && state.hotspot.current.id}),
  hotspot: state.hotspot.current,
  theme: mapTheme(state.preferences.theme),
  swipedAtLeastOnce: state.preferences.swipedAtLeastOnce
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onUpdatePreference: (optionRatings, hotspotId) => {
    dispatch(performApiRequest('updateOptions', {}, optionRatings))
    dispatch(updateProgress(hotspotId))
  },
  onPreferenceSwipe: () => dispatch(registerFirstSwipe()),
  onLeavePreferences: () => {
    dispatch(unsetPreferenceTheme())
    dispatch(unsetHotspot())
  }
})

class Preferences extends React.Component<PreferencesProps, PreferencesState> {
  state = {
    thumbDownAnimated: false,
    animateLabelThumbDown: new Animated.Value(0),
    thumbUpAnimated: false,
    animateLabelThumbUp: new Animated.Value(0),
    optionRatings: {}
  }
  thumbDown = undefined
  thumbUp = undefined

  updatePreference (id: number, itemIndex: number) {
    if (itemIndex === 0 && this.thumbDown) {
      this.thumbDown.play()
      this.labelColorAnimation(itemIndex)
    }
    if (itemIndex === 2 && this.thumbUp) {
      this.thumbUp.play()
      this.labelColorAnimation(itemIndex)
    }
    this.setState({
      optionRatings: {
        ...this.state.optionRatings,
        [id]: itemIndex
      }
    })
    if (!this.props.swipedAtLeastOnce) {
      this.props.onPreferenceSwipe()
    }
  }

  componentWillUnmount () {
    this.props.onUpdatePreference(this.state.optionRatings, this.props.hotspot.id)
    this.props.onLeavePreferences()
  }

  registerThumbDown (ref) {
    this.thumbDown = ref
  }

  registerThumbUp (ref) {
    this.thumbUp = ref
  }

  labelColorAnimation (itemIndex) {
    if (itemIndex === 0) {
      Animated.timing(
        this.state.animateLabelThumbDown,
        {
          toValue: 1,
          duration: 1000
        }
      ).start(() => this.state.animateLabelThumbDown.setValue(0))
    }
    if (itemIndex === 2) {
      Animated.timing(
        this.state.animateLabelThumbUp,
        {
          toValue: 1,
          duration: 1000
        }
      ).start(() => this.state.animateLabelThumbUp.setValue(0))
    }
  }

  componentWillReceiveProps (newProps) {
    let optionRatings = {}
    newProps.optionGroups && newProps.optionGroups.map(group => {
      group.options.map(option => {
        optionRatings[option.id] = option.customerRating !== null ? option.customerRating : 1
      })
    })
    this.setState({optionRatings})
  }

  render () {
    const { hotspot, optionGroups } = this.props
    return this.props.hotspot ? (
      <View style={{flex: 1}}>
        <Title>{hotspot.title}</Title>
        <View style={{flex: 1}}>
          <View>
            <Divider />
            <Header>
              <HeaderColumn>
                <ThumbsAnimation
                  direction={'down'}
                  register={(ref) => this.registerThumbDown(ref)}
                  theme={this.props.theme}
                />
                <HeaderTitle
                  style={{
                    color: this.state.animateLabelThumbDown.interpolate({
                      inputRange: [0, 0.5, 0.9],
                      outputRange: [this.props.theme.colorMedium, this.props.theme.colorDark, this.props.theme.colorMedium]
                    })
                  }}
                >
                  Niets voor mij
                </HeaderTitle>
              </HeaderColumn>
              <HeaderColumn>
                <ThumbsAnimation
                  direction={'up'}
                  register={(ref) => this.registerThumbUp(ref)}
                  theme={this.props.theme}
                />
                <HeaderTitle
                  style={{
                    color: this.state.animateLabelThumbUp.interpolate({
                      inputRange: [0, 0.5, 0.9],
                      outputRange: [this.props.theme.colorMedium, this.props.theme.colorDark, this.props.theme.colorMedium]
                    })
                  }}
                >
                  Iets voor mij
                </HeaderTitle>
              </HeaderColumn>
            </Header>
            <HeaderDivider source={require('../assets/images/hr-dashed.png')} />
            <Divider source={require('../assets/images/vr-dashed.png')} />
          </View>
          <ScrollPreferences>
            {optionGroups && optionGroups.map(group => (
              <SliderList key={group.id}>
                {optionGroups.length > 1 && (
                  <SubTitle>{group.title}</SubTitle>
                )}
                {group.options.map((item, i) => (
                  <Slider
                    key={item.id}
                    label={item.title}
                    index={item.customerRating !== null ? item.customerRating : 1}
                    onIndexChanged={(itemIndex) => this.updatePreference(item.id, itemIndex)}
                    padding={40}
                    swipeHint={!this.props.swipedAtLeastOnce && i === 0}
                    sliderNumero={i}
                  />
                ))}
              </SliderList>
            ))}

          </ScrollPreferences>
        </View>
      </View>

    ) : null
  }
}

const Title = StyledH1.extend`
  text-align: center;
  margin-bottom: 40px;
  color: ${props => props.theme.colorMedium || colors.orangeMedium};
`

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 52px;
`

const HeaderDivider = styled.Image`
  margin-bottom: 20px;
  align-self: center;
`

const HeaderTitle = Animated.createAnimatedComponent(StyledHeaderTitle.extend`
  color: ${props => props.theme.color || colors.orange};
  margin-left: 12px;
`)

const HeaderColumn = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: 15px;
`

const Divider = styled.Image`
  position: absolute;
  height: 940px;
  top: -10px;
  width: 1px;
  align-self: center;
`

const SubTitle = StyledSubTitle.extend`
  text-align: center;
  background-color: white;
  padding: 5px;
  margin-bottom: 16px;
`

const SliderList = styled.View`
  margin-bottom: 40px;
`

const ScrollPreferences = styled.ScrollView.attrs({
  contentContainerStyle: () => ({
    flexGrow: 1,
    paddingBottom: 60
  })
})`
  flex: 1;
`

export default connect(mapStateToProps, mapDispatchToProps)(Preferences)
