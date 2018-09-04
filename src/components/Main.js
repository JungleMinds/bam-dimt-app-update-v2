// @flow

import React, { Component } from 'react'
import type { NavigationRoute, NavigationScreenProp, NavigationAction } from 'react-navigation'
import styled from 'styled-components/native'
import { connect } from 'react-redux'
import type { IContent, ISpace, ISpaceHotspot, IPoint } from '../entities'
import type { Dispatch } from 'redux'
import { setHotspot } from '../redux/hotspot'
import Floorplan from './floorplan/Floorplan'

import MainNav from './MainNav'
import { getResultData, performApiRequest } from 'react-api-data'
import { saveProgess } from '../redux/preferences'

type MainProps = {
  navigation: NavigationScreenProp<NavigationRoute, NavigationAction>,
  spaces: Array<ISpace>,
  onSetHotspot: (hotspot: ISpaceHotspot) => void,
  onGetFloorplan: () => void,
  floorplan: IContent,
  onSaveProgress: (floorplan: IContent) => void,
  tagPosition: IPoint,
  socketErrors: Array<string>
}

type State = {
  pressedCount: number,
  pressedTimer?: TimeoutID // eslint-disable-line
}

const mapStateToProps = state => ({
  spaces: state.content.content,
  floorplan: getResultData(state.apiData, 'getFloorplan')
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onSetHotspot: hotspot => dispatch(setHotspot(hotspot)),
  onGetFloorplan: () => dispatch(performApiRequest('getFloorplan')),
  onSaveProgress: (floorplan) => dispatch(saveProgess(floorplan))
})

class Main extends Component<MainProps, State> {
  state = {
    pressedCount: 0,
    pressedTimer: undefined
  }

  componentDidMount () {
    this.props.onGetFloorplan()
  }

  componentWillUnmount () {
    if (this.state.pressedTimer) {
      clearTimeout(this.state.pressedTimer)
    }
  }

  UNSAFE_componentWillReceiveProps (newProps) {
    if (newProps.floorplan && !this.props.floorplan) {
      this.props.onSaveProgress(newProps.floorplan)
    }
  }

  pressSettings () {
    if (this.state.pressedTimer) {
      clearTimeout(this.state.pressedTimer)
    }
    const timeout = setTimeout(() => {
      this.setState({
        pressedCount: 0
      })
    }, 1000)

    this.setState(
      {
        pressedCount: this.state.pressedCount + 1,
        pressedTimer: timeout
      },
      () => {
        if (this.state.pressedCount === 7) {
          this.props.navigation.navigate('Settings')
        }
      }
    )
  }

  render () {
    const { navigation: { navigate } } = this.props
    return (
      <Container>
        <Floorplan navigate={navigate} />
        <SettingsBtn
          onPress={() => this.pressSettings()}
          style={{ padding: 20 }}
        />
        <MainNav navigate={navigate} />
      </Container>
    )
  }
}

const SettingsBtn = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  width: 170px;
  height: 75px;
  background-color: transparent;
`

const Container = styled.View`
  padding: 40px 20px;
  flex: 1;
  height: 100%;
`

export default connect(mapStateToProps, mapDispatchToProps)(Main)
