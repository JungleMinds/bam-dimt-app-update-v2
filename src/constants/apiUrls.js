import { API_URL } from 'react-native-dotenv'

export const settingsUrl = `${API_URL}ecw/global-settings/`
export const dockedEventUrl = `${API_URL}ecw/dock-event/`
export const tabletWallUrl = ({x, y}) => `${API_URL}ecw/tablet-wall/${x}/${y}/`
export const loginUrl = `${API_URL}login/`
export const logoutUrl = `${API_URL}logout/`
export const layoutUrl = `${API_URL}ecw/layout/`
export const hotspotOptionsUrl = `${API_URL}ecw/hotspot/:id/option-groups/`
export const optionsRatingUrl = `${API_URL}ecw/customer-ratings/`
export const profileUrl = `${API_URL}profile/`
