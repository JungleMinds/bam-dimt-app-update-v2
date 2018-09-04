// flow
import React from 'react'
import { Animated, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import inside from 'point-in-polygon'
import { DangerZone } from 'expo'
import DeviceBattery from 'react-native-device-battery'
import { NavigationActions } from 'react-navigation'
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'
import type { IPoint } from '../entities'
import { performApiRequest } from 'react-api-data'

// utils
import {
  settingsUrl,
  tabletWallUrl
} from '../constants/apiUrls'
import dockService from '../services/dock'
import api from '../services/api'
import NavigationService from '../services/navigation'
import { dockDataLoaded, dockTabletDocked, dockUndock, dockDock, type IDock } from '../redux/dock'
import { setTabletWallDimensions } from '../redux/settings'
import { logout } from '../redux/user'

// components
import ContentFader from './ContentFader'

const { Lottie } = DangerZone
const LottieAnimation = require('../assets/lottie/dock/docking.json')

type DocScreenProps = {
  tabletWallIndex: IPoint,
  tagPosition: IPoint,
  tabletwallImages: Array<Object>,
  docks: Array<Object>,
  serverTime: number,
  isDocked: boolean,
  setTabletWallDimensions: ({ rows: number, cols: number }) => void,
  dockDataLoaded: (any) => void,
  dockTabletDocked: (isDocked: boolean) => void,
  dockUndock: () => void,
  dockDock: (dock: IDock) => void,
  onApiLogout: () => void,
  onLogoutSuccessful: () => void,
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>
}

type DocScreenState = {
  activeDock: {
    id: string,
    type: string
  }
}

const mapStateToProps = (state) => ({
  tabletWallIndex: state.settings.tabletWallIndex,
  tagPosition: state.location.tagPosition,
  isDocked: state.dock.isDocked,
  docks: state.dock.docks,
  currentDock: state.dock.currentDock,
  prevDock: state.dock.prevDock,
  tabletwallImages: state.dock.tabletwallImages,
  serverTime: state.dock.serverTime,
  userIsLoggedIn: state.user.loggedIn
})

const mapDispatchToProps = (dispatch) => ({
  dockTabletDocked: (isDocked: boolean) => dispatch(dockTabletDocked({isDocked})),
  dockDock: (dock: IDock) => dispatch(dockDock(dock)),
  dockUndock: () => dispatch(dockUndock()),
  dockDataLoaded: (data) => dispatch(dockDataLoaded(data)),
  setTabletWallDimensions: (dimensions: {rows: number, cols: number}) => dispatch(setTabletWallDimensions(dimensions)),
  onApiLogout: () => dispatch(performApiRequest('doLogout')),
  onLogoutSuccessful: () => {
    dispatch(logout())
  }
})

export class DockScreen extends React.Component<DocScreenProps, DocScreenState> {
  _timeout = undefined
  _imageCycle = undefined
  dockTimeout = null
  state = {
    activeDock: undefined,
    currentImage: '',
    isCharging: false,
    loader: new Animated.Value(0.68),
    toValue: true
  }

  onBatteryStateChanged = (batteryState) => {
    if (batteryState.charging !== this.props.isDocked) {
      if (!batteryState.charging) {
        // to prevent accidental dock/undock events due to sloppy power connection
        // we wait three seconds before we actually change the docked state
        this.dockTimeout = setTimeout(() => {
          this.props.dockTabletDocked(batteryState.charging)
        }, 1500)
      } else {
        this.props.dockTabletDocked(batteryState.charging)
      }
    } else {
      this.dockTimeout && clearTimeout(this.dockTimeout)
    }
  }

  componentDidMount () {
    DeviceBattery.addListener(this.onBatteryStateChanged)
    DeviceBattery.isCharging().then(isCharging => {
      this.props.dockTabletDocked(isCharging)
    })

    const startTime = Date.now()
    Promise.all([this.fetchDocks(), this.getImagesForTablet(this.props.tabletWallIndex)])
      .then((results) => {
        const [settings, tabletWall] = results
        const {width, height} = settings.tabletWall
        const fetchTime = Date.now() - startTime
        this.props.setTabletWallDimensions({rows: height, cols: width})
        this.props.dockDataLoaded({
          docks: settings.interactiveExhibits,
          tabletwallImages: tabletWall.slides,
          serverTime: tabletWall.timestamp
        })
        this.setState({
          timeOffset: (Date.now() - fetchTime) - (tabletWall.timestamp * 1000)
        }, () => {
          this.parseTagPosition(this.props.tagPosition)
          this.startImageCycle()
        })
      }).catch(error => {
        if (__DEV__) {
          console.log('error during fetching docks and images', error)
        }
      })

    this.parseTagPosition(this.props.tagPosition)
  }

  componentWillUnmount () {
    this._timeout && clearTimeout(this._timeout)
    this._imageCycle && clearInterval(this._imageCycle)
    DeviceBattery.removeListener(this.onBatteryStateChanged)
  }

  animateLogo (animateIn: boolean) {
    this.setState({
      loader: new Animated.Value(animateIn ? 0 : 0.6)
    }, () => {
      Animated.timing(this.state.loader, {
        toValue: animateIn ? 0.6 : 1,
        delay: animateIn ? 400 : 0,
        duration: 1000
      }).start()
    })
  }

  componentDidUpdate (prevProps: DocScreenProps) {
    if (
      !this.props.isDocked &&
      this.props.tagPosition &&
      (this.props.tagPosition.x !== prevProps.tagPosition.x ||
      this.props.tagPosition.y !== prevProps.tagPosition.y)
    ) {
      this.parseTagPosition(this.props.tagPosition)
    }
    if (this.props.isDocked !== prevProps.isDocked) {
      // we have a dock but we are no longer docked
      if (this.props.currentDock && !this.props.isDocked) {
        // send undock event for currentDock
        if (this.props.currentDock.type !== 'tabletwall') {
          dockService(false, this.props.currentDock)
            .then(result => {
              this.animateLogo(false)
              this.props.dockUndock()
            })
            .catch(e => {
              if (__DEV__) {
                console.log(e)
              }
            })
        } else {
          if (__DEV__) {
            console.log('undock')
          }
          this.props.dockUndock()
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({routeName: 'Login'})
            ]
          })
          NavigationService.reset(resetAction)
        }
      }

      // we have an active dock but we are not yet docked
      if (this.props.isDocked && this.state.activeDock) {
        // send dock event for currentDock
        if (this.state.activeDock.type !== 'tabletwall') {
          if (__DEV__) {
            console.log('dock tablet in exhibition')
          }
          dockService(true, this.state.activeDock)
            .then(result => {
              this.animateLogo(true)
              this.props.dockDock(this.state.activeDock)
            })
            .catch(e => {
              if (__DEV__) {
                console.log(e)
              }
            })
        } else {
          if (__DEV__) {
            console.log('dock tablet in tabletwall')
          }
          this.props.dockDock(this.state.activeDock)
          if (this.props.userIsLoggedIn) {
            InteractionManager.runAfterInteractions(() => {
              const promise = api.logout()
              promise
                .then(result => {
                  this.props.onLogoutSuccessful()
                })
                .catch(error => {
                  if (__DEV__) {
                    console.log(error)
                  }
                })
            })
          }
        }
      }
    }

    if (this.props.tabletWallIndex.x !== prevProps.tabletWallIndex.x ||
        this.props.tabletWallIndex.y !== prevProps.tabletWallIndex.y
    ) {
      this.getImagesForTablet(this.props.tabletWallIndex).then((result) => {
        this.props.dockDataLoaded({
          docks: this.props.docks,
          tabletwallImages: result.slides || [],
          serverTime: this.props.timestamp
        })
      })
    }
  }

  dockChanged (dockA, dockB): boolean {
    let hasChanged = !!((!dockA && dockB) || (dockA && !dockB) || (dockA && dockB && (dockA.id !== dockB.id)))
    return hasChanged
  }

  parseTagPosition (tagPosition) {
    if (tagPosition) {
      const { x, y } = tagPosition
      const dock = this.props.docks.find(item => inside([x, y], item.dockingArea))
      if (this.dockChanged(dock, this.state.activeDock)) {
        this.setState({
          activeDock: dock
        })
      }
    }
  }

  startImageCycle () {
    this.stopImageCycle()
    if (!this.props.tabletwallImages || !this.props.tabletwallImages.length) {
      return
    }

    const date = new Date(Date.now() - this.state.timeOffset)
    const imageIndex = date.getMinutes() % this.props.tabletwallImages.length
    const currentImage = this.props.tabletwallImages[imageIndex]
    this.setState({
      currentImage
    })

    // setTimeout so we start cycling at the start of a new minute
    this._timeout = setTimeout(() => {
      this._imageCycle = setInterval(() => {
        if (this.props.tabletwallImages.length) {
          let minute = new Date(Date.now() - this.state.timeOffset).getMinutes()
          let currentImage = this.props.tabletwallImages[minute % this.props.tabletwallImages.length]
          this.setState({
            currentImage
          })
        }
      }, 5000)
    }, date.getSeconds() * 1000)
  }

  stopImageCycle () {
    this._timeout && clearTimeout(this._timeout)
    this.imageCycle && clearInterval(this.imageCycle)
  }

  fetchDocks () {
    return fetch(settingsUrl).then(results => results.json())
  }

  getImagesForTablet (wallIndex: IPoint) {
    return fetch(tabletWallUrl(wallIndex)).then(result => {
      return result.json()
        .then(result => {
          result.slides = result.slides ? result.slides.map(slide => slide.imageUrl) : []
          return result
        })
    }).catch(err => {
      if (__DEV__) {
        console.log('error', err)
      }
    })
  }

  isImageVisible (image: string) {
    return this.props.currentDock &&
      this.props.currentDock.type === 'tabletwall' &&
      this.props.isDocked &&
      (image === this.state.currentImage)
  }

  getDockText () {
    if (this.props.currentDock) {
      return `${this.props.currentDock.title} geactiveerd`
    } else if (this.props.prevDock) {
      return `${this.props.prevDock.title} geactiveerd`
    } else {
      return ''
    }
  }

  render () {
    const { prevDock } = this.props

    if (this.props.tagPosition.x === 0 || this.props.tagPosition.y === 0) {
      return null
    }

    return (
      <ContentFader
        visible={this.props.currentDock && this.props.isDocked}
        delay={this.props.currentDock ? !this.props.isDocked ? 1200 : 0 : (prevDock && prevDock.type !== 'tabletwall') ? 1200 : 0}
        render={
          (fade) => (
            <Backdrop
              style={{ opacity: fade }}
              pointerEvents={(this.props.currentDock && this.props.isDocked) ? 'auto' : 'none'}>
              <DockedContainer style={{
                opacity: ((prevDock && prevDock.type !== 'tabletwall') || this.props.currentDock) ? 1 : 0
              }}>
                <Lottie
                  style={{
                    width: 125 * (170 / 140),
                    height: 170
                  }}
                  loop
                  source={LottieAnimation}
                  progress={this.state.loader}
                />
                <ContentFader
                  visible={this.props.currentDock && this.props.isDocked}
                  delay={this.props.isDocked ? 500 : 0}
                  render={
                    (fadeText) => (
                      <DockedText style={{
                        opacity: fadeText,
                        transform: [{
                          translateY: fadeText.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10, 40]
                          })}]
                      }}>
                        {this.getDockText()}
                      </DockedText>
                    )
                  }
                />
              </DockedContainer>
              {this.props.tabletwallImages && this.props.tabletwallImages.length && this.props.tabletwallImages.map((image, index) =>
                <ContentFader
                  key={index}
                  visible={this.isImageVisible(image)}
                  render={(fade) => (
                    <FullscreenImageContainer style={{flex: 1, opacity: fade}}>
                      <FullscreenImage source={{uri: image}} />
                    </FullscreenImageContainer>
                  )}
                />
              )}
            </Backdrop>
          )
        }
      />
    )
  }
}

const Backdrop = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #544E48;
`)

const DockedText = Animated.createAnimatedComponent(styled.Text`
  color: #322E2B;
  font-size: 44px;
  font-family: 'foco-bold'
`)

const DockedContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const FullscreenImageContainer = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`)

const FullscreenImage = styled.Image`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export default connect(mapStateToProps, mapDispatchToProps)(DockScreen)
