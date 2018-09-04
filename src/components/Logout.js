// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { StyledBody } from '../constants/styledText'
import type { Dispatch } from 'redux'
import { NavigationActions } from 'react-navigation'
import { getApiDataRequest, performApiRequest, withApiData } from 'react-api-data'
import { connect } from 'react-redux'
import { logout } from '../redux/user'

import api from '../services/api'

// types
import type { IProfile } from '../entities'
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'

// Components
import ActionPanel from './ActionPanel'
import Backdrop from './Backdrop'
import { CTAButton, LinkButton } from './ui/Buttons'

type Props = {
  onApiLogout: () => void,
  onLogoutSuccessful: () => void,
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  profile: IProfile
}

const defaultProfilePicture = require('../assets/images/user_default.png')

const connectApiData = withApiData({
  profile: 'getProfile'
})

const mapStateToProps = (state) => ({
  logoutRequest: getApiDataRequest(state.apiData, 'doLogout')
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onApiLogout: () => dispatch(performApiRequest('doLogout')),
  onLogoutSuccessful: () => {
    dispatch(logout())
  }
})

class Logout extends React.Component<Props> {
  logout () {
    api.logout()
      .then(result => {
        this.navigate()
      })
      .catch(error => {
        if (__DEV__) {
          console.log(error)
        }
        this.navigate()
      })
  }

  navigate () {
    this.props.onLogoutSuccessful()
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'LogoutSuccess'})
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  render () {
    let customerImage
    let customerName

    if (this.props.profile && this.props.profile.data && this.props.profile.data.customer) {
      customerName = this.props.profile.data.customer.customerName
      customerImage = this.props.profile.data.customer.customerImage
    }

    return (
      <Container>
        <Backdrop />
        <ActionPanel
          title={`Je bent ingelogd als ${customerName || ''}`}
          icon={<ProfilePicture source={customerImage ? {uri: customerImage} : defaultProfilePicture} />}
        >
          <Text textAlign={'center'}>Al je interesses zijn opgeslagen en kunnen tijdens een volgend bezoek weer gebruikt worden na inlog.</Text>
          <ButtonContainer>
            <CTAButton btnAlign={'center'} onPress={() => this.logout()}>
              Uitloggen
            </CTAButton>
          </ButtonContainer>
          <LinkButton onPress={() => this.props.navigation.goBack()} label={'Annuleren'} textAlign={'center'} />
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

const ButtonContainer = styled.View`
  margin-bottom: 19px;
`

const ProfilePicture = styled.Image`
  border-radius: 68px;
  width: 137px;
  height: 137px;
`

export default connectApiData(connect(mapStateToProps, mapDispatchToProps)(Logout))
