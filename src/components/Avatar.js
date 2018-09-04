// @flow

import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../constants/styleGuide'
import { StyledBodySmall } from '../constants/styledText'
import { withApiData } from 'react-api-data'
import type { IProfile } from '../entities'

type State = {
  animateOpacity: Object
}

type Props = {
  disabled: boolean,
  navigate: (string) => void,
  profile: IProfile
}

const defaultProfilePicture = require('../assets/images/avatar_default.png')

const connectApiData = withApiData({
  profile: 'getProfile'
})

class Avatar extends React.Component<Props, State> {
  state = {
    animateOpacity: new Animated.Value(0)
  }

  componentWillReceiveProps (newProps: Props) {
    if (newProps.disabled !== this.props.disabled) {
      Animated.timing(
        this.state.animateOpacity,
        {
          toValue: newProps.disabled ? 1 : 0,
          duration: 300,
          useNativeDriver: true
        }
      ).start()
    }
  }

  render () {
    const {navigate} = this.props
    let customerImage
    let customerName

    if (this.props.profile && this.props.profile.data && this.props.profile.data.customer) {
      customerName = this.props.profile.data.customer.customerName
      customerImage = this.props.profile.data.customer.customerImage
    }

    return (
      <Container
        onPress={() => !this.props.disabled && navigate('Logout')}
        disabled={this.props.disabled}
      >
        <SubContainer
          style={{
            opacity:
              this.state.animateOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.2]
              })
          }}
        >
          <Image
            source={customerImage ? {uri: customerImage} : defaultProfilePicture}
          />
          <Text>{customerName ? `Ingelogd als ${customerName}` : 'Ingelogd'}</Text>
        </SubContainer>
      </Container>
    )
  }
}

const Container = styled.TouchableOpacity`
  position: absolute;
  left: 40px;
`

const SubContainer = Animated.createAnimatedComponent(styled.View`
  flex-direction: row;
  align-items: center;
`)

const Image = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 8px;
`

const Text = StyledBodySmall.extend`
  font-style: italic;
  max-width: 123px;
  color: ${colors.beigeMedium}
`

export default connectApiData(Avatar)
