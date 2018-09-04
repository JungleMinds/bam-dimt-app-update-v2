// @flow

import React from 'react'
import { NetInfo } from 'react-native'
import { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import styled from 'styled-components/native'

// types
import type { MapStateToProps } from "react-redux"
import type { IPoint } from '../entities'

// utils
import { LOCATIFY_ENDPOINT_WEBSOCKET } from 'react-native-dotenv'
import { mapTheme } from '../services/utils'
import { colors } from '../constants/styleGuide'

// components
import Layover from './Layover'
import { StyledH1 } from '../constants/styledText'
import MapWithMarker from './MapWithMarker'

type Props = {
  theme: string,
  tagPosition: IPoint,
  socketErrors: Array<string>
}

type State = {
  isConnected: boolean
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  theme: state.preferences.theme,
  tagPosition: state.location.tagPosition,
  socketErrors: state.location.errors
})

class FloorplanScreen extends React.Component<Props, State> {
  state = {
    isConnected: false
  }

  componentDidMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        isConnected: isConnected
      })
    })
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    )
  }

  handleConnectivityChange (isConnected) {
    this.setState({
      isConnected: isConnected
    })
  }

  render () {
    const theme = mapTheme(this.props.theme)

    return (
      <ThemeProvider theme={theme}>
        <Layover>
          <Title>Wegwijzer</Title>
          <MapWrapper>
            <MapWithMarker
              tagPosition={this.props.tagPosition}
              floorplanSlug={'building'} />
          </MapWrapper>
          {
            !!__DEV__ &&
            <Info pointerEvents={'none'}>
              <InfoText>{this.state.isConnected ? 'Verbonden met wifi' : 'Niet verbonden met wifi'}</InfoText>
              {
                this.props.tagPosition &&
                <InfoText>x: {this.props.tagPosition.x}, y: {this.props.tagPosition.y}</InfoText>
              }
              <InfoText>socket-endpoint: {LOCATIFY_ENDPOINT_WEBSOCKET}</InfoText>
              <InfoText>socket-info:</InfoText>
              {
                this.props.socketErrors.map((error, i) => (
                  <InfoText key={i}>{error}</InfoText>
                )).reverse()
              }
            </Info>
          }
        </Layover>
      </ThemeProvider>
    )
  }
}

const Title = StyledH1.extend`
  text-align: center;
  margin-bottom: 96px;
  color: ${colors.orangeMedium};
`

const MapWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  align-content: flex-start;
  margin-horizontal: 10px;
`

const Info = styled.ScrollView`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
`

const InfoText = styled.Text`
  font-size: 12px;
`

export default connect(mapStateToProps)(FloorplanScreen)
