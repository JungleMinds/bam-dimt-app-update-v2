// @flow

import React from 'react'
import Layover from './Layover'
import { ThemeProvider } from 'styled-components'
import Preferences from './Preferences'
import { connect } from 'react-redux'
import { mapTheme } from '../services/utils'
import { toggleHotspots } from '../redux/hotspot'
import type { Dispatch } from 'redux'

type PreferencesScreenProps = {
  theme: string,
  onHotspotsToggle: (open: boolean) => void
}

const mapStateToProps = (state) => ({
  theme: state.preferences.theme
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onHotspotsToggle: (open) => dispatch(toggleHotspots(open))
})

class PreferencesScreen extends React.Component<PreferencesScreenProps> {
  componentWillMount () {
    this.props.onHotspotsToggle(true)
  }

  render () {
    const theme = mapTheme(this.props.theme)
    return (
      <ThemeProvider theme={theme}>
        <Layover>
          <Preferences />
        </Layover>
      </ThemeProvider>
    )
  }

  componentWillUnmount () {
    this.props.onHotspotsToggle(false)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesScreen)
