// @flow

import { StackNavigator } from 'react-navigation'
import Main from './Main'
import PreferencesScreen from './PreferencesScreen'
import FloorplanScreen from './FloorplanScreen'
import PreferencesOverview from './PreferencesOverview'
import Settings from './Settings'
import Welcome from './Welcome'
import Login from './Login'
import Logout from './Logout'
import LogoutSuccess from './LogoutSuccess'
import WithAdmin from './WithAdmin'
import SettingsUpdateScreen from './SettingsUpdateScreen'

const RootNavigator = StackNavigator({
  Login: {screen: WithAdmin(Login)},
  Welcome: {screen: WithAdmin(Welcome)},
  Main: {screen: WithAdmin(Main)},
  Preferences: {screen: WithAdmin(PreferencesScreen)},
  Floorplan: { screen: WithAdmin(FloorplanScreen) },
  PreferencesOverview: {screen: WithAdmin(PreferencesOverview)},
  Settings: {screen: Settings},
  SettingsUpdate: { screen: SettingsUpdateScreen },
  Logout: {screen: WithAdmin(Logout)},
  LogoutSuccess: {screen: WithAdmin(LogoutSuccess)}
},
{
  headerMode: 'none',
  mode: 'modal',
  cardStyle: {
    backgroundColor: 'transparent'
  },
  transitionConfig: () => ({
    transitionSpec: {
      duration: 0
    },
    screenInterpolator: () => null
  })
})

export default RootNavigator
