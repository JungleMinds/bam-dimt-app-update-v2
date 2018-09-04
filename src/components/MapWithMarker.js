// @flow

import React from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'
import { connect } from 'react-redux'

import type { MapStateToProps } from "react-redux"
import type { IPoint } from '../entities'
import type { SpaceOffset } from '../services/floorplanOffset'

import { floorplanOffsets } from '../services/floorplanOffset'
import UserMarker from './floorplan/UserMarker'

type Props = {
  floorplanSlug: string,
  tagPosition: IPoint
}

type State = {
  floorplanX: number,
  floorplanY: number,
  floorplanWidth: number,
  floorplanHeight: number
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  theme: state.preferences.theme,
  tagPosition: state.location.tagPosition
})

class MapWithMarker extends React.Component<Props, State> {
  state = {
    floorplanX: 0,
    floorplanY: 0,
    floorplanWidth: 0,
    floorplanHeight: 0
  }

  onLayout (event) {
    this.setState({
      floorplanX: event.nativeEvent.layout.x,
      floorplanY: event.nativeEvent.layout.y,
      floorplanWidth: event.nativeEvent.layout.width,
      floorplanHeight: event.nativeEvent.layout.height
    })
  }

  scalePosition (point: IPoint, offset: SpaceOffset): IPoint {
    const imgResizeScale = this.state.floorplanWidth / offset.imageWidth

    const posX =
      (point.x - offset.x) * offset.imageScale * imgResizeScale +
      this.state.floorplanX
    const posY =
      (point.y - offset.y) * offset.imageScale * imgResizeScale +
      this.state.floorplanY + 10
    return { x: posX, y: posY }
  }

  render () {
    const offset: SpaceOffset = floorplanOffsets[this.props.floorplanSlug]
    if (!offset || !this.props.tagPosition) {
      return null
    }

    const scaledPosition = this.scalePosition(this.props.tagPosition, offset)

    return (
      <FloorplanWrapper>
        <Image
          style={{
            flex: 1,
            resizeMode: 'contain'
          }}
          onLayout={event => this.onLayout(event)}
          source={offset.imageSrc}
        />
        <UserMarker position={scaledPosition} />
      </FloorplanWrapper>
    )
  }
}

const FloorplanWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-horizontal: 10;
`

export default connect(mapStateToProps)(MapWithMarker)
