// @flow

import React from 'react'
import styled from 'styled-components/native'
import { colors } from '../../constants/styleGuide'

type ProgressCircleProps = {
  progress: number
}

const CIRCLE_RADIUS = 16
const CIRCLE_BORDER = 2

export const ProgressCircle = (props: ProgressCircleProps) => (
  <BackgroundCircle>
    <OuterCircle>
      <FirstHalf />
      <SecondHalfWrap progress={props.progress}>
        <SecondHalf progress={props.progress} />
      </SecondHalfWrap>
    </OuterCircle>
  </BackgroundCircle>
)

const BackgroundCircle = styled.View`
  width: ${(CIRCLE_RADIUS + CIRCLE_BORDER) * 2}px;
  height: ${(CIRCLE_RADIUS + CIRCLE_BORDER) * 2}px;
  border-radius: ${(CIRCLE_RADIUS + CIRCLE_BORDER)}px;
  background-color: white;
  justify-content: center;
  align-items: center;
`

const OuterCircle = styled.View`
  width: ${CIRCLE_RADIUS * 2}px;
  height: ${CIRCLE_RADIUS * 2}px;
  border-radius: ${CIRCLE_RADIUS}px;
  background-color: ${props => props.theme.color || colors.pink};
`

const FirstHalf = styled.View`
  width: ${CIRCLE_RADIUS}px;
  height: ${CIRCLE_RADIUS * 2}px;
  border-radius: ${CIRCLE_RADIUS}px;
  background-color: ${props => props.theme.colorLight || colors.pinkLight};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

const SecondHalfWrap = styled.View`
  width: ${CIRCLE_RADIUS * 2}px;
  height: ${CIRCLE_RADIUS * 2}px;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-${props => props.progress === 1 ? 0 : (0.5 - (props.progress % 0.5)) * 360}deg);
`

const SecondHalf = FirstHalf.extend`
  background-color: ${props => props.progress >= 0.5 ? (props.theme.color || colors.pink) : (props.theme.colorLight || colors.pinkLight)};
`
