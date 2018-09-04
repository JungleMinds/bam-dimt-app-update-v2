// @flow
import React from 'react'
import styled from 'styled-components/native'

type Props = {
  source: any
}

class ProfilePicture extends React.Component<Props> {
  render () {
    return (
      <Image source={this.props.source} />
    )
  }
}

const Image = styled.Image`
  width: 156px;
  height: 156px;
  border-radius: 78;
`

export default ProfilePicture
