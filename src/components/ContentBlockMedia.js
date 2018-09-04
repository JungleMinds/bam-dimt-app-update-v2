import * as React from 'react'
import styled from 'styled-components/native'
import { StyledH3, StyledBody } from '../constants/styledText'

class ContentBlockMedia extends React.Component {
  render () {
    return (
      <ContentContainer>
        <ContentImage source={{uri: 'https://cdn.jungleminds.com/media/blog/digital_identity.png?mtime=20171004152421'}} />
        <TextContainer>
          <StyledH3>Zie je dit icoon op de vloer? Pak dan je tablet erbij.</StyledH3>
          <StyledBody>Stukje over het experience center en wat je hier kunt doen. Lorem ipsum dolor sit amet, consectetur adipiscing elit ehasellus efficitur.</StyledBody>
        </TextContainer>
      </ContentContainer>
    )
  }
}

const ContentContainer = styled.View`
  flex-direction: row;
  margin-top: 48px;
  margin-bottom: 40px;
  align-items: center;
`

const ContentImage = styled.Image`
  width: 175px;
  height: 175px;
`

const TextContainer = styled.View`
  margin-left: 20px;
  flex: 1;
`

export default ContentBlockMedia
