// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { Image, KeyboardAvoidingView } from 'react-native'
import { NavigationActions } from 'react-navigation'
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'
import { type Dispatch } from 'redux'
import { getApiDataRequest, performApiRequest } from 'react-api-data'
import { connect } from 'react-redux'
import { setCredentials, logout } from '../redux/user'

import api from '../services/api'

import { CTAButton } from './ui/Buttons'
import { StyledBody, StyledBodySmall } from '../constants/styledText'
import { colors } from '../constants/styleGuide'

// Components
import Backdrop from './Backdrop'
import ActionPanel from './ActionPanel'
import Input from './ui/Inputs'

type LoginProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  onSubmit: (email: string, password: string) => void,
  onSaveCredentials: (email: string, timestamp: number) => void,
  loginRequest: Object,
  onApiLogout: () => Promise<any>,
  onLogoutSuccessful: () => void
}

type LoginState = {
  email: string,
  password: string,
  passwordFocus: boolean,
  hasError: boolean,
  isLoading: boolean
}

const mapStateToProps = (state) => ({
  loginRequest: getApiDataRequest(state.apiData, 'postLogin')
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onSubmit: (email, password) => dispatch(performApiRequest('postLogin', {}, { email, password })),
  onSaveCredentials: (email, timestamp) => dispatch(setCredentials(email, timestamp)),
  onApiLogout: () => dispatch(performApiRequest('doLogout')),
  onLogoutSuccessful: () => dispatch(logout())
})

class Login extends React.Component<LoginProps, LoginState> {
  state = {
    email: '',
    password: '',
    passwordFocus: false,
    hasError: false,
    isLoading: false
  }

  login () {
    this.setState({ isLoading: true })
    api.login(this.state.email, this.state.password)
      .then(result => {
        if (result.ok) {
          this.props.onSaveCredentials(this.state.email, Date.now())
          this.setState(() => ({
            password: '',
            hasError: false,
            isLoading: true
          }), () => {
            const resetAction = NavigationActions.reset({
              index: 1,
              actions: [
                NavigationActions.navigate({ routeName: 'Main' }),
                NavigationActions.navigate({ routeName: 'Welcome' })
              ]
            })
            this.props.navigation.dispatch(resetAction)
          })
        } else {
          this.setState(() => ({
            password: '',
            hasError: true,
            isLoading: false
          }))
        }
      })
      .catch(error => {
        if (__DEV__) {
          // eslint-disable-next-line
          console.log(error)
        }
        this.setState(() => ({
          hasError: true,
          isLoading: false
        }))
      })
  }

  render () {
    const { hasError } = this.state
    return (
      <Container>
        <Backdrop />
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          <ActionPanel
            title={'Welkom in het Homestudios experience center'}
            icon={<Image source={require('../assets/images/login-icon.png')} />}
          >
            <Text textAlign={'center'}>Met de Homestudios app haal je vandaag het meeste uit je bezoek. Log in met je Homestudios account om de app te gebruiken.</Text>
            <Input
              onChangeText={(text) => this.setState({ email: text })}
              hasError={hasError}
              labelText={'E-mailadres'}
              required
              returnKeyType={'next'}
              autoCapitalize={'none'}
              autoCorrect={false}
              onSubmitEditing={() => { this.setState({ passwordFocus: true }, () => this.setState({ passwordFocus: false })) }}
              disableFullscreenUI
              type={'email'}
            />
            <Input
              onChangeText={(text) => this.setState({ password: text })}
              hasError={hasError}
              labelText={'Wachtwoord'}
              required
              shouldFocus={this.state.passwordFocus}
              returnKeyType={'send'}
              autoCorrect={false}
              autoCapitalize={'none'}
              disableFullscreenUI
              onSubmitEditing={() => this.login()}
              type={'password'}
            />
            {hasError && <ErrorText>De ingevoerde combinatie van e-mailadres en wachtwoord is niet correct.</ErrorText>}
            <SmallText>Door in te loggen ga je ermee akkoord dat sommige gegevens op Mijn Homestudios zichtbaar zijn voor je gesprekspartners: de woonadviseur en de badkamer- en keukenspecialist.</SmallText>
            <CTAButton
              onPress={() => this.login()}
              btnAlign={'center'}
              loading={this.state.isLoading}
            >
              Inloggen
            </CTAButton>
          </ActionPanel>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}

const Container = styled.View`
  padding: 40px 20px;
  flex: 1;
`

const Text = StyledBody.extend`
  margin-bottom: 26px;
`

const ErrorText = StyledBodySmall.extend`
  color: ${colors.error};
`

const SmallText = StyledBodySmall.extend`
  margin: 40px 0;
`

export default connect(mapStateToProps, mapDispatchToProps)(Login)
