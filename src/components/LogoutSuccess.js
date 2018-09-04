// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { Image } from 'react-native'
import { StyledBody } from '../constants/styledText'
import { NavigationActions } from 'react-navigation'
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'

// Components
import ActionPanel from './ActionPanel'
import { LinkButton } from './ui/Buttons'
import Backdrop from './Backdrop'

type LogoutSuccessProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>
}

class LogoutSuccess extends React.Component<LogoutSuccessProps> {
  goToLogin () {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'Login'})
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  render () {
    return (
      <Container>
        <Backdrop />
        <ActionPanel
          title={'Het uitloggen is gelukt'}
          icon={<Image source={require('../assets/images/logo.png')} />}
        >
          <Text textAlign={'center'}>Al je interesses zijn opgeslagen en kunnen tijdens een volgend bezoek weer gebruikt worden na inlog.</Text>
          <LinkButton onPress={() => this.goToLogin()} label={'Opnieuw inloggen'} textAlign={'center'} />
        </ActionPanel>
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
`

const Text = StyledBody.extend`
  margin-bottom: 40px;
`

export default LogoutSuccess
