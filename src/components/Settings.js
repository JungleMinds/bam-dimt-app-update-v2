// @flow
import * as React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

// types
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'

// utils
import { colors } from '../constants/styleGuide'

// components
import Backdrop from './Backdrop'
import BackdropImage from './BackdropImage'
import ActionPanel from './ActionPanel'
import { CTAButton, LinkButton } from './ui/Buttons'

const appData = require('../../app.json')

type SettingsProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>
}

class Settings extends React.Component<SettingsProps> {
  updateSettings () {
    this.props.navigation.navigate('SettingsUpdate')
  }

  render () {
    return (
      <Container>
        <Backdrop
          overlay={'flipped'}
          backdropImage={
            <BackdropImage source={require('../assets/images/settings-background.jpg')} />
          }
        />
        <ActionPanel
          title={'Beheerders scherm'}
          icon={<Icon source={require('../assets/images/lock.png')} />}
        >
          <Button btnAlign={'center'} onPress={() => this.updateSettings()}>
            <Text>Instellingen wijzigen</Text>
          </Button>
          <CancelButton>
            <LinkButton onPress={() => this.props.navigation.goBack()} label={'Terug'} textAlign={'center'} />
          </CancelButton>
          <Version>Huidige versie: {appData.expo.version}</Version>
        </ActionPanel>
      </Container>
    )
  }
}

const Container = styled.View`
  background-color: ${colors.greyLight};
  flex: 1;
`

const Button = styled(CTAButton)`
  margin-top: 30px;
`

const Icon = styled.Image`
  margin-top: -10px;
`

const CancelButton = styled.View`
  margin-top: 20px;
`

const Version = styled.Text`
  font-size: 10px;
  position: absolute;
  bottom: 10px;
  right: 12px;
  color: #cecece;
`

export default Settings
