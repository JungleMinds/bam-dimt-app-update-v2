import React from 'react'
import styled from 'styled-components/native'
import { StyledSubTitle, SmallText } from '../../constants/styledText'
import { colors } from '../../constants/styleGuide'

type LabelProps = {
  type: 'Top' | 'Bottom',
  children: string,
  subLabel?: string
}

const SMALL_LABEL = 34
const BIG_LABEL = 64
const SMALL_LABEL_WIDTH = 178
const BIG_LABEL_WIDTH = 324

export const Label = (props: LabelProps) => {
  const size = props.subLabel ? BIG_LABEL : SMALL_LABEL
  const width = props.subLabel ? BIG_LABEL_WIDTH : SMALL_LABEL_WIDTH
  return (
    <LabelWrap>
      <TriangleLeft type={props.type} size={size} />
      <LabelCenter size={size} width={width}>
        {props.subLabel ? ([
          <SubLabel key={'sub'}>{props.subLabel}</SubLabel>,
          <LabelTextBig key={'title'}>{props.children}</LabelTextBig>
        ]) : (
          <LabelText>{props.children}</LabelText>
        )}
      </LabelCenter>
      <TriangleRight type={props.type} size={size} />
    </LabelWrap>
  )
}

const LabelWrap = styled.View`
  flex-direction: row;
  justify-content: center;
`

const LabelCenter = styled.View`
  width: ${props => props.width}px;
  height: ${props => props.size}px;
  padding: 6px;
  background-color: ${props => props.theme.color || colors.orange};
`

const LabelText = StyledSubTitle.extend`
  color: ${props => props.theme.colorMedium || colors.orangeMedium};
  text-align: center;
  color: white;
`

const LabelTextBig = LabelText.extend`
  font-size: 26px;
  line-height: 32px;
`

const SubLabel = SmallText.extend`
  color: white;
  text-align: center;
  padding-top: 2px;
`

const TriangleSetup = styled.View`
  width: 0;
  height: 0;
  borderTopColor: transparent;
  borderRightColor: transparent;
  borderLeftColor: transparent;
  borderBottomColor: transparent;
  border${props => props.type}Width: ${props => props.size}px;
  border${props => props.type}Color: ${props => props.theme.colorMedium || colors.orangeMedium};
`

const TriangleLeft = TriangleSetup.extend`
  borderLeftWidth: ${props => props.size}px;
`

const TriangleRight = TriangleSetup.extend`
  borderRightWidth: ${props => props.size}px;
`
