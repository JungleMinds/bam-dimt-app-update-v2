// @flow
import * as React from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'

// types
import type { ISpaceHotspot } from '../entities'

// Utils
import { colors } from '../constants/styleGuide'

// components
import { StyledSubTitle } from '../constants/styledText'

type HotspotListItemProps = {
  hotspot: ISpaceHotspot,
  done: boolean,
  onPressItem: (hotspot: ISpaceHotspot) => void
};

const HotspotListItem = (props: HotspotListItemProps) => (
  <TouchableOpacity onPress={() => props.onPressItem(props.hotspot)}>
    <Hotspot>
      <HotspotChecked done={props.done}>
        {props.done && (
          <HotspotDone source={require('../assets/images/check.png')} />
        )}
      </HotspotChecked>
      <FoldoutText>{props.hotspot.title}</FoldoutText>
      <Arrow source={require('../assets/images/chevron-right.png')} />
    </Hotspot>
  </TouchableOpacity>
)

const FoldoutText = StyledSubTitle.extend`
  color: white
`

const Hotspot = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 10px;
`

const HotspotChecked = styled.View`
  height: 18px;
  width: 18px;
  background-color: ${props => props.theme.colorDark || colors.orangeDark};
  border-radius: 9px;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
`

const Arrow = styled.Image`
  margin-left: 5px;
  top: 2px;
`

const HotspotDone = styled.Image`

`

export default HotspotListItem
