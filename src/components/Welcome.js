// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import Layover from './Layover'
import { generalTheme } from '../constants/styleGuide'
import { ThemeProvider } from 'styled-components'
import { StyledH1, StyledHeaderTitle, StyledBodyLarge, StyledBody } from '../constants/styledText'
import ProfilePicture from './ProfilePicture'
import { withApiData } from 'react-api-data'
import type { IProfile } from '../entities'
import { CTAButton } from './ui/Buttons'

type Props = {
  profile: IProfile
}

type States = {
  closeModal: boolean
}

const defaultProfilePicture = require('../assets/images/background-overlay.png')

const connectApiData = withApiData({
  profile: 'getProfile'
})

class Welcome extends React.Component<Props, States> {
  state = {
    closeModal: false
  }

  render () {
    let customerImage
    let customerName = ''

    if (this.props.profile && this.props.profile.data && this.props.profile.data.customer) {
      customerName = this.props.profile.data.customer.customerName
      customerImage = this.props.profile.data.customer.customerImage
    }

    return (
      <ThemeProvider theme={generalTheme}>
        <Layover
          noPaddingTop
          profilePic
          noCloseButton
          centerComponent={<ProfilePicture source={customerImage ? {uri: customerImage} : defaultProfilePicture} />}
          closeModal={this.state.closeModal}
        >
          <Title textAlign={'center'}>{`${customerName ? 'Welkom ' + customerName : 'Welkom'}!`}</Title>

          <Body textAlign={'center'}>Met deze app heb je de touwtjes in handen tijdens je bezoek aan het Homestudios experience center.</Body>
          <ContentContainer>
            <ContentImage source={require('../assets/images/floor-icon-example.png')} />
            <BodySmall textAlign={'center'}>Zie je dit icoon op de vloer? Pak dan je tablet erbij.</BodySmall>
            <Subtitle textAlign={'center'}>Woonontwerpen bij de hand</Subtitle>
            <BodySmall textAlign={'center'}>
              In de Creatiestudio heeft de Homestudios app een andere functie. Daar dock je de tablet in de creatietafel voor toegang tot jouw woonontwerpen op Mijn Homestudios. Zo heb je alle
voorbereiding die je thuis al hebt gedaan bij de hand tijdens je gesprekken met de woonadviseur.
            </BodySmall>
            <BodySmall>
              Er is genoeg te ontdekken, ervaren en te kiezen vandaag; hoog tijd dus om de handen uit de mouwen te steken.
            </BodySmall>
            <CTAButton
              btnAlign={'center'}
              onPress={() => this.setState({closeModal: true})}
            >
              Aan de slag
            </CTAButton>
          </ContentContainer>
        </Layover>
      </ThemeProvider>
    )
  }
}

const Title = StyledH1.extend`
  padding: 0 90px;
  margin-bottom: 20px;
  margin-top: 137px;
`

const Body = StyledBodyLarge.extend`
  padding: 0 90px;
`

const ContentContainer = styled.View`
  flex-direction: column;
  margin-top: 40px;
  align-items: center;
  padding: 0 70px;
`

const ContentImage = styled.Image`
  width: 100%;
  height: 280px;
`

const Subtitle = StyledHeaderTitle.extend`
  margin-top: 32px;
  margin-bottom: 12px;
  padding: 0 20px;
`

const BodySmall = StyledBody.extend`
  margin-bottom: 40px;
  padding: 0 20px;
`

export default connectApiData(Welcome)
