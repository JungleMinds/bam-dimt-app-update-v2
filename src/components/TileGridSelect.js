// @flow
import * as React from 'react'
import styled from 'styled-components/native'

import type { IPoint } from '../entities'

type TileGridSelectProps = {
  dimensions: {
    rows: number,
    cols: number
  },
  selectedIndex?: IPoint,
  onSelect: (point: IPoint) => void
}

const drawGrid = ({ dimensions: { rows, cols }, ...props }: TileGridSelectProps) =>
  [...Array(rows)].map((item, y) =>
    <GridRow key={y}>
      {
        [...Array(cols)].map((item2, x) =>
          <GridTile
            selected={props.selectedIndex && props.selectedIndex.y === y && props.selectedIndex.x === x}
            onPress={() => props.onSelect({x: x, y: y})}
            key={x}>
            <TileText selected={props.selectedIndex && props.selectedIndex.y === y && props.selectedIndex.x === x}>
              {(x + (y * cols)) + 1}
            </TileText>
          </GridTile>
        )
      }
    </GridRow>
  )

const TileGridSelect = (props: TileGridSelectProps) => (
  <GridContainer>
    { drawGrid(props) }
  </GridContainer>
)

const GridContainer = styled.View`
  flex-direction: column;
`

const GridRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`

const GridTile = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 48px;
  background-color: ${({ selected }) => selected ? '#993D00' : '#F5F3F2'};
`

const TileText = styled.Text`
  font-size: 14px;
  font-family: 'foco-bold';
  color: ${({ selected }) => selected ? '#ffffff' : '#544E48'};
`

export default TileGridSelect
