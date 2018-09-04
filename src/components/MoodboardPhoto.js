// @flow
import * as React from 'react'
import styled from 'styled-components/native'

type MoodboardPhotoProps = {}

class MoodboardPhoto extends React.Component<MoodboardPhotoProps> {
  render () {
    return (
      <Title>MoodboardPhoto</Title>
    )
  }
}

const Title = styled.Text`
  font-family: 'foco-bold';
`

export default MoodboardPhoto
