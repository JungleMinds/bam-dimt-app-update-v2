// @flow

import React, { type Node } from 'react'
import styled from 'styled-components/native'
import { Image } from 'react-native'

import BackdropImage from './BackdropImage'

type Props = {
  backdrop?: Node,
  overlay?: string
}

const Backdrop = (props: Props = {overlay: ''}) => {
  return (
    <BackgroundContainer>
      {props.backdropImage ? (
        props.backdropImage
      ) : (
        <BackdropImage
          source={require('../assets/images/general-background.jpg')}
        />
      )}
      {
        (props.overlay === 'flipped')
          ? <Image source={require('../assets/images/background-overlay-flipped.png')} />
          : <Image source={require('../assets/images/background-overlay.png')} />
      }
      <Logo source={require('../assets/images/logo-hs.png')} />
    </BackgroundContainer>
  )
}

const BackgroundContainer = styled.View`
  position: absolute;
  flex: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Logo = styled.Image`
  position: absolute;
  right: 50px;
  bottom: 60px;
  width: 180px;
  resize-mode: contain;
`

export default Backdrop
