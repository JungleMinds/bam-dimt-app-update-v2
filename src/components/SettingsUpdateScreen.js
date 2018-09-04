// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'

// types
import { type Dispatch } from 'redux'
import type { IPoint } from '../entities'

import { generalTheme } from '../constants/styleGuide'
import { setTagId, setTabletWallIndex } from '../redux/settings'

// components
import { StyledH1, StyledHeaderTitle, StyledBodyLarge } from '../constants/styledText'
import ProfilePicture from './ProfilePicture'
import Layover from './Layover'
import TileGridSelect from './TileGridSelect'
import { CTAButton } from './ui/Buttons'
import Input from './ui/Inputs'

type Props = {
  tagId: string,
  tabletWallIndex: IPoint,
  setTagId: (tagId: string) => void,
  setTabletWallIndex: (tabletWallIndex: IPoint) => void
}

type State = {
  closeModal: boolean,
  tagId: string,
  tabletWallIndex: IPoint
}

const profileImage = require('../assets/images/settings.png')

const mapStateToProps = state => ({
  tagId: state.settings.tagId,
  tabletWallIndex: state.settings.tabletWallIndex
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  setTagId: (tagId: string) => dispatch(setTagId(tagId)),
  setTabletWallIndex: (tabletWallIndex: IPoint) => dispatch(setTabletWallIndex(tabletWallIndex))
})

export class SettingsUpdateScreen extends React.Component<Props, State> {
  state = {
    closeModal: false,
    tagId: '0',
    tabletWallIndex: {
      x: 0,
      y: 0
    }
  }

  componentWillMount () {
    this.setState({
      tagId: this.props.tagId,
      tabletWallIndex: this.props.tabletWallIndex
    })
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.tabletWallIndex !== this.props.tabletWallIndex) {
      this.setState({
        tabletWallIndex: {
          x: this.props.tabletWallIndex.x || 0,
          y: this.props.tabletWallIndex.y || 0
        }
      })
    }
  }

  updateTagId (tagId: string) {
    this.setState({
      tagId
    })
  }

  updateTabletWallIndex (tabletWallIndex: IPoint) {
    this.setState({
      tabletWallIndex
    })
  }

  saveSettings () {
    this.props.setTagId(this.state.tagId)
    this.props.setTabletWallIndex(this.state.tabletWallIndex)
  }

  render () {
    return (
      <ThemeProvider theme={generalTheme}>
        <Layover
          noPaddingTop
          profilePic
          centerComponent={<ProfilePicture source={profileImage} />}
          closeModal={this.state.closeModal}
        >
          <Title textAlign={'center'}>Instellingen wijzigen</Title>
          <Body textAlign={'center'}>Op dit scherm kun je het tagnummer en de positie in de tabletwall van deze tablet wijzigen. Let op: de wijzigingen zijn pas definitief nadat je hebt gekozen voor Wijzigingen opslaan.</Body>
          <ContentContainer>
            <Subtitle textAlign={'center'}>Locatify tag</Subtitle>
            <TagIdInput
              value={this.state.tagId}
              labelText={'Tagnummer*'}
              onChangeText={text => this.updateTagId(text)}
            />
            <Subtitle textAlign={'center'}>Tabletwall positie</Subtitle>
            <TileGridSelect
              selectedIndex={this.state.tabletWallIndex}
              onSelect={(point: IPoint) => this.updateTabletWallIndex(point)}
              dimensions={{rows: 3, cols: 17}}
            />
            <Spacer />
            <CTAButton
              btnAlign={'center'}
              onPress={() => {
                this.saveSettings()
                this.setState({ closeModal: true })
              }}
            >
              Wijzigingen opslaan
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
  padding: 0 40px;
`

const TagIdInput = styled(Input)`
  alignSelf: stretch;
`

const ContentContainer = styled.View`
  flex-direction: column;
  flex: 1;
  margin-top: 40px;
  padding: 0 40px;
`

const Spacer = styled.View`
  margin-top: 100px;
`

const Subtitle = StyledHeaderTitle.extend`
  margin-top: 32px;
  margin-bottom: 12px;
  padding: 0 20px;
`

export default connect(mapStateToProps, mapDispatchToProps)(SettingsUpdateScreen)
