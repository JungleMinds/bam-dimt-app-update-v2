import React, { type Node } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { StyledH2 } from '../constants/styledText'
import { colors } from '../constants/styleGuide'

type Props = {
  icon: Node,
  title: string,
  children?: Node
}

const ActionPanel = (props: Props) => {
  return (
    <Container>
      <View>
        <ContentContainer>
          <StyledH2>{props.title}</StyledH2>
          {props.children}
        </ContentContainer>
        <IconContainer>{props.icon}</IconContainer>
      </View>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const IconContainer = styled.View`
  position: absolute;
  top: 0;
  left: 50%;
  right: 0;
  alignItems: center;
  justifyContent: center;
  margin-left: -78px;
  background-color: ${colors.orangeDark};
  width: 146px;
  height: 146px;
  border-radius: 146px;
  border-width: 5;
  elevation: 2;
  border-color: #ffffff;
`

const ContentContainer = styled.View`
  background-color: #ffffff;
  elevation: 2;
  margin-top: 72px;
  padding-top: 100px;
  paddingHorizontal: 40px;
  paddingBottom: 40px;
  width: 505px;
`

export default ActionPanel
