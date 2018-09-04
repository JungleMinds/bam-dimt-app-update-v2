// @flow
import * as React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'
import { ProgressCircle } from './ui/ProgressCircle'
import { Label } from './ui/Label'
import { ThemeProvider } from 'styled-components'
import { mapTheme } from '../services/utils'
import { setSelectedSpace } from '../redux/hotspot'
import { connect } from 'react-redux'
import type { ISpace } from '../entities'
import { type Dispatch } from 'redux'

type SpaceBlockProps = {
  onSelectSpace: (id: number) => void,
  onPress: (isAcitve: boolean) => void,
  space: ISpace,
  progress: number,
  selectedSpace: number
}

type SpaceBlockState = {
  labelAnimation: Object
}

const mapStateToProps = state => ({
  selectedSpace: state.hotspot.selectedSpace
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onSelectSpace: id => dispatch(setSelectedSpace(id))
})

class SpaceBlock extends React.Component<SpaceBlockProps, SpaceBlockState> {
  state = {
    labelAnimation: new Animated.Value(-10)
  }

  componentWillReceiveProps (newProps) {
    const id = this.props.space.id
    if (newProps.selectedSpace === id && this.props.selectedSpace !== id) {
      Animated.timing(this.state.labelAnimation, {
        toValue: 0,
        duration: 200,
        delay: this.props.selectedSpace === 0 ? 0 : 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true
      }).start()
    }
    if (newProps.selectedSpace !== id && this.props.selectedSpace === id) {
      Animated.timing(this.state.labelAnimation, {
        toValue: -10,
        duration: 200,
        delay: 280,
        useNativeDriver: true
      }).start()
    }
  }

  onPress (space) {
    const isActive = this.props.selectedSpace !== space.id
    this.props.onSelectSpace(isActive ? space.id : 0)
    this.props.onPress(isActive)
  }

  render () {
    const { space } = this.props
    return (
      <ThemeProvider theme={mapTheme(space.theme.slug)}>
        <Block activeOpacity={0.9} onPressIn={() => this.onPress(space)}>
          <Overlay />
          <BackgroundImage
            source={{
              uri:
                'https://cdn.jungleminds.com/media/blog/digital_identity.png?mtime=20171004152421'
            }}
          />
          <Progress>
            <ProgressCircle progress={this.props.progress} />
          </Progress>
          <SpaceLabel
            style={{
              transform: [{ translateY: this.state.labelAnimation }]
            }}
          >
            <Label type={'Bottom'}>{space.title.toUpperCase()}</Label>
          </SpaceLabel>
        </Block>
      </ThemeProvider>
    )
  }
}

const Block = styled.TouchableOpacity`
  height: 180px;
  padding: 10px;
  justify-content: center;
  align-items: center;
`

const Overlay = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  left: 10px;
  background-color: #000;
  z-index: 1;
  opacity: 0.15;
`

const BackgroundImage = styled.Image`
  height: 100%;
  width: 100%;
`

const SpaceLabel = Animated.createAnimatedComponent(styled.View`
  position: absolute;
  bottom: 0;
  z-index: 2;
`)

const Progress = styled.View`
  position: absolute;
  right: 22px;
  top: 22px;
  z-index: 2;
`

export default connect(mapStateToProps, mapDispatchToProps)(SpaceBlock)
