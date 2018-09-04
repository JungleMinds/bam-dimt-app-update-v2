import React from 'react'
import styled from 'styled-components/native'
import { colors } from '../../constants/styleGuide'
import { Animated } from 'react-native'

export const CTAButton = (props) => (
  <StyledCTAButton {...props}>
    {props.loading && <Loader size={'small'} color={'#fff'} />}
    <StyledCTAButtonLabel>{props.children}</StyledCTAButtonLabel>
    {props.icon}
  </StyledCTAButton>
)

const StyledCTAButton = styled.TouchableOpacity`
  borderTopLeftRadius: 8;
  borderBottomRightRadius: 8;
  background: ${colors.blueMedium};
  padding: 8px 20px;
  display: flex;
  flex-direction: row;
  align-self: ${(props) => props.btnAlign === 'right' ? 'flex-end' : props.btnAlign === 'center' ? 'center' : 'flex-start'};
`

const StyledCTAButtonLabel = styled.Text`
  font-family: 'foco-bold';
  font-size: 20px;
  line-height: 25px;
  color: white;
`

const Loader = styled.ActivityIndicator`
  margin-right: 10px;
`

export const RoundButton = (props) => (
  <Btn {...props} style={{ elevation: 2 }} activeOpacity={1}>
    {props.icon}
  </Btn>
)

const Btn = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${(props) => props.expanded && props.expandBtn ? colors.blueDark : colors.blueMedium};
  justify-content: center;
  align-items: center;
`

export const LinkButton = (props) => (
  <LinkContainer>
    <Link {...props}>
      <Text>{props.label}</Text>
    </Link>
  </LinkContainer>
)

const LinkContainer = styled.View`
  align-items: center;
`

const Link = styled.TouchableOpacity`
  align-items: ${(props) => props.textAlign === 'center' ? 'center' : 'flex-start'};
  width: 180px;
`

const Text = styled.Text`
  font-family: 'foco-bold';
  color: ${colors.blueMedium};
  text-align: ${(props) => props.textAlign === 'center' ? 'center' : 'left'}
  font-size: 18px;
  padding: 13px;
`

export const BackButton = (props) => (
  <BackButtonContainer needsOffscreenAlphaCompositing onPress={props.onPress} activeOpacity={0.8}>
    <Triangles>
      <TriangleTop style={props.buttonColor ? {borderBottomColor: props.buttonColor} : {}} />
      <TriangleBottom style={props.bottomTriangleColor ? {borderTopColor: props.bottomTriangleColor} : {}} />
    </Triangles>
    <BackButtonInner
      style={props.buttonColor ? {backgroundColor: props.buttonColor} : {}}
    >
      <BackText>NAAR OVERZICHT</BackText>
    </BackButtonInner>
  </BackButtonContainer>
)

const BackButtonInner = Animated.createAnimatedComponent(styled.View`
  height: 30px;
  padding: 0 12px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colorMedium || colors.orangeMedium};
`)

const BackButtonContainer = Animated.createAnimatedComponent(styled.TouchableOpacity`
  padding: 20px 0 20px 0;

  flex-direction: row;
`)

const TriangleBottom = Animated.createAnimatedComponent(styled.View`
  width: 0;
  height: 0;
  background-color: transparent;
  borderStyle: solid;
  borderLeftWidth: 15;
  borderTopWidth: 15;
  borderLeftColor: transparent;
  borderTopColor: ${props => props.theme.color || colors.orange};
`)

const TriangleTop = Animated.createAnimatedComponent(styled.View`
   width: 0;
  height: 0;
  background-color: transparent;
  borderStyle: solid;
  borderLeftWidth: 15;
  borderBottomWidth: 15;
  borderLeftColor: transparent;
  borderBottomColor: ${props => props.theme.colorMedium || colors.orangeMedium};
`)

const Triangles = styled.View`

`

const BackText = styled.Text`
  font-family: 'foco-bold';
  color: white;
  font-size: 16px;
`
