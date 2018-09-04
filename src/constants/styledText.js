// @flow

import styled from 'styled-components/native'
import { colors } from './styleGuide'

export const StyledH1 = styled.Text`
  font-family: 'foco-bold';
  font-size: 40px;
  line-height: 51px;
  color: ${props => props.theme.colorMedium || colors.orangeMedium};
  text-align: ${props => props.textAlign || 'left'};
`

export const StyledH2 = styled.Text`
  font-family: 'foco-bold';
  font-size: 32px;
  margin-bottom: 20px;
  line-height: 40px;
  textAlign: center;
  color: ${props => props.theme.colorMedium || colors.orangeMedium};
`

export const StyledH3 = styled.Text`
  font-family: 'foco-bold';
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 12px;
  color: ${props => props.theme.colorMedium || colors.orangeMedium};
`

export const StyledHeaderTitle = styled.Text`
  font-family: 'foco-bold';
  font-size: 24px;
  line-height: 30px;
  color: ${props => props.theme.colorMedium || colors.orange};
  text-align: ${props => props.textAlign || 'center'};
`

export const StyledSubTitle = styled.Text`
  font-family: 'foco-bold';
  font-size: 16px;
  line-height: 20px;
  color: ${colors.greyDark};
  text-align: ${props => props.textAlign || 'center'};
`

export const StyledBody = styled.Text`
  font-family: 'foco-regular';
  font-size: 20px;
  line-height: 28px;
  color: ${colors.bodyText};
  text-align: ${props => props.textAlign || 'left'};
`

export const StyledBodyLarge = styled.Text`
  font-family: 'foco-regular';
  font-size: 22px;
  line-height: 32px;
  color: ${colors.bodyText};
  text-align: ${props => props.textAlign || 'left'};
`

export const StyledBodySmall = styled.Text`
  font-family: 'foco-regular';
  font-size: 14px;
  line-height: 18px;
  color: ${colors.bodyText};
  text-align: ${props => props.textAlign || 'left'};
`

export const SmallText = styled.Text`
  font-family: 'foco-regular';
  font-size: 12px;
  line-height: 16px;
`
