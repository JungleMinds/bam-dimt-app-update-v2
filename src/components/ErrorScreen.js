// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { colors } from '../constants/styleGuide'

import type { MapStateToProps } from "react-redux"


type Props = {
  errors: Array<{text: string}>
}

const mapStateToprops: MapStateToProps<*, *, *> = (state) => ({
  errors: state.error.errors
})

class ErrorScreen extends Component<Props> {
  render () {
    return (
      <Container>
        {
          this.props.errors.map((error, index) => (
            <ErrorNotification key={index}>
              <ErrorNotificationText>{error.text}</ErrorNotificationText>
            </ErrorNotification>
          ))
        }
      </Container>
    )
  }
}

export { ErrorScreen }
export default connect(mapStateToprops)(ErrorScreen)

const Container = styled.View`
  position: absolute;
  flex: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const ErrorNotification = styled.View`
  backgroundColor: ${colors.orange};
  width: 506px;
`

const ErrorNotificationText = styled.Text`
  color: #ffffff;
`
