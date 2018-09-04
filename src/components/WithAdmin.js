// @flow

import React, { Component } from 'react'
import { type Dispatch } from 'redux'
import {
  NavigationActions,
  type NavigationRoute,
  type NavigationScreenProp,
  type NavigationAction
} from 'react-navigation'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import { performApiRequest } from 'react-api-data'

import api from '../services/api'
import { logout } from '../redux/user'

type Props = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  loggedInFrom: number,
  isLoggedIn: boolean,
  onLogoutSuccessful: () => void
}

type State = {
  pressedCount: number
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.loggedIn,
  loggedInFrom: state.user.timestamp
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onApiLogout: () => dispatch(performApiRequest('doLogout')),
  onLogoutSuccessful: () => dispatch(logout())
})

// $FlowFixMe
export default (WrappedComponent) => {
  class WithAdmin extends Component<Props, State> {
    _pressedTimer: ?TimeoutID = null // eslint-disable-line
    _sessionCheckInterval: ?IntervalID = null // eslint-disable-line
    state = {
      pressedCount: 0
    }

    componentDidMount () {
      this._sessionCheckInterval = setInterval(() => {
        this.isSessionExpired() && this.onSessionExpired()
      }, 30000)
    }

    componentWillUnmount () {
      this.clearTimers()
    }

    isSessionExpired () {
      return !!(
        this.props.isLoggedIn &&
        ((Date.now() - this.props.loggedInFrom) > (24 * 60 * 60 * 1000))
      )
    }

    onSessionExpired () {
      this.clearTimers()
      api.logout()
        .then(() => {
          this.props.onLogoutSuccessful()
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({routeName: 'Login'})
            ]
          })
          this.props.navigation.dispatch(resetAction)
        })
        .catch(error => {
          if (__DEV__) {
            // eslint-disable-next-line
            console.log(error)
          }
        })
    }

    pressSettings () {
      if (!__DEV__) {
        if (this._pressedTimer) {
          clearTimeout(this._pressedTimer)
        }
        this._pressedTimer = setTimeout(() => {
          this.setState({
            pressedCount: 0
          })
        }, 1000)
      }

      this.setState((state) => (
        {
          pressedCount: state.pressedCount + 1
        }
      ),
      () => {
        if (this.state.pressedCount === 7) {
          this.props.navigation.navigate('Settings')
          this.setState({
            pressedCount: 0
          })
        }
      })
    }

    clearTimers () {
      if (this._pressedTimer) {
        clearTimeout(this._pressedTimer)
        this._pressedTimer = null
      }

      if (this._sessionCheckInterval) {
        clearInterval(this._sessionCheckInterval)
        this._sessionCheckInterval = null
      }
    }

    render () {
      return (
        <Container>
          <WrappedComponent navigation={this.props.navigation} />
          <SettingsBtn
            onPress={() => this.pressSettings()}
            style={{ padding: 20 }}
          >
            <InvisibleText>admin</InvisibleText>
          </SettingsBtn>
        </Container>
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithAdmin)
}

const SettingsBtn = styled.TouchableOpacity`
  position: absolute;
  top: 10;
  left: 0;
  width: 100px;
  height: 75px;
  background-color: transparent;
`

const Container = styled.View`
  flex: 1;
  height: 100%;
`

const InvisibleText = styled.Text`
  opacity: 0;
`
